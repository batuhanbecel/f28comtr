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
import { workCoverImage } from '../lib/workCoverImage';
import { ArrayItemEditLayer, openArrayItem } from './ArrayItemEditLayer';
import { DraggableImageGrid, reorderArray } from './DraggableImageGrid';

type SanityImageItem = {
  _key?: string;
  _type?: 'image';
  asset?: { _ref?: string; _type?: string };
};

type AiPoweredWorkItem = {
  _key: string;
  _type: 'aiPoweredWork';
  brand?: string;
  title?: string;
  category?: string;
  images?: SanityImageItem[];
  image?: SanityImageItem;
  slug?: { current?: string };
};

export function AiPoweredWorksInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange, readOnly, members, onItemOpen } = props;
  const works = value as AiPoweredWorkItem[];
  const client = useClient({ apiVersion });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const patchWorks = useCallback(
    (next: AiPoweredWorkItem[]) => {
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
      if (!files?.length || readOnly) return;
      setUploading(true);
      try {
        const uploaded: AiPoweredWorkItem[] = [];
        let n = works.length;
        for (const file of Array.from(files)) {
          if (!file.type.startsWith('image/')) continue;
          const asset = await client.assets.upload('image', file, { filename: file.name });
          n += 1;
          const slugKey = randomKey(8);
          uploaded.push({
            _type: 'aiPoweredWork',
            _key: randomKey(12),
            brand: `Marka ${n}`,
            category: 'visual',
            slug: { current: `work-${slugKey}` },
            images: [
              {
                _type: 'image',
                _key: randomKey(12),
                asset: { _ref: asset._id },
              },
            ],
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
    [client, members, onItemOpen, patchWorks, readOnly, works],
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
        previewUrl: imagePreviewUrl(workCoverImage(work)),
        label: work.brand?.trim() || `Çalışma ${index + 1}`,
      })),
    [works],
  );

  return (
    <div className="f28-gallery-wide" style={{ width: '100%' }}>
    <Stack space={4}>
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
                Çalışma görseli ekle
              </Text>
              <Text size={1} muted>
                Görsel seçin — detay penceresi otomatik açılır
              </Text>
            </Stack>
          </Flex>
        </Card>
      ) : null}

      <Text size={1} muted>
        {works.length} çalışma — sıralamak için sol üstteki tutamacı sürükleyin; çalışmaya tıklayınca
        birden fazla görsel ve künye düzenlenir
      </Text>

      {works.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent" border>
          <Flex align="center" gap={2} justify="center">
            <ImageIcon />
            <Text size={1} muted>
              Henüz çalışma yok. Yukarıdaki kutudan görsel ekleyin.
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
    </div>
  );
}
