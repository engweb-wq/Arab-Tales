export type GlossaryIllustrationKind =
  | 'scales'
  | 'heart-sun'
  | 'owl-book'
  | 'lamp-light'
  | 'seed-sprout'
  | 'handshake'
  | 'gift-coins'
  | 'tools-craft'
  | 'mountain-step'
  | 'cloud-garden'
  | 'ship-sea'
  | 'cave-light'
  | 'kaaba-star'
  | 'desert-palm'
  | 'cat-bowl'
  | 'bee-flower'
  | 'ant-grain'
  | 'turtle-shell'
  | 'clay-jar'
  | 'eraser-pencil'
  | 'clock-time'
  | 'bookshelf'
  | 'wall-shield'
  | 'water-well';

export interface GlossaryTerm {
  id: string;
  word: string;
  forms: string[];
  category: 'قيمة تربوية' | 'مفهوم لغوي' | 'مكان وطبيعة' | 'كائن وأداة';
  simpleMeaning: string;
  exampleSentence: string;
  illustration: GlossaryIllustrationKind;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'honesty',
    word: 'الأمانة',
    forms: ['الأمانة', 'أمانة', 'الأمين', 'أمانته', 'بأمانته'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'حفظ حقوق الناس وأغراضهم، وإتقان ما نُكلَّف به سواء رآنا الناس أم لم يرونا.',
    exampleSentence: 'ردَّ الطفل القلم المفقود لصاحبه، ففرحت المعلمة بأمانته.',
    illustration: 'scales',
  },
  {
    id: 'truthfulness',
    word: 'الصدق',
    forms: ['الصدق', 'صدقًا', 'صدقا', 'الصادق', 'صادق', 'صادقة'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'قول الحقيقة كما حدثت تماماً دون كذب أو تغيير للحكاية خوفاً من العقاب.',
    exampleSentence: 'الصدق ينجّي صاحبه ويجعل الجميع يثقون بكلامه.',
    illustration: 'heart-sun',
  },
  {
    id: 'wisdom',
    word: 'الحكمة',
    forms: ['الحكمة', 'حكمة', 'الحكيم', 'بديهته', 'بذكاء'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'وضع كل شيء في مكانه الصحيح، والتفكير بهدوء وسرعة فهم قبل الكلام أو التصرف.',
    exampleSentence: 'استمع الولد لنصيحة جده لأنها مليئة بالحكمة.',
    illustration: 'owl-book',
  },
  {
    id: 'humility',
    word: 'التواضع',
    forms: ['التواضع', 'متواضع', 'متواضعة', 'تواضع'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'معاملة جميع الناس بلطف واحترام، وعدم التكبّر عليهم بما نملك من علم أو مال.',
    exampleSentence: 'التواضع يرفع قدر الإنسان ويجعله محبوباً بين أصدقائه.',
    illustration: 'seed-sprout',
  },
  {
    id: 'arrogance',
    word: 'الغرور',
    forms: ['الغرور', 'المتكبر', 'يتكبر', 'مغرور', 'الجحود', 'بالبخل'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'شعور الشخص بأنه أفضل من الآخرين أو إنكاره لفضل الله، وهو خلق يبعد الأصدقاء والبركة.',
    exampleSentence: 'خسر الأرنب السباق بسبب الغرور وعدم الاستمرار.',
    illustration: 'mountain-step',
  },
  {
    id: 'cooperation',
    word: 'التعاون',
    forms: ['التعاون', 'يتعاونون', 'تعاون', 'المشاركة', 'نتعاون'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'عمل مجموعة من الأصدقاء أو الإخوة معاً بيد واحدة لإنجاز العمل بسهولة وسرعة.',
    exampleSentence: 'بالتعاون رتّب الطلاب الفصل في دقائق معدودة.',
    illustration: 'handshake',
  },
  {
    id: 'perseverance',
    word: 'المثابرة',
    forms: ['المثابرة', 'ثابر', 'الجد', 'الاجتهاد', 'مجتهد', 'متحمّس', 'المتحمس'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'الاستمرار في المحاولة والعمل بنشاط وعدم الاستسلام عند مواجهة صعوبة.',
    exampleSentence: 'بالمثابرة تعلّم معاذ القراءة بطلاقة ونجح في دراسته.',
    illustration: 'mountain-step',
  },
  {
    id: 'mastery',
    word: 'الإتقان',
    forms: ['الإتقان', 'إتقان', 'يتقن', 'أتقن', 'متقنة'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'أداء العمل بأجمل صورة وأكمل وجه دون إهمال أو استعجال.',
    exampleSentence: 'أحبّ الله من العامل إذا عمل عملاً أن يحرص على الإتقان.',
    illustration: 'tools-craft',
  },
  {
    id: 'contentment',
    word: 'القناعة',
    forms: ['القناعة', 'قانع', 'الرضا', 'بأمان', 'الجميل'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'الرضا والشعور بالسعادة بما رزقنا الله من نعم، دون طمع فيما في أيدي الآخرين.',
    exampleSentence: 'القناعة تجعل قلب الطفل مطمئناً وشاكراً لنعم الله.',
    illustration: 'heart-sun',
  },
  {
    id: 'charity',
    word: 'الصدقة',
    forms: ['الصدقة', 'يتصدق', 'الفقراء', 'المساكين', 'فقيراً', 'مسكين'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'تقديم المال أو الطعام أو المساعدة للمحتاجين حباً في الخير وطمعاً في رضا الله.',
    exampleSentence: 'الصدقة لا تنقص المال بل تزيده بركة وسعادة.',
    illustration: 'gift-coins',
  },
  {
    id: 'kindness',
    word: 'الإحسان والرفق',
    forms: ['الإحسان', 'إحسانهم', 'المعروف', 'الرفق', 'إحسان', 'بلطف', 'نرحمها', 'الوفية'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'فعل الخير ومساعدة الناس والرفق بالإنسان والحيوان بكلمة طيبة أو رعاية لطيفة.',
    exampleSentence: 'سقي العصفور العطشان وإطعام القطة الصغيرة من أجمل صور الرفق.',
    illustration: 'cat-bowl',
  },
  {
    id: 'forgiveness',
    word: 'التسامح',
    forms: ['التسامح', 'سامح', 'العفو'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'تجاوز أخطاء الأصدقاء وقبول اعتذارهم بقلب صافٍ خالٍ من الغضب.',
    exampleSentence: 'اختار الأصدقاء التسامح فعادت المودة بينهم أسرع.',
    illustration: 'handshake',
  },
  {
    id: 'anger',
    word: 'الغضب',
    forms: ['الغضب', 'غضب', 'يغضب', 'سخط'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'انفعال شديد عند الانزعاج، والطفل القوي يضبط نفسه ولا يؤذي الآخرين عنده.',
    exampleSentence: 'توضأ الطفل وهدأ عند الغضب فلم يقل كلمة مؤذية.',
    illustration: 'heart-sun',
  },
  {
    id: 'patience',
    word: 'الصبر',
    forms: ['الصبر', 'صبراً', 'صبر'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'تحمّل المواقف الصعبة والانتظار بهدوء وثقة بأن الله سيجعل بعد العسر يسراً.',
    exampleSentence: 'بالصبر استطاع موسى عليه السلام فهم أسرار الحكمة.',
    illustration: 'mountain-step',
  },
  {
    id: 'trust-in-god',
    word: 'التوكل واليقين',
    forms: ['التوكل', 'توكل', 'اليقين', 'بيقين', 'قدير'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'بذل الجهد والأخذ بالأسباب مع الإيمان القوي الراسخ بقدرة الله وحفظه.',
    exampleSentence: 'قال الرجل الصالح بيقين: أعلم أن الله على كل شيء قدير.',
    illustration: 'heart-sun',
  },
  {
    id: 'parents-honor',
    word: 'بر الوالدين',
    forms: ['بر الوالدين', 'رضا الوالدين', 'الأمهات', 'كأم'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'طاعة الأب والأم، وخدمتهما بحب، وخفض الصوت عند التحدث معهما وتقدير فضلهما.',
    exampleSentence: 'الجنة تحت أقدام الأمهات لأن برّهما باب عظيم للخير والبركة.',
    illustration: 'heart-sun',
  },
  {
    id: 'chastity',
    word: 'العفة',
    forms: ['العفة', 'عفة'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'صيانة النفس عن الخطأ وطلب الحلال الطيب فقط مع مراقبة الله.',
    exampleSentence: 'العفة جعلت الشاب يترك الحرام خوفاً من الله وحباً لرضاه.',
    illustration: 'scales',
  },
  {
    id: 'justice',
    word: 'العدل',
    forms: ['العدل', 'عادلاً', 'الميزان', 'الظالم'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'إعطاء كل ذي حق حقه والمساواة بين الناس دون ظلم لأحد.',
    exampleSentence: 'حكم القاضي بالعدل ففرح المظلوم واطمأن الناس.',
    illustration: 'scales',
  },
  {
    id: 'blessing',
    word: 'البركة',
    forms: ['البركة', 'مبارك', 'فبارك', 'بارك'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'الخير الكثير والنماء الذي يضعه الله في المال أو الوقت أو الرزق بسبب الطاعة.',
    exampleSentence: 'تحلّ البركة في البيت عندما يشكر أهله نعم الله.',
    illustration: 'cloud-garden',
  },
  {
    id: 'gratitude',
    word: 'الشكر',
    forms: ['الشكر', 'شكر', 'شكرهم', 'الشاكر', 'النعم', 'نعمة'],
    category: 'قيمة تربوية',
    simpleMeaning:
      'الاعتراف بفضل الله والثناء عليه وحسن استخدام النعم في الخير.',
    exampleSentence: 'بالشكر تدوم النعم وتزداد في حياتنا.',
    illustration: 'gift-coins',
  },
  {
    id: 'repentance',
    word: 'التوبة والبعث',
    forms: ['التوبة', 'تاب', 'الندم', 'بعثه', 'بعث', 'القيامة'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'التوبة هي الرجوع الصادق عن الخطأ، والبعث هو إحياء الله للناس بعد الموت بقدرته.',
    exampleSentence: 'فرح المؤمنون عندما قبل الله التوبة الصادقة لكعب.',
    illustration: 'seed-sprout',
  },
  {
    id: 'century-sleep',
    word: 'قرن ورقدة',
    forms: ['قرن', 'رقدتك', 'سباتهم', 'القرون'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'القرن يعني مائة عام كاملة، والرقدة والسبات يعنيان النوم العميق الطويل.',
    exampleSentence: 'نام الرجل مائة عام أي قرناً كاملاً ثم أيقظه الله بقدرته.',
    illustration: 'clock-time',
  },
  {
    id: 'ruined-village',
    word: 'قرية خاوية',
    forms: ['خاوية', 'عروشها', 'القرية', 'أصناماً'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'قرية مهدمة فارغة سقطت سقوف بيوتها على الأرض بعد أن كانت عامرة بأهلها.',
    exampleSentence: 'مرّ الرجل على القرية الفارغة وتأمل قدرة الله في إحيائها.',
    illustration: 'cave-light',
  },
  {
    id: 'cave',
    word: 'الكهف والفتية',
    forms: ['الكهف', 'كهف', 'الفتية', 'الهجرة'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'الكهف هو تجويف واسع داخل الجبل، والفتية هم الشباب المؤمنون الذين لجؤوا إليه.',
    exampleSentence: 'هاجر الفتية إلى الكهف ليحفظوا إيمانهم بعيداً عن الظلم.',
    illustration: 'cave-light',
  },
  {
    id: 'ship',
    word: 'السفينة',
    forms: ['السفينة', 'سفينة', 'خشبة'],
    category: 'كائن وأداة',
    simpleMeaning:
      'مركب كبير يبحر فوق مياه البحر أو النهر لنقل المسافرين والبضائع.',
    exampleSentence: 'أبحرت السفينة بأمان فوق أمواج البحر الهادئة.',
    illustration: 'ship-sea',
  },
  {
    id: 'dam',
    word: 'السد',
    forms: ['السد', 'ردماً', 'النحاس', 'الحديد'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'حاجز ضخم وقوي يُبنى من الحديد والنحاس لحماية الناس من الخطر.',
    exampleSentence: 'بنى ذو القرنين السد القوي لحماية القوم الضعفاء.',
    illustration: 'wall-shield',
  },
  {
    id: 'kaaba',
    word: 'الكعبة والحرم',
    forms: ['الكعبة', 'الحرم', 'أبرهة', 'الفيل'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'بيت الله الحرام في مكة المكرمة وقبلة المسلمين في صلاتهم.',
    exampleSentence: 'حمى الله الكعبة المشرفة من جيش أبرهة.',
    illustration: 'kaaba-star',
  },
  {
    id: 'orchard',
    word: 'البستان',
    forms: ['البستان', 'بستان', 'الحديقة', 'الأزهار', 'الحصاد'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'أرض خضراء واسعة مزروعة بأشجار الفواكه والثمار والأزهار الجميلة.',
    exampleSentence: 'تفتحت الأزهار في البستان بعد نزول المطر.',
    illustration: 'cloud-garden',
  },
  {
    id: 'cloud',
    word: 'السحابة',
    forms: ['السحابة', 'المطر', 'المياه'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'غيمة في السماء تحمل قطرات الماء لتسقي الأرض والحدائق والأشجار.',
    exampleSentence: 'سقت السحابة حديقة الرجل الصالح الذي يتصدق على الفقراء.',
    illustration: 'cloud-garden',
  },
  {
    id: 'zamzam',
    word: 'زمزم',
    forms: ['زمزم', 'الصفا', 'المروة'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'بئر ماء مبارك نبع في مكة لإسماعيل وأمه هاجر عليهما السلام وما زال يروي الناس.',
    exampleSentence: 'شرب الحجاج من ماء زمزم المبارك ودعوا الله بالخير.',
    illustration: 'water-well',
  },
  {
    id: 'desert',
    word: 'الصحراء',
    forms: ['الصحراء', 'الرمل', 'الصخر', 'الصخرة', 'الإبل', 'بعيراً', 'ناقة'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'أرض واسعة تغطيها الرمال الذهبية والصخور وتعيش فيها الإبل الصبورة.',
    exampleSentence: 'مشى الصديقان في الصحراء وتعلّما معنى التسامح والوفاء.',
    illustration: 'desert-palm',
  },
  {
    id: 'nectar',
    word: 'الرحيق',
    forms: ['الرحيق', 'النحلة', 'العسل', 'الخلية'],
    category: 'كائن وأداة',
    simpleMeaning:
      'عصير حلو تجمعُه النحلة من داخل الأزهار لتصنع منه العسل الشهي المفيد.',
    exampleSentence: 'تتنقل النحلة بنشاط بين الأزهار لجمع الرحيق.',
    illustration: 'bee-flower',
  },
  {
    id: 'ant',
    word: 'النملة',
    forms: ['النملة', 'سليمان', 'الوادي'],
    category: 'كائن وأداة',
    simpleMeaning:
      'حشرة صغيرة مجتهدة تعمل بتعاون ونظام وتدّخر طعامها في مساكنها.',
    exampleSentence: 'حذّرت النملة أخواتها بلطف فتبسّم نبي الله سليمان.',
    illustration: 'ant-grain',
  },
  {
    id: 'turtle',
    word: 'السلحفاة',
    forms: ['السلحفاة', 'الأرنب', 'السباق'],
    category: 'كائن وأداة',
    simpleMeaning:
      'حيوان لطيف يحمل بيتاً صلباً على ظهره ويمشي بثبات وهدوء دون تسرع.',
    exampleSentence: 'فازت السلحفاة في السباق لأنها واصلت السير بثبات.',
    illustration: 'turtle-shell',
  },
  {
    id: 'jar',
    word: 'الجرة والإناء',
    forms: ['الجرتين', 'الجرة', 'الشق', 'إناء'],
    category: 'كائن وأداة',
    simpleMeaning:
      'إناء مصنوع من الفخار أو الخزف يُستخدم لنقل وحفظ الماء أو الحليب.',
    exampleSentence: 'وضع الطفل الحليب للقطة في إناء صغير نظيف.',
    illustration: 'clay-jar',
  },
  {
    id: 'eraser',
    word: 'الممحاة والقلم',
    forms: ['الممحاة', 'القلم', 'الأخطاء', 'التعبير'],
    category: 'كائن وأداة',
    simpleMeaning:
      'أداة مدرسية تزيل آثار القلم الرصاص وتصحح الأخطاء لتبقى الصفحة نظيفة.',
    exampleSentence: 'تعمل الممحاة والقلم معاً لإخراج لوحة وكتابة متقنة.',
    illustration: 'eraser-pencil',
  },
  {
    id: 'carpenter',
    word: 'النجار',
    forms: ['النجار', 'المسامير', 'الخشب', 'البناء'],
    category: 'كائن وأداة',
    simpleMeaning:
      'الحرفي الذي يصنع الأبواب والبيوت والأثاث من الخشب باستخدام الأدوات والمسامير.',
    exampleSentence: 'يتعب النجار حين لا يتقن عمله ثم يكتشف أنه بنى بيته نفسه.',
    illustration: 'tools-craft',
  },
  {
    id: 'time',
    word: 'الوقت',
    forms: ['الوقت', 'الساعة', 'النظام'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'الساعات والدقائق التي نعيشها كل يوم، وتنظيمها يساعدنا على إنجاز القراءة واللعب.',
    exampleSentence: 'تعلّم الأصدقاء قيمة الوقت فخصصوا ساعة للعب وساعة للمطالعة.',
    illustration: 'clock-time',
  },
  {
    id: 'library',
    word: 'المكتبة والعلم',
    forms: ['المكتبة', 'الرفوف', 'المدرسة', 'العلم', 'التفوق'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'مكان هادئ مرتب يضم كتباً وقصصاً متنوعة على الرفوف لتنمية العقل والمعرفة.',
    exampleSentence: 'حفظت لين الكتب على الرفوف في المكتبة ليسهل البحث عنها.',
    illustration: 'bookshelf',
  },
  {
    id: 'mind-lamp',
    word: 'مصباح الفكر والمجد',
    forms: ['المصباح', 'للذهن', 'المجد', 'اليمن', 'حوشي'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'تشبيه جميل للعلم والمدرسة بالنور الذي يضيء العقل ويفتح أبواب الشرف والرفعة.',
    exampleSentence: 'المدرسة هي المصباح الذي ينير طريق الذهن نحو المجد.',
    illustration: 'lamp-light',
  },
  {
    id: 'treasure',
    word: 'الكنز',
    forms: ['الكنز', 'الغلام', 'الجدار', 'الجنة'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'شيء ثمين محفوظ ومخبأ بعناية ليبقى لأصحابه، وأثمن الكنوز رضا الله والجنة.',
    exampleSentence: 'أقام الخضر الجدار ليحفظ الكنز للطفلين اليتيمين.',
    illustration: 'gift-coins',
  },
  {
    id: 'colors',
    word: 'الألوان والفرشاة',
    forms: ['الألوان', 'الفرشاة', 'لوحة'],
    category: 'كائن وأداة',
    simpleMeaning:
      'درجات جميلة من الأحمر والأزرق والأصفر والأخضر نستخدمها بالفرشاة لرسم اللوحات.',
    exampleSentence: 'اجتمعت الألوان معاً فرسمت لوحة زاهية أجمل من لون واحد.',
    illustration: 'eraser-pencil',
  },
  {
    id: 'fireplace-shell',
    word: 'المدفأة والصدفة',
    forms: ['مدفأة', 'المدفأة', 'الصدفي', 'بابتسامة'],
    category: 'كائن وأداة',
    simpleMeaning:
      'المدفأة جهاز ينشر الدفء في ليالي البرد، والصدفة هي البيت الصلب الذي يحمي السلحفاة.',
    exampleSentence: 'أحضر الأب مدفأة دافئة فشعرت السلحفاة بالأمان.',
    illustration: 'lamp-light',
  },
  {
    id: 'tower-courage',
    word: 'البرج والشجاعة',
    forms: ['البرج', 'برج', 'الضفادع', 'ضفادع', 'المحبط', 'القمة'],
    category: 'مفهوم لغوي',
    simpleMeaning:
      'البرج بناء مرتفع له قمة عالية، والكلام المحبط يضعف الهمة، أما التشجيع فيقوّي الشجاعة.',
    exampleSentence: 'واصل الضفدع الصغير القفز بثقة حتى وصل إلى قمة البرج.',
    illustration: 'mountain-step',
  },
  {
    id: 'mecca-protection',
    word: 'مكة والمعتدين',
    forms: ['مكة', 'المعتدين', 'طيراً', 'أبابيل', 'سجيل'],
    category: 'مكان وطبيعة',
    simpleMeaning:
      'مكة المكرمة هي المدينة المباركة التي فيها الكعبة المشرفة، والمعتدون هم من يريدون أذى الآخرين.',
    exampleSentence: 'حمى الله مكة المكرمة وأبعد المعتدين عن بيته الحرام.',
    illustration: 'kaaba-star',
  },
];

// Build lookup structures once
const TERM_BY_FORM = new Map<string, GlossaryTerm>();
const ALL_FORMS_SORTED: string[] = [];

const DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u0640]/g;

function stripArabicDiacriticsWithMap(input: string): {
  stripped: string;
  toOrigStart: number[];
  toOrigEnd: number[];
} {
  let stripped = '';
  const toOrigStart: number[] = [];
  const toOrigEnd: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (DIACRITICS_REGEX.test(ch)) {
      // Extend the original end index of the preceding base char
      if (toOrigEnd.length > 0) {
        toOrigEnd[toOrigEnd.length - 1] = i + 1;
      }
      DIACRITICS_REGEX.lastIndex = 0;
    } else {
      stripped += ch;
      toOrigStart.push(i);
      toOrigEnd.push(i + 1);
    }
  }
  return { stripped, toOrigStart, toOrigEnd };
}

for (const term of GLOSSARY_TERMS) {
  for (const form of term.forms) {
    const cleanForm = form.replace(DIACRITICS_REGEX, '');
    if (!TERM_BY_FORM.has(cleanForm)) {
      TERM_BY_FORM.set(cleanForm, term);
      ALL_FORMS_SORTED.push(cleanForm);
    }
  }
}

ALL_FORMS_SORTED.sort((a, b) => b.length - a.length);

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MATCH_REGEX = new RegExp(
  `(${ALL_FORMS_SORTED.map(escapeRegex).join('|')})`,
  'g'
);

const ARABIC_LETTER_RE = /[\u0621-\u064A\u0671-\u06D3]/;

export interface ParagraphSegment {
  text: string;
  term?: GlossaryTerm;
}

export function tokenizeParagraphWithGlossary(
  paragraph: string
): ParagraphSegment[] {
  const { stripped, toOrigStart, toOrigEnd } =
    stripArabicDiacriticsWithMap(paragraph);

  const segments: ParagraphSegment[] = [];
  let lastOrigIndex = 0;

  MATCH_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = MATCH_REGEX.exec(stripped)) !== null) {
    const matchedClean = match[0];
    const start = match.index;
    const end = start + matchedClean.length;

    const charBefore = start > 0 ? stripped[start - 1] : '';
    const charAfter = end < stripped.length ? stripped[end] : '';

    // Allow common 1-letter Arabic prefixes (و ف ب ك ل) on the left boundary if clean word follows
    const validLeftBoundary =
      !charBefore ||
      !ARABIC_LETTER_RE.test(charBefore) ||
      ((charBefore === 'و' ||
        charBefore === 'ف' ||
        charBefore === 'ب' ||
        charBefore === 'ك' ||
        charBefore === 'ل') &&
        (start === 1 || !ARABIC_LETTER_RE.test(stripped[start - 2])));

    const validRightBoundary = !charAfter || !ARABIC_LETTER_RE.test(charAfter);

    const term = TERM_BY_FORM.get(matchedClean);

    if (term && validLeftBoundary && validRightBoundary) {
      const origStart = toOrigStart[start];
      const origEnd = toOrigEnd[end - 1];

      if (origStart > lastOrigIndex) {
        segments.push({ text: paragraph.slice(lastOrigIndex, origStart) });
      }
      segments.push({
        text: paragraph.slice(origStart, origEnd),
        term,
      });
      lastOrigIndex = origEnd;
    }
  }

  if (lastOrigIndex < paragraph.length) {
    segments.push({ text: paragraph.slice(lastOrigIndex) });
  }

  return segments.length > 0 ? segments : [{ text: paragraph }];
}

export function extractStoryGlossaryTerms(paragraphs: string[]): GlossaryTerm[] {
  const seen = new Set<string>();
  const ordered: GlossaryTerm[] = [];

  for (const para of paragraphs) {
    const segments = tokenizeParagraphWithGlossary(para);
    for (const seg of segments) {
      if (seg.term && !seen.has(seg.term.id)) {
        seen.add(seg.term.id);
        ordered.push(seg.term);
      }
    }
  }

  return ordered;
}
