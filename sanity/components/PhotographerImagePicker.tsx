'use client';

import { ArrowLeftIcon, CheckmarkIcon } from '@sanity/icons';
import { Box, Button, Card, Dialog, Flex, Grid, Spinner, Stack, Text } from '@sanity/ui';
import { useEffect, useMemo, useState } from 'react';
import { useClient } from 'sanity';

import { toNameCase } from '@/lib/displayCase';

import { apiVersion } from '../env';
import { imagePreviewUrl } from '../lib/imagePreview';

export type PickedImage = {
  assetRef: string;
  hotspot?: Record<string, unknown>;
  crop?: Record<string, unknown>;
};

export type PickResult = {
  photographerId: string;
  images: PickedImage[];
};

type PhotographerRow = {
  _id: string;
  fullName?: string;
  title?: string;
  preview?: { asset?: { _ref?: string } };
  count?: number;
};

type PortfolioRow = {
  _key: string;
  asset?: { _ref?: string };
  hotspot?: Record<string, unknown>;
  crop?: Record<string, unknown>;
};

const PHOTOGRAPHERS_QUERY = `*[_type == "photographer" && !(_id in path("drafts.**"))] | order(orderRank asc, fullName asc) {
  _id, fullName, title, preview, "count": count(portfolioImages)
}`;

const IMAGES_QUERY = `*[_id == $id][0]{
  "images": [preview{"_key": "preview", asset, hotspot, crop}] + coalesce(portfolioImages[]{_key, asset, hotspot, crop}, [])
}`;

interface PhotographerImagePickerProps {
  onClose: () => void;
  onPick: (result: PickResult) => void;
  /** Start on this photographer's images (published id); otherwise start on the list. */
  photographerId?: string;
  /** How many images may be chosen at once (1 = pick on click). */
  max?: number;
  /** Asset refs already in use — marked in the grid. */
  usedAssetRefs?: string[];
}

/**
 * Two-step dialog: choose a photographer, then choose from the images already
 * in their portfolio (cover first). Nothing is uploaded — the picked image
 * points at the same Sanity asset, with its crop and hotspot. Render it only
 * while open, so each opening starts fresh.
 */
export function PhotographerImagePicker({
  onClose,
  onPick,
  photographerId: initialPhotographerId,
  max = 1,
  usedAssetRefs = [],
}: PhotographerImagePickerProps) {
  const client = useClient({ apiVersion });
  const [photographers, setPhotographers] = useState<PhotographerRow[] | null>(null);
  const [photographerId, setPhotographerId] = useState<string | undefined>(initialPhotographerId);
  const [imagesById, setImagesById] = useState<Record<string, PortfolioRow[]>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const images = photographerId ? imagesById[photographerId] ?? null : null;

  useEffect(() => {
    if (photographers) return;
    let cancelled = false;
    client.fetch<PhotographerRow[]>(PHOTOGRAPHERS_QUERY).then((rows) => {
      if (!cancelled) setPhotographers(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [client, photographers]);

  useEffect(() => {
    if (!photographerId || imagesById[photographerId]) return;
    let cancelled = false;
    client
      .fetch<{ images?: PortfolioRow[] } | null>(IMAGES_QUERY, { id: photographerId })
      .then((doc) => {
        if (cancelled) return;
        // The cover is often also the first portfolio image: keep each asset once.
        const seen = new Set<string>();
        const rows = (doc?.images ?? []).filter((img) => {
          const ref = img?.asset?._ref;
          if (!ref || seen.has(ref)) return false;
          seen.add(ref);
          return true;
        });
        setImagesById((prev) => ({ ...prev, [photographerId]: rows }));
      });
    return () => {
      cancelled = true;
    };
  }, [client, photographerId, imagesById]);

  const current = useMemo(
    () => photographers?.find((p) => p._id === photographerId),
    [photographers, photographerId],
  );

  const finish = (keys: string[]) => {
    if (!photographerId || !images) return;
    const picked = keys
      .map((key) => images.find((img) => img._key === key))
      .filter((img): img is PortfolioRow => !!img?.asset?._ref)
      .map((img) => ({ assetRef: img.asset!._ref!, hotspot: img.hotspot, crop: img.crop }));
    if (picked.length === 0) return;
    onPick({ photographerId, images: picked });
    onClose();
  };

  const toggle = (key: string) => {
    if (max === 1) {
      finish([key]);
      return;
    }
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : prev.length >= max ? prev : [...prev, key],
    );
  };

  const header = photographerId ? toNameCase(current?.fullName ?? 'Fotoğrafçı') : 'Fotoğrafçı seçin';

  return (
    <Dialog
      id="photographer-image-picker"
      header={header}
      onClose={onClose}
      width={3}
      footer={
        photographerId && max > 1 ? (
          <Flex padding={3} gap={3} justify="space-between" align="center">
            <Text size={1} muted>
              {selected.length} / {max} seçildi
            </Text>
            <Button
              text={selected.length > 0 ? `Seçilenleri ekle (${selected.length})` : 'Seçilenleri ekle'}
              tone="primary"
              disabled={selected.length === 0}
              onClick={() => finish(selected)}
            />
          </Flex>
        ) : undefined
      }
    >
      <Box padding={4}>
        {!photographerId ? (
          photographers ? (
            <Grid columns={[2, 3, 4]} gap={3}>
              {photographers.map((p) => {
                const thumb = imagePreviewUrl(p.preview, 300, 400);
                return (
                  <Card
                    key={p._id}
                    as="button"
                    radius={2}
                    border
                    padding={2}
                    style={{ cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => setPhotographerId(p._id)}
                  >
                    <Stack space={2}>
                      <div style={{ aspectRatio: '3 / 4', background: 'var(--card-muted-bg-color)', overflow: 'hidden' }}>
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : null}
                      </div>
                      <Text size={1} weight="semibold">
                        {p.fullName ? toNameCase(p.fullName) : 'İsimsiz'}
                      </Text>
                      <Text size={0} muted>
                        {typeof p.count === 'number' ? `${p.count} görsel` : 'Görsel yok'}
                      </Text>
                    </Stack>
                  </Card>
                );
              })}
            </Grid>
          ) : (
            <Flex justify="center" padding={5}>
              <Spinner muted />
            </Flex>
          )
        ) : (
          <Stack space={4}>
            <Flex align="center" justify="space-between" gap={3}>
              <Button
                mode="bleed"
                icon={ArrowLeftIcon}
                text="Fotoğrafçılar"
                onClick={() => {
                  setPhotographerId(undefined);
                  setSelected([]);
                }}
              />
              <Text size={1} muted>
                {max === 1 ? 'Bir görsele tıklayın' : `En fazla ${max} görsel seçebilirsiniz`}
              </Text>
            </Flex>

            {images === null ? (
              <Flex justify="center" padding={5}>
                <Spinner muted />
              </Flex>
            ) : images.length === 0 ? (
              <Card padding={4} radius={2} tone="transparent" border>
                <Text size={1} muted>
                  Bu fotoğrafçının portfolyosunda görsel yok.
                </Text>
              </Card>
            ) : (
              <Grid columns={[2, 3, 4]} gap={2}>
                {images.map((img) => {
                  const thumb = imagePreviewUrl(img, 360, 360);
                  const isSelected = selected.includes(img._key);
                  const isUsed = usedAssetRefs.includes(img.asset?._ref ?? '');
                  return (
                    <Card
                      key={img._key}
                      as="button"
                      radius={2}
                      tone={isSelected ? 'primary' : 'default'}
                      border
                      style={{ position: 'relative', padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => toggle(img._key)}
                      aria-pressed={max > 1 ? isSelected : undefined}
                    >
                      <div style={{ aspectRatio: '1 / 1', background: 'var(--card-muted-bg-color)' }}>
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              opacity: isUsed && !isSelected ? 0.45 : 1,
                            }}
                          />
                        ) : null}
                      </div>
                      {img._key === 'preview' || isUsed || isSelected ? (
                        <Box style={{ position: 'absolute', left: 6, top: 6 }}>
                          <Card padding={1} radius={2} tone={isSelected ? 'primary' : 'default'} shadow={1}>
                            <Flex align="center" gap={1}>
                              {isSelected ? <CheckmarkIcon /> : null}
                              <Text size={0}>
                                {isSelected ? 'Seçildi' : isUsed ? 'Zaten ekli' : 'Kapak'}
                              </Text>
                            </Flex>
                          </Card>
                        </Box>
                      ) : null}
                    </Card>
                  );
                })}
              </Grid>
            )}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}
