'use client';

import { ImageIcon, UploadIcon } from '@sanity/icons';
import { Card, Flex, Spinner, Stack, Text, useToast } from '@sanity/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';
import { randomKey } from '@sanity/util/content';

import { apiVersion } from '../env';
import { F28_GALLERY_COLUMNS_WIDE, F28_GALLERY_THUMB_HEIGHT_WIDE } from '../lib/galleryGrid';
import { imagePreviewUrl } from '../lib/imagePreview';
import { orderRankAfter, orderRankBetween } from '../lib/lexorank';
import { DraggableImageGrid, reorderArray } from './DraggableImageGrid';
import { AiPortfolioTagEditor, type AiTagOption } from './AiPortfolioTagEditor';

interface AiPortfolioRow {
  _id: string;
  orderRank: string | null;
  image: { asset?: { _ref?: string } } | null;
  tags?: AiTagOption[] | null;
}

const QUERY = `*[_type == "aiPortfolioItem"] | order(orderRank asc) {
  _id,
  orderRank,
  image,
  "tags": tags[]->{_id, en, tr}
}`;

const TAGS_QUERY = `*[_type == "aiTag"] | order(en asc){_id, en, tr}`;

export function AiPortfolioGalleryDesk() {
  const client = useClient({ apiVersion });
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<AiPortfolioRow[]>([]);
  const [allTags, setAllTags] = useState<AiTagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, tags] = await Promise.all([
        client.fetch<AiPortfolioRow[]>(QUERY),
        client.fetch<AiTagOption[]>(TAGS_QUERY),
      ]);
      setRows(data ?? []);
      setAllTags(tags ?? []);
    } finally {
      setLoading(false);
    }
  }, [client]);

  const addTag = useCallback(
    async (rowId: string, tagId: string) => {
      try {
        await client
          .patch(rowId)
          .setIfMissing({ tags: [] })
          .append('tags', [{ _type: 'reference', _ref: tagId, _key: randomKey(12) }])
          .commit();
        await load();
      } catch (e) {
        toast.push({
          status: 'error',
          title: 'Etiket eklenemedi',
          description: e instanceof Error ? e.message : undefined,
        });
      }
    },
    [client, load, toast],
  );

  const createAndAddTag = useCallback(
    async (rowId: string, label: string) => {
      try {
        const created = await client.create({ _type: 'aiTag', en: label, tr: label });
        await client
          .patch(rowId)
          .setIfMissing({ tags: [] })
          .append('tags', [{ _type: 'reference', _ref: created._id, _key: randomKey(12) }])
          .commit();
        await load();
        toast.push({ status: 'success', title: `Etiket oluşturuldu: ${label}` });
      } catch (e) {
        toast.push({
          status: 'error',
          title: 'Etiket oluşturulamadı',
          description: e instanceof Error ? e.message : undefined,
        });
      }
    },
    [client, load, toast],
  );

  const removeTag = useCallback(
    async (rowId: string, tagId: string) => {
      try {
        await client.patch(rowId).unset([`tags[_ref=="${tagId}"]`]).commit();
        await load();
      } catch (e) {
        toast.push({
          status: 'error',
          title: 'Etiket kaldırılamadı',
          description: e instanceof Error ? e.message : undefined,
        });
      }
    },
    [client, load, toast],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const openItem = useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row?._id) return;
      setSelectedId(row._id);
      router.navigateIntent('edit', { id: row._id, type: 'aiPortfolioItem' });
    },
    [router, rows],
  );

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setUploading(true);
      try {
        const lastRank = rows.length > 0 ? rows[rows.length - 1]?.orderRank : null;
        let nextRank = orderRankAfter(lastRank);
        let lastId: string | null = null;
        for (const file of Array.from(files)) {
          if (!file.type.startsWith('image/')) continue;
          const asset = await client.assets.upload('image', file, { filename: file.name });
          const created = await client.create({
            _type: 'aiPortfolioItem',
            image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: asset._id },
            },
            orderRank: nextRank,
          });
          lastId = created._id;
          nextRank = orderRankAfter(nextRank);
        }
        await load();
        if (lastId) {
          setSelectedId(lastId);
          router.navigateIntent('edit', { id: lastId, type: 'aiPortfolioItem' });
        }
        toast.push({ status: 'success', title: 'Görseller eklendi' });
      } catch (e) {
        toast.push({
          status: 'error',
          title: 'Yükleme başarısız',
          description: e instanceof Error ? e.message : undefined,
        });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [client, load, router, rows, toast],
  );

  const removeAt = useCallback(
    async (index: number) => {
      const row = rows[index];
      if (!row?._id) return;
      try {
        await client.delete(row._id);
        if (selectedId === row._id) setSelectedId(null);
        await load();
        toast.push({ status: 'success', title: 'Görsel silindi' });
      } catch (e) {
        toast.push({
          status: 'error',
          title: 'Silinemedi',
          description: e instanceof Error ? e.message : undefined,
        });
      }
    },
    [client, load, rows, selectedId, toast],
  );

  const handleReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const reordered = reorderArray(rows, fromIndex, toIndex);
      const moved = reordered[toIndex];
      if (!moved) return;

      const prev = reordered[toIndex - 1];
      const next = reordered[toIndex + 1];
      const newRank = orderRankBetween(prev?.orderRank ?? null, next?.orderRank ?? null);

      setRows(reordered);
      try {
        await client.patch(moved._id).set({ orderRank: newRank }).commit();
        await load();
      } catch (e) {
        await load();
        toast.push({
          status: 'error',
          title: 'Sıralama kaydedilemedi',
          description: e instanceof Error ? e.message : undefined,
        });
      }
    },
    [client, load, rows, toast],
  );

  const gridItems = useMemo(
    () =>
      rows.map((row, index) => ({
        id: row._id,
        previewUrl: imagePreviewUrl(row.image ?? undefined),
        // Keep only a small index counter overlaid on the image; tags live in the
        // footer below so the two no longer stack on top of each other.
        label: `${index + 1}`,
        footer: (
          <AiPortfolioTagEditor
            tags={row.tags ?? []}
            allTags={allTags}
            onAdd={(tagId) => addTag(row._id, tagId)}
            onCreate={(label) => createAndAddTag(row._id, label)}
            onRemove={(tagId) => removeTag(row._id, tagId)}
          />
        ),
      })),
    [rows, allTags, addTag, createAndAddTag, removeTag],
  );

  return (
    <Stack className="f28-gallery-wide" space={4} padding={4}>
      <Stack space={2}>
        <Text size={2} weight="semibold">
          AI Portfolyo Görselleri
        </Text>
        <Text size={1} muted>
          Etiketleri doğrudan görselin altından ekleyin — yazıp seçin ya da Enter ile yeni
          oluşturun. Sıra için sol üstteki tutamacı kullanın.
        </Text>
      </Stack>

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
              Tıklayın — birden fazla görsel seçebilirsiniz
            </Text>
          </Stack>
        </Flex>
      </Card>

      {loading ? (
        <Flex justify="center" padding={5}>
          <Spinner muted />
        </Flex>
      ) : rows.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent" border>
          <Flex align="center" gap={2} justify="center">
            <ImageIcon />
            <Text size={1} muted>
              Henüz görsel yok. Yukarıdaki kutudan ekleyin.
            </Text>
          </Flex>
        </Card>
      ) : (
        <>
          <Text size={1} muted>
            {rows.length} görsel
          </Text>
          <DraggableImageGrid
            items={gridItems}
            columns={F28_GALLERY_COLUMNS_WIDE}
            thumbHeight={F28_GALLERY_THUMB_HEIGHT_WIDE}
            selectedId={selectedId ?? undefined}
            onReorder={(from, to) => void handleReorder(from, to)}
            onRemove={(index) => void removeAt(index)}
            onItemClick={openItem}
          />
        </>
      )}
    </Stack>
  );
}
