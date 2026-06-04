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

import { HOME_SELECTED_WORKS_MAX } from '@/lib/homeSelectedWorks.shared';

import { apiVersion } from '../env';
import { F28_GALLERY_COLUMNS_WIDE, F28_GALLERY_THUMB_HEIGHT_WIDE } from '../lib/galleryGrid';
import { imagePreviewUrl } from '../lib/imagePreview';
import { ArrayItemEditLayer, openArrayItem } from './ArrayItemEditLayer';
import { DraggableImageGrid, reorderArray } from './DraggableImageGrid';

type HomeSelectedWorkItem = {
  _key: string;
  _type: 'homeSelectedWork';
  image?: { asset?: { _ref?: string }; _type?: string };
  workTitle?: string;
  photographer?: { _ref?: string; _type?: string };
};

export function HomeSelectedWorksInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange, readOnly, members, onItemOpen } = props;
  const works = value as HomeSelectedWorkItem[];
  const client = useClient({ apiVersion });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const atMax = works.length >= HOME_SELECTED_WORKS_MAX;
  const slotsLeft = Math.max(0, HOME_SELECTED_WORKS_MAX - works.length);

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
          const next = [...works, ...uploaded];
          patchWorks(next);
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
    [atMax, client, members, onItemOpen, patchWorks, readOnly, slotsLeft, works],
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
                Öne çıkan iş görseli ekle
              </Text>
              <Text size={1} muted>
                Görsel seçin — fotoğrafçı ve başlık penceresi açılır (en fazla {HOME_SELECTED_WORKS_MAX})
              </Text>
            </Stack>
          </Flex>
        </Card>
      ) : null}

      {atMax ? (
        <Text size={1} muted>
          En fazla {HOME_SELECTED_WORKS_MAX} iş eklenebilir. Yeni eklemek için birini silin.
        </Text>
      ) : (
        <Text size={1} muted>
          {works.length} / {HOME_SELECTED_WORKS_MAX} iş — sıralamak için tutamacı sürükleyin; fotoğrafçı ve
          başlık için görsele tıklayın
        </Text>
      )}

      {works.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent" border>
          <Flex align="center" gap={2} justify="center">
            <ImageIcon />
            <Text size={1} muted>
              Henüz öne çıkan iş yok. Yukarıdaki kutudan görsel ekleyin.
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

      <ArrayItemEditLayer {...props} />
    </Stack>
  );
}
