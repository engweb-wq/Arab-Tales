import { AgeGroup, AgeGroupProfile, CartoonCharacter, CharacterId } from '../types/story';

export const CARTOON_CHARACTERS: Record<CharacterId, CartoonCharacter> = {
  talia: {
    id: 'talia',
    name: 'تاليا',
    tagline: 'مستكشفة الحكايات والأسئلة الذكية',
    accentColor: 'emerald',
    traits: ['فضولية ومحبّة للمعرفة', 'شجاعة في قول الحق', 'تدوّن الأفكار في دفترها الأخضر'],
    educationalRole:
      'تقود المغامرة وتطرح الأسئلة الذكية التي تساعد الأطفال على اكتشاف السبب والنتيجة واستنتاج الدرس التعليمي بأنفسهم.',
    catchphrase: '«كل حكاية تخبئ فكرة جميلة لمن يسأل ويتأمل!»',
    companionItem: 'عدسة الاستكشاف والدفتر الأخضر',
  },
  leen: {
    id: 'leen',
    name: 'لين',
    tagline: 'صاحبة القلب الرقيق واللطف والإبداع',
    accentColor: 'amber',
    traits: ['رقيقة ومتعاونة', 'تهتم بمشاعر الآخرين والحيوان', 'تحب الرسم والطبيعة'],
    educationalRole:
      'تربط أحداث القصة بالمشاعر الطيبة والرفق والتسامح، وتوضح كيف تصنع الكلمة الحلوة والعطاء فرقاً كبيراً.',
    catchphrase: '«القلب الرحيم والكلمة اللطيفة يفتحان كل الأبواب!»',
    companionItem: 'باقة الزهور وريشة الألوان',
  },
  muadh: {
    id: 'muadh',
    name: 'معاذ',
    tagline: 'حافظ القيم والبطل المنظّم',
    accentColor: 'sky',
    traits: ['صادق وأمين', 'هادئ ومنظّم في التفكير', 'يتذكر الآيات والأحاديث والخطوات العملية'],
    educationalRole:
      'يربط القصة بالآية أو الحديث الشريف، ويلخص الدرس التربوي في خطوات عملية بسيطة يسهل تطبيقها كل يوم.',
    catchphrase: '«الصدق والأمانة وإتقان العمل مفاتيح النجاح!»',
    companionItem: 'البوصلة الذهبية وكتاب القيم',
  },
};

export const CHARACTER_LIST: CartoonCharacter[] = [
  CARTOON_CHARACTERS.talia,
  CARTOON_CHARACTERS.leen,
  CARTOON_CHARACTERS.muadh,
];

export const AGE_GROUP_PROFILES: Record<AgeGroup, AgeGroupProfile> = {
  '٣–٥ سنوات': {
    id: '٣–٥ سنوات',
    label: '٣–٥ سنوات',
    stageName: 'مرحلة الطفولة المبكرة',
    languageStyle: 'جمل قصيرة جداً وإيقاعية ولطيفة تناسب سماع الطفل وتركيزه.',
    vocabularyLevel: 'مفردات يومية قريبة من عالم الطفل (الألوان، الفواكه، الحيوانات، البيت، الشكر).',
    lessonComplexity: 'قيمة واحدة واضحة ومباشرة يمكن للطفل تطبيقها فوراً بعد القصة.',
  },
  '٦–٨ سنوات': {
    id: '٦–٨ سنوات',
    label: '٦–٨ سنوات',
    stageName: 'مرحلة التأسيس والخيال',
    languageStyle: 'سرد حواري مشوّق وجمل متوسطة الطول تنمّي الطلاقة القرائية.',
    vocabularyLevel: 'مفردات واضحة مع تشبيهات ممتعة ومواقف من المدرسة والأسرة.',
    lessonComplexity: 'درسان إلى ثلاثة دروس تربوية تربط بين التصرف الصحيح ونتيجته الجميلة.',
  },
  '٩–١١ سنة': {
    id: '٩–١١ سنة',
    label: '٩–١١ سنة',
    stageName: 'مرحلة الوعي والتفكّر',
    languageStyle: 'أسلوب أدبي مترابط يحفظ جمال التعبير القرآني والتراثي.',
    vocabularyLevel: 'مفردات أثرى وتراكيب معبّرة مع شواهد من القرآن الكريم والسنة والشعر.',
    lessonComplexity: 'دروس مركّبة تنمّي التفكير الناقد، والمسؤولية، وضبط النفس، وفهم العواقب.',
  },
};
