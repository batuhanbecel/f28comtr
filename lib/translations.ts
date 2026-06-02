import { adminEn, adminTr } from '@/lib/adminTranslations';

export const translations = {
  en: {
    nav: {
      home: 'HOME',
      production: 'PRODUCTION',
      aiPowered: 'AI-POWERED',
      portfolios: 'PORTFOLIOS',
      about: 'ABOUT US',
      contact: 'CONTACT',
      allPortfolios: 'All Portfolios',
      ourArtists: 'Our Artists',
      aiPoweredGallery: 'Works',
      aiPoweredPortfolio: 'Portfolio',
    },
    common: {
      scroll: 'Scroll',
      viewPortfolio: 'VIEW PORTFOLIO',
      enter: 'Enter',
      download: 'DOWNLOAD',
      downloadPortfolio: 'Download Portfolio',
      downloaded: 'Downloaded',
      preparing: 'Preparing…',
      buildingPdf: 'Building PDF…',
      failedRetry: 'Failed — try again',
      close: 'Close',
      navigation: 'Navigation',
      contact: 'Contact',
      follow: 'Follow',
    },
    titleMap: {
      'Photographer': 'Photographer',
      'Retoucher': 'Retoucher',
      'Art Director': 'Art Director',
      'Director': 'Director',
      'Cinematographer': 'Cinematographer',
      'Videographer': 'Videographer',
      'PHOTOGRAPHER': 'Photographer',
      'RETOUCHER': 'Retoucher',
      'ART DIRECTOR': 'Art Director',
      'DIRECTOR': 'Director',
      'CINEMATOGRAPHER': 'Cinematographer',
      'VIDEOGRAPHER': 'Videographer',
    },
    landing: {
      productionLabel: 'Photography & Retouching',
      aiLabel: 'AI-Powered & Creativity',
    },
    homeV2: {
      heroTitle: 'PRODUCTION & AI',
      servicesMarqueeLabel: 'Our services',
      selectedWorksLabel: 'Selected work',
      selectedWorksHeading: 'SELECTED WORKS',
      workTitleFallback: 'Editorial campaign',
      artistsLabel: 'Our artists',
      artistsHeading: 'ARTISTS',
      viewAllArtists: 'View all',
      aiSplitLabel: 'AI-Powered Production',
      aiSplitTitle: 'Traditional production + AI',
      aiSplitBody:
        'From brief to delivery: model selection, prompt, iteration and hybrid retouch. AI workflow and traditional post-production in one pipeline.',
      aiSplitCta: 'View works',
      aiWorksStat: 'AI works',
      clientsMarqueeLabel: 'Clients',
    },
    production: {
      sectionLabel: 'Istanbul — Since 2008',
      heading: 'PRODUCTION',
      description:
        'Based in Istanbul since 2008, f/2.8 Production delivers high-quality photography and video services through an international portfolio. Working with many leading brands from around the world, the team provides efficient solutions for photography, video, CGI, animation, editing, and motion graphics.',
      stats: {
        projects: 'Completed projects',
        brands: 'Brands worked with',
        since: 'Est. Istanbul',
      },
      services: {
        sectionLabel: 'Capabilities',
        heading: 'WHAT WE DO',
        items: [
          {
            title: 'Photography',
            description: 'Campaign, lookbook, e-commerce, still life and on-location shoots for global brands.',
          },
          {
            title: 'AI-Powered Content',
            description: 'Hybrid visual and video production — AI models combined with traditional retouch and craft for campaigns, social and concept work.',
          },
          {
            title: 'CGI & Retouch',
            description: 'Compositing, beauty, set extension and high-end post for print and digital.',
          },
          {
            title: 'Videography',
            description: 'Commercial films, social content, product video and motion-led brand storytelling.',
          },
          {
            title: 'Editing',
            description: 'Offline and online edit, grading prep and platform-ready master cuts.',
          },
        ],
      },
      process: {
        sectionLabel: 'Our Process',
        heading: 'HOW WE WORK',
        steps: [
          { title: 'Brief & planning', sub: 'Brand need, creative direction, shot list and schedule' },
          { title: 'Production', sub: 'Studio or location shoot with the right crew and talent' },
          { title: 'Post & retouch', sub: 'Compositing, color and high-end finishing' },
          { title: 'Adaptation', sub: 'Crops, formats and versions for every channel' },
          { title: 'Delivery', sub: 'Final assets, archives and handoff to your team' },
        ],
      },
      deliverables: {
        sectionLabel: 'Output',
        heading: 'WHAT WE DELIVER',
        items: [
          'Campaign key visuals',
          'E-commerce packshots',
          'Social cutdowns',
          'Brand film masters',
          'Print-ready files',
          'Platform-specific exports',
        ],
      },
      team: {
        sectionLabel: 'Our Network',
        description:
          'We work with a wide network of photographers and retouchers. For every project we assign the right talent to the brief — from shoot to final delivery.',
        cta: 'View portfolios',
      },
      marqueeLabel: 'Selected production work',
      marqueeRow: 'Production image',
      marqueeViewImage: 'View image',
    },
    aiPowered: {
      sectionLabel: 'AI-Powered & Creativity',
      heading: 'AI-POWERED',
      description:
        'We offer a hybrid production process by blending traditional retouching disciplines with the latest AI models. By combining our industry-standard craftsmanship with innovative technologies, we produce both creative and highly efficient visual and video content for our brands.',
      worksLabel: 'works',
      stats: {
        projects: 'Completed projects',
        brands: 'Brands worked with',
        since: 'Est. Istanbul',
      },
      process: {
        sectionLabel: 'Our Process',
        heading: 'How we work?',
        steps: [
          { title: 'Brief & concept', sub: 'Brand need and creative direction' },
          { title: 'AI-powered production', sub: 'Model selection, prompt, iteration' },
          { title: 'Hybrid retouching', sub: 'AI-powered workflow plus traditional post-production' },
          { title: 'Delivery', sub: 'Platform-specific format and dimensions' },
        ],
      },
      filters: {
        brand: 'Brand',
        type: 'Type',
        all: 'All',
        allBrands: 'All brands',
        allTypes: 'All types',
        visual: 'Visual',
        video: 'Video',
        hybrid: 'Hybrid',
        resultsSuffix: 'works',
        empty: 'No works match these filters.',
      },
    },
    about: {
      sectionLabel: 'Istanbul — Since 2008',
      heading: 'PRODUCTION\nIS OUR LIFE',
      description:
        'Based in Istanbul, f/2.8 Production delivers high-quality photography and video services through an international portfolio. Working with leading brands worldwide — photography, video, CGI, animation, editing, and motion graphics.',
      collaborationsLabel: 'Collaborations',
      partnerAgencies: 'PARTNER AGENCIES',
      whoWeWorkWith: 'Who We Work With',
      clientsHeading: 'CLIENTS',
    },
    portfolios: {
      sectionLabel: 'Our Work',
      heading: 'PORTFOLIOS',
    },
    contact: {
      sectionLabel: 'Get in touch',
      heading: 'CONTACT',
      description: 'Send us a message — we will get back to you as soon as we can.',
      channelsLabel: 'Direct',
      channelsHeading: 'REACH US',
      emailLabel: 'Email',
      instagramLabel: 'Instagram',
      linkedinLabel: 'LinkedIn',
      addressLabel: 'Studio',
      formLabel: 'Inquiry',
      formHeading: 'SEND A MESSAGE',
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        submit: 'Send message',
        sending: 'Sending…',
        success: 'Message sent. We will get back to you soon.',
        error: 'Something went wrong. Please try again or email us directly.',
        required: 'Please fill in all fields.',
        invalidEmail: 'Please enter a valid email address.',
      },
    },
    aiPoweredPortfolio: {
      sectionLabel: 'AI-Powered',
      heading: 'PORTFOLIO',
      description:
        'A curated selection of full AI-powered concept portfolio productions.',
      empty: 'Portfolio images coming soon.',
      filters: {
        all: 'All',
        category: 'Category',
        empty: 'No images in this category.',
        resultsSuffix: 'images',
      },
    },
    footer: {
      tagline: 'Photography & Production',
      location: 'Istanbul — Est. 2008',
      navigation: 'Navigation',
      contact: 'Contact',
      contactPage: 'Contact form',
      follow: 'Follow',
      rights: 'All rights reserved.',
      city: 'Istanbul, Turkey',
    },
    seo: {
      home: {
        title: 'f/2.8 Production Agency | Photography & Retouching',
        description:
          'Professional photography and retouching production agency in Istanbul. Featuring top photographers and retouchers for commercial and creative projects.',
      },
      production: {
        title: 'Production',
        description:
          'Photography, video, CGI, retouching, and AI-powered content production in Istanbul — services, process, and deliverables since 2008.',
      },
      aiPowered: {
        title: 'AI-Powered Works',
        description:
          'Hybrid AI and traditional retouching for visual and video content — campaigns, social, and concept work by f/2.8 Production, Istanbul.',
      },
      aiPoweredPortfolio: {
        title: 'AI-Powered Portfolio',
        description:
          'Curated AI-powered concept portfolio productions — filtered gallery by f/2.8 Production Agency, Istanbul.',
      },
      portfolios: {
        title: 'Portfolios',
        description:
          'Browse portfolios from our talented photographers and retouchers at f/2.8 Production Agency, Istanbul.',
      },
      about: {
        title: 'About Us',
        description:
          'Istanbul-based photography and production agency since 2008. Photography, video, CGI, animation, editing, and motion graphics.',
      },
      contact: {
        title: 'Contact',
        description:
          'Contact f/2.8 Production Agency in Istanbul — send a message for photography, video, CGI, and AI-powered production inquiries.',
      },
      photographer: {
        titleTemplate: '{name}',
        descriptionTemplate:
          '{title} portfolio — {name} at f/2.8 Production Agency, Istanbul.',
        notFoundTitle: 'Portfolio',
        notFoundDescription: 'Photographer portfolio at f/2.8 Production Agency.',
      },
      notFound: {
        title: '404 | f/2.8 Production Agency',
        description: 'This page could not be found.',
      },
    },
    notFound: {
      label: 'Error',
      title: '404',
      description: 'This page could not be found.',
      backHome: 'Back to home',
    },
    errors: {
      label: 'Something went wrong',
      title: 'Error',
      description: 'An unexpected error occurred.',
      tryAgain: 'Try again',
      backHome: 'Back to home',
    },
    admin: adminEn,
  },
  tr: {
    nav: {
      home: 'ANA SAYFA',
      production: 'PRODÜKSİYON',
      aiPowered: 'AI-POWERED',
      portfolios: 'PORTFÖYLER',
      about: 'HAKKIMIZDA',
      contact: 'İLETİŞİM',
      allPortfolios: 'Tüm Portföyler',
      ourArtists: 'Sanatçılarımız',
      aiPoweredGallery: 'Çalışmalarımız',
      aiPoweredPortfolio: 'Portföyler',
    },
    common: {
      scroll: 'Kaydır',
      viewPortfolio: 'PORTFÖYÜ GÖR',
      enter: 'Giriş',
      download: 'İNDİR',
      downloadPortfolio: 'Portföyü İndir',
      downloaded: 'İndirildi',
      preparing: 'Hazırlanıyor…',
      buildingPdf: 'PDF Oluşturuluyor…',
      failedRetry: 'Başarısız — tekrar dene',
      close: 'Kapat',
      navigation: 'Gezinti',
      contact: 'İletişim',
      follow: 'Takip Et',
    },
    titleMap: {
      'Photographer': 'Fotoğrafçı',
      'Retoucher': 'Rötuşçu',
      'Art Director': 'Sanat Yönetmeni',
      'Director': 'Yönetmen',
      'Cinematographer': 'Görüntü Yönetmeni',
      'Videographer': 'Video Çekimcisi',
      'PHOTOGRAPHER': 'Fotoğrafçı',
      'RETOUCHER': 'Rötuşçu',
      'ART DIRECTOR': 'Sanat Yönetmeni',
      'DIRECTOR': 'Yönetmen',
      'CINEMATOGRAPHER': 'Görüntü Yönetmeni',
      'VIDEOGRAPHER': 'Video Çekimcisi',
    },
    landing: {
      productionLabel: 'Fotoğrafçılık & Rötuş',
      aiLabel: 'AI-Powered & Yaratıcılık',
    },
    homeV2: {
      heroTitle: 'PRODUCTION & AI',
      servicesMarqueeLabel: 'Hizmetlerimiz',
      selectedWorksLabel: 'Seçili iş',
      selectedWorksHeading: 'SEÇİLİ İŞLER',
      workTitleFallback: 'Kampanya',
      artistsLabel: 'Sanatçılarımız',
      artistsHeading: 'SANATÇILAR',
      viewAllArtists: 'Tümünü gör',
      aiSplitLabel: 'AI-Powered Production',
      aiSplitTitle: 'Geleneksel prodüksiyon + yapay zeka',
      aiSplitBody:
        'Brief\'ten teslimata kadar: model seçimi, prompt, iterasyon ve hibrit retuş. AI iş akışı ile geleneksel post-prodüksiyon bir arada.',
      aiSplitCta: 'İşleri gör',
      aiWorksStat: 'AI iş',
      clientsMarqueeLabel: 'Müşterilerimiz',
    },
    production: {
      sectionLabel: 'İstanbul — 2008\'den Beri',
      heading: 'PRODÜKSİYON',
      description:
        '2008\'den bu yana İstanbul merkezli f/2.8 Production, uluslararası portföyüyle yüksek kaliteli fotoğrafçılık ve video hizmetleri sunmaktadır. Dünyanın dört bir yanındaki önde gelen markalarla çalışan ekip; fotoğrafçılık, video, CGI, animasyon, kurgu ve hareketli grafik alanlarında etkin çözümler sunmaktadır.',
      stats: {
        projects: 'Tamamlanan proje',
        brands: 'Çalışılan marka',
        since: 'İstanbul, 2008',
      },
      services: {
        sectionLabel: 'Yetkinlikler',
        heading: 'NE YAPIYORUZ',
        items: [
          {
            title: 'Fotoğrafçılık',
            description: 'Kampanya, lookbook, e-ticaret, still life ve location çekimleri.',
          },
          {
            title: 'AI Tabanlı İçerik Üretimi',
            description: 'Hibrit görsel ve video prodüksiyon — AI modelleri ile geleneksel rötuş ve ustalığın kampanya, sosyal medya ve konsept işlerinde birleşimi.',
          },
          {
            title: 'CGI & Rötuş',
            description: 'Compositing, beauty, set extension ve print/digital post prodüksiyon.',
          },
          {
            title: 'Video',
            description: 'Reklam filmi, sosyal medya içeriği, product video ve marka hikâyesi.',
          },
          {
            title: 'Kurgu',
            description: 'Offline/online edit, grading hazırlığı ve platform master kesimleri.',
          },
        ],
      },
      process: {
        sectionLabel: 'Sürecimiz',
        heading: 'NASIL ÇALIŞIYORUZ',
        steps: [
          { title: 'Brief & planlama', sub: 'Marka ihtiyacı, yaratıcı yön, shot list ve takvim' },
          { title: 'Prodüksiyon', sub: 'Stüdyo veya location çekimi, doğru ekip ve talent' },
          { title: 'Post & rötuş', sub: 'Compositing, color ve high-end finishing' },
          { title: 'Adaptasyon', sub: 'Kanal bazlı crop, format ve versiyonlar' },
          { title: 'Teslimat', sub: 'Final asset\'ler, arşiv ve ekibinize devir' },
        ],
      },
      deliverables: {
        sectionLabel: 'Çıktılar',
        heading: 'NE TESLİM EDİYORUZ',
        items: [
          'Kampanya key visual\'ları',
          'E-ticaret packshot\'ları',
          'Sosyal cutdown\'lar',
          'Brand film master\'ları',
          'Baskıya hazır dosyalar',
          'Platforma özel export\'lar',
        ],
      },
      team: {
        sectionLabel: 'Ekibimiz',
        description:
          'Geniş bir fotoğrafçı ve retoucher ağıyla çalışıyoruz. Her proje için brief\'e uygun yeteneği çekimden final teslimata kadar atıyoruz.',
        cta: 'Portföyleri gör',
      },
      marqueeLabel: 'Seçilmiş prodüksiyon çalışmaları',
      marqueeRow: 'Prodüksiyon görseli',
      marqueeViewImage: 'Görseli aç',
    },
    aiPowered: {
      sectionLabel: 'AI-Powered & Yaratıcılık',
      heading: 'AI-POWERED',
      description:
        'Geleneksel retouch disiplinini en güncel AI modelleriyle harmanlayarak hibrit bir prodüksiyon süreci sunuyoruz. Sektör standartlarındaki ustalığımızı inovatif teknolojilerle birleştirerek, markalarımız için hem yaratıcı hem de yüksek verimli görsel ve video içerikler üretiyoruz.',
      worksLabel: 'çalışma',
      stats: {
        projects: 'Tamamlanan proje',
        brands: 'Çalışılan marka',
        since: 'İstanbul, 2008',
      },
      process: {
        sectionLabel: 'Çalışma Sürecimiz',
        heading: 'Nasıl çalışıyoruz?',
        steps: [
          { title: 'Brief & konsept', sub: 'Marka ihtiyacı ve yaratıcı yön' },
          { title: 'AI-powered prodüksiyon', sub: 'Model seçimi, prompt ve iterasyon' },
          { title: 'Hybrid rötüş', sub: 'AI-powered workflow ve geleneksel post prodüksiyon' },
          { title: 'Teslimat', sub: 'Platforma özel format ve boyut' },
        ],
      },
      filters: {
        brand: 'Marka',
        type: 'Tür',
        all: 'Tümü',
        allBrands: 'Tüm markalar',
        allTypes: 'Tüm türler',
        visual: 'Görsel',
        video: 'Video',
        hybrid: 'Hybrid',
        resultsSuffix: 'çalışma',
        empty: 'Bu filtrelere uygun çalışma bulunamadı.',
      },
    },
    about: {
      sectionLabel: 'İstanbul — 2008\'den Beri',
      heading: 'PRODÜKSİYON\nTUTKUMUZ',
      description:
        'İstanbul merkezli f/2.8 Production, uluslararası portföyüyle yüksek kaliteli fotoğrafçılık ve video hizmetleri sunmaktadır. Dünya genelinde önde gelen markalarla çalışan ekip; fotoğrafçılık, video, CGI, animasyon, kurgu ve hareketli grafik alanlarında hizmet vermektedir.',
      collaborationsLabel: 'İşbirlikleri',
      partnerAgencies: 'ORTAK AJANSLAR',
      whoWeWorkWith: 'Birlikte Çalıştıklarımız',
      clientsHeading: 'MÜŞTERİLER',
    },
    portfolios: {
      sectionLabel: 'Çalışmalarımız',
      heading: 'PORTFÖYLER',
    },
    contact: {
      sectionLabel: 'Bize ulaşın',
      heading: 'İLETİŞİM',
      description: 'Mesajınızı gönderin — en kısa sürede size dönüş yapacağız.',
      channelsLabel: 'Doğrudan',
      channelsHeading: 'BİZE ULAŞIN',
      emailLabel: 'E-posta',
      instagramLabel: 'Instagram',
      linkedinLabel: 'LinkedIn',
      addressLabel: 'Stüdyo',
      formLabel: 'Talep',
      formHeading: 'MESAJ GÖNDERİN',
      form: {
        name: 'Ad Soyad',
        email: 'E-posta',
        subject: 'Konu',
        message: 'Mesaj',
        submit: 'Mesaj gönder',
        sending: 'Gönderiliyor…',
        success: 'Mesajınız iletildi. En kısa sürede size dönüş yapacağız.',
        error: 'Bir hata oluştu. Lütfen tekrar deneyin veya doğrudan e-posta gönderin.',
        required: 'Lütfen tüm alanları doldurun.',
        invalidEmail: 'Geçerli bir e-posta adresi girin.',
      },
    },
    aiPoweredPortfolio: {
      sectionLabel: 'AI-Powered',
      heading: 'PORTFÖY',
      description:
        'Konsept AI-Powered portfolyo prodüksiyonlarından seçilmiş çalışmalar.',
      empty: 'Portfolyo görselleri yakında.',
      filters: {
        all: 'Tümü',
        category: 'Kategori',
        empty: 'Bu kategoride görsel yok.',
        resultsSuffix: 'görsel',
      },
    },
    footer: {
      tagline: 'Fotoğrafçılık & Prodüksiyon',
      location: 'İstanbul — K. 2008',
      navigation: 'Gezinti',
      contact: 'İletişim',
      contactPage: 'İletişim formu',
      follow: 'Takip Et',
      rights: 'Tüm hakları saklıdır.',
      city: 'İstanbul, Türkiye',
    },
    seo: {
      home: {
        title: 'f/2.8 Production Agency | Fotoğrafçılık & Rötuş',
        description:
          'İstanbul merkezli profesyonel fotoğrafçılık ve rötuş prodüksiyon ajansı. Ticari ve yaratıcı projeler için önde gelen fotoğrafçılar ve rötuşçular.',
      },
      production: {
        title: 'Prodüksiyon',
        description:
          'Fotoğraf, video, CGI, rötuş ve AI tabanlı içerik prodüksiyonu — hizmetler, süreç ve teslimatlar. 2008\'den beri İstanbul.',
      },
      aiPowered: {
        title: 'AI-Powered Çalışmalar',
        description:
          'Hibrit AI ve geleneksel rötuşla görsel ve video içerik — kampanya, sosyal medya ve konsept işler. f/2.8 Production, İstanbul.',
      },
      aiPoweredPortfolio: {
        title: 'AI-Powered Portföy',
        description:
          'Seçilmiş AI-powered konsept portföy prodüksiyonları — kategorili galeri. f/2.8 Production Agency, İstanbul.',
      },
      portfolios: {
        title: 'Portföyler',
        description:
          'f/2.8 Production Agency fotoğrafçı ve rötuşçu portföylerini keşfedin — İstanbul.',
      },
      about: {
        title: 'Hakkımızda',
        description:
          '2008\'den beri İstanbul merkezli fotoğrafçılık ve prodüksiyon ajansı. Fotoğraf, video, CGI, animasyon, kurgu ve motion graphics.',
      },
      contact: {
        title: 'İletişim',
        description:
          'f/2.8 Production Agency ile İstanbul\'da iletişime geçin — fotoğraf, video, CGI ve AI-powered prodüksiyon talepleri için mesaj gönderin.',
      },
      photographer: {
        titleTemplate: '{name}',
        descriptionTemplate:
          '{name} — {title} portföyü, f/2.8 Production Agency, İstanbul.',
        notFoundTitle: 'Portföy',
        notFoundDescription: 'f/2.8 Production Agency fotoğrafçı portföyü.',
      },
      notFound: {
        title: '404 | f/2.8 Production Agency',
        description: 'Bu sayfa bulunamadı.',
      },
    },
    notFound: {
      label: 'Hata',
      title: '404',
      description: 'Bu sayfa bulunamadı.',
      backHome: 'Ana sayfaya dön',
    },
    errors: {
      label: 'Bir şeyler ters gitti',
      title: 'Hata',
      description: 'Beklenmeyen bir hata oluştu.',
      tryAgain: 'Tekrar dene',
      backHome: 'Ana sayfaya dön',
    },
    admin: adminTr,
  },
};

export type Lang = 'en' | 'tr';
export type T = typeof translations.en;
