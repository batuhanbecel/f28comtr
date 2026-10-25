'use client';

import { CheckmarkIcon, ImagesIcon } from '@sanity/icons';
import { Box, Button, Card, Dialog, Flex, Grid, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useEffect, useState } from 'react';
import { PatchEvent, set, useClient, type ArrayOfObjectsInputProps } from 'sanity';
import { randomKey } from '@sanity/util/content';

import { HOME_AI_SCENE_DEFAULT_COUNT, HOME_AI_SCENE_MAX } from '@/lib/homeV2.shared';

import { apiVersion } from '../env';
import { imagePreviewUrl } from '../lib/imagePreview';

type SceneRef = { _key: string; _type: 'reference'; _ref?: string };

type PortfolioRow = {
  _id: string;
  image?: { asset?: { _ref?: string }; hotspot?: unknown; crop?: unknown };
};

const PORTFOLIO_QUERY = `*[_type == "aiPortfolioItem" && !(_id in path("drafts.**")) && defined(image.asset)]
  | order(orderRank asc) { _id, image }`;

/**
 * The AI scene's image list: the usual reference grid (drag to reorder,
 * remove), plus a dialog that shows every AI Portfolio image so editors pick
 * by sight instead of searching file names.
 */
export function AiSceneItemsInput(props: ArrayOfObjectsInputProps) {
  const { onChange, readOnly } = props;
  const value = (props.value ?? []) as SceneRef[];
  const [open, setOpen] = useState(false);
  const full = value.length >= HOME_AI_SCENE_MAX;

  const handlePick = useCallback(
    (ids: string[]) => {
      const existing = new Set(value.map((v) => v._ref));
      const added = ids
        .filter((id) => !existing.has(id))
        .map((id) => ({ _key: randomKey(12), _type: 'reference' as const, _ref: id }));
      if (added.length === 0) return;
      onChange(PatchEvent.from(set([...value, ...added].slice(0, HOME_AI_SCENE_MAX))));
    },
    [onChange, value],
  );

  return (
    <Stack space={3}>
      {!readOnly ? (
        <Stack space={2}>
          <Button
            icon={ImagesIcon}
            text="AI Portfolyodan seç"
            mode="ghost"
            disabled={full}
            onClick={() => setOpen(true)}
          />
          <Text size={1} muted>
            {full
              ? `En fazla ${HOME_AI_SCENE_MAX} görsel — yenisini eklemek için birini kaldırın.`
              : `${value.length} / ${HOME_AI_SCENE_MAX} görsel. Boş bırakılırsa AI Portfolyo'nun ilk ${HOME_AI_SCENE_DEFAULT_COUNT} görseli gösterilir.`}
          </Text>
        </Stack>
      ) : null}

      {props.renderDefault(props)}

      {open ? (
        <AiPortfolioPicker
          onClose={() => setOpen(false)}
          onPick={handlePick}
          used={value.map((v) => v._ref ?? '')}
          max={HOME_AI_SCENE_MAX - value.length}
        />
      ) : null}
    </Stack>
  );
}

interface AiPortfolioPickerProps {
  onClose: () => void;
  onPick: (ids: string[]) => void;
  /** Portfolio document ids already in the scene — shown dimmed, not selectable. */
  used: string[];
  /** How many more images fit. */
  max: number;
}

function AiPortfolioPicker({ onClose, onPick, used, max }: AiPortfolioPickerProps) {
  const client = useClient({ apiVersion });
  const [rows, setRows] = useState<PortfolioRow[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    client.fetch<PortfolioRow[]>(PORTFOLIO_QUERY).then((r) => {
      if (!cancelled) setRows(r);
    });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : prev.length >= max ? prev : [...prev, id],
    );
  };

  return (
    <Dialog
      id="ai-scene-portfolio-picker"
      header="AI Portfolyo"
      onClose={onClose}
      width={3}
      footer={
        <Flex padding={3} gap={3} justify="space-between" align="center">
          <Text size={1} muted>
            {selected.length} / {max} seçildi
          </Text>
          <Button
            text={selected.length > 0 ? `Seçilenleri ekle (${selected.length})` : 'Seçilenleri ekle'}
            tone="primary"
            disabled={selected.length === 0}
            onClick={() => {
              onPick(selected);
              onClose();
            }}
          />
        </Flex>
      }
    >
      <Box padding={4}>
        {rows === null ? (
          <Flex justify="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : rows.length === 0 ? (
          <Card padding={4} radius={2} tone="transparent" border>
            <Text size={1} muted>
              AI Portfolyo'da henüz görsel yok.
            </Text>
          </Card>
        ) : (
          <Grid columns={[2, 3, 4]} gap={2}>
            {rows.map((row) => {
              const thumb = imagePreviewUrl(row.image as never, 360, 360);
              const isSelected = selected.includes(row._id);
              const isUsed = used.includes(row._id);
              return (
                <Card
                  key={row._id}
                  as="button"
                  radius={2}
                  tone={isSelected ? 'primary' : 'default'}
                  border
                  disabled={isUsed}
                  style={{ position: 'relative', padding: 0, overflow: 'hidden', cursor: isUsed ? 'default' : 'pointer' }}
                  onClick={() => !isUsed && toggle(row._id)}
                  aria-pressed={isSelected}
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
                          opacity: isUsed ? 0.45 : 1,
                        }}
                      />
                    ) : null}
                  </div>
                  {isUsed || isSelected ? (
                    <Box style={{ position: 'absolute', left: 6, top: 6 }}>
                      <Card padding={1} radius={2} tone={isSelected ? 'primary' : 'default'} shadow={1}>
                        <Flex align="center" gap={1}>
                          {isSelected ? <CheckmarkIcon /> : null}
                          <Text size={0}>{isSelected ? 'Seçildi' : 'Zaten ekli'}</Text>
                        </Flex>
                      </Card>
                    </Box>
                  ) : null}
                </Card>
              );
            })}
          </Grid>
        )}
      </Box>
    </Dialog>
  );
}
