/** Admin panel copy — imported into lib/translations.ts */

export type AdminTranslations = {
  label: string;
  nav: {
    dashboard: string;
    photographers: string;
    aiImages: string;
    landing: string;
    logos: string;
    previews: string;
    settings: string;
    logout: string;
    toggleMenu: string;
  };
  actions: Record<string, string>;
  status: Record<string, string>;
  dropzone: Record<string, string>;
  uploadQueue: Record<string, string>;
  filters: Record<string, string>;
  categories: Record<string, string>;
  login: Record<string, string>;
  dashboard: {
    title: string;
    roster: string;
    photographers: string;
    stats: {
      photographers: string;
      aiImages: string;
      redis: string;
      viewSite: string;
    };
    cards: {
      photographersDesc: string;
      aiDesc: string;
      settingsDesc: string;
    };
  };
  photographers: Record<string, string>;
  photographerEdit: Record<string, string>;
  aiBased: Record<string, string>;
  landing: Record<string, string>;
  previews: Record<string, string>;
  logos: Record<string, string>;
  settings: Record<string, string>;
  toast: Record<string, string>;
};

export const adminEn: AdminTranslations = {
  label: 'Admin',
  nav: {
    dashboard: 'Dashboard',
    photographers: 'Photographers',
    aiImages: 'AI Images',
    landing: 'Landing',
    logos: 'Logos',
    previews: 'Previews',
    settings: 'Settings',
    logout: 'Logout',
    toggleMenu: 'Toggle menu',
  },
  actions: {
    add: '+ Add',
    cancel: '✕ Cancel',
    upload: '+ Upload',
    save: 'Save',
    saving: 'Saving...',
    saveOrder: 'Save Order',
    viewPage: 'View Page ↗',
    viewSite: 'View Site',
    manageAll: 'Manage All →',
    editPhotos: 'Edit Photos',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    scanning: 'Scanning...',
    cleanupImages: 'Cleanup Images',
    createPhotographer: 'Create Photographer',
    addPhotographer: '+ Add Photographer',
    saveInfo: 'Save Changes',
    savingInfo: 'Saving...',
  },
  status: {
    connected: 'Connected',
    notConfigured: 'Not configured',
    none: 'None',
    unsaved: '• Unsaved',
  },
  dropzone: {
    hint: 'Drop files or click to upload',
    formats: 'JPG, PNG, WebP',
    dropImages: 'Drop images or click to upload',
    dropLogos: 'Drop {category} logos here',
  },
  uploadQueue: {
    uploading: 'Uploading {done}/{total}',
    cancel: 'Cancel',
    pending: 'Pending',
    uploadingItem: 'Uploading...',
    failed: 'Failed',
  },
  filters: {
    filter: 'Filter',
    allBrands: 'All brands',
    allTypes: 'All types',
  },
  categories: {
    visual: 'Visual',
    video: 'Video',
    hybrid: 'Hybrid',
  },
  login: {
    title: 'Sign In',
    subtitle: 'Admin Dashboard',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    loginFailed: 'Login failed',
    networkError: 'Network error. Please try again.',
  },
  dashboard: {
    title: 'Dashboard',
    roster: 'Roster',
    photographers: 'Photographers',
    stats: {
      photographers: 'Photographers',
      aiImages: 'AI Images',
      redis: 'Redis',
      viewSite: 'View Site',
    },
    cards: {
      photographersDesc: 'Edit roster, reorder, manage previews',
      aiDesc: 'Reorder and manage AI-generated images',
      settingsDesc: 'Seed data, cache control, environment',
    },
  },
  photographers: {
    title: 'Photographers',
    count: '{count} photographers — hover to edit or reorder',
    new: 'New',
    newTitle: 'Photographer',
    idFolder: 'ID / Folder',
    fullName: 'Full Name',
    titleField: 'Title',
    previewPath: 'Preview Path (optional)',
    noResults: 'No photographers found',
    deleteConfirm: 'Delete {name}?',
    deleted: '{name} deleted',
    added: '{name} added',
  },
  photographerEdit: {
    intro: 'Edit photographer information and manage portfolio images',
    information: 'Information',
    details: 'Details',
    portfolio: 'Portfolio',
    images: 'Images',
    previewImage: 'Preview Image',
    bioEn: 'Bio (English)',
    bioTr: 'Bio (Turkish)',
    instagram: 'Instagram URL',
    website: 'Website URL',
    previewHint: 'Use ⭐ on images below to set preview',
    previewChange: 'Use ⭐ on images below to change',
    setPreview: 'Set as preview',
    noImages: 'No images found',
    noImagesHint: 'Drop images above or click Upload',
    updated: 'Photographer info updated',
  },
  aiBased: {
    title: 'AI Images',
    count: '{count} works — tag each with brand and type, drag to reorder',
    upload: 'Upload',
    defaults: 'Defaults',
    brandNext: 'Brand (next upload)',
    brandPlaceholder: 'Brand (e.g. Puma)',
    type: 'Type',
    brand: 'Brand',
    year: 'Year',
    titleOptional: 'Title (optional)',
    noWorks: 'No AI works found',
    noWorksHint: 'Drop images above or click Upload to add works',
  },
  landing: {
    title: 'Landing',
    count: '{count} images — drag to reorder',
    noImages: 'No landing images found',
    noImagesHint: 'Drop images above or click Upload to add landing images',
  },
  previews: {
    title: 'Previews',
    count: '{count} images — drag to reorder, hover for controls',
    hint: 'Used on the portfolios index page',
    noImages: 'No preview images found',
    noImagesHint: 'Drop images above or click Upload to add preview images',
  },
  logos: {
    title: 'Logos',
    intro: 'Manage client, partner, f28, and social media logos',
    category: 'Category',
    logoCount: '{count} logo',
    logoCountPlural: '{count} logos',
    noLogos: 'No {category} logos found',
    noLogosHint: 'Drop logos above or click Upload to add {category} logos',
  },
  settings: {
    title: 'Settings',
    intro: 'Data management and system configuration',
    environment: 'Environment',
    status: 'Status',
    redis: 'Redis / Upstash',
    nodeEnv: 'Node Env',
    vercelBlob: 'Vercel Blob',
    dataManagement: 'Data Management',
    maintenance: 'Maintenance',
    cleanupTitle: 'Cleanup Images',
    cleanupDesc: 'Scan Redis for broken image URLs (404) and remove them automatically.',
    cleanupConfirm:
      'Scan all image URLs in Redis and remove broken (404) references? This may take a minute.',
    cleanupFailed: 'Cleanup failed',
    external: 'External',
    links: 'Links',
    vercelDashboard: 'Vercel Dashboard',
    upstashConsole: 'Upstash Console',
    viewLiveSite: 'View Live Site',
  },
  toast: {
    loadFailed: 'Failed to load',
    saveOrderFailed: 'Failed to save order',
    deleteFailed: 'Delete failed',
    addFailed: 'Failed to add',
    failed: 'Failed',
    updateFailed: 'Failed to update',
    updatePhotographerFailed: 'Failed to update photographer',
  },
};

export const adminTr: AdminTranslations = {
  label: 'Yönetim',
  nav: {
    dashboard: 'Panel',
    photographers: 'Fotoğrafçılar',
    aiImages: 'AI Görseller',
    landing: 'Ana Sayfa',
    logos: 'Logolar',
    previews: 'Önizlemeler',
    settings: 'Ayarlar',
    logout: 'Çıkış',
    toggleMenu: 'Menüyü aç/kapat',
  },
  actions: {
    add: '+ Ekle',
    cancel: '✕ İptal',
    upload: '+ Yükle',
    save: 'Kaydet',
    saving: 'Kaydediliyor...',
    saveOrder: 'Sırayı Kaydet',
    viewPage: 'Sayfayı Gör ↗',
    viewSite: 'Siteyi Gör',
    manageAll: 'Tümünü Yönet →',
    editPhotos: 'Fotoğrafları Düzenle',
    signingIn: 'Giriş yapılıyor...',
    signIn: 'Giriş Yap',
    scanning: 'Taranıyor...',
    cleanupImages: 'Görselleri Temizle',
    createPhotographer: 'Fotoğrafçı Oluştur',
    addPhotographer: '+ Fotoğrafçı Ekle',
    saveInfo: 'Değişiklikleri Kaydet',
    savingInfo: 'Kaydediliyor...',
  },
  status: {
    connected: 'Bağlı',
    notConfigured: 'Yapılandırılmamış',
    none: 'Yok',
    unsaved: '• Kaydedilmedi',
  },
  dropzone: {
    hint: 'Dosyaları bırakın veya yüklemek için tıklayın',
    formats: 'JPG, PNG, WebP',
    dropImages: 'Görselleri bırakın veya yüklemek için tıklayın',
    dropLogos: '{category} logolarını buraya bırakın',
  },
  uploadQueue: {
    uploading: 'Yükleniyor {done}/{total}',
    cancel: 'İptal',
    pending: 'Bekliyor',
    uploadingItem: 'Yükleniyor...',
    failed: 'Başarısız',
  },
  filters: {
    filter: 'Filtre',
    allBrands: 'Tüm markalar',
    allTypes: 'Tüm türler',
  },
  categories: {
    visual: 'Görsel',
    video: 'Video',
    hybrid: 'Hibrit',
  },
  login: {
    title: 'Giriş',
    subtitle: 'Yönetim Paneli',
    password: 'Şifre',
    passwordPlaceholder: 'Şifrenizi girin',
    loginFailed: 'Giriş başarısız',
    networkError: 'Ağ hatası. Lütfen tekrar deneyin.',
  },
  dashboard: {
    title: 'Panel',
    roster: 'Kadro',
    photographers: 'Fotoğrafçılar',
    stats: {
      photographers: 'Fotoğrafçılar',
      aiImages: 'AI Görseller',
      redis: 'Redis',
      viewSite: 'Siteyi Gör',
    },
    cards: {
      photographersDesc: 'Kadroyu düzenle, sırala, önizlemeleri yönet',
      aiDesc: 'AI görsellerini sırala ve yönet',
      settingsDesc: 'Veri, önbellek ve ortam ayarları',
    },
  },
  photographers: {
    title: 'Fotoğrafçılar',
    count: '{count} fotoğrafçı — düzenlemek veya sıralamak için üzerine gelin',
    new: 'Yeni',
    newTitle: 'Fotoğrafçı',
    idFolder: 'ID / Klasör',
    fullName: 'Ad Soyad',
    titleField: 'Ünvan',
    previewPath: 'Önizleme yolu (isteğe bağlı)',
    noResults: 'Fotoğrafçı bulunamadı',
    deleteConfirm: '{name} silinsin mi?',
    deleted: '{name} silindi',
    added: '{name} eklendi',
  },
  photographerEdit: {
    intro: 'Fotoğrafçı bilgilerini düzenleyin ve portföy görsellerini yönetin',
    information: 'Bilgi',
    details: 'Detaylar',
    portfolio: 'Portföy',
    images: 'Görseller',
    previewImage: 'Önizleme Görseli',
    bioEn: 'Biyografi (İngilizce)',
    bioTr: 'Biyografi (Türkçe)',
    instagram: 'Instagram URL',
    website: 'Web Sitesi URL',
    previewHint: 'Önizleme için aşağıdaki görsellerde ⭐ kullanın',
    previewChange: 'Değiştirmek için aşağıdaki görsellerde ⭐ kullanın',
    setPreview: 'Önizleme olarak ayarla',
    noImages: 'Görsel bulunamadı',
    noImagesHint: 'Yukarıya bırakın veya Yükle’ye tıklayın',
    updated: 'Fotoğrafçı bilgileri güncellendi',
  },
  aiBased: {
    title: 'AI Görseller',
    count: '{count} çalışma — marka ve tür etiketleyin, sıralamak için sürükleyin',
    upload: 'Yükleme',
    defaults: 'Varsayılanlar',
    brandNext: 'Marka (sonraki yükleme)',
    brandPlaceholder: 'Marka (ör. Puma)',
    type: 'Tür',
    brand: 'Marka',
    year: 'Yıl',
    titleOptional: 'Başlık (isteğe bağlı)',
    noWorks: 'AI çalışması bulunamadı',
    noWorksHint: 'Yukarıya bırakın veya çalışma eklemek için Yükle’ye tıklayın',
  },
  landing: {
    title: 'Ana Sayfa',
    count: '{count} görsel — sıralamak için sürükleyin',
    noImages: 'Ana sayfa görseli bulunamadı',
    noImagesHint: 'Yukarıya bırakın veya görsel eklemek için Yükle’ye tıklayın',
  },
  previews: {
    title: 'Önizlemeler',
    count: '{count} görsel — sıralamak için sürükleyin, kontroller için üzerine gelin',
    hint: 'Portföyler indeks sayfasında kullanılır',
    noImages: 'Önizleme görseli bulunamadı',
    noImagesHint: 'Yukarıya bırakın veya önizleme eklemek için Yükle’ye tıklayın',
  },
  logos: {
    title: 'Logolar',
    intro: 'Müşteri, ortak, f28 ve sosyal medya logolarını yönetin',
    category: 'Kategori',
    logoCount: '{count} logo',
    logoCountPlural: '{count} logo',
    noLogos: '{category} logosu bulunamadı',
    noLogosHint: 'Yukarıya bırakın veya {category} logosu eklemek için Yükle’ye tıklayın',
  },
  settings: {
    title: 'Ayarlar',
    intro: 'Veri yönetimi ve sistem yapılandırması',
    environment: 'Ortam',
    status: 'Durum',
    redis: 'Redis / Upstash',
    nodeEnv: 'Node Ortamı',
    vercelBlob: 'Vercel Blob',
    dataManagement: 'Veri Yönetimi',
    maintenance: 'Bakım',
    cleanupTitle: 'Görselleri Temizle',
    cleanupDesc:
      'Redis’teki kırık görsel URL’lerini (404) tarar ve otomatik kaldırır.',
    cleanupConfirm:
      'Redis’teki tüm görsel URL’leri taranıp kırık (404) referanslar kaldırılsın mı? Bir dakika sürebilir.',
    cleanupFailed: 'Temizleme başarısız',
    external: 'Harici',
    links: 'Bağlantılar',
    vercelDashboard: 'Vercel Paneli',
    upstashConsole: 'Upstash Konsolu',
    viewLiveSite: 'Canlı Siteyi Gör',
  },
  toast: {
    loadFailed: 'Yüklenemedi',
    saveOrderFailed: 'Sıra kaydedilemedi',
    deleteFailed: 'Silinemedi',
    addFailed: 'Eklenemedi',
    failed: 'Başarısız',
    updateFailed: 'Güncellenemedi',
    updatePhotographerFailed: 'Fotoğrafçı güncellenemedi',
  },
};
