'use client';

import { AddIcon, CloseIcon, TagIcon } from '@sanity/icons';
import { Box, Flex, Popover, Stack, Text, TextInput } from '@sanity/ui';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface AiTagOption {
  _id: string;
  en: string;
  tr?: string | null;
}

interface AiPortfolioTagEditorProps {
  tags: AiTagOption[];
  allTags: AiTagOption[];
  busy?: boolean;
  onAdd: (tagId: string) => void | Promise<void>;
  onCreate: (label: string) => void | Promise<void>;
  onRemove: (tagId: string) => void | Promise<void>;
}

function normalize(s: string): string {
  return s.trim().toLocaleLowerCase('tr');
}

const resetButton: React.CSSProperties = {
  appearance: 'none',
  background: 'none',
  border: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
};

const suggestionBtn: React.CSSProperties = {
  ...resetButton,
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '6px 8px',
  borderRadius: 4,
};

/**
 * Inline tag editor shown under each AI-portfolio thumbnail. Lets an editor add
 * filters straight from the gallery: type to filter existing tags, click one to
 * attach it, or press Enter / "Yeni oluştur" to create a brand-new tag. No need
 * to visit the separate "Etiket Tanımları" section first.
 */
export function AiPortfolioTagEditor({
  tags,
  allTags,
  busy = false,
  onAdd,
  onCreate,
  onRemove,
}: AiPortfolioTagEditorProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const attachedIds = useMemo(() => new Set(tags.map((t) => t._id)), [tags]);
  const q = normalize(query);

  const suggestions = useMemo(() => {
    const available = allTags.filter((t) => !attachedIds.has(t._id));
    if (!q) return available.slice(0, 8);
    return available
      .filter((t) => normalize(t.en).includes(q) || normalize(t.tr ?? '').includes(q))
      .slice(0, 8);
  }, [allTags, attachedIds, q]);

  const exactMatch = useMemo(
    () => allTags.find((t) => normalize(t.en) === q || normalize(t.tr ?? '') === q),
    [allTags, q],
  );

  const closeSoon = useCallback(() => {
    // Let click handlers on suggestions fire before the popover unmounts.
    window.setTimeout(() => setOpen(false), 120);
  }, []);

  const handleAdd = useCallback(
    async (tagId: string) => {
      setQuery('');
      setOpen(false);
      await onAdd(tagId);
    },
    [onAdd],
  );

  const handleCreate = useCallback(async () => {
    const label = query.trim();
    if (!label) return;
    setQuery('');
    setOpen(false);
    await onCreate(label);
  }, [onCreate, query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (exactMatch) void handleAdd(exactMatch._id);
        else if (query.trim()) void handleCreate();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [exactMatch, handleAdd, handleCreate, query],
  );

  const showCreate = q.length > 0 && !exactMatch;

  const suggestionList = (
    <Box style={{ maxHeight: 220, overflowY: 'auto', minWidth: 220 }}>
      <Stack space={1} padding={1}>
        {suggestions.length === 0 && !showCreate ? (
          <Box padding={2}>
            <Text size={1} muted>
              {q ? 'Eşleşen etiket yok' : 'Tüm etiketler ekli'}
            </Text>
          </Box>
        ) : null}
        {suggestions.map((t) => (
          <button
            key={t._id}
            type="button"
            style={suggestionBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => void handleAdd(t._id)}
          >
            <Flex align="center" gap={2}>
              <TagIcon />
              <Text size={1}>{t.en}</Text>
              {t.tr && normalize(t.tr) !== normalize(t.en) ? (
                <Text size={1} muted>
                  · {t.tr}
                </Text>
              ) : null}
            </Flex>
          </button>
        ))}
        {showCreate ? (
          <button
            type="button"
            style={{ ...suggestionBtn, color: 'var(--card-link-color, #2276fc)' }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => void handleCreate()}
          >
            <Flex align="center" gap={2}>
              <AddIcon />
              <Text size={1} weight="semibold" style={{ color: 'inherit' }}>
                Yeni oluştur: “{query.trim()}”
              </Text>
            </Flex>
          </button>
        ) : null}
      </Stack>
    </Box>
  );

  return (
    <Stack space={2}>
      {tags.length > 0 ? (
        <Flex gap={1} wrap="wrap">
          {tags.map((t) => (
            <Flex
              key={t._id}
              align="center"
              gap={1}
              paddingLeft={2}
              paddingRight={1}
              paddingY={1}
              style={{ background: 'rgba(127,127,127,0.16)', borderRadius: 999 }}
            >
              <Text size={1}>{t.en}</Text>
              <button
                type="button"
                disabled={busy}
                onClick={() => void onRemove(t._id)}
                title="Etiketi kaldır"
                aria-label={`${t.en} etiketini kaldır`}
                style={{
                  ...resetButton,
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 2,
                  borderRadius: 999,
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.5 : 0.7,
                }}
              >
                <CloseIcon />
              </button>
            </Flex>
          ))}
        </Flex>
      ) : null}

      <Popover
        open={open && (suggestions.length > 0 || showCreate)}
        portal
        placement="bottom-start"
        content={suggestionList}
      >
        <Box>
          <TextInput
            ref={inputRef}
            fontSize={1}
            icon={TagIcon}
            placeholder="Etiket ekle…"
            value={query}
            disabled={busy}
            onFocus={() => setOpen(true)}
            onBlur={closeSoon}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
        </Box>
      </Popover>
    </Stack>
  );
}
