'use client';

import { Box } from '@sanity/ui';
import {
  ArrayOfObjectsInputMembers,
  type ArrayOfObjectsInputProps,
  type ArrayOfObjectsMember,
} from 'sanity';

export function getArrayItemMember(
  members: ArrayOfObjectsMember[] | undefined,
  key: string,
): ArrayOfObjectsMember | undefined {
  return members?.find((m) => m.kind === 'item' && m.key === key);
}

/** Opens the default Sanity array-item edit dialog for the given `_key`. */
export function openArrayItem(
  props: Pick<ArrayOfObjectsInputProps, 'members' | 'onItemOpen'>,
  key: string,
): boolean {
  const member = getArrayItemMember(props.members, key);
  if (member?.kind === 'item' && props.onItemOpen) {
    props.onItemOpen(member.item.path);
    return true;
  }
  return false;
}

/**
 * Renders array item editors off-screen so `onItemOpen` can show the edit modal.
 * Required when replacing the default array list UI with a custom grid.
 */
export function ArrayItemEditLayer(props: ArrayOfObjectsInputProps) {
  const { members } = props;
  if (!members?.length) return null;

  return (
    <Box
      aria-hidden
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
      }}
    >
      <ArrayOfObjectsInputMembers
        members={members}
        renderAnnotation={props.renderAnnotation}
        renderBlock={props.renderBlock}
        renderField={props.renderField}
        renderInlineBlock={props.renderInlineBlock}
        renderInput={props.renderInput}
        renderItem={props.renderItem}
        renderPreview={props.renderPreview}
      />
    </Box>
  );
}
