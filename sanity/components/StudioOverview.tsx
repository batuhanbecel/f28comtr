'use client';

import {
  AddIcon,
  ComposeIcon,
  EarthGlobeIcon,
  HomeIcon,
  ImageIcon,
  ImagesIcon,
  RobotIcon,
  UsersIcon,
} from '@sanity/icons';
import { Box, Button, Card, Flex, Grid, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';

import { apiVersion } from '../env';
import { imagePreviewUrl } from '../lib/imagePreview';

type ImageLike = { asset?: { _ref?: string } } | null;

interface OverviewCounts {
  photographers: number;
  retouchers: number;
  aiWorks: number;
  aiPortfolio: number;
  aiTags: number;
  seoOverrides: number;
}

interface RecentDoc {
  _id: string;
  _type: string;
  _updatedAt: string;
  title: string | null;
  media: ImageLike;
}

const COUNTS_QUERY = `{
  "photographers": count(*[_type == "photographer" && title == "PHOTOGRAPHER"]),
  "retouchers": count(*[_type == "photographer" && title == "RETOUCHER"]),
  "aiWorks": coalesce(count(*[_id in ["aiPoweredCollection", "drafts.aiPoweredCollection"]][0].works), 0),
  "aiPortfolio": count(*[_type == "aiPortfolioItem"]),
  "aiTags": count(*[_type == "aiTag"]),
  "seoOverrides": count(*[_type == "seoOverride"])
}`;

const RECENT_QUERY = `*[_type in ["photographer", "aiPortfolioItem", "seoOverride"]]
  | order(_updatedAt desc)[0...8]{
    _id,
    _type,
    _updatedAt,
    "title": select(
      _type == "photographer" => fullName,
      _type == "seoOverride" => pageKey,
      _type == "aiPortfolioItem" => image.asset->originalFilename,
      _type
    ),
    "media": select(
      _type == "photographer" => preview,
      _type == "aiPortfolioItem" => image,
      null
    )
  }`;

const TYPE_LABELS: Record<string, string> = {
  photographer: 'Fotoğrafçı',
  aiPortfolioItem: 'AI Portfolyo',
  seoOverride: 'SEO',
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return 'az önce';
  if (min < 60) return `${min} dk önce`;
  const hrs = Math.round(min / 60);
  if (hrs < 24) return `${hrs} sa önce`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR');
}

function StatCard({
  icon,
  value,
  label,
  loading,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  loading: boolean;
}) {
  return (
    <Card className="f28-dash-stat" padding={4} radius={3} border>
      <Flex align="center" gap={3}>
        <span className="f28-dash-stat__icon" aria-hidden>
          {icon}
        </span>
        <Stack space={2}>
          <Text size={4} weight="bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {loading ? '—' : value}
          </Text>
          <Text size={1} muted>
            {label}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}

export function StudioOverview() {
  const client = useClient({ apiVersion });
  const router = useRouter();
  const [counts, setCounts] = useState<OverviewCounts | null>(null);
  const [recent, setRecent] = useState<RecentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      client.fetch<OverviewCounts>(COUNTS_QUERY),
      client.fetch<RecentDoc[]>(RECENT_QUERY),
    ])
      .then(([c, r]) => {
        if (!active) return;
        setCounts(c);
        setRecent(r ?? []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [client]);

  const editDoc = useCallback(
    (id: string, type: string) => router.navigateIntent('edit', { id, type }),
    [router],
  );

  const createDoc = useCallback(
    (type: string) => router.navigateIntent('create', { type }),
    [router],
  );

  const stats = useMemo(
    () => [
      { icon: <UsersIcon />, value: counts?.photographers ?? 0, label: 'Fotoğrafçı' },
      { icon: <UsersIcon />, value: counts?.retouchers ?? 0, label: 'Retoucher' },
      { icon: <RobotIcon />, value: counts?.aiWorks ?? 0, label: 'AI Çalışma' },
      { icon: <ImagesIcon />, value: counts?.aiPortfolio ?? 0, label: 'AI Portfolyo Görseli' },
      { icon: <ImageIcon />, value: counts?.aiTags ?? 0, label: 'AI Etiket' },
      { icon: <EarthGlobeIcon />, value: counts?.seoOverrides ?? 0, label: 'SEO Kaydı' },
    ],
    [counts],
  );

  return (
    <Box className="f28-dash" padding={[3, 4, 5]}>
      <Stack space={5} style={{ maxWidth: 1180, marginInline: 'auto', width: '100%' }}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <Stack space={3} className="f28-dash-head">
          <Text size={0} muted className="f28-dash-eyebrow">
            f/2.8 · PRODUCTION COMMAND
          </Text>
          <Text size={5} weight="bold">
            Genel Bakış
          </Text>
          <Text size={1} muted>
            İçerik durumunu izleyin, hızlıca yeni kayıt oluşturun ve son düzenlemelere
            geri dönün.
          </Text>
        </Stack>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <Grid columns={[2, 3, 6]} gap={3}>
          {stats.map((s) => (
            <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} loading={loading} />
          ))}
        </Grid>

        {/* ── Quick actions ──────────────────────────────────────── */}
        <Stack space={3}>
          <Text size={1} weight="semibold" className="f28-dash-section-label">
            HIZLI İŞLEMLER
          </Text>
          <Grid columns={[1, 2, 3]} gap={3}>
            <Button
              mode="ghost"
              icon={AddIcon}
              text="Yeni Fotoğrafçı"
              justify="flex-start"
              padding={4}
              onClick={() => createDoc('photographer')}
            />
            <Button
              mode="ghost"
              icon={RobotIcon}
              text="AI Çalışma Galerisi"
              justify="flex-start"
              padding={4}
              onClick={() => editDoc('aiPoweredCollection', 'aiPoweredCollection')}
            />
            <Button
              mode="ghost"
              icon={ImagesIcon}
              text="AI Portfolyo Görseli"
              justify="flex-start"
              padding={4}
              onClick={() => createDoc('aiPortfolioItem')}
            />
            <Button
              mode="ghost"
              icon={HomeIcon}
              text="Anasayfa İçeriği"
              justify="flex-start"
              padding={4}
              onClick={() => editDoc('homeV2PageCopy', 'homeV2PageCopy')}
            />
            <Button
              mode="ghost"
              icon={ComposeIcon}
              text="Production Sayfası"
              justify="flex-start"
              padding={4}
              onClick={() => editDoc('productionPageCopy', 'productionPageCopy')}
            />
            <Button
              mode="ghost"
              icon={EarthGlobeIcon}
              text="SEO Düzenlemesi"
              justify="flex-start"
              padding={4}
              onClick={() => createDoc('seoOverride')}
            />
          </Grid>
        </Stack>

        {/* ── Recent activity ────────────────────────────────────── */}
        <Stack space={3}>
          <Text size={1} weight="semibold" className="f28-dash-section-label">
            SON DÜZENLENENLER
          </Text>
          <Card radius={3} border overflow="hidden">
            {loading ? (
              <Flex justify="center" padding={5}>
                <Spinner muted />
              </Flex>
            ) : recent.length === 0 ? (
              <Flex justify="center" padding={5}>
                <Text size={1} muted>
                  Henüz düzenlenmiş içerik yok.
                </Text>
              </Flex>
            ) : (
              <Stack>
                {recent.map((doc, i) => {
                  const preview = imagePreviewUrl(doc.media ?? undefined);
                  return (
                    <Card
                      key={doc._id}
                      as="button"
                      className="f28-dash-row"
                      padding={3}
                      radius={0}
                      style={{
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderTop: i === 0 ? undefined : '1px solid var(--card-border-color)',
                        width: '100%',
                      }}
                      onClick={() => editDoc(doc._id.replace(/^drafts\./, ''), doc._type)}
                    >
                      <Flex align="center" gap={3}>
                        <Box
                          className="f28-dash-row__thumb"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: 'rgba(255,255,255,0.06)',
                          }}
                        >
                          {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={preview}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Flex align="center" justify="center" style={{ height: '100%' }}>
                              <ImageIcon />
                            </Flex>
                          )}
                        </Box>
                        <Stack space={2} flex={1} style={{ minWidth: 0 }}>
                          <Text size={1} weight="medium" textOverflow="ellipsis">
                            {doc.title || 'İsimsiz'}
                          </Text>
                          <Text size={0} muted>
                            {TYPE_LABELS[doc._type] ?? doc._type}
                          </Text>
                        </Stack>
                        <Text size={0} muted style={{ flexShrink: 0 }}>
                          {relativeTime(doc._updatedAt)}
                        </Text>
                      </Flex>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
