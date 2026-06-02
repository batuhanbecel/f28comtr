/** Admin panel copy — imported into lib/translations.ts */

export type AdminTranslations = {
  label: string;
  nav: {
    dashboard: string;
    photographers: string;
    aiPowered: string;
    aiPoweredPortfolio: string;
    landing: string;
    logos: string;
    previews: string;
    pageCopy: string;
    seo: string;
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
      aiPowered: string;
      redis: string;
      viewSite: string;
    };
    cards: {
      photographersDesc: string;
      aiPoweredDesc: string;
      settingsDesc: string;
    };
  };
  photographers: Record<string, string>;
  photographerEdit: Record<string, string>;
  aiPowered: Record<string, string>;
  aiPoweredPortfolio: Record<string, string>;
  landing: Record<string, string>;
  previews: Record<string, string>;
  logos: Record<string, string>;
  pageCopy: {
    title: string;
    intro: string;
    language: string;
    pages: { production: string; aiPowered: string; contact: string };
    sections: {
      hero: string;
      stats: string;
      services: string;
      process: string;
      deliverables: string;
      team: string;
      marquee: string;
      filters: string;
      channels: string;
      form: string;
      contactInfo: string;
      seo: string;
    };
    fields: {
      sectionLabel: string;
      heading: string;
      description: string;
      title: string;
      subtitle: string;
      cta: string;
      itemTitle: string;
      itemDescription: string;
      stepTitle: string;
      stepSub: string;
      deliverable: string;
      statProjects: string;
      statBrands: string;
      statSince: string;
      statProjectsLabel: string;
      statBrandsLabel: string;
      statSinceLabel: string;
      seoTitle: string;
      seoDescription: string;
      email: string;
      instagram: string;
      linkedin: string;
      address: string;
      city: string;
    };
    reset: string;
    resetConfirm: string;
    saved: string;
    resetDone: string;
    addService: string;
    addStep: string;
    addDeliverable: string;
    removeItem: string;
  };
  seo: {
    title: string;
    intro: string;
    language: string;
    panelTitle: string;
    titleField: string;
    descriptionField: string;
    reset: string;
    resetConfirm: string;
    saved: string;
    resetDone: string;
  };
  settings: Record<string, string>;
  toast: Record<string, string>;
};

export const adminEn: AdminTranslations = {
  label: 'Admin',
    nav: {
    dashboard: 'Dashboard',
    photographers: 'Photographers',
    aiPowered: 'AI-Powered',
    aiPoweredPortfolio: 'AI Portfolio',
    landing: 'Landing',
    logos: 'Logos',
    previews: 'Previews',
    pageCopy: 'Page Copy',
    seo: 'SEO',
    settings: 'Settings',
    logout: 'Logout',
    toggleMenu: 'Toggle menu',
  },
  actions: {
    add: '+ Add',
    cancel: '✕ Cancel',
    upload: '+ Upload',
    save: 'Save',
    loading: 'Loading...',
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
      aiPowered: 'AI-Powered',
      redis: 'Redis',
      viewSite: 'View Site',
    },
    cards: {
      photographersDesc: 'Edit roster, reorder, manage previews',
      aiPoweredDesc: 'Reorder and manage AI-powered images',
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
  aiPowered: {
    title: 'AI-Powered',
    count: '{count} works — tag each with brand and type, drag to reorder',
    upload: 'Upload',
    defaults: 'Defaults',
    brandNext: 'Brand (next upload)',
    brandPlaceholder: 'Brand (e.g. Puma)',
    type: 'Type',
    brand: 'Brand',
    year: 'Year',
    titleOptional: 'Title (optional)',
    noWorks: 'No AI-powered works found',
    noWorksHint: 'Drop images above or click Upload to add works',
  },
  aiPoweredPortfolio: {
    title: 'AI-Powered Portfolio',
    count: '{count} images — assign categories, drag to reorder',
    noImages: 'No portfolio images found',
    noImagesHint: 'Drop images above or click Upload to add portfolio images',
    tagsTitle: 'Filter categories',
    tagsHint: 'Labels appear in EN and TR on the public portfolio page.',
    tagEn: 'English label',
    tagTr: 'Turkish label',
    addTag: 'Add category',
    deleteTag: 'Remove',
    uploadTags: 'Default categories for new uploads',
    imageTags: 'Categories',
    noTags: 'Add categories above to enable filtering.',
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
  pageCopy: {
    title: 'Page Copy',
    intro: 'Edit Production, AI-Powered, and Contact page text in English and Turkish.',
    language: 'Language',
    pages: {
      production: 'Production',
      aiPowered: 'AI-Powered',
      contact: 'Contact',
    },
    sections: {
      hero: 'Hero',
      stats: 'Stats',
      services: 'Services',
      process: 'Process',
      deliverables: 'Deliverables',
      team: 'Team',
      marquee: 'Marquee',
      filters: 'Filters',
      channels: 'Channels',
      form: 'Form',
      contactInfo: 'Contact details',
      seo: 'SEO',
    },
    fields: {
      sectionLabel: 'Section label',
      heading: 'Heading',
      description: 'Description',
      title: 'Title',
      subtitle: 'Subtext',
      cta: 'Button text',
      itemTitle: 'Item title',
      itemDescription: 'Item description',
      stepTitle: 'Step title',
      stepSub: 'Step description',
      deliverable: 'Deliverable',
      statProjects: 'Projects value',
      statBrands: 'Brands value',
      statSince: 'Since year',
      statProjectsLabel: 'Projects label',
      statBrandsLabel: 'Brands label',
      statSinceLabel: 'Since label',
      seoTitle: 'Meta title',
      seoDescription: 'Meta description',
      email: 'Email',
      instagram: 'Instagram URL',
      linkedin: 'LinkedIn URL',
      address: 'Address',
      city: 'City',
    },
    reset: 'Reset to defaults',
    resetConfirm: 'Reset all custom copy for this page and language?',
    saved: 'Page copy saved',
    resetDone: 'Reset to defaults',
    addService: '+ Add service',
    addStep: '+ Add step',
    addDeliverable: '+ Add deliverable',
    removeItem: 'Remove',
  },
  seo: {
    title: 'SEO / Metadata',
    intro: 'Edit meta title and description for all public pages (EN/TR). Stored separately from page body copy.',
    language: 'Language',
    panelTitle: 'Meta tags',
    titleField: 'Meta title',
    descriptionField: 'Meta description',
    reset: 'Reset SEO',
    resetConfirm: 'Reset custom SEO for this page and language?',
    saved: 'SEO saved',
    resetDone: 'SEO reset to defaults',
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
    aiPowered: 'AI-Powered',
    aiPoweredPortfolio: 'AI Portfolio',
    landing: 'Ana Sayfa',
    logos: 'Logolar',
    previews: 'Önizlemeler',
    pageCopy: 'Sayfa Metinleri',
    seo: 'SEO',
    settings: 'Ayarlar',
    logout: 'Çıkış',
    toggleMenu: 'Menüyü aç/kapat',
  },
  actions: {
    add: '+ Ekle',
    cancel: '✕ İptal',
    upload: '+ Yükle',
    save: 'Kaydet',
    loading: 'Yükleniyor...',
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
      aiPowered: 'AI-Powered',
      redis: 'Redis',
      viewSite: 'Siteyi Gör',
    },
    cards: {
      photographersDesc: 'Kadroyu düzenle, sırala, önizlemeleri yönet',
      aiPoweredDesc: 'AI-Powered görselleri sırala ve yönet',
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
  aiPowered: {
    title: 'AI-Powered',
    count: '{count} çalışma — marka ve tür etiketleyin, sıralamak için sürükleyin',
    upload: 'Yükleme',
    defaults: 'Varsayılanlar',
    brandNext: 'Marka (sonraki yükleme)',
    brandPlaceholder: 'Marka (ör. Puma)',
    type: 'Tür',
    brand: 'Marka',
    year: 'Yıl',
    titleOptional: 'Başlık (isteğe bağlı)',
    noWorks: 'AI-Powered çalışma bulunamadı',
    noWorksHint: 'Yukarıya bırakın veya çalışma eklemek için Yükle’ye tıklayın',
  },
  aiPoweredPortfolio: {
    title: 'AI-Powered Portfolio',
    count: '{count} görsel — kategori ata, sıralamak için sürükleyin',
    noImages: 'Portfolyo görseli bulunamadı',
    noImagesHint: 'Yukarıya bırakın veya portfolyo görseli eklemek için Yükle’ye tıklayın',
    tagsTitle: 'Filtre kategorileri',
    tagsHint: 'Etiketler public portfolyo sayfasında EN ve TR olarak görünür.',
    tagEn: 'İngilizce etiket',
    tagTr: 'Türkçe etiket',
    addTag: 'Kategori ekle',
    deleteTag: 'Kaldır',
    uploadTags: 'Yeni yüklemeler için varsayılan kategoriler',
    imageTags: 'Kategoriler',
    noTags: 'Filtreleme için yukarıdan kategori ekleyin.',
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
  pageCopy: {
    title: 'Sayfa Metinleri',
    intro: 'Production, AI-Powered ve İletişim sayfalarının EN/TR metinlerini düzenleyin.',
    language: 'Dil',
    pages: {
      production: 'Production',
      aiPowered: 'AI-Powered',
      contact: 'İletişim',
    },
    sections: {
      hero: 'Hero',
      stats: 'İstatistikler',
      services: 'Hizmetler',
      process: 'Süreç',
      deliverables: 'Teslimatlar',
      team: 'Ekip',
      marquee: 'Marquee',
      filters: 'Filtreler',
      channels: 'Kanallar',
      form: 'Form',
      contactInfo: 'İletişim bilgileri',
      seo: 'SEO',
    },
    fields: {
      sectionLabel: 'Bölüm etiketi',
      heading: 'Başlık',
      description: 'Açıklama',
      title: 'Başlık',
      subtitle: 'Alt metin',
      cta: 'Buton metni',
      itemTitle: 'Öğe başlığı',
      itemDescription: 'Öğe açıklaması',
      stepTitle: 'Adım başlığı',
      stepSub: 'Adım açıklaması',
      deliverable: 'Teslimat',
      statProjects: 'Proje değeri',
      statBrands: 'Marka değeri',
      statSince: 'Kuruluş yılı',
      statProjectsLabel: 'Proje etiketi',
      statBrandsLabel: 'Marka etiketi',
      statSinceLabel: 'Kuruluş etiketi',
      seoTitle: 'Meta başlık',
      seoDescription: 'Meta açıklama',
      email: 'E-posta',
      instagram: 'Instagram URL',
      linkedin: 'LinkedIn URL',
      address: 'Adres',
      city: 'Şehir',
    },
    reset: 'Varsayılana dön',
    resetConfirm: 'Bu sayfa ve dil için tüm özel metinler silinsin mi?',
    saved: 'Sayfa metinleri kaydedildi',
    resetDone: 'Varsayılana döndürüldü',
    addService: '+ Hizmet ekle',
    addStep: '+ Adım ekle',
    addDeliverable: '+ Teslimat ekle',
    removeItem: 'Kaldır',
  },
  seo: {
    title: 'SEO / Meta',
    intro: 'Tüm public sayfalar için meta başlık ve açıklama (EN/TR). Sayfa metinlerinden ayrı kaydedilir.',
    language: 'Dil',
    panelTitle: 'Meta etiketleri',
    titleField: 'Meta başlık',
    descriptionField: 'Meta açıklama',
    reset: 'SEO sıfırla',
    resetConfirm: 'Bu sayfa ve dil için özel SEO sıfırlansın mı?',
    saved: 'SEO kaydedildi',
    resetDone: 'SEO varsayılana döndü',
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
