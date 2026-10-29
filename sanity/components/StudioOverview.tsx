'use client';

import {
  AddIcon,
  CheckmarkCircleIcon,
  CaseIcon,
  DesktopIcon,
  EarthGlobeIcon,
  EditIcon,
  EnvelopeIcon,
  HomeIcon,
  ImageIcon,
  ImagesIcon,
  LaunchIcon,
  RobotIcon,
  UsersIcon,
  WarningOutlineIcon,
  InfoOutlineIcon,
} from '@sanity/icons';
import { Badge, Box, Button, Card, Flex, Menu, MenuButton, MenuItem, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClient, useCurrentUser } from 'sanity';
import { useRouter } from 'sanity/router';

import { hasRoleFilter } from '@/lib/artistRoles';
import { toNameCase } from '@/lib/displayCase';
import { HOME_AI_SCENE_DEFAULT_COUNT } from '@/lib/homeV2.shared';

import { apiVersion, studioBasePath } from '../env';
import { imagePreviewUrl } from '../lib/imagePreview';

type ImageLike = { asset?: { _ref?: string } } | null | undefined;

/** Every document type the overview reads — edits to any of them refresh it live. */
const WATCHED_TYPES = [
  'photographer',
  'productionProject',
  'aiPoweredCollection',
  'aiPortfolioItem',
  'aiTag',
  'homeV2PageCopy',
  'siteAssets',
  'productionPageCopy',
  'aiPoweredPageCopy',
  'contactPageCopy',
  'seoOverride',
];

const TYPE_LABELS: Record<string, string> = {
  photographer: 'Sanatçı',
  productionProject: 'Prodüksiyon projesi',
  aiPoweredCollection: 'AI çalışmalar',
  aiPortfolioItem: 'AI portfolyo görseli',
  aiTag: 'AI etiketi',
  homeV2PageCopy: 'Anasayfa',
  siteAssets: 'Site görselleri',
  productionPageCopy: 'Production sayfası',
  aiPoweredPageCopy: 'AI Powered sayfası',
  contactPageCopy: 'İletişim sayfası',
  seoOverride: 'SEO',
};

const SEO_PAGE_COUNT = 9;

const PUBLISHED = `!(_id in path("drafts.**"))`;

/** Readable title for any watched document (used in drafts + recent lists). */
const DOC_TITLE = `select(
  _type == "photographer" => fullName,
  _type == "productionProject" => coalesce(brand + " — " + title, brand, title),
  _type == "aiPortfolioItem" => image.asset->originalFilename,
  _type == "aiTag" => coalesce(tr, en),
  _type == "seoOverride" => "SEO · " + pageKey,
  null
)`;

const DOC_MEDIA = `select(
  _type == "photographer" => preview,
  _type == "productionProject" => images[0],
  _type == "aiPortfolioItem" => image,
  null
)`;

const OVERVIEW_QUERY = `{
  "counts": {
    "photographers": count(*[_type == "photographer" && ${hasRoleFilter('PHOTOGRAPHER')} && ${PUBLISHED}]),
    "retouchers": count(*[_type == "photographer" && ${hasRoleFilter('RETOUCHER')} && ${PUBLISHED}]),
    "aiArtists": count(*[_type == "photographer" && ${hasRoleFilter('AI_ARTIST')} && ${PUBLISHED}]),
    "portfolioImages": count(*[_type == "photographer" && ${PUBLISHED}].portfolioImages[]),
    "projects": count(*[_type == "productionProject" && ${PUBLISHED}]),
    "aiWorks": coalesce(count(*[_id == "aiPoweredCollection"][0].works), 0),
    "aiPortfolio": count(*[_type == "aiPortfolioItem" && ${PUBLISHED}]),
    "aiTags": count(*[_type == "aiTag" && ${PUBLISHED}]),
    "clientLogos": coalesce(count(*[_id == "siteAssets"][0].logos.clients), 0),
    "seoOverrides": count(*[_type == "seoOverride" && ${PUBLISHED}])
  },
  "drafts": *[_id in path("drafts.**") && _type in $types] | order(_updatedAt desc)[0...12]{
    _id, _type, _updatedAt,
    "title": ${DOC_TITLE},
    "media": ${DOC_MEDIA},
    "isNew": count(*[_id == string::split(^._id, "drafts.")[1]]) == 0
  },
  "recent": *[${PUBLISHED} && _type in $types] | order(_updatedAt desc)[0...30]{
    _id, _type, _updatedAt,
    "title": ${DOC_TITLE},
    "media": ${DOC_MEDIA}
  },
  "home": *[_id == "homeV2PageCopy"][0]{
    "works": works[]{ _key, image, workTitle, "artist": photographer->fullName },
    "scene": aiSceneItems[]->{ _id, image }
  },
  "portfolioHead": *[_type == "aiPortfolioItem" && ${PUBLISHED} && defined(image.asset)] | order(orderRank asc)[0...${HOME_AI_SCENE_DEFAULT_COUNT}]{ _id, image },
  "health": {
    "noCover": *[_type == "photographer" && ${PUBLISHED} && !defined(preview.asset)]{ _id, _type, "title": fullName },
    "noPortfolio": *[_type == "photographer" && ${PUBLISHED} && !(count(portfolioImages) > 0)]{ _id, _type, "title": fullName },
    "projectNoImages": *[_type == "productionProject" && ${PUBLISHED} && !(count(images) > 0)]{ _id, _type, "title": coalesce(brand, title) },
    "projectNoAlt": *[_type == "productionProject" && ${PUBLISHED} && !(length(imageAlt) > 0)]{ _id, _type, "title": coalesce(brand, title) },
    "aiWorkNoAlt": *[_id == "aiPoweredCollection"][0].works[!(length(imageAlt) > 0)]{ "_id": _key, "title": brand },
    "aiUntagged": count(*[_type == "aiPortfolioItem" && ${PUBLISHED} && !(count(tags) > 0)])
  }
}`;

interface DocRow {
  _id: string;
  _type: string;
  _updatedAt: string;
  title: string | null;
  media: ImageLike;
  isNew?: boolean;
}

interface IssueDoc {
  _id: string;
  _type?: string;
  title: string | null;
}

interface OverviewData {
  counts: {
    photographers: number;
    retouchers: number;
    aiArtists: number;
    portfolioImages: number;
    projects: number;
    aiWorks: number;
    aiPortfolio: number;
    aiTags: number;
    clientLogos: number;
    seoOverrides: number;
  };
  drafts: DocRow[];
  recent: DocRow[];
  home: {
    works?: { _key: string; image?: ImageLike; workTitle?: string; artist?: string }[] | null;
    scene?: ({ _id: string; image?: ImageLike } | null)[] | null;
  } | null;
  portfolioHead: { _id: string; image?: ImageLike }[];
  health: {
    noCover: IssueDoc[];
    noPortfolio: IssueDoc[];
    projectNoImages: IssueDoc[];
    projectNoAlt: IssueDoc[];
    aiWorkNoAlt: IssueDoc[] | null;
    aiUntagged: number;
  };
}

function relativeTime(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const min = Math.round((now - then) / 60000);
  if (min < 1) return 'az önce';
  if (min < 60) return `${min} dk önce`;
  const hrs = Math.round(min / 60);
  if (hrs < 24) return `${hrs} sa önce`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR');
}

function docTitle(doc: { _type: string; title: string | null }): string {
  if (doc.title) return doc._type === 'photographer' ? toNameCase(doc.title) : doc.title;
  return TYPE_LABELS[doc._type] ?? 'İsimsiz';
}

const publishedId = (id: string) => id.replace(/^drafts\./, '');

/** Studio-side navigation used by every block on the page. */
function useStudioNav() {
  const router = useRouter();
  return useMemo(
    () => ({
      edit: (id: string, type: string) => router.navigateIntent('edit', { id: publishedId(id), type }),
      create: (type: string) => router.navigateIntent('create', { type }),
      pane: (path: string) => router.navigateUrl({ path: `${studioBasePath}/structure/${path}` }),
      tool: (name: string) => router.navigateUrl({ path: `${studioBasePath}/${name}` }),
    }),
    [router],
  );
}

type Nav = ReturnType<typeof useStudioNav>;

/** Open a page of the public site (same origin as the Studio) in a new tab. */
function openSite(path: string) {
  window.open(`${window.location.origin}${path}`, '_blank', 'noopener');
}

// ── Building blocks ────────────────────────────────────────────────────────

function SectionHead({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <Flex align="flex-end" justify="space-between" gap={3} className="f28-dash-section-head">
      <Stack space={2}>
        <Text size={1} weight="semibold" className="f28-dash-section-label">
          {title}
        </Text>
        {hint ? (
          <Text size={1} muted>
            {hint}
          </Text>
        ) : null}
      </Stack>
      {action}
    </Flex>
  );
}

/** Shown in place of a thumbnail for documents without an image (pages, SEO). */
const TYPE_ICONS: Record<string, React.ReactNode> = {
  homeV2PageCopy: <HomeIcon />,
  productionPageCopy: <DesktopIcon />,
  aiPoweredPageCopy: <RobotIcon />,
  aiPoweredCollection: <RobotIcon />,
  contactPageCopy: <EnvelopeIcon />,
  seoOverride: <EarthGlobeIcon />,
  photographer: <UsersIcon />,
  productionProject: <CaseIcon />,
};

function Thumb({ source, type, size = 40 }: { source: ImageLike; type?: string; size?: number }) {
  const src = imagePreviewUrl(source ?? undefined, size * 2, size * 2);
  return (
    <span className="f28-dash-thumb" style={{ width: size, height: size }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" />
      ) : (
        (type && TYPE_ICONS[type]) ?? <ImageIcon />
      )}
    </span>
  );
}

function StatCard({
  icon,
  value,
  label,
  note,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  note?: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      as="button"
      className="f28-dash-stat"
      padding={4}
      radius={3}
      border
      onClick={onClick}
      aria-label={`${label}: ${loading ? 'yükleniyor' : value}. Listeyi aç`}
    >
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <span className="f28-dash-stat__icon" aria-hidden>
            {icon}
          </span>
          <Text size={0} muted aria-hidden>
            Aç →
          </Text>
        </Flex>
        <Stack space={2}>
          <Text size={4} weight="semibold" className="f28-dash-num">
            {loading ? '—' : value}
          </Text>
          <Text size={1}>{label}</Text>
          {note ? (
            <Text size={0} muted>
              {loading ? ' ' : note}
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}

function DocList({
  rows,
  now,
  nav,
  empty,
  showState,
}: {
  rows: DocRow[];
  now: number;
  nav: Nav;
  empty: React.ReactNode;
  showState?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <Card padding={4} radius={3} border tone="transparent">
        {empty}
      </Card>
    );
  }
  return (
    <Card radius={3} border overflow="hidden">
      <Stack as="ul" className="f28-dash-list">
        {rows.map((doc) => (
          <li key={doc._id}>
            <Card
              as="button"
              className="f28-dash-row"
              padding={3}
              radius={0}
              onClick={() => nav.edit(doc._id, doc._type)}
            >
              <Flex align="center" gap={3}>
                <Thumb source={doc.media} type={doc._type} />
                <Stack space={2} flex={1} style={{ minWidth: 0 }}>
                  <Text size={1} weight="medium" textOverflow="ellipsis">
                    {docTitle(doc)}
                  </Text>
                  <Text size={0} muted textOverflow="ellipsis">
                    {TYPE_LABELS[doc._type] ?? doc._type}
                  </Text>
                </Stack>
                {showState ? (
                  <Badge tone={doc.isNew ? 'primary' : 'caution'} fontSize={0} padding={2} radius={2}>
                    {doc.isNew ? 'Hiç yayınlanmadı' : 'Değişiklik var'}
                  </Badge>
                ) : null}
                <Text size={0} muted style={{ flexShrink: 0, minWidth: 64, textAlign: 'right' }}>
                  {relativeTime(doc._updatedAt, now)}
                </Text>
              </Flex>
            </Card>
          </li>
        ))}
      </Stack>
    </Card>
  );
}

type IssueTone = 'caution' | 'primary';

interface Issue {
  key: string;
  tone: IssueTone;
  title: string;
  detail: string;
  docs?: IssueDoc[];
  /** Fallback action when there are no individual documents to open. */
  action?: { label: string; run: () => void };
}

function HealthPanel({ issues, nav, loading }: { issues: Issue[]; nav: Nav; loading: boolean }) {
  if (loading) {
    return (
      <Card padding={5} radius={3} border>
        <Flex justify="center">
          <Spinner muted />
        </Flex>
      </Card>
    );
  }
  if (issues.length === 0) {
    return (
      <Card padding={4} radius={3} border tone="positive">
        <Flex align="center" gap={3}>
          <Text size={2}>
            <CheckmarkCircleIcon />
          </Text>
          <Text size={1}>Her şey yolunda — eksik görsel, alt metin ya da etiket yok.</Text>
        </Flex>
      </Card>
    );
  }
  return (
    <Card radius={3} border overflow="hidden">
      <Stack as="ul" className="f28-dash-list">
        {issues.map((issue) => (
          <li key={issue.key}>
            <Box padding={3} className="f28-dash-issue">
              <Flex gap={3} align="flex-start">
                <Text size={2} className={`f28-dash-issue__icon f28-dash-issue__icon--${issue.tone}`}>
                  {issue.tone === 'caution' ? <WarningOutlineIcon /> : <InfoOutlineIcon />}
                </Text>
                <Stack space={3} flex={1} style={{ minWidth: 0 }}>
                  <Stack space={2}>
                    <Text size={1} weight="medium">
                      {issue.title}
                    </Text>
                    <Text size={1} muted>
                      {issue.detail}
                    </Text>
                  </Stack>
                  {issue.docs && issue.docs.length > 0 ? (
                    <Flex gap={2} wrap="wrap">
                      {issue.docs.slice(0, 6).map((d) => (
                        <Button
                          key={d._id}
                          mode="ghost"
                          fontSize={1}
                          padding={2}
                          text={d.title ? (d._type === 'photographer' ? toNameCase(d.title) : d.title) : 'İsimsiz'}
                          onClick={() =>
                            d._type ? nav.edit(d._id, d._type) : nav.edit('aiPoweredCollection', 'aiPoweredCollection')
                          }
                        />
                      ))}
                      {issue.docs.length > 6 ? (
                        <Text size={1} muted style={{ alignSelf: 'center' }}>
                          +{issue.docs.length - 6} daha
                        </Text>
                      ) : null}
                    </Flex>
                  ) : issue.action ? (
                    <Box>
                      <Button mode="ghost" fontSize={1} padding={2} text={issue.action.label} onClick={issue.action.run} />
                    </Box>
                  ) : null}
                </Stack>
              </Flex>
            </Box>
          </li>
        ))}
      </Stack>
    </Card>
  );
}

function ShowcaseStrip({
  title,
  note,
  images,
  slots,
  onEdit,
}: {
  title: string;
  note: string;
  images: { key: string; image?: ImageLike; label?: string }[];
  slots: number;
  onEdit: () => void;
}) {
  const empty = Math.max(0, slots - images.length);
  return (
    <Stack space={3}>
      <Flex align="center" justify="space-between" gap={3}>
        <Stack space={2}>
          <Text size={1} weight="medium">
            {title}
          </Text>
          <Text size={0} muted>
            {note}
          </Text>
        </Stack>
        <Button mode="bleed" icon={EditIcon} text="Düzenle" fontSize={1} padding={2} onClick={onEdit} />
      </Flex>
      <div className="f28-dash-strip" style={{ '--slots': slots } as React.CSSProperties}>
        {images.map((img, i) => {
          const src = imagePreviewUrl(img.image ?? undefined, 320, 400);
          return (
            <figure key={img.key} className="f28-dash-strip__item" title={img.label}>
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={img.label ?? ''} />
              ) : null}
              <span className="f28-dash-strip__num">{String(i + 1).padStart(2, '0')}</span>
            </figure>
          );
        })}
        {Array.from({ length: empty }, (_, i) => (
          <button key={`empty-${i}`} type="button" className="f28-dash-strip__empty" onClick={onEdit} aria-label="Görsel ekle">
            <AddIcon />
          </button>
        ))}
      </div>
    </Stack>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

const SITE_PAGES: {
  label: string;
  path: string;
  icon: React.ReactNode;
  edit: (nav: Nav) => void;
}[] = [
  { label: 'Anasayfa', path: '/', icon: <HomeIcon />, edit: (n) => n.edit('homeV2PageCopy', 'homeV2PageCopy') },
  { label: 'Portfolyolar', path: '/portfolios', icon: <UsersIcon />, edit: (n) => n.pane('sanatcilar') },
  { label: 'Production', path: '/production', icon: <DesktopIcon />, edit: (n) => n.edit('productionPageCopy', 'productionPageCopy') },
  { label: 'AI Powered', path: '/ai-powered', icon: <RobotIcon />, edit: (n) => n.edit('aiPoweredPageCopy', 'aiPoweredPageCopy') },
  { label: 'AI Portfolyo', path: '/ai-powered/portfolio', icon: <ImagesIcon />, edit: (n) => n.pane('ai-powered;ai-portfolyo') },
  { label: 'Hakkımızda', path: '/about', icon: <ImageIcon />, edit: (n) => n.edit('siteAssets', 'siteAssets') },
  { label: 'İletişim', path: '/contact', icon: <EnvelopeIcon />, edit: (n) => n.edit('contactPageCopy', 'contactPageCopy') },
];

export function StudioOverview() {
  const baseClient = useClient({ apiVersion });
  // Raw perspective: published documents and drafts side by side.
  const client = useMemo(() => baseClient.withConfig({ perspective: 'raw' }), [baseClient]);
  const user = useCurrentUser();
  const nav = useStudioNav();
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    client
      .fetch<OverviewData>(OVERVIEW_QUERY, { types: WATCHED_TYPES })
      .then((d) => {
        setData(d);
        setError(null);
        setSyncedAt(Date.now());
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
  }, [client]);

  // First load + live updates: any edit, publish or delete refreshes the page.
  useEffect(() => {
    load();
    const sub = client
      .listen(`*[_type in $types]`, { types: WATCHED_TYPES }, { includeResult: false, visibility: 'query' })
      .subscribe(() => {
        if (refetchTimer.current) clearTimeout(refetchTimer.current);
        refetchTimer.current = setTimeout(load, 500);
      });
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      sub.unsubscribe();
      clearInterval(tick);
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
    };
  }, [client, load]);

  const loading = data === null && error === null;
  const counts = data?.counts;

  const stats = [
    {
      icon: <UsersIcon />,
      value: counts?.photographers ?? 0,
      label: 'Fotoğrafçı',
      note: `${counts?.retouchers ?? 0} retoucher · ${counts?.aiArtists ?? 0} AI artist · ${counts?.portfolioImages ?? 0} portfolyo görseli`,
      onClick: () => nav.pane('sanatcilar'),
    },
    {
      icon: <CaseIcon />,
      value: counts?.projects ?? 0,
      label: 'Prodüksiyon projesi',
      note: '/production sayfasında',
      onClick: () => nav.pane('projeler'),
    },
    {
      icon: <RobotIcon />,
      value: counts?.aiWorks ?? 0,
      label: 'AI çalışma',
      note: '/ai-powered galerisinde',
      onClick: () => nav.edit('aiPoweredCollection', 'aiPoweredCollection'),
    },
    {
      icon: <ImagesIcon />,
      value: counts?.aiPortfolio ?? 0,
      label: 'AI portfolyo görseli',
      note: `${counts?.aiTags ?? 0} etiket`,
      onClick: () => nav.pane('ai-powered;ai-portfolyo'),
    },
    {
      icon: <ImageIcon />,
      value: counts?.clientLogos ?? 0,
      label: 'Müşteri logosu',
      note: 'Anasayfa ve Hakkımızda',
      onClick: () => nav.edit('siteAssets', 'siteAssets'),
    },
  ];

  const issues = useMemo<Issue[]>(() => {
    if (!data) return [];
    const h = data.health;
    const list: Issue[] = [];
    const sceneCount = (data.home?.scene ?? []).filter(Boolean).length;
    const worksCount = (data.home?.works ?? []).length;
    if (worksCount === 0)
      list.push({
        key: 'home-works',
        tone: 'caution',
        title: 'Anasayfada öne çıkan iş yok',
        detail: 'Hero slaytları yedek görsellerle gösteriliyor. Anasayfa → Öne Çıkan İşler bölümünden ekleyin.',
        action: { label: 'Anasayfayı aç', run: () => nav.edit('homeV2PageCopy', 'homeV2PageCopy') },
      });
    if (h.noCover.length)
      list.push({ key: 'cover', tone: 'caution', title: `${h.noCover.length} sanatçının kapak görseli yok`, detail: 'Portfolyolar sayfasında boş kart olarak görünür.', docs: h.noCover });
    if (h.noPortfolio.length)
      list.push({ key: 'portfolio', tone: 'caution', title: `${h.noPortfolio.length} sanatçının portfolyosu boş`, detail: 'Sanatçı sayfasında gösterilecek görsel yok.', docs: h.noPortfolio });
    if (h.projectNoImages.length)
      list.push({ key: 'proj-img', tone: 'caution', title: `${h.projectNoImages.length} projede görsel yok`, detail: 'Görselsiz projeler /production sayfasında görünmez.', docs: h.projectNoImages });
    const aiNoAlt = h.aiWorkNoAlt ?? [];
    if (aiNoAlt.length || h.projectNoAlt.length)
      list.push({
        key: 'alt',
        tone: 'primary',
        title: `${aiNoAlt.length + h.projectNoAlt.length} işte alt metin eksik`,
        detail: 'Alt metin ekran okuyucular ve Google görsel araması için önerilir; boşsa marka ve başlık kullanılır.',
        docs: [...h.projectNoAlt, ...aiNoAlt],
      });
    if (h.aiUntagged)
      list.push({
        key: 'tags',
        tone: 'primary',
        title: `${h.aiUntagged} AI portfolyo görselinde etiket yok`,
        detail: 'Etiketsiz görseller filtrelerde yalnızca "Tümü" altında çıkar.',
        action: { label: 'Portfolyo görsellerini aç', run: () => nav.pane('ai-powered;ai-portfolyo') },
      });
    if (sceneCount === 0)
      list.push({
        key: 'scene',
        tone: 'primary',
        title: 'AI sahnesi için görsel seçilmedi',
        detail: `Anasayfa AI sahnesinde AI Portfolyo'nun ilk ${HOME_AI_SCENE_DEFAULT_COUNT} görseli gösteriliyor.`,
        action: { label: 'Görsel seç', run: () => nav.edit('homeV2PageCopy', 'homeV2PageCopy') },
      });
    if ((counts?.seoOverrides ?? 0) < SEO_PAGE_COUNT)
      list.push({
        key: 'seo',
        tone: 'primary',
        title: `${SEO_PAGE_COUNT - (counts?.seoOverrides ?? 0)} sayfa varsayılan SEO metnini kullanıyor`,
        detail: 'Sorun değil — sayfa başlığı ve açıklaması koddaki varsayılanlardan gelir. İsterseniz özelleştirin.',
        action: { label: 'SEO düzenlemeleri', run: () => nav.pane('seo') },
      });
    return list;
  }, [data, counts, nav]);

  const cautionCount = issues.filter((i) => i.tone === 'caution').length;

  const heroImages = (data?.home?.works ?? [])
    .filter((w) => w.image?.asset)
    .slice(0, 6)
    .map((w) => ({
      key: w._key,
      image: w.image,
      label: [w.workTitle, w.artist ? toNameCase(w.artist) : undefined].filter(Boolean).join(' — '),
    }));
  const picked = (data?.home?.scene ?? []).filter((s): s is { _id: string; image?: ImageLike } => !!s?.image);
  const sceneImages = (picked.length > 0 ? picked : data?.portfolioHead ?? []).map((s) => ({ key: s._id, image: s.image }));

  // Batch uploads (e.g. 20 portfolio images) would fill the list: keep at most
  // two per type so the list reads as "what changed lately" across the site.
  const recent = useMemo(() => {
    const perType = new Map<string, number>();
    return (data?.recent ?? [])
      .filter((doc) => {
        const n = perType.get(doc._type) ?? 0;
        perType.set(doc._type, n + 1);
        return n < 2;
      })
      .slice(0, 8);
  }, [data]);

  const firstName = user?.name?.split(' ')[0];
  const today = new Date(now).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  const drafts = data?.drafts ?? [];

  return (
    <Box className="f28-dash" padding={[3, 4, 5]}>
      <Stack space={6} className="f28-dash-inner">
        {/* ── Header ─────────────────────────────────────────────── */}
        <Flex className="f28-dash-head" gap={4} align={['flex-start', 'flex-start', 'flex-end']} justify="space-between" wrap="wrap">
          <Stack space={3}>
            <Text size={1} muted>
              {today.charAt(0).toLocaleUpperCase('tr-TR') + today.slice(1)}
            </Text>
            <Text as="h1" size={5} weight="semibold">
              {firstName ? `Merhaba, ${firstName}` : 'Genel Bakış'}
            </Text>
            <Flex align="center" gap={2}>
              <span className={`f28-dash-live ${error ? 'is-error' : ''}`} aria-hidden />
              <Text size={1} muted>
                {error
                  ? 'Bağlantı sorunu — veriler güncellenemedi'
                  : syncedAt
                    ? `Canlı · ${relativeTime(new Date(syncedAt).toISOString(), now)} güncellendi`
                    : 'Yükleniyor…'}
              </Text>
            </Flex>
          </Stack>
          <Flex gap={2} wrap="wrap">
            <MenuButton
              id="f28-dash-create"
              button={<Button mode="ghost" icon={AddIcon} text="Yeni" />}
              popover={{ portal: true, placement: 'bottom-end' }}
              menu={
                <Menu>
                  <MenuItem icon={UsersIcon} text="Sanatçı" onClick={() => nav.create('photographer')} />
                  <MenuItem icon={CaseIcon} text="Prodüksiyon projesi" onClick={() => nav.create('productionProject')} />
                  <MenuItem icon={ImagesIcon} text="AI portfolyo görselleri" onClick={() => nav.pane('ai-powered;ai-portfolyo')} />
                  <MenuItem icon={RobotIcon} text="AI çalışma" onClick={() => nav.edit('aiPoweredCollection', 'aiPoweredCollection')} />
                  <MenuItem icon={EarthGlobeIcon} text="SEO düzenlemesi" onClick={() => nav.create('seoOverride')} />
                </Menu>
              }
            />
            <Button mode="ghost" icon={DesktopIcon} text="Canlı önizleme" onClick={() => nav.tool('presentation')} />
            <Button tone="primary" iconRight={LaunchIcon} text="Siteyi aç" onClick={() => openSite('/')} />
          </Flex>
        </Flex>

        {error ? (
          <Card padding={4} radius={3} tone="critical" border>
            <Stack space={3}>
              <Text size={1} weight="medium">
                Veriler yüklenemedi
              </Text>
              <Text size={1} muted>
                {error}
              </Text>
              <Box>
                <Button mode="ghost" text="Tekrar dene" onClick={load} />
              </Box>
            </Stack>
          </Card>
        ) : null}

        {/* ── Stats ──────────────────────────────────────────────── */}
        <div className="f28-dash-stats">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} loading={loading} />
          ))}
        </div>

        {/* ── Work queue ─────────────────────────────────────────── */}
        <div className="f28-dash-cols">
          <Stack space={3}>
            <SectionHead
              title="Yayın bekleyenler"
              hint={
                drafts.length
                  ? `${drafts.length} belgede yayınlanmamış değişiklik var — siteye yansımaları için yayınlayın.`
                  : 'Taslak olarak bekleyen değişiklikleriniz burada listelenir.'
              }
            />
            {loading ? (
              <Card padding={5} radius={3} border>
                <Flex justify="center">
                  <Spinner muted />
                </Flex>
              </Card>
            ) : (
              <DocList
                rows={drafts}
                now={now}
                nav={nav}
                showState
                empty={
                  <Flex align="center" gap={3}>
                    <Text size={2}>
                      <CheckmarkCircleIcon />
                    </Text>
                    <Text size={1} muted>
                      Bekleyen değişiklik yok — sitedeki her şey güncel.
                    </Text>
                  </Flex>
                }
              />
            )}
          </Stack>

          <Stack space={3}>
            <SectionHead
              title="İçerik kontrolü"
              hint={
                loading
                  ? ' '
                  : cautionCount
                    ? `${cautionCount} konu sitede görünür bir boşluğa yol açıyor.`
                    : 'Sitede görünen bir eksik yok.'
              }
            />
            <HealthPanel issues={issues} nav={nav} loading={loading} />
          </Stack>
        </div>

        {/* ── Home showcase ──────────────────────────────────────── */}
        <Stack space={4}>
          <SectionHead title="Anasayfa vitrini" hint="Ziyaretçilerin anasayfada ilk gördüğü görseller, sitedeki sırasıyla." />
          <Card padding={4} radius={3} border>
            {loading ? (
              <Flex justify="center" padding={4}>
                <Spinner muted />
              </Flex>
            ) : (
              <Stack space={5}>
                <ShowcaseStrip
                  title="Hero slaytları"
                  note="Öne Çıkan İşler'in ilk 6'sı"
                  images={heroImages}
                  slots={6}
                  onEdit={() => nav.edit('homeV2PageCopy', 'homeV2PageCopy')}
                />
                <ShowcaseStrip
                  title="AI sahnesi"
                  note={picked.length > 0 ? 'Studio’da seçilen görseller' : `Seçim yok — AI Portfolyo'nun ilk ${HOME_AI_SCENE_DEFAULT_COUNT} görseli`}
                  images={sceneImages}
                  slots={picked.length > 0 ? Math.max(picked.length, HOME_AI_SCENE_DEFAULT_COUNT) : HOME_AI_SCENE_DEFAULT_COUNT}
                  onEdit={() => nav.edit('homeV2PageCopy', 'homeV2PageCopy')}
                />
              </Stack>
            )}
          </Card>
        </Stack>

        {/* ── Recent + site map ─────────────────────────────────── */}
        <div className="f28-dash-cols">
          <Stack space={3}>
            <SectionHead title="Son yayınlananlar" />
            {loading ? (
              <Card padding={5} radius={3} border>
                <Flex justify="center">
                  <Spinner muted />
                </Flex>
              </Card>
            ) : (
              <DocList
                rows={recent}
                now={now}
                nav={nav}
                empty={
                  <Text size={1} muted>
                    Henüz yayınlanmış içerik yok.
                  </Text>
                }
              />
            )}
          </Stack>

          <Stack space={3}>
            <SectionHead
              title="Site sayfaları"
              hint="Yayınlanan değişiklikler birkaç saniye içinde siteye yansır."
            />
            <Card radius={3} border overflow="hidden">
              <Stack as="ul" className="f28-dash-list">
                {SITE_PAGES.map((page) => (
                  <li key={page.path}>
                    <Flex align="center" gap={3} padding={2} paddingLeft={3} className="f28-dash-page">
                      <Text size={1} muted aria-hidden>
                        {page.icon}
                      </Text>
                      <Stack space={2} flex={1} style={{ minWidth: 0 }}>
                        <Text size={1} weight="medium">
                          {page.label}
                        </Text>
                        <Text size={0} muted className="f28-dash-path">
                          {page.path}
                        </Text>
                      </Stack>
                      <Button mode="bleed" icon={EditIcon} text="Düzenle" fontSize={1} padding={2} onClick={() => page.edit(nav)} />
                      <Button
                        mode="bleed"
                        icon={LaunchIcon}
                        fontSize={1}
                        padding={2}
                        aria-label={`${page.label} sayfasını sitede aç`}
                        title="Sitede aç"
                        onClick={() => openSite(page.path)}
                      />
                    </Flex>
                  </li>
                ))}
              </Stack>
            </Card>
          </Stack>
        </div>
      </Stack>
    </Box>
  );
}
