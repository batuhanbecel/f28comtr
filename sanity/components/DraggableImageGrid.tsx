'use client';

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleIcon, EditIcon, TrashIcon } from '@sanity/icons';
import { Box, Card, Flex, Grid, Spinner, Text } from '@sanity/ui';
import type { ReactNode } from 'react';

export interface DraggableGridItem {
  id: string;
  previewUrl: string | null;
  label?: string;
  footer?: ReactNode;
}

interface SortableImageCardProps {
  item: DraggableGridItem;
  index: number;
  total: number;
  readOnly: boolean;
  selected?: boolean;
  thumbHeight: number;
  onRemove: () => void;
  onItemClick?: (index: number) => void;
}

const toolbarBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  padding: 0,
  margin: 0,
  borderRadius: 4,
  border: '1px solid rgba(255,255,255,0.22)',
  boxShadow: '0 1px 6px rgba(0,0,0,0.35)',
  cursor: 'pointer',
  color: '#ffffff',
  lineHeight: 0,
};

const dragHandleStyle: React.CSSProperties = {
  ...toolbarBtnBase,
  background: 'rgba(0, 0, 0, 0.55)',
};

const deleteBtnStyle: React.CSSProperties = {
  ...toolbarBtnBase,
  background: 'rgba(185, 28, 28, 0.92)',
  border: '1px solid rgba(255,255,255,0.15)',
};

const toolbarIconProps = {
  width: 16,
  height: 16,
  color: '#ffffff',
};

function SortableImageCard({
  item,
  index,
  total,
  readOnly,
  selected,
  thumbHeight,
  onRemove,
  onItemClick,
}: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 2 : 1,
    outline: selected ? '2px solid #111' : undefined,
    outlineOffset: 2,
  };

  return (
    <Card
      ref={setNodeRef}
      className={onItemClick ? 'f28-thumb-card f28-thumb-card--editable' : 'f28-thumb-card'}
      style={style}
      radius={2}
      overflow="hidden"
      border
      shadow={isDragging ? 2 : 1}
    >
      <Box style={{ position: 'relative', background: '#1a1a1a' }}>
        <Box
          className="f28-thumb-card__media"
          role={onItemClick ? 'button' : undefined}
          tabIndex={onItemClick ? 0 : undefined}
          onClick={() => onItemClick?.(index)}
          onKeyDown={(e) => {
            if (onItemClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onItemClick(index);
            }
          }}
          style={{
            display: 'block',
            height: thumbHeight,
            cursor: onItemClick ? 'pointer' : 'default',
          }}
          title={onItemClick ? 'Detayları düzenle' : undefined}
        >
          {item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt=""
              className="f28-thumb-card__img"
              style={{
                display: 'block',
                width: '100%',
                height: thumbHeight,
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          ) : (
            <Flex align="center" justify="center" style={{ height: thumbHeight }}>
              <Spinner muted />
            </Flex>
          )}
          {onItemClick ? (
            <Flex
              className="f28-thumb-edit-overlay"
              align="center"
              justify="center"
              direction="column"
              gap={2}
              aria-hidden
            >
              <span className="f28-thumb-edit-overlay__icon" aria-hidden>
                <EditIcon {...toolbarIconProps} />
              </span>
              <Text size={1} weight="semibold" style={{ color: '#ffffff' }}>
                Düzenle
              </Text>
            </Flex>
          ) : null}
        </Box>

        {!readOnly ? (
          <Flex
            gap={1}
            align="center"
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              justifyContent: 'space-between',
              zIndex: 2,
            }}
          >
            <button
              type="button"
              className="f28-thumb-toolbar-btn"
              title="Sürükleyerek sırala"
              aria-label="Sürükleyerek sırala"
              style={{
                ...dragHandleStyle,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
              {...attributes}
              {...listeners}
            >
              <DragHandleIcon {...toolbarIconProps} />
            </button>
            <button
              type="button"
              className="f28-thumb-toolbar-btn"
              title="Sil"
              aria-label="Sil"
              style={deleteBtnStyle}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <TrashIcon {...toolbarIconProps} />
            </button>
          </Flex>
        ) : null}

        <Box
          padding={2}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.82))',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <Text size={1} weight="medium" style={{ color: '#fff' }}>
            {item.label ?? `${index + 1} / ${total}`}
          </Text>
        </Box>
      </Box>
      {item.footer ? <Box padding={2}>{item.footer}</Box> : null}
    </Card>
  );
}

type GridColumns = number | number[];

interface DraggableImageGridProps {
  items: DraggableGridItem[];
  readOnly?: boolean;
  selectedId?: string;
  /** Responsive column count; default `[1, 2, 3]`. AI galleries use `[1, 3, 5]`. */
  columns?: GridColumns;
  thumbHeight?: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  onItemClick?: (index: number) => void;
}

export function DraggableImageGrid({
  items,
  readOnly = false,
  selectedId,
  columns = [1, 2, 3],
  thumbHeight = 200,
  onReorder,
  onRemove,
  onItemClick,
}: DraggableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = items.findIndex((i) => i.id === active.id);
    const toIndex = items.findIndex((i) => i.id === over.id);
    if (fromIndex < 0 || toIndex < 0) return;
    onReorder(fromIndex, toIndex);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <Grid className="f28-thumb-grid" columns={columns} gap={3}>
          {items.map((item, index) => (
            <SortableImageCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              readOnly={readOnly}
              thumbHeight={thumbHeight}
              selected={selectedId === item.id}
              onRemove={() => onRemove(index)}
              onItemClick={onItemClick}
            />
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}

/** Reorder array in memory (for patch-based arrays). */
export function reorderArray<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  return arrayMove(items, fromIndex, toIndex);
}
