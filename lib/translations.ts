export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      signInRequired: 'Sign in required',
      error: 'Error',
      success: 'Success'
    },
    nav: {
      home: 'Home',
      pricing: 'Pricing',
      voices: 'Voices',
      tts: 'Text to Speech',
      login: 'Log in',
      dashboard: 'Dashboard'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Welcome to your dashboard',
      welcome: 'Welcome to your personal dashboard',
      loading: 'Loading...',
      accountBalance: 'Account Balance',
      points: 'points',
      maxBalance: 'Max Balance',
      totalSpent: 'Total Spent',
      lastPurchase: 'Last Purchase',
      voicesGenerated: 'Voices Generated',
      lastGenerated: 'Last Generated',
      accountAge: 'Usage Period',
      days: 'days',
      memberSince: 'Member Since',
      voiceHistory: 'Voice History',
      orderHistory: 'Order History',
      accountInfo: 'Account Info',
      recentVoices: 'Recent Voices',
      recentVoicesDesc: 'Your recently generated voices',
      noVoices: 'No voices generated yet',
      generateVoice: 'Generate Voice',
      generateMore: 'Generate More',
      play: 'Play',
      pause: 'Pause',
      download: 'Download',
      purchaseHistory: 'Purchase History',
      purchaseHistoryDesc: 'Your recent purchases',

      noOrders: 'No purchases yet',
      viewPlans: 'View Plans',
      buyMore: 'Buy More',
      profileInformation: 'Profile Information',
      profileInformationDesc: 'Your account details',
      name: 'Name',
      email: 'Email',
      currentBalance: 'Current Balance',
      refreshData: 'Refresh User Info',
      playbackError: 'Playback Error',
      playbackErrorDesc: 'Could not play the audio file',
      downloadStarted: 'Download Started',
      delete: 'Delete',
      deleteConfirmTitle: 'Delete Voice Record',
      deleteConfirmDesc: 'Are you sure you want to delete this voice record? This action cannot be undone.',
      cancel: 'Cancel',
      deleteSuccess: 'Deleted Successfully',
      deleteSuccessDesc: 'The voice record has been deleted.',
      deleteError: 'Delete Error',
      deleteErrorDesc: 'Failed to delete the voice record. Please try again.',
      dataLoadFailed: 'Data Load Failed',
      dataLoadFailedDesc: 'Could not load user data, please try again later',
      dataUpdated: 'Data Updated',
      noName: 'No Name',
      noEmail: 'No Email',
      paymentName: 'Payment Name',
      paymentEmail: 'Payment Email',
      amount: 'Amount',
      orderDate: 'Order Date',
      downloadStartedDesc: 'Your audio file is being downloaded',
      charactersUsed: 'Characters Used',
      charactersUsedDesc: 'Characters used this month',
      audioGenerated: 'Audio Generated',
      audioGeneratedDesc: 'Total audio files generated',
      savedVoices: 'Saved Voices',
      noTextAvailable: 'No text available',
      customVoice: 'custom voice',
      currentPlan: 'Current Plan',
      renewsOn: 'Renews on',
      recentConversions: 'Recent Conversions',
      recentConversionsDesc: 'Your recent text-to-speech conversions',
      speechSample: 'Speech Sample',
      hoursAgo: 'hours ago',
      yesterday: 'Yesterday',
      daysAgo: 'days ago'
    },
    auth: {
      welcomeBack: 'Welcome back',
      loginToContinue: 'Sign in to continue to VoiceWave',
      continueWithGithub: 'Continue with GitHub',
      continueWithGoogle: 'Continue with Google',
      or: 'or',
      emailPlaceholder: 'Enter your email',
      emailLoginComingSoon: 'Email login coming soon',
      noAccount: 'Don\'t have an account?',
      createAccount: 'Create an account',
      byLogging: 'By logging in, you agree to our',
      terms: 'Terms of Service',
      and: 'and',
      privacy: 'Privacy Policy',
      loginFailed: 'Login failed',
      tryAgain: 'Please try again later',
      registerFailed: 'Registration failed',
      registerToContinue: 'Sign up to start using VoiceWave',
      emailRegisterComingSoon: 'Email registration coming soon',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Log in',
      byRegistering: 'By registering, you agree to our',
      errorTitle: 'Authentication Error',
      errorDefault: 'An authentication error occurred. Please try again.',
      errorConfiguration: 'There is a problem with the authentication configuration.',
      errorAccessDenied: 'Access denied. You do not have permission to access this resource.',
      errorVerification: 'The verification link has expired or has already been used.',
      tryAgainButton: 'Try Again',
      backToHome: 'Back to Home'
    },
    userMenu: {
      dashboard: 'Dashboard',
      billing: 'Billing',
      settings: 'Settings',
      signOut: 'Sign out'
    },
    hero: {
      title: 'Transform Text to Natural Speech',
      subtitle: 'Convert your text into realistic human-like speech with natural intonation and emotions',
      tryNow: 'Try for free',
      learnMore: 'Learn more'
    },
    tts: {
      title: 'Text to Speech',
      pageTitle: 'Advanced Text to Speech Conversion',
      pageDescription: 'Convert your text into natural-sounding speech with our AI-powered voice generation technology',
      generateTab: 'Generate Audio',
      libraryTab: 'My Library',
      inputPlaceholder: 'Type or paste your text here...',
      selectVoice: 'Select Voice',
      speed: 'Speed',
      generate: 'Generate',
      play: 'Play',
      pause: 'Pause',
      download: 'Download',
      copy: 'Copy Link',
      clear: 'Clear',
      save: 'Save to Library',
      load: 'Load',
      noSavedAudios: 'No saved audios yet',
      generateToSave: 'Generate some audio and save it to your library',
      localLibrary: 'Local Library',
      cloudCollection: 'Cloud Collection',
      noCloudAudios: 'No saved audios in cloud',
      generateToSaveCloud: 'Generate and save audio to add to your cloud collection',
      generated: 'Generated Audio',
      signInPrompt: 'Sign in to access more voices and features',
      charactersCount: 'Characters: {count}',
      deleteConfirmTitle: 'Delete Recording',
      confirmDelete: 'Are you sure you want to delete this recording?',
      cancel: 'Cancel',
      delete: 'Delete',
      saveLocationTitle: 'Save Location',
      saveLocationDescription: 'Where would you like to save this recording?',
      saveToLocal: 'Save to Local Library',
      saveToCloud: 'Save to Cloud Collection',
      saveToBoth: 'Save to Both',
      // Toast messages
      error: 'Error',
      success: 'Success',
      noAudioToDownload: 'No audio available to download.',
      downloadStarted: 'Download started',
      downloadStartedDesc: 'Your audio file is being downloaded.',
      noAudioToSave: 'No audio available to save.',
      loginRequired: 'You must be logged in to save audio.',
      mustBeLoggedInToSave: 'You must be logged in to save audio.',
      authRequired: 'Authentication Required',
      mustBeLoggedIn: 'You must be logged in to generate audio.',
      insufficientBalance: 'Insufficient Balance',
      balanceNeeded: 'This operation requires {0} points, but you only have {1} points.',
      emptyTextError: 'Please enter some text to generate speech.',
      audioSavedLocally: 'Audio saved locally',
      audioSavedLocallyDesc: 'Your audio has been saved to your local library.',
      audioSavedToCloud: 'Audio saved to cloud',
      audioSavedToCloudDesc: 'Your audio has been saved to your cloud collection.',
      failedToSaveCloud: 'Failed to save to cloud collection.',
      audioDeleted: 'Audio deleted',
      audioDeletedTitle: 'Audio deleted',
      audioDeletedFromCloud: 'Audio removed from cloud collection.',
      audioDeletedFromLocal: 'The audio has been removed from your local library.',
      failedToDeleteCloud: 'Failed to delete from cloud collection.',
      textCopied: 'Text copied',
      textCopiedTitle: 'Text copied',
      textCopiedDesc: 'Text has been copied to clipboard.',
      failedToCopyText: 'Failed to copy text to clipboard.',
      playbackError: 'Playback Error',
      audioPlayerNotAvailable: 'Audio player is not available.',
      couldNotPlayAudio: 'Could not play the audio. Please try again.',
      unexpectedPlaybackError: 'An unexpected error occurred while trying to play the audio.',
      failedToGenerateSpeech: 'Failed to generate speech. Please try again.',
      audioGenerated: 'Audio generated successfully. Used {0} points.'
    },
    home: {
      ttsPromo: {
        title: 'Try Our Advanced Text to Speech Tool',
        description: 'Convert your text into qnatural-sounding speech with multiple voices, languages, and customization options',
        button: 'Try Text to Speech'
      },
      useCases: {
        title: 'Text to Speech Use Cases',
        subtitle: 'Discover how our voice technology can transform your projects across different domains',
        cases: {
          content: {
            title: 'Content Creation',
            badge: 'Media',
            description: 'Create engaging podcasts, videos, and audiobooks with natural-sounding narration'
          },
          accessibility: {
            title: 'Accessibility',
            badge: 'Inclusive',
            description: 'Make your content accessible to everyone, including those with visual impairments or reading difficulties'
          },
          education: {
            title: 'Education',
            badge: 'Learning',
            description: 'Enhance learning materials with audio narration for improved comprehension and retention'
          },
          business: {
            title: 'Business',
            badge: 'Enterprise',
            description: 'Create professional IVR systems, presentations, and training materials with consistent voice branding'
          }
        }
      },
      popularVoices: {
        title: 'Popular Voice Models',
        subtitle: 'Explore our collection of high-quality voice models across multiple languages and styles',
        voices: {
          emma: {
            name: 'Emma',
            type: 'British Female',
            description: 'Clear and professional voice with natural intonation'
          },
          yunxi: {
            name: 'Yunxi',
            type: 'Chinese Male',
            description: 'Warm and engaging voice with excellent pronunciation'
          },
          tebukuro: {
            name: 'Tebukuro',
            type: 'Japanese Female',
            description: 'Soft and melodic voice with natural Japanese accent'
          },
          siwis: {
            name: 'Siwis',
            type: 'French Female',
            description: 'Elegant and articulate voice with authentic French accent'
          }
        }
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Transform your text into natural-sounding speech in just a few simple steps',
        steps: {
          step1: {
            title: 'Enter Your Text',
            description: 'Type or paste the text you want to convert to speech'
          },
          step2: {
            title: 'Choose a Voice',
            description: 'Select from our diverse collection of natural-sounding voices'
          },
          step3: {
            title: 'Generate & Download',
            description: 'Generate your audio and download it for use in your projects'
          }
        }
      }
    },
    voice: {
      // English - British Male
      bm_lewis: 'Lewis (British Male)',
      bm_daniel: 'Daniel (British Male)',
      bm_george: 'George (British Male)',
      // English - British Female
      bf_emma: 'Emma (British Female)',
      bf_alice: 'Alice (British Female)',
      bf_lily: 'Lily (British Female)',
      // French - Female
      ff_siwis: 'Siwis (French Female)'
    },
    features: {
      title: 'Why Choose VoiceWave',
      subtitle: 'Advanced features to create the perfect voice for your content',
      naturalVoices: {
        title: 'Natural Sounding Voices',
        description: 'Our AI models generate human-like speech with natural intonation, emphasis, and emotions'
      },
      multiLanguage: {
        title: 'Multiple Languages',
        description: 'Support for English, Chinese, Japanese, Korean and more languages with native-sounding accents'
      },
      speedControl: {
        title: 'Adjustable Speed',
        description: 'Fine-tune the speech rate from 0.1x to 5x to match your exact needs'
      },
      highQuality: {
        title: 'Studio Quality Audio',
        description: 'Crystal clear audio output suitable for professional projects'
      }
    },
    pricing: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that works for you',

      free: {
        title: 'Free',
        price: '$0',
        description: 'For occasional use',
        features: '3 voice models\n1,000 characters per day\nStandard quality audio\nBasic speed control',
        cta: 'Get Started'
      },
      basic: {
        title: 'Basic',
        price: '$5',
        description: 'For regular users',
        features: '10 voice models\n30,000 characters per month\nHigh quality audio\nStandard speed control\nEmail support',
        cta: 'Get Basic'
      },
      pro: {
        title: 'Pro',
        price: '$12',
        description: 'For content creators',
        features: '20+ voice models\n100,000 characters per month\nHD quality audio\nAdvanced speed control\nPriority generation',
        cta: 'Upgrade to Pro'
      },
      enterprise: {
        title: 'Enterprise',
        price: 'Custom',
        description: 'For businesses',
        features: 'Unlimited voice models\nUnlimited characters\nStudio quality audio\nCustom voice creation\nAPI access\nDedicated support',
        cta: 'Contact Sales'
      },
      saveWithYearly: 'Save 20% with yearly billing',
      selected: 'Selected',
      recommended: 'Recommended'
    },
    payment: {
      success: {
        title: 'Payment Successful',
        subtitle: 'Thank you for your purchase',
        processing: 'Processing your payment...',
        plan: 'Plan',
        amount: 'Amount',
        date: 'Date',
        account: 'Account',
        receiptInfo: 'A receipt has been sent to your email address.',
        thankYou: 'Thank you for your purchase! Your account has been credited.',
        enjoyService: 'You can now enjoy our premium voice generation service.',
        dashboard: 'Go to Dashboard',
        home: 'Return to Home'
      },
      canceled: {
        title: 'Payment Canceled',
        subtitle: 'Your payment process was not completed.',
        reason: 'Reason for cancellation:',
        noCharges: 'No charges have been made to your payment method. You can try again or contact our support team if you need assistance.',
        tryAgain: 'Try Again',
        home: 'Return to Home'
      }
    },
    cta: {
      title: 'Ready to transform your text?',
      subtitle: 'Start creating natural voiceovers today.',
      button: 'Get Started for Free',
    },
    footer: {
      description: 'VoiceWave provides high-quality text-to-speech conversion for content creators, developers, and businesses.',
      product: 'Product',
      voices: 'Voices',
      pricing: 'Pricing',
      api: 'API',
      company: 'Company',
      about: 'About',
      blog: 'Blog',
      support: 'Support',
      legal: 'Legal',
      terms: 'Terms',
      privacy: 'Privacy',
      cookies: 'Cookies',
      allRightsReserved: 'All rights reserved.'
    },
    voices: {
      allLanguages: 'All',
      english: 'English',
      chinese: 'Chinese',
      japanese: 'Japanese',
      french: 'French',
      allGenders: 'All',
      male: 'Male',
      female: 'Female',
      pageTitle: 'Voice Models',
      pageDescription: 'Listen to our natural-sounding voice models in different languages and accents',
      premium: 'Premium',
      demoAvailable: 'Demo available',
      unlockPremium: 'Unlock Premium',
      playSample: 'Play Sample',
      playing: 'Playing...'
    }
  },
  zh: {
    common: {
      loading: '加载中...',
      signInRequired: '需要登录',
      error: '错误',
      success: '成功'
    },
    nav: {
      home: '首页',
      pricing: '价格',
      voices: '声音模型',
      login: '登录',
      tts: '文本转语音',
      dashboard: '控制台'
    },
    dashboard: {
      title: '仪表板',
      subtitle: '欢迎来到您的仪表板',
      welcome: '欢迎来到您的个人仪表板',
      loading: '加载中...',
      accountBalance: '账户余额',
      points: '点数',
      maxBalance: '最大余额',
      totalSpent: '总消费',
      lastPurchase: '最近购买',
      voicesGenerated: '生成的语音',
      lastGenerated: '最近生成',
      accountAge: '已使用时间',
      days: '天',
      memberSince: '注册时间',
      voiceHistory: '语音历史',
      orderHistory: '订单历史',
      accountInfo: '账户信息',
      recentVoices: '最近生成的语音',
      recentVoicesDesc: '您最近生成的语音',
      noVoices: '还没有生成语音',
      generateVoice: '生成语音',
      generateMore: '生成更多',
      play: '播放',
      pause: '暂停',
      download: '下载',
      delete: '删除',
      deleteConfirmTitle: '删除语音记录',
      deleteConfirmDesc: '您确定要删除这条语音记录吗？此操作无法撤销。',
      cancel: '取消',
      deleteSuccess: '删除成功',
      deleteSuccessDesc: '语音记录已被删除。',
      deleteError: '删除错误',
      deleteErrorDesc: '删除语音记录失败，请重试。',
      purchaseHistory: '购买历史',
      purchaseHistoryDesc: '您最近的购买',

      noOrders: '还没有购买记录',
      viewPlans: '查看套餐',
      buyMore: '购买更多',
      profileInformation: '个人信息',
      profileInformationDesc: '您的账户详情',
      name: '姓名',
      email: '电子邮箱',
      currentBalance: '当前余额',
      refreshData: '刷新用户信息',
      playbackError: '播放错误',
      playbackErrorDesc: '无法播放音频文件',
      downloadStarted: '开始下载',
      dataLoadFailed: '数据加载失败',
      dataLoadFailedDesc: '无法加载用户数据，请稍后再试',
      dataUpdated: '数据已更新',
      noName: '无姓名',
      noEmail: '无邮箱',
      paymentName: '付款人',
      paymentEmail: '付款邮箱',
      amount: '金额',
      orderDate: '订单日期',
      downloadStartedDesc: '您的音频文件正在下载中',
      charactersUsed: '已使用字符',
      charactersUsedDesc: '本月已使用字符',
      audioGenerated: '生成的音频',
      audioGeneratedDesc: '生成的音频文件总数',
      savedVoices: '保存的语音',
      noTextAvailable: '无可用文本',
      customVoice: '自定义语音',
      currentPlan: '当前套餐',
      renewsOn: '续费日期',
      recentConversions: '最近转换',
      recentConversionsDesc: '您最近的文本转语音转换',
      speechSample: '语音示例',
      hoursAgo: '小时前',
      yesterday: '昨天',
      daysAgo: '天前',
      localLibrary: '本地库',
      cloudCollection: '云端收藏',
      noCloudAudios: '云端没有保存的音频',
      generateToSaveCloud: '生成并保存音频以添加到您的云端收藏'
    },
    auth: {
      welcomeBack: '欢迎回来',
      loginToContinue: '登录以继续使用 VoiceWave',
      continueWithGithub: '使用 GitHub 账号登录',
      continueWithGoogle: '使用 Google 账号登录',

      or: '或',
      emailPlaceholder: '输入您的邮箱',
      emailLoginComingSoon: '邮箱登录即将推出',
      noAccount: '没有账号？',
      createAccount: '创建账号',
      byLogging: '登录即表示您同意我们的',
      terms: '服务条款',
      and: '和',
      privacy: '隐私政策',
      loginFailed: '登录失败',
      tryAgain: '请稍后再试',
      registerFailed: '注册失败',
      registerToContinue: '注册以开始使用 VoiceWave',
      emailRegisterComingSoon: '邮箱注册即将推出',
      alreadyHaveAccount: '已有账号？',
      login: '登录',
      byRegistering: '注册即表示您同意我们的',
      signup: '注册',
      dashboard: '控制台'
    },
    userMenu: {
      dashboard: '控制台',
      billing: '账单',
      settings: '设置',
      signOut: '退出登录'
    },
    hero: {
      title: '将文本转换为自然语音',
      subtitle: '将您的文本转换为具有自然语调和情感的逼真人声',
      tryNow: '免费试用',
      learnMore: '了解更多'
    },
    tts: {
      title: '文本转语音',
      pageTitle: '高级文本转语音转换',
      pageDescription: '使用我们的AI驱动的语音生成技术将您的文本转换为自然的语音',
      generateTab: '生成音频',
      libraryTab: '我的库',
      inputPlaceholder: '在此处输入或粘贴您的文本...',
      selectVoice: '选择声音',
      speed: '语速',
      generate: '生成',
      play: '播放',
      pause: '暂停',
      download: '下载',
      copy: '复制链接',
      clear: '清除',
      save: '保存到库',
      load: '加载',
      noSavedAudios: '还没有保存的音频',
      generateToSave: '生成一些音频并保存到您的库中',
      localLibrary: '本地库',
      cloudCollection: '云端收藏',
      noCloudAudios: '云端没有保存的音频',
      generateToSaveCloud: '生成并保存音频以添加到您的云端收藏',
      generated: '已生成的音频',
      signInPrompt: '登录以访问更多声音和功能',
      charactersCount: '字符数: {count}',
      deleteConfirmTitle: '删除录音',
      confirmDelete: '确定要删除这个录音吗？',
      cancel: '取消',
      delete: '删除',
      saveLocationTitle: '保存位置',
      saveLocationDescription: '您想将录音保存到哪里？',
      saveToLocal: '保存到本地库',
      saveToCloud: '保存到云端集合',
      saveToBoth: '同时保存到两处',
      // Toast消息
      error: '错误',
      success: '成功',
      noAudioToDownload: '没有可下载的音频。',
      downloadStarted: '开始下载',
      downloadStartedDesc: '您的音频文件正在下载。',
      noAudioToSave: '没有可保存的音频。',
      loginRequired: '您必须登录才能保存音频。',
      mustBeLoggedInToSave: '您必须登录才能保存音频。',
      authRequired: '需要认证',
      mustBeLoggedIn: '您必须登录才能生成音频。',
      insufficientBalance: '余额不足',
      balanceNeeded: '此操作需要 {0} 点数，但您只有 {1} 点数。',
      emptyTextError: '请输入要生成语音的文本。',
      audioSavedLocally: '音频已本地保存',
      audioSavedLocallyDesc: '您的音频已保存到本地库。',
      audioSavedToCloud: '音频已保存到云端',
      audioSavedToCloudDesc: '您的音频已保存到云端集合。',
      failedToSaveCloud: '保存到云端集合失败。',
      audioDeleted: '音频已删除',
      audioDeletedTitle: '音频已删除',
      audioDeletedFromCloud: '音频已从云端集合中移除。',
      audioDeletedFromLocal: '音频已从本地库中移除。',
      failedToDeleteCloud: '从云端集合删除失败。',
      textCopied: '文本已复制',
      textCopiedTitle: '文本已复制',
      textCopiedDesc: '文本已复制到剪贴板。',
      failedToCopyText: '复制文本到剪贴板失败。',
      playbackError: '播放错误',
      audioPlayerNotAvailable: '音频播放器不可用。',
      couldNotPlayAudio: '无法播放音频。请重试。',
      unexpectedPlaybackError: '播放音频时发生意外错误。',
      failedToGenerateSpeech: '生成语音失败。请重试。',
      audioGenerated: '音频生成成功。使用了 {0} 点数。'
    },
    home: {
      ttsPromo: {
        title: '尝试我们的高级文本转语音工具',
        description: '使用多种声音、语言和自定义选项将您的文本转换为自然的语音',
        button: '尝试文本转语音'
      },
      useCases: {
        title: '文本转语音应用场景',
        subtitle: '探索我们的语音技术如何在不同领域改变您的项目',
        cases: {
          content: {
            title: '内容创作',
            badge: '媒体',
            description: '创建引人入胜的播客、视频和有声读物'
          },
          accessibility: {
            title: '无障碍访问',
            badge: '包容性',
            description: '让您的内容对所有人都可访问，包括视力障碍或阅读困难的人群'
          },
          education: {
            title: '教育',
            badge: '学习',
            description: '通过音频讲解增强学习材料，提高理解力和记忆力'
          },
          business: {
            title: '商业应用',
            badge: '企业',
            description: '创建专业的IVR系统、演示文稿和培训材料，保持一致的语音品牌'
          }
        }
      },
      popularVoices: {
        title: '热门语音模型',
        subtitle: '探索我们多种语言和风格的高质量语音模型收藏',
        voices: {
          emma: {
            name: '艾玛',
            type: '英式女声',
            description: '清晰专业的声音，具有自然的语调'
          },
          yunxi: {
            name: '云溪',
            type: '中文男声',
            description: '温暖引人的声音，发音准确'
          },
          tebukuro: {
            name: '手袋',
            type: '日语女声',
            description: '柔和旋律的声音，具有自然的日语口音'
          },
          siwis: {
            name: '西维斯',
            type: '法语女声',
            description: '优雅清晰的声音，具有真实的法语口音'
          }
        }
      },
      howItWorks: {
        title: '如何使用',
        subtitle: '只需几个简单步骤，就能将文本转换为自然的语音',
        steps: {
          step1: {
            title: '输入文本',
            description: '输入或粘贴您想要转换成语音的文本'
          },
          step2: {
            title: '选择语音',
            description: '从我们多样化的自然语音收藏中选择'
          },
          step3: {
            title: '生成和下载',
            description: '生成您的音频并下载以用于您的项目'
          }
        }
      }
    },
    voice: {
      // English - British Male
      bm_lewis: '刘易斯（英式男声）',
      bm_daniel: '丹尼尔（英式男声）',
      bm_george: '乔治（英式男声）',
      // English - British Female
      bf_emma: '艾玛（英式女声）',
      bf_alice: '爱丽丝（英式女声）',
      bf_lily: '莉莉（英式女声）',
      ff_siwis: '西维斯（法语女声）'
    },
    features: {
      title: '为什么选择 VoiceWave',
      subtitle: '先进功能，为您的内容创造完美声音',
      naturalVoices: {
        title: '自然声音',
        description: '我们的AI模型生成具有自然语调、重音和情感的人声'
      },
      multiLanguage: {
        title: '多语言支持',
        description: '支持英语、中文、日语、韩语等多种语言，带有本地口音'
      },
      speedControl: {
        title: '可调节速度',
        description: '将语速从0.1倍到5倍精细调整，以满足您的确切需求'
      },
      highQuality: {
        title: '录音棚品质',
        description: '适用于专业项目的清晰音频输出'
      }
    },
    pricing: {
      title: '简单透明的价格',
      subtitle: '选择适合您的计划',
      recommended: '推荐',
      selected: '选择',
      free: {
        title: '免费',
        price: '¥0',
        description: '适合偶尔使用',
        features: '3种声音模型\n每天1,000字符\n标准音质\n基本速度控制',
        cta: '开始使用'
      },
      basic: {
        title: '基础版',
        price: '¥35',
        description: '适合经常使用',
        features: '10种声音模型\n30,000字符每月\n高品质音频\n标准速度控制\n电子邮件支持',
        cta: '获取基础版'
      },
      pro: {
        title: '专业版',
        price: '¥78',
        description: '适合内容创作者',
        features: '20+种声音模型\n100,000字符每月\nHD品质音频\n高级速度控制\n优先生成',
        cta: '升级到专业版'
      },
      enterprise: {
        title: '企业版',
        price: '定制',
        description: '适合企业',
        features: '无限声音模型\n无限字符\n录音棚品质\n自定义声音创建\nAPI访问\n专属支持',
        cta: '联系销售'
      },
      saveWithYearly: '年付可节省20%'
    },
    payment: {
      success: {
        title: '支付成功！',
        subtitle: '感谢您的购买。您的订阅现已激活。',
        processing: '正在处理您的支付...',
        plan: '套餐',
        amount: '金额',
        date: '日期',
        account: '账户',
        receiptInfo: '收据已发送至您的邮箱。如有任何问题或需要帮助，请联系我们的支持团队。',
        thankYou: '感谢您的购买！您的账户已经充值成功。',
        enjoyService: '您现在可以使用我们的高级语音生成服务了。',
        dashboard: '前往控制台',
        home: '返回首页'
      },
      canceled: {
        title: '支付已取消',
        subtitle: '您的支付流程未完成。',
        reason: '取消原因：',
        noCharges: '您的支付方式未被收取任何费用。您可以重试或联系我们的支持团队获取帮助。',
        tryAgain: '重新尝试',
        home: '返回首页'
      }
    },
    cta: {
      title: '准备好转换您的文本了吗？',
      subtitle: '立即开始创建自然旁白。',
      button: '免费开始',
    },
    footer: {
      description: 'VoiceWave为内容创作者、开发人员和企业提供高质量的文本到语音转换。',
      product: '产品',
      voices: '声音模型',
      pricing: '价格',
      api: 'API',
      company: '公司',
      about: '关于我们',
      blog: '博客',
      support: '支持',
      legal: '法律',
      terms: '条款',
      privacy: '隐私',
      cookies: 'Cookie',
      allRightsReserved: '保留所有权利。'
    },
    voices: {
      allLanguages: '全部',
      english: '英语',
      chinese: '中文',
      japanese: '日语',
      french: '法语',
      allGenders: '全部',
      male: '男声',
      female: '女声',
      pageTitle: '声音模型',
      pageDescription: '聆听我们不同语言和口音的自然声音模型',
      premium: '高级版',
      demoAvailable: '可试听',
      unlockPremium: '解锁高级版',
      playSample: '播放示例',
      playing: '播放中...'
    }
  },
  ja: {
    common: {
      loading: '読み込み中...',
      signInRequired: 'ログインが必要です',
      error: 'エラー',
      success: '成功'
    },
    nav: {
      home: 'ホーム',
      pricing: '料金',
      voices: '音声モデル',
      login: 'ログイン',
      tts: 'テキスト読み上げ',
      dashboard: 'ダッシュボード'
    },
    dashboard: {
      title: 'ダッシュボード',
      subtitle: 'ダッシュボードへようこそ',
      welcome: '個人ダッシュボードへようこそ',
      loading: '読み込み中...',
      accountBalance: 'アカウント残高',
      points: 'ポイント',
      maxBalance: '最大残高',
      totalSpent: '合計支出',
      lastPurchase: '最終購入',
      voicesGenerated: '生成された音声',
      lastGenerated: '最終生成',
      accountAge: '利用期間',
      days: '日',
      memberSince: '登録日',
      voiceHistory: '音声履歴',
      orderHistory: '注文履歴',
      accountInfo: 'アカウント情報',
      recentVoices: '最近の音声',
      recentVoicesDesc: '最近生成された音声',
      noVoices: 'まだ音声が生成されていません',
      generateVoice: '音声を生成',
      generateMore: 'さらに生成',
      play: '再生',
      pause: '一時停止',
      download: 'ダウンロード',
      delete: '削除',
      deleteConfirmTitle: '音声記録を削除',
      deleteConfirmDesc: 'この音声記録を削除してもよろしいですか？この操作は元に戻せません。',
      cancel: 'キャンセル',
      deleteSuccess: '削除成功',
      deleteSuccessDesc: '音声記録が削除されました。',
      deleteError: '削除エラー',
      deleteErrorDesc: '音声記録の削除に失敗しました。もう一度お試しください。',
      purchaseHistory: '購入履歴',
      purchaseHistoryDesc: '最近の購入',

      noOrders: 'まだ購入がありません',
      viewPlans: 'プランを表示',
      buyMore: '購入する',
      profileInformation: 'プロフィール情報',
      profileInformationDesc: 'アカウントの詳細',
      name: '名前',
      email: 'メールアドレス',
      currentBalance: '現在の残高',
      refreshData: 'ユーザー情報を更新',
      playbackError: '再生エラー',
      playbackErrorDesc: '音声ファイルを再生できませんでした',
      downloadStarted: 'ダウンロード開始',
      dataLoadFailed: 'データ読み込み失敗',
      dataLoadFailedDesc: 'ユーザーデータを読み込めませんでした。後で再試行してください',
      dataUpdated: 'データが更新されました',
      noName: '名前なし',
      noEmail: 'メールなし',
      paymentName: '支払い者',
      paymentEmail: '支払いメール',
      amount: '金額',
      orderDate: '注文日',
      downloadStartedDesc: '音声ファイルをダウンロード中です',
      charactersUsed: '使用文字数',
      charactersUsedDesc: '今月の使用文字数',
      audioGenerated: '生成された音声',
      audioGeneratedDesc: '生成された音声ファイルの合計',
      savedVoices: '保存された音声',
      noTextAvailable: 'テキストがありません',
      customVoice: 'カスタム音声',
      currentPlan: '現在のプラン',
      renewsOn: '更新日',
      recentConversions: '最近の変換',
      recentConversionsDesc: '最近のテキストから音声への変換',
      speechSample: '音声サンプル',
      hoursAgo: '時間前',
      yesterday: '昨日',
      daysAgo: '日前',
      localLibrary: 'ローカルライブラリ',
      cloudCollection: 'クラウドコレクション',
      noCloudAudios: 'クラウドに保存されたオーディオはありません',
      generateToSaveCloud: 'オーディオを生成して保存し、クラウドコレクションに追加してください'
    },
    auth: {
      welcomeBack: 'おかえりなさい',
      loginToContinue: 'VoiceWaveを続けるにはサインインしてください',
      continueWithGithub: 'GitHubで続ける',
      continueWithGoogle: 'Googleで続ける',
      or: 'または',
      emailPlaceholder: 'メールアドレスを入力',
      emailLoginComingSoon: 'メールログインは近日公開予定',
      noAccount: 'アカウントをお持ちでないですか？',
      createAccount: 'アカウントを作成',
      byLogging: 'ログインすることで、当社の',
      terms: '利用規約',
      and: 'および',
      privacy: 'プライバシーポリシー',
      loginFailed: 'ログインに失敗しました',
      tryAgain: '後でもう一度お試しください',
      registerFailed: '登録に失敗しました',
      registerToContinue: 'VoiceWaveを使い始めるにはサインアップしてください',
      emailRegisterComingSoon: 'メール登録は近日公開予定',
      alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
      login: 'ログイン',
      byRegistering: '登録することで、当社の',
      signup: '登録',
      dashboard: 'ダッシュボード'
    },
    userMenu: {
      dashboard: 'ダッシュボード',
      billing: '請求',
      settings: '設定',
      signOut: 'ログアウト'
    },
    hero: {
      title: 'テキストを自然な音声に変換',
      subtitle: 'テキストを自然な抑揚と感情を持つリアルな人間の声に変換します',
      tryNow: '無料でお試し',
      learnMore: '詳細を見る'
    },
    tts: {
      title: 'テキスト読み上げ',
      pageTitle: '高度なテキスト読み上げ変換',
      pageDescription: '当社のAI駆動の音声生成技術を使用して、テキストを自然な音声に変換します',
      generateTab: '音声を生成',
      libraryTab: 'マイライブラリ',
      inputPlaceholder: 'ここにテキストを入力または貼り付け...',
      selectVoice: '音声を選択',
      speed: '速度',
      generate: '生成',
      play: '再生',
      pause: '一時停止',
      download: 'ダウンロード',
      copy: 'リンクをコピー',
      clear: 'クリア',
      save: 'ライブラリに保存',
      load: '読み込み',
      noSavedAudios: '保存されたオーディオはありません',
      generateToSave: 'オーディオを生成してライブラリに保存してください',
      localLibrary: 'ローカルライブラリ',
      cloudCollection: 'クラウドコレクション',
      noCloudAudios: 'クラウドに保存されたオーディオはありません',
      generateToSaveCloud: 'オーディオを生成して保存し、クラウドコレクションに追加してください',
      generated: '生成された音声',
      signInPrompt: 'サインインしてより多くの音声と機能にアクセス',
      charactersCount: '文字数: {count}',
      deleteConfirmTitle: '録音を削除',
      confirmDelete: 'この録音を削除してもよろしいですか？',
      cancel: 'キャンセル',
      delete: '削除',
      saveLocationTitle: '保存場所',
      saveLocationDescription: 'この録音をどこに保存しますか？',
      saveToLocal: 'ローカルライブラリに保存',
      saveToCloud: 'クラウドコレクションに保存',
      saveToBoth: '両方に保存',
      // Toastメッセージ
      error: 'エラー',
      success: '成功',
      noAudioToDownload: 'ダウンロード可能な音声がありません。',
      downloadStarted: 'ダウンロード開始',
      downloadStartedDesc: '音声ファイルをダウンロードしています。',
      noAudioToSave: '保存可能な音声がありません。',
      loginRequired: '音声を保存するにはログインが必要です。',
      mustBeLoggedInToSave: '音声を保存するにはログインが必要です。',
      authRequired: '認証が必要です',
      mustBeLoggedIn: '音声を生成するにはログインが必要です。',
      insufficientBalance: '残高不足',
      balanceNeeded: 'この操作には {0} ポイントが必要ですが、あなたは {1} ポイントしか持っていません。',
      emptyTextError: '音声を生成するテキストを入力してください。',
      audioSavedLocally: '音声がローカルに保存されました',
      audioSavedLocallyDesc: '音声がローカルライブラリに保存されました。',
      audioSavedToCloud: '音声がクラウドに保存されました',
      audioSavedToCloudDesc: '音声がクラウドコレクションに保存されました。',
      failedToSaveCloud: 'クラウドコレクションへの保存に失敗しました。',
      audioDeleted: '音声が削除されました',
      audioDeletedTitle: '音声が削除されました',
      audioDeletedFromCloud: '音声がクラウドコレクションから削除されました。',
      audioDeletedFromLocal: '音声がローカルライブラリから削除されました。',
      failedToDeleteCloud: 'クラウドコレクションからの削除に失敗しました。',
      textCopied: 'テキストがコピーされました',
      textCopiedTitle: 'テキストがコピーされました',
      textCopiedDesc: 'テキストがクリップボードにコピーされました。',
      failedToCopyText: 'テキストのコピーに失敗しました。',
      playbackError: '再生エラー',
      audioPlayerNotAvailable: '音声プレーヤーが利用できません。',
      couldNotPlayAudio: '音声を再生できませんでした。もう一度お試しください。',
      unexpectedPlaybackError: '音声の再生中に予期しないエラーが発生しました。',
      failedToGenerateSpeech: '音声の生成に失敗しました。もう一度お試しください。',
      audioGenerated: '音声が正常に生成されました。{0} ポイントを使用しました。'
    },
    home: {
      ttsPromo: {
        title: '高度なテキスト読み上げツールを試す',
        description: '複数の音声、言語、カスタマイズオプションを使用してテキストを自然な音声に変換',
        button: 'テキスト読み上げを試す'
      },
      useCases: {
        title: 'テキスト読み上げの活用例',
        subtitle: '当社の音声技術がさまざまな分野でプロジェクトをどのように変革できるかを発見してください',
        cases: {
          content: {
            title: 'コンテンツ制作',
            badge: 'メディア',
            description: '自然なナレーションで魅力的なポッドキャスト、ビデオ、オーディオブックを作成'
          },
          accessibility: {
            title: 'アクセシビリティ',
            badge: '包括的',
            description: '視覚障害や読書困難のある方を含め、すべての人がコンテンツにアクセスできるようにする'
          },
          education: {
            title: '教育',
            badge: '学習',
            description: '音声ナレーションで学習教材を強化し、理解力と記憶力を向上'
          },
          business: {
            title: 'ビジネス',
            badge: '企業',
            description: '一貫した音声ブランディングで専門的なIVRシステム、プレゼンテーション、トレーニング教材を作成'
          }
        }
      },
      popularVoices: {
        title: '人気の音声モデル',
        subtitle: '複数の言語とスタイルにわたる高品質な音声モデルコレクションを探索',
        voices: {
          emma: {
            name: 'エマ',
            type: 'イギリス女性',
            description: '自然なイントネーションを持つクリアでプロフェッショナルな音声'
          },
          yunxi: {
            name: 'ユンシー',
            type: '中国男性',
            description: '優れた発音を持つ温かみのある魅力的な音声'
          },
          tebukuro: {
            name: '手袋',
            type: '日本女性',
            description: '自然な日本語のアクセントを持つ柔らかく旋律的な音声'
          },
          siwis: {
            name: 'シヴィス',
            type: 'フランス女性',
            description: '本物のフランス語アクセントを持つ優雅で明瞭な音声'
          }
        }
      },
      howItWorks: {
        title: '使い方',
        subtitle: '簡単なステップでテキストを自然な音声に変換',
        steps: {
          step1: {
            title: 'テキストを入力',
            description: '音声に変換したいテキストを入力または貼り付け'
          },
          step2: {
            title: '音声を選択',
            description: '多様な自然な音声コレクションから選択'
          },
          step3: {
            title: '生成とダウンロード',
            description: '音声を生成し、プロジェクトで使用するためにダウンロード'
          }
        }
      }
    },
    voice: {
      // English - British Male
      bm_lewis: 'ルイス（イギリス男性）',
      bm_daniel: 'ダニエル（イギリス男性）',
      bm_george: 'ジョージ（イギリス男性）',
      // English - British Female
      bf_emma: 'エマ（イギリス女性）',
      bf_alice: 'アリス（イギリス女性）',
      bf_lily: 'リリー（イギリス女性）',
      // French - Female
      ff_siwis: 'シウィス（フランス女性）'
    },
    features: {
      title: 'VoiceWaveを選ぶ理由',
      subtitle: 'コンテンツに最適な音声を作成するための高度な機能',
      naturalVoices: {
        title: '自然な音声',
        description: '私たちのAIモデルは、自然な抑揚、強調、感情を持つ人間のような音声を生成します'
      },
      multiLanguage: {
        title: '複数言語対応',
        description: '英語、中国語、日本語、韓国語など、ネイティブのアクセントを持つ多言語をサポート'
      },
      speedControl: {
        title: '調整可能な速度',
        description: '正確なニーズに合わせて、0.1倍から5倍までの話速を微調整'
      },
      highQuality: {
        title: 'スタジオ品質の音声',
        description: 'プロフェッショナルなプロジェクトに適した、クリアな音声出力'
      }
    },
    pricing: {
      title: 'シンプルで透明な料金',
      subtitle: 'あなたに合ったプランを選択',

      free: {
        title: '無料',
        price: '¥0',
        description: '時々の利用に',
        features: '3つの音声モデル\n1日1,000文字\n標準品質オーディオ\n基本的な速度調整',
        cta: '始める'
      },
      basic: {
        title: 'ベーシック',
        price: '¥650',
        description: '定期的な利用に',
        features: '10の音声モデル\n月30,000文字\n高品質オーディオ\n標準速度調整\nメールサポート',
        cta: 'ベーシックを取得'
      },
      pro: {
        title: 'プロ',
        price: '¥1,500',
        description: 'コンテンツ制作者向け',
        features: '20+の音声モデル\n月10万文字\nHD品質オーディオ\n高度な速度調整\n優先生成',
        cta: 'プロにアップグレード'
      },
      enterprise: {
        title: 'エンタープライズ',
        price: 'カスタム',
        description: 'ビジネス向け',
        features: '無制限の音声モデル\n無制限の文字数\nスタジオ品質の音声\nカスタム音声作成\nAPIアクセス\n専任サポート',
        cta: '営業に問い合わせ'
      },
      saveWithYearly: '年額で20%お得',
      selected: '選択済み',
      recommended: 'おすすめ'
    },
    payment: {
      success: {
        title: 'お支払いが完了しました',
        subtitle: 'ご購入ありがとうございます',
        processing: 'お支払いを処理しています...',
        plan: 'プラン',
        amount: '金額',
        date: '日付',
        account: 'アカウント',
        receiptInfo: '領収書がメールアドレスに送信されました。',
        thankYou: 'ご購入ありがとうございます！お客様のアカウントに充幣されました。',
        enjoyService: 'これで当社のプレミアム音声生成サービスをお楽しみいただけます。',
        dashboard: 'ダッシュボードに移動',
        home: 'ホームに戻る'
      },
      canceled: {
        title: '支払いキャンセル',
        subtitle: '支払い処理が完了しませんでした。',
        reason: 'キャンセルの理由：',
        noCharges: '支払い方法に請求は発生していません。もう一度お試しいただくか、サポートチームにお問い合わせください。',
        tryAgain: '再試行',
        home: 'ホームに戻る'
      }
    },
    cta: {
      title: 'テキストを変換する準備はできましたか？',
      subtitle: '今日から自然なナレーションを作成しましょう。',
      button: '無料で始める',
    },
    footer: {
      description: 'VoiceWaveはコンテンツ制作者、開発者、企業向けに高品質のテキスト読み上げ変換を提供します。',
      product: '製品',
      voices: '音声モデル',
      pricing: '料金',
      api: 'API',
      company: '会社',
      about: '会社概要',
      blog: 'ブログ',
      support: 'サポート',
      legal: '法的情報',
      terms: '利用規約',
      privacy: 'プライバシー',
      cookies: 'Cookie',
      allRightsReserved: 'All rights reserved.'
    },
    voices: {
      allLanguages: 'すべて',
      english: '英語',
      chinese: '中国語',
      japanese: '日本語',
      french: 'フランス語',
      allGenders: 'すべて',
      male: '男性',
      female: '女性',
      pageTitle: '音声モデル',
      pageDescription: '様々な言語やアクセントの自然な音声モデルをお聴きください',
      premium: 'プレミアム',
      demoAvailable: 'デモ利用可能',
      unlockPremium: 'プレミアムを解除',
      playSample: 'サンプル再生',
      playing: '再生中...'
    }
  },
  ko: {
    common: {
      loading: '로딩 중...',
      signInRequired: '로그인이 필요합니다',
      error: '오류',
      success: '성공'
    },
    nav: {
      home: '홈',
      pricing: '가격',
      voices: '음성 모델',
      login: '로그인',
      tts: '텍스트 음성 변환',
      dashboard: '대시보드'
    },
    dashboard: {
      title: '대시보드',
      subtitle: '대시보드에 오신 것을 환영합니다',
      welcome: '개인 대시보드에 오신 것을 환영합니다',
      loading: '로딩 중...',
      accountBalance: '계정 잔액',
      points: '포인트',
      maxBalance: '최대 잔액',
      totalSpent: '총 지출',
      lastPurchase: '최근 구매',
      voicesGenerated: '생성된 음성',
      lastGenerated: '최근 생성',
      accountAge: '사용 기간',
      days: '일',
      memberSince: '가입일',
      voiceHistory: '음성 기록',
      orderHistory: '주문 기록',
      accountInfo: '계정 정보',
      recentVoices: '최근 음성',
      recentVoicesDesc: '최근에 생성된 음성',
      noVoices: '아직 생성된 음성이 없습니다',
      generateVoice: '음성 생성',
      generateMore: '더 생성하기',
      play: '재생',
      pause: '일시중지',
      download: '다운로드',
      delete: '삭제',
      deleteConfirmTitle: '음성 기록 삭제',
      deleteConfirmDesc: '이 음성 기록을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
      cancel: '취소',
      deleteSuccess: '삭제 완료',
      deleteSuccessDesc: '음성 기록이 삭제되었습니다.',
      deleteError: '삭제 오류',
      deleteErrorDesc: '음성 기록 삭제에 실패했습니다. 다시 시도해 주세요.',
      purchaseHistory: '구매 내역',
      purchaseHistoryDesc: '최근 구매 내역',

      noOrders: '아직 구매 내역이 없습니다',
      viewPlans: '플랜 보기',
      buyMore: '더 구매하기',
      profileInformation: '프로필 정보',
      profileInformationDesc: '계정 상세 정보',
      name: '이름',
      email: '이메일',
      currentBalance: '현재 잔액',
      refreshData: '사용자 정보 새로고침',
      playbackError: '재생 오류',
      playbackErrorDesc: '오디오 파일을 재생할 수 없습니다',
      downloadStarted: '다운로드 시작',
      dataLoadFailed: '데이터 로드 실패',
      dataLoadFailedDesc: '사용자 데이터를 로드할 수 없습니다. 나중에 다시 시도해주세요',
      dataUpdated: '데이터가 업데이트되었습니다',
      noName: '이름 없음',
      noEmail: '이메일 없음',
      paymentName: '결제자',
      paymentEmail: '결제 이메일',
      amount: '금액',
      orderDate: '주문 날짜',
      downloadStartedDesc: '오디오 파일이 다운로드 중입니다',
      charactersUsed: '사용된 문자',
      charactersUsedDesc: '이번 달에 사용된 문자',
      audioGenerated: '생성된 오디오',
      audioGeneratedDesc: '생성된 총 오디오 파일',
      savedVoices: '저장된 음성',
      noTextAvailable: '사용 가능한 텍스트 없음',
      customVoice: '커스텀 음성',
      currentPlan: '현재 플랜',
      renewsOn: '갱신 날짜',
      recentConversions: '최근 변환',
      recentConversionsDesc: '최근 텍스트-투-스피치 변환',
      speechSample: '음성 샘플',
      hoursAgo: '시간 전',
      yesterday: '어제',
      daysAgo: '일 전',
      localLibrary: '로컬 라이브러리',
      cloudCollection: '클라우드 컬렉션',
      noCloudAudios: '클라우드에 저장된 오디오가 없습니다',
      generateToSaveCloud: '오디오를 생성하고 저장하여 클라우드 컬렉션에 추가하세요'
    },
    auth: {
      welcomeBack: '환영합니다',
      loginToContinue: 'VoiceWave를 계속하려면 로그인하세요',
      continueWithGithub: 'GitHub로 계속하기',
      continueWithGoogle: 'Google로 계속하기',
      or: '또는',
      emailPlaceholder: '이메일 주소 입력',
      emailLoginComingSoon: '이메일 로그인 곧 출시 예정',
      noAccount: '계정이 없으신가요?',
      createAccount: '계정 만들기',
      byLogging: '로그인함으로써 귀하는 당사의',
      terms: '서비스 약관',
      and: '및',
      privacy: '개인정보 보호정책',
      loginFailed: '로그인 실패',
      tryAgain: '나중에 다시 시도해주세요',
      registerFailed: '등록 실패',
      registerToContinue: 'VoiceWave를 시작하려면 가입하세요',
      emailRegisterComingSoon: '이메일 등록 곧 출시 예정',
      alreadyHaveAccount: '이미 계정이 있으신가요?',
      login: '로그인',
      byRegistering: '가입함으로써 귀하는 당사의',
      signup: '가입하기',
      dashboard: '대시보드'
    },
    userMenu: {
      dashboard: '대시보드',
      billing: '결제',
      settings: '설정',
      signOut: '로그아웃'
    },
    hero: {
      title: '텍스트를 자연스러운 음성으로 변환',
      subtitle: '자연스러운 억양과 감정을 가진 실제 사람과 같은 음성으로 텍스트를 변환하세요',
      tryNow: '무료로 시작하기',
      learnMore: '더 알아보기'
    },
    tts: {
      title: '텍스트 음성 변환',
      pageTitle: '고급 텍스트 음성 변환',
      pageDescription: 'AI 기반 음성 생성 기술로 텍스트를 자연스러운 음성으로 변환합니다',
      generateTab: '오디오 생성',
      libraryTab: '내 라이브러리',
      inputPlaceholder: '여기에 텍스트를 입력하거나 붙여넣기...',
      selectVoice: '음성 선택',
      speed: '속도',
      generate: '생성',
      play: '재생',
      pause: '일시정지',
      download: '다운로드',
      copy: '링크 복사',
      clear: '지우기',
      save: '라이브러리에 저장',
      load: '불러오기',
      noSavedAudios: '저장된 오디오가 없습니다',
      generateToSave: '오디오를 생성하여 라이브러리에 저장하세요',
      localLibrary: '로컬 라이브러리',
      cloudCollection: '클라우드 컬렉션',
      noCloudAudios: '클라우드에 저장된 오디오가 없습니다',
      generateToSaveCloud: '오디오를 생성하고 저장하여 클라우드 컬렉션에 추가하세요',
      generated: '생성된 오디오',
      signInPrompt: '더 많은 음성과 기능에 액세스하려면 로그인하세요',
      charactersCount: '글자 수: {count}',
      deleteConfirmTitle: '녹음 삭제',
      confirmDelete: '이 녹음을 삭제하시겠습니까?',
      cancel: '취소',
      delete: '삭제',
      saveLocationTitle: '저장 위치',
      saveLocationDescription: '이 녹음을 어디에 저장하시겠습니까?',
      saveToLocal: '로컬 라이브러리에 저장',
      saveToCloud: '클라우드 콜렉션에 저장',
      saveToBoth: '둘 다에 저장',
      // Toast 메시지
      error: '오류',
      success: '성공',
      noAudioToDownload: '다운로드할 오디오가 없습니다.',
      downloadStarted: '다운로드 시작',
      downloadStartedDesc: '오디오 파일이 다운로드되고 있습니다.',
      noAudioToSave: '저장할 오디오가 없습니다.',
      loginRequired: '오디오를 저장하려면 로그인해야 합니다.',
      mustBeLoggedInToSave: '오디오를 저장하려면 로그인해야 합니다.',
      authRequired: '인증 필요',
      mustBeLoggedIn: '오디오를 생성하려면 로그인해야 합니다.',
      insufficientBalance: '잔액 부족',
      balanceNeeded: '이 작업에는 {0} 포인트가 필요하지만, 귀하는 {1} 포인트만 보유하고 있습니다.',
      emptyTextError: '음성을 생성할 텍스트를 입력해 주세요.',
      audioSavedLocally: '오디오가 로컬에 저장되었습니다',
      audioSavedLocallyDesc: '오디오가 로컬 라이브러리에 저장되었습니다.',
      audioSavedToCloud: '오디오가 클라우드에 저장되었습니다',
      audioSavedToCloudDesc: '오디오가 클라우드 콜렉션에 저장되었습니다.',
      failedToSaveCloud: '클라우드 콜렉션에 저장하지 못했습니다.',
      audioDeleted: '오디오가 삭제되었습니다',
      audioDeletedTitle: '오디오가 삭제되었습니다',
      audioDeletedFromCloud: '오디오가 클라우드 콜렉션에서 삭제되었습니다.',
      audioDeletedFromLocal: '오디오가 로컬 라이브러리에서 삭제되었습니다.',
      failedToDeleteCloud: '클라우드 콜렉션에서 삭제하지 못했습니다.',
      textCopied: '텍스트가 복사되었습니다',
      textCopiedTitle: '텍스트가 복사되었습니다',
      textCopiedDesc: '텍스트가 클립보드에 복사되었습니다.',
      failedToCopyText: '텍스트를 클립보드에 복사하지 못했습니다.',
      playbackError: '재생 오류',
      audioPlayerNotAvailable: '오디오 플레이어를 사용할 수 없습니다.',
      couldNotPlayAudio: '오디오를 재생할 수 없습니다. 다시 시도해 주세요.',
      unexpectedPlaybackError: '오디오 재생 중 예기치 않은 오류가 발생했습니다.',
      failedToGenerateSpeech: '음성 생성에 실패했습니다. 다시 시도해 주세요.',
      audioGenerated: '오디오가 성공적으로 생성되었습니다. {0} 포인트를 사용했습니다.'
    },
    home: {
      ttsPromo: {
        title: '고급 텍스트 음성 변환 도구를 사용해보세요',
        description: '다양한 음성, 언어 및 사용자 정의 옵션으로 텍스트를 자연스러운 음성으로 변환',
        button: '텍스트 음성 변환 시도'
      },
      useCases: {
        title: '텍스트 음성 변환 활용 사례',
        subtitle: '당사의 음성 기술이 다양한 분야에서 프로젝트를 어떻게 변화시킬 수 있는지 알아보세요',
        cases: {
          content: {
            title: '콘텐츠 제작',
            badge: '미디어',
            description: '자연스러운 내레이션으로 매력적인 팟캐스트, 비디오 및 오디오북 제작'
          },
          accessibility: {
            title: '접근성',
            badge: '포용적',
            description: '시각 장애나 읽기 어려움이 있는 사람들을 포함한 모든 사람이 콘텐츠에 접근할 수 있도록 지원'
          },
          education: {
            title: '교육',
            badge: '학습',
            description: '오디오 내레이션으로 학습 자료를 향상시켜 이해력과 기억력 개선'
          },
          business: {
            title: '비즈니스',
            badge: '기업',
            description: '일관된 음성 브랜딩으로 전문적인 IVR 시스템, 프레젠테이션 및 교육 자료 제작'
          }
        }
      },
      popularVoices: {
        title: '인기 있는 음성 모델',
        subtitle: '다양한 언어와 스타일의 고품질 음성 모델 컨텐츠를 탐색해보세요',
        voices: {
          emma: {
            name: '에마',
            type: '영국 여성',
            description: '자연스러운 억양을 가진 선명하고 전문적인 목소리'
          },
          yunxi: {
            name: '윤시',
            type: '중국 남성',
            description: '우수한 발음을 가진 따뜻하고 매력적인 목소리'
          },
          tebukuro: {
            name: '테부쿠로',
            type: '일본 여성',
            description: '자연스러운 일본어 악센트를 가진 부드럽고 선률적인 목소리'
          },
          siwis: {
            name: '시위스',
            type: '프랑스 여성',
            description: '진정한 프랑스어 악센트를 가진 우아하고 명확한 목소리'
          }
        }
      },
      howItWorks: {
        title: '사용 방법',
        subtitle: '단 몇 가지 간단한 단계로 텍스트를 자연스러운 음성으로 변환하세요',
        steps: {
          step1: {
            title: '텍스트 입력',
            description: '음성으로 변환하고 싶은 텍스트를 입력하거나 붙여넣기'
          },
          step2: {
            title: '음성 선택',
            description: '다양한 자연스러운 음성 컨텐츠에서 선택'
          },
          step3: {
            title: '생성 및 다운로드',
            description: '오디오를 생성하고 프로젝트에서 사용하기 위해 다운로드'
          }
        }
      }
    },
    voice: {
      // English - British Male
      bm_lewis: '루이스 (영국 남성)',
      bm_daniel: '다니엘 (영국 남성)',
      bm_george: '조지 (영국 남성)',
      // English - British Female
      bf_emma: '엠마 (영국 여성)',
      bf_alice: '앨리스 (영국 여성)',
      bf_lily: '릴리 (영국 여성)',

      // French - Female
      ff_siwis: '시위스 (프랑스 여성)'
    },
    features: {
      title: 'VoiceWave를 선택하는 이유',
      subtitle: '콘텐츠를 위한 완벽한 음성을 만들기 위한 고급 기능',
      naturalVoices: {
        title: '자연스러운 음성',
        description: '우리의 AI 모델은 자연스러운 억양, 강조, 감정을 가진 사람과 같은 음성을 생성합니다'
      },
      multiLanguage: {
        title: '다국어 지원',
        description: '영어, 중국어, 일본어, 한국어 등 원어민 발음의 다양한 언어 지원'
      },
      speedControl: {
        title: '조절 가능한 속도',
        description: '정확한 요구에 맞게 0.1배에서 5배까지 음성 속도를 미세 조정'
      },
      highQuality: {
        title: '스튜디오 품질 오디오',
        description: '전문 프로젝트에 적합한 선명한 오디오 출력'
      }
    },
    pricing: {
      title: '간단하고 투명한 가격',
      subtitle: '당신에게 맞는 플랜을 선택하세요',

      free: {
        title: '무료',
        price: '₩0',
        description: '가끔 사용하는 경우',
        features: '3개 음성 모델\n하루 1,000자\n표준 품질 오디오\n기본 속도 제어',
        cta: '시작하기'
      },
      basic: {
        title: '베이직',
        price: '₩6500',
        description: '정기적인 사용자용',
        features: '10개 음성 모델\n월 30,000자\n고품질 오디오\n표준 속도 제어\n이메일 지원',
        cta: '베이직 시작하기'
      },
      pro: {
        title: '프로',
        price: '₩15,000',
        description: '콘텐츠 제작자용',
        features: '20+ 음성 모델\n월 100,000자\nHD 품질 오디오\n고급 속도 제어\n우선 생성',
        cta: '프로로 업그레이드'
      },
      enterprise: {
        title: '엔터프라이즈',
        price: '맞춤형',
        description: '비즈니스용',
        features: '무제한 음성 모델\n무제한 글자 수\n스튜디오 품질 오디오\n맞춤 음성 제작\nAPI 액세스\n전담 지원',
        cta: '영업팀 문의'
      },
      saveWithYearly: '연간 결제로 20% 절약',
      selected: '선택됨',
      recommended: '추천'
    },
    payment: {
      success: {
        title: '결제 성공',
        subtitle: '구매해 주셔서 감사합니다',
        processing: '결제를 처리하고 있습니다...',
        plan: '플랜',
        amount: '금액',
        date: '날짜',
        account: '계정',
        receiptInfo: '영수증이 이메일 주소로 전송되었습니다.',
        thankYou: '구매해 주셔서 감사합니다! 고객님의 계정에 충전되었습니다.',
        enjoyService: '이제 당사의 프리미엄 음성 생성 서비스를 즐기실 수 있습니다.',
        dashboard: '대시보드로 이동',
        home: '홈으로 돌아가기'
      },
      canceled: {
        title: '결제 취소됨',
        subtitle: '결제 프로세스가 완료되지 않았습니다.',
        reason: '취소 이유:',
        noCharges: '결제 수단에 요금이 청구되지 않았습니다. 다시 시도하거나 도움이 필요하시면 지원 팀에 문의하세요.',
        tryAgain: '다시 시도',
        home: '홈으로 돌아가기'
      }
    },
    cta: {
      title: '텍스트를 변환할 준비가 되셨나요?',
      subtitle: '오늘부터 자연스러운 음성 내레이션을 만들어보세요.',
      button: '무료로 시작하기',
    },
    footer: {
      description: 'VoiceWave는 콘텐츠 제작자, 개발자, 기업을 위한 고품질 텍스트 음성 변환 서비스를 제공합니다.',
      product: '제품',
      voices: '음성 모델',
      pricing: '가격',
      api: 'API',
      company: '회사',
      about: '회사 소개',
      blog: '블로그',
      support: '지원',
      legal: '법적 정보',
      terms: '이용약관',
      privacy: '개인정보 처리방침',
      cookies: '쿠키',
      allRightsReserved: '모든 권리 보유.'
    },
    voices: {
      allLanguages: '전체',
      english: '영어',
      chinese: '중국어',
      japanese: '일본어',
      french: '프랑스어',
      allGenders: '전체',
      male: '남성',
      female: '여성',
      pageTitle: '음성 모델',
      pageDescription: '다양한 언어와 억양으로 자연스러운 음성 모델을 들어보세요',
      premium: '프리미엄',
      demoAvailable: '데모 가능',
      unlockPremium: '프리미엄 잠금 해제',
      playSample: '샘플 재생',
      playing: '재생 중...'
    }
  }
};