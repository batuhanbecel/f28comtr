'use client';

import { UserIcon } from '@sanity/icons';
import { Button, Stack, Text } from '@sanity/ui';
import { useCallback, useState } from 'react';
import { PatchEvent, set, useFormValue, type ObjectInputProps } from 'sanity';

import { PhotographerImagePicker, type PickResult } from './PhotographerImagePicker';

/**
 * The work's image field: the usual upload / crop input, plus a button that
 * picks the image from the selected photographer's portfolio instead.
 */
export function HomeWorkImageInput(props: ObjectInputProps) {
  const { onChange, path, readOnly } = props;
  const [open, setOpen] = useState(false);
  const photographer = useFormValue([...path.slice(0, -1), 'photographer']) as { _ref?: string } | undefined;
  const photographerId = photographer?._ref?.replace(/^drafts\./, '');

  const handlePick = useCallback(
    ({ images }: PickResult) => {
      const img = images[0];
      if (!img) return;
      onChange(
        PatchEvent.from(
          set({
            _type: 'image',
            asset: { _type: 'reference', _ref: img.assetRef },
            ...(img.hotspot ? { hotspot: img.hotspot } : {}),
            ...(img.crop ? { crop: img.crop } : {}),
          }),
        ),
      );
    },
    [onChange],
  );

  return (
    <Stack space={3}>
      {!readOnly ? (
        <Stack space={2}>
          <Button
            icon={UserIcon}
            text="Fotoğrafçının portfolyosundan seç"
            mode="ghost"
            disabled={!photographerId}
            onClick={() => setOpen(true)}
          />
          {!photographerId ? (
            <Text size={1} muted>
              Önce yukarıdan fotoğrafçıyı seçin.
            </Text>
          ) : null}
        </Stack>
      ) : null}

      {props.renderDefault(props)}

      {open ? (
        <PhotographerImagePicker
          onClose={() => setOpen(false)}
          onPick={handlePick}
          photographerId={photographerId}
          max={1}
        />
      ) : null}
    </Stack>
  );
}
