'use client';

import { ImageIcon, UploadIcon } from '@sanity/icons';
import { Card, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  PatchEvent,
  type ArrayOfObjectsInputProps,
  set,
  unset,
  useClient,
} from 'sanity';
import { randomKey } from '@sanity/util/content';

import { apiVersion } from '../env';
import { F28_GALLERY_COLUMNS_WIDE, F28_GALLERY_THUMB_HEIGHT_WIDE } from '../lib/galleryGrid';
import { imagePreviewUrl } from '../lib/imagePreview';
import { ArrayItemEditLayer, openArrayItem } from './ArrayItemEditLayer';
import { DraggableImageGrid, reorderArray } from './DraggableImageGrid';

type PortfolioImage = {
  _key: string;
  _type: 'image';
  asset?: { _ref?: string; _type?: string };
};

export function PortfolioImagesInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange, readOnly, members, onItemOpen } = props;
  const images = value as PortfolioImage[];
  const client = useClient({ apiVersion });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const countLabel = useMemo(() => `${images.length} görsel`, [images.length]);

  const openImage = useCallback(
    (index: number) => {
      const item = images[index];
      if (!item?._key) return;
      setSelectedKey(item._key);
      openArrayItem({ members, onItemOpen }, item._key);
    },
    [images, members, onItemOpen],
  );

  const patchImages = useCallback(
    (next: PortfolioImage[]) => {
      onChange(PatchEvent.from(set(next)));
    },
    [onChange],
  );

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || readOnly) return;
      setUploading(true);
      try {
        const uploaded: PortfolioImage[] = [];
        for (const file of Array.from(files)) {
          if (!file.type.startsWith('image/')) continue;
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
          });
          uploaded.push({
            _type: 'image',
            _key: randomKey(12),
            asset: { _type: 'reference', _ref: asset._id },
          });
        }
        if (uploaded.length > 0) {
          const next = [...images, ...uploaded];
          patchImages(next);
          const last = uploaded[uploaded.length - 1];
          if (last?._key) {
            setSelectedKey(last._key);
            openArrayItem({ members, onItemOpen }, last._key);
          }
        }
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [client, images, members, onItemOpen, patchImages, readOnly],
  );

  const removeAt = useCallback(
    (index: number) => {
      if (readOnly) return;
      const item = images[index];
      if (!item?._key) return;
      if (selectedKey === item._key) setSelectedKey(null);
      onChange(PatchEvent.from(unset([{ _key: item._key }])));
    },
    [images, onChange, readOnly, selectedKey],
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (readOnly) return;
      patchImages(reorderArray(images, fromIndex, toIndex));
    },
    [images, patchImages, readOnly],
  );

  const gridItems = useMemo(
    () =>
      images.map((item, index) => ({
        id: item._key,
        previewUrl: imagePreviewUrl(item),
        label: `${index + 1} / ${images.length}`,
      })),
    [images],
  );

  return (
    <Stack className="f28-gallery-wide" space={4}>
      {!readOnly ? (
        <Card
          padding={4}
          radius={2}
          tone="transparent"
          border
          style={{
            borderStyle: 'dashed',
            cursor: uploading ? 'wait' : 'pointer',
          }}
          onClick={() => !uploading && fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <Flex align="center" justify="center" gap={3} direction="column">
            {uploading ? (
              <Spinner muted />
            ) : (
              <UploadIcon style={{ fontSize: 28, opacity: 0.7 }} />
            )}
            <Stack space={2} style={{ textAlign: 'center' }}>
              <Text size={2} weight="semibold">
                Portfolyo görseli ekle
              </Text>
              <Text size={1} muted>
                Görsel seçin — kırpma penceresi otomatik açılır
              </Text>
            </Stack>
          </Flex>
        </Card>
      ) : null}

      <Text size={1} muted>
        {countLabel} — sıralamak için sol üstteki tutamacı sürükleyin; kırpma ve hotspot için
        görsele tıklayın
      </Text>

      {images.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent" border>
          <Flex align="center" gap={2} justify="center">
            <ImageIcon />
            <Text size={1} muted>
              Henüz portfolyo görseli yok. Yukarıdaki kutudan ekleyin.
            </Text>
          </Flex>
        </Card>
      ) : (
        <DraggableImageGrid
          items={gridItems}
          columns={F28_GALLERY_COLUMNS_WIDE}
          thumbHeight={F28_GALLERY_THUMB_HEIGHT_WIDE}
          readOnly={!!readOnly}
          selectedId={selectedKey ?? undefined}
          onReorder={handleReorder}
          onRemove={removeAt}
          onItemClick={readOnly ? undefined : openImage}
        />
      )}

      <ArrayItemEditLayer {...props} />
    </Stack>
  );
}
