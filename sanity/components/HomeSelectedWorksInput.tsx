'use client';

import { ImageIcon, UploadIcon, UserIcon } from '@sanity/icons';
import { Button, Card, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  PatchEvent,
  type ArrayOfObjectsInputProps,
  set,
  unset,
  useClient,
} from 'sanity';
import { randomKey } from '@sanity/util/content';

import { HOME_SELECTED_WORKS_MAX, SELECTED_WORKS_MAX } from '@/lib/homeSelectedWorks.shared';

import { apiVersion } from '../env';
import { F28_GALLERY_COLUMNS_WIDE, F28_GALLERY_THUMB_HEIGHT_WIDE } from '../lib/galleryGrid';
import { imagePreviewUrl } from '../lib/imagePreview';
import { ArrayItemEditLayer, openArrayItem } from './ArrayItemEditLayer';
import { DraggableImageGrid, reorderArray } from './DraggableImageGrid';
import { PhotographerImagePicker, type PickResult } from './PhotographerImagePicker';

type HomeSelectedWorkItem = {
  _key: string;
  _type: 'homeSelectedWork';
  image?: { asset?: { _ref?: string; _type?: string }; _type?: string; hotspot?: unknown; crop?: unknown };
  workTitle?: string;
  photographer?: { _ref?: string; _type?: string };
};

export function HomeSelectedWorksInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange, readOnly, members, onItemOpen } = props;
  // Hero reel (Anasayfa → works) holds 6; the site-wide list (Production → selectedWorks) more
  const max = props.path[props.path.length - 1] === 'selectedWorks' ? SELECTED_WORKS_MAX : HOME_SELECTED_WORKS_MAX;
  const works = value as HomeSelectedWorkItem[];
  const client = useClient({ apiVersion });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const atMax = works.length >= max;
  const slotsLeft = Math.max(0, max - works.length);

  const patchWorks = useCallback(
    (next: HomeSelectedWorkItem[]) => {
      onChange(PatchEvent.from(set(next)));
    },
    [onChange],
  );

  const openWork = useCallback(
    (index: number) => {
      const work = works[index];
      if (!work?._key) return;
      setSelectedKey(work._key);
      openArrayItem({ members, onItemOpen }, work._key);
    },
    [members, onItemOpen, works],
  );

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || readOnly || atMax) return;
      setUploading(true);
      try {
        const uploaded: HomeSelectedWorkItem[] = [];
        const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
        for (const file of fileList.slice(0, slotsLeft)) {
          const asset = await client.assets.upload('image', file, { filename: file.name });
          uploaded.push({
            _type: 'homeSelectedWork',
            _key: randomKey(12),
            image: {
              _type: 'image',
              asset: { _ref: asset._id },
            },
          });
        }
        if (uploaded.length > 0) {
          // New works go first — editors see them at once instead of dragging them up
          const next = [...uploaded, ...works];
          patchWorks(next);
          const first = uploaded[0];
          if (first?._key) {
            setSelectedKey(first._key);
            openArrayItem({ members, onItemOpen }, first._key);
          }
        }
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [atMax, client, members, onItemOpen, patchWorks, readOnly, slotsLeft, works],
  );

  // Adds works straight from a photographer's portfolio: same asset, crop and
  // hotspot, with the photographer already filled in — nothing is uploaded.
  const handlePick = useCallback(
    ({ photographerId, images }: PickResult) => {
      if (readOnly || atMax) return;
      const added: HomeSelectedWorkItem[] = images.slice(0, slotsLeft).map((img) => ({
        _type: 'homeSelectedWork',
        _key: randomKey(12),
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: img.assetRef },
          ...(img.hotspot ? { hotspot: img.hotspot } : {}),
          ...(img.crop ? { crop: img.crop } : {}),
        },
        photographer: { _type: 'reference', _ref: photographerId },
      }));
      if (added.length === 0) return;
      patchWorks([...added, ...works]);
      setSelectedKey(added[0]._key);
    },
    [atMax, patchWorks, readOnly, slotsLeft, works],
  );

  const usedAssetRefs = useMemo(
    () => works.map((w) => w.image?.asset?._ref).filter((ref): ref is string => !!ref),
    [works],
  );

  const removeAt = useCallback(
    (index: number) => {
      if (readOnly) return;
      const item = works[index];
      if (!item?._key) return;
      if (selectedKey === item._key) setSelectedKey(null);
      onChange(PatchEvent.from(unset([{ _key: item._key }])));
    },
    [onChange, readOnly, selectedKey, works],
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (readOnly) return;
      patchWorks(reorderArray(works, fromIndex, toIndex));
    },
    [patchWorks, readOnly, works],
  );

  const gridItems = useMemo(
    () =>
      works.map((work, index) => ({
        id: work._key,
        previewUrl: imagePreviewUrl(work.image),
        label: work.workTitle?.trim() || `İş ${index + 1}`,
      })),
    [works],
  );

  return (
    <Stack className="f28-gallery-wide" space={4}>
      {!readOnly && !atMax ? (
        <Card padding={4} radius={2} tone="transparent" border style={{ borderStyle: 'dashed' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <Stack space={4}>
            <Stack space={2} style={{ textAlign: 'center' }}>
              <Text size={2} weight="semibold">
                Öne çıkan iş ekle
              </Text>
              <Text size={1} muted>
                Fotoğrafçıyı seçin, portfolyosundaki görsellerden ekleyin — en başa eklenir (en fazla {max})
              </Text>
            </Stack>
            <Flex gap={2} justify="center" wrap="wrap">
              <Button
                icon={UserIcon}
                text="Fotoğrafçının portfolyosundan seç"
                tone="primary"
                onClick={() => setPickerOpen(true)}
              />
              <Button
                icon={uploading ? Spinner : UploadIcon}
                text="Bilgisayardan yükle"
                mode="ghost"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              />
            </Flex>
          </Stack>
        </Card>
      ) : null}

      {atMax ? (
        <Text size={1} muted>
          En fazla {max} iş eklenebilir. Yeni eklemek için birini silin.
        </Text>
      ) : (
        <Text size={1} muted>
          {works.length} / {max} iş — sıralamak için tutamacı sürükleyin; fotoğrafçı ve
          başlık için görsele tıklayın
        </Text>
      )}

      {works.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent" border>
          <Flex align="center" gap={2} justify="center">
            <ImageIcon />
            <Text size={1} muted>
              Henüz öne çıkan iş yok. Yukarıdan fotoğrafçı seçerek ekleyin.
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
          onItemClick={readOnly ? undefined : openWork}
        />
      )}

      {pickerOpen ? (
        <PhotographerImagePicker
          onClose={() => setPickerOpen(false)}
          onPick={handlePick}
          max={slotsLeft}
          usedAssetRefs={usedAssetRefs}
        />
      ) : null}

      <ArrayItemEditLayer {...props} />
    </Stack>
  );
}
