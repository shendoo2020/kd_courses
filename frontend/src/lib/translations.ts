export type Language = "en" | "ar";

export interface Translations {
  nav: {
    catalog: string;
    customCourses: string;
    events: string;
    teach: string;
    stories: string;
    about: string;
    myLearning: string;
    profile: string;
    instructorPortal: string;
    signIn: string;
    joinFree: string;
    logout: string;
    darkMode: string;
    lightMode: string;
  };
  catalog: {
    heroBadge: string;
    heroTitlePart1: string;
    heroTitlePart2: string;
    heroDesc: string;
    searchPlaceholder: string;
    clear: string;
    targetAudience: string;
    allTiers: string;
    k12: string;
    higherEd: string;
    professional: string;
    allDelivery: string;
    selfPaced: string;
    cohortBased: string;
    hybrid: string;
    inPerson: string;
    allPrices: string;
    freeOnly: string;
    paidOnly: string;
    featuredCurriculum: string;
    coursesAvailable: string;
    viewSyllabus: string;
    free: string;
    weeks: string;
    hrsPerWeek: string;
    noCoursesFound: string;
    resetFilters: string;
    requestCustom: string;
  };
  courseDetails: {
    instructor: string;
    duration: string;
    schedule: string;
    free: string;
    lifetimeAccess: string;
    startNow: string;
    continueLearning: string;
    reviewCourse: string;
    enrollPaid: string;
    enrollFree: string;
    orderPrintedPack: string;
    packageBreakdown: string;
    whatsIncluded: string;
    whatsNotIncluded: string;
    prerequisites: string;
    gradingCriteria: string;
    syllabusOverview: string;
    curriculumModules: string;
    studentFeedback: string;
    leaveReview: string;
    rating: string;
    submitReview: string;
    facultyInstructor: string;
    printedBookletTitle: string;
    printedBookletDesc: string;
    orderPrintButton: string;
    doorstepFulfillment: string;
    orderPrintMaterials: string;
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    confirmOrder: string;
    orderQueued: string;
  };
  customCourses: {
    badge: string;
    title: string;
    desc: string;
    step1Title: string;
    fullName: string;
    email: string;
    phone: string;
    organization: string;
    step2Title: string;
    step3Title: string;
    topic: string;
    studentCount: string;
    timeframe: string;
    deliveryFormat: string;
    requirements: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    summary: string;
    submitAnother: string;
    benefitsTitle: string;
  };
  events: {
    badge: string;
    title: string;
    desc: string;
    requestPrivate: string;
    audience: string;
    format: string;
    allFormats: string;
    reserveSeat: string;
    soldOut: string;
    seatsLeft: string;
    virtual: string;
    inPerson: string;
    modalTitle: string;
    modalDesc: string;
    confirmRsvp: string;
    rsvpSuccess: string;
  };
  teach: {
    badge: string;
    title: string;
    desc: string;
    revShare: string;
    revShareDesc: string;
    pedagogy: string;
    pedagogyDesc: string;
    credibility: string;
    credibilityDesc: string;
    step1: string;
    step2: string;
    step3: string;
    degree: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    courseTitle: string;
    courseSummary: string;
    sampleVideo: string;
    submitApp: string;
    successTitle: string;
    successDesc: string;
  };
  about: {
    badge: string;
    title: string;
    desc: string;
    facultyBoard: string;
    facultyBoardDesc: string;
    partnerTitle: string;
    partnerDesc: string;
  };
  stories: {
    badge: string;
    title: string;
    desc: string;
    shareExperience: string;
    verifiedCerts: string;
    verifyBadge: string;
    modalTitle: string;
    roleCompany: string;
    yourStory: string;
    postReview: string;
  };
  footer: {
    brandDesc: string;
    rights: string;
    curriculumPortals: string;
    contactSupport: string;
    followUs: string;
    communityText: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      catalog: "Catalog",
      customCourses: "Custom Cohorts",
      events: "Seminars",
      teach: "Teach",
      stories: "Stories",
      about: "About Us",
      myLearning: "My Learning",
      profile: "Profile & Settings",
      instructorPortal: "Instructor Portal",
      signIn: "Sign in",
      joinFree: "Join for Free",
      logout: "Log Out",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
    },
    catalog: {
      heroBadge: "Coursera & DeepLearning.AI Standard Academic Platform",
      heroTitlePart1: "Rigorous Courses for",
      heroTitlePart2: "Schools, Universities & Industry",
      heroDesc: "Multi-level technical curricula engineered with interactive coding checkpoints, live faculty keynotes, and door-to-door printed study guide fulfillment.",
      searchPlaceholder: "Search by topic, algorithm, or course title...",
      clear: "Clear",
      targetAudience: "Target Academic Group",
      allTiers: "All Pathways",
      k12: "Schools (K-12)",
      higherEd: "Universities / Colleges",
      professional: "Professional & Enterprise",
      allDelivery: "All Delivery Formats",
      selfPaced: "Self-Paced Portal",
      cohortBased: "Live Cohort",
      hybrid: "Hybrid (Blended)",
      inPerson: "In-Person Workshop",
      allPrices: "All Prices",
      freeOnly: "Free Only",
      paidOnly: "Paid",
      featuredCurriculum: "Featured Curriculum",
      coursesAvailable: "courses available",
      viewSyllabus: "Syllabus & Details",
      free: "Free",
      weeks: "Weeks",
      hrsPerWeek: "hrs/wk",
      noCoursesFound: "No matching curriculum found",
      resetFilters: "Reset Filters",
      requestCustom: "Request Custom Course",
    },
    courseDetails: {
      instructor: "Instructor",
      duration: "Duration",
      schedule: "Schedule",
      free: "Free",
      lifetimeAccess: "Full Lifetime Access",
      startNow: "Start Now →",
      continueLearning: "Continue Learning →",
      reviewCourse: "Review Course →",
      enrollPaid: "Enroll with Stripe Checkout",
      enrollFree: "Enroll for Free",
      orderPrintedPack: "Order Printed Study Pack ($19.99 Home Delivery)",
      packageBreakdown: "Course Package & Transparency Breakdown",
      whatsIncluded: "What's Included",
      whatsNotIncluded: "What's NOT Included",
      prerequisites: "Technical Prerequisites",
      gradingCriteria: "Grading & Certification Criteria",
      syllabusOverview: "Syllabus & Curriculum Overview",
      curriculumModules: "Curriculum Modules",
      studentFeedback: "Student Feedback & Reviews",
      leaveReview: "Enrolled in this course? Leave a review",
      rating: "Rating",
      submitReview: "Submit Review",
      facultyInstructor: "Faculty Instructor",
      printedBookletTitle: "Physical Study Guides Delivered",
      printedBookletDesc: "Prefer studying with physical pages? Order high-quality spiral-bound lecture summaries and cheat sheets delivered to your home.",
      orderPrintButton: "Order Printed Materials",
      doorstepFulfillment: "Door-to-Door Fulfillment",
      orderPrintMaterials: "Order Course Print Materials",
      recipientName: "Recipient Name",
      phone: "Phone Number",
      address: "Street Address",
      city: "City",
      state: "State / Province",
      postalCode: "Postal Code",
      confirmOrder: "Confirm Delivery Order",
      orderQueued: "Order Queued for Printing!",
    },
    customCourses: {
      badge: "Institutional & Enterprise On-Demand Training",
      title: "Design a Tailored Curriculum for Your Cohort",
      desc: "Whether you represent a K-12 STEM program, university department, or corporate engineering team, our curriculum architects and domain experts will engineer a dedicated learning pathway.",
      step1Title: "Organization & Point of Contact",
      fullName: "Full Name",
      email: "Work / Academic Email",
      phone: "Phone Number (with Country Code)",
      organization: "Institution / Organization Name",
      step2Title: "Target Learning Group",
      step3Title: "Curriculum Specifications",
      topic: "Desired Topic / Course Title",
      studentCount: "Estimated Learner Count",
      timeframe: "Target Timeframe / Start Window",
      deliveryFormat: "Preferred Delivery Format",
      requirements: "Custom Requirements, Prerequisites or Learning Goals",
      submitBtn: "Submit Custom Course Request",
      submitting: "Submitting Inquiry...",
      successTitle: "Request Received & Under Academic Review",
      successDesc: "Your custom cohort training inquiry has been logged. Our Academic Director will contact you within 24–48 hours.",
      summary: "Request Summary",
      submitAnother: "Submit Another Request",
      benefitsTitle: "What You Get with KLZ Academy",
    },
    events: {
      badge: "Community & Mentor Engagement",
      title: "Academic Seminars & Keynotes",
      desc: "Connect with frontier industry leaders, university faculty, and fellow scholars through live virtual keynotes, architecture deep-dives, and career AMAs.",
      requestPrivate: "Request Private Institutional Seminar",
      audience: "Audience",
      format: "Format",
      allFormats: "All Formats",
      reserveSeat: "Reserve Complimentary Seat",
      soldOut: "Registration Closed",
      seatsLeft: "Seats Left",
      virtual: "Virtual Event (Zoom)",
      inPerson: "In-Person",
      modalTitle: "Complimentary Registration",
      modalDesc: "A direct joining link and calendar invitation will be dispatched immediately.",
      confirmRsvp: "Confirm Free Registration",
      rsvpSuccess: "Registration Confirmed!",
    },
    teach: {
      badge: "Join Our Global Academic Faculty",
      title: "Share Your Expertise with 50,000+ Ambitious Minds",
      desc: "KLZ Academy partners with university faculty, staff engineers, and industry authorities to author world-class curriculum, interactive checkpoints, and published study guides.",
      revShare: "Competitive Revenue Share",
      revShareDesc: "Earn up to 70% of course enrollments, institutional licenses, and study guide royalties.",
      pedagogy: "Pedagogical & Studio Support",
      pedagogyDesc: "Our instructional designers assist with curriculum structure, quiz authoring, and video production.",
      credibility: "Institutional Credibility",
      credibilityDesc: "Showcase your verified profile, university affiliation, and professional portfolio.",
      step1: "Credentials & Professional Affiliation",
      step2: "Verification Links & Portfolio",
      step3: "Proposed Course & Pedagogical Outline",
      degree: "Highest Academic Degree or Industry Title",
      linkedin: "LinkedIn Profile URL",
      portfolio: "GitHub / Google Scholar / Portfolio",
      resume: "Resume / CV Link (Drive / Dropbox)",
      courseTitle: "Course Working Title",
      courseSummary: "Curriculum Summary & Learning Objectives",
      sampleVideo: "Sample Teaching Video URL (Loom / YouTube)",
      submitApp: "Submit Faculty Application",
      successTitle: "Faculty Application Submitted!",
      successDesc: "Your proposal has been sent to our Academic Review Board. We will contact you within 3–5 business days.",
    },
    about: {
      badge: "Institutional Rigor Meets Industry Application",
      title: "Architecting the Future of Technical Education",
      desc: "KLZ Academy was founded to bridge the gulf between abstract academic theory and modern cloud-native engineering.",
      facultyBoard: "Academic Review Board & Faculty",
      facultyBoardDesc: "Our curricula are engineered and peer-reviewed by leaders across top research labs and universities.",
      partnerTitle: "Partner with KLZ Academy",
      partnerDesc: "Looking to join as a faculty instructor or request a custom curriculum package for your university department?",
    },
    stories: {
      badge: "Verified Graduate Outcomes",
      title: "Real Impact, Proven Careers",
      desc: "Explore how students, researchers, and engineers around the globe accelerated their mastery and secured industry credentials.",
      shareExperience: "Share Your Experience",
      verifiedCerts: "Recent Verified Graduate Credentials",
      verifyBadge: "Verified Credential",
      modalTitle: "Share Your Graduate Experience",
      roleCompany: "Your Role & Organization",
      yourStory: "Your Testimonial / Story",
      postReview: "Post Testimonial",
    },
    footer: {
      brandDesc: "Empowering ambitious learners worldwide with high-impact, industry-certified education, cutting-edge labs, and mentor-guided courses.",
      rights: "© 2026 KLZ Academy. All rights reserved.",
      curriculumPortals: "Curriculum & Portals",
      contactSupport: "Contact Support",
      followUs: "Follow Us",
      communityText: "Join our community of over 50,000 learners across our social channels.",
    },
  },
  ar: {
    nav: {
      catalog: "دليل الدورات",
      customCourses: "تدريب مخصص",
      events: "الندوات العلمية",
      teach: "درّس معنا",
      stories: "قصص النجاح",
      about: "عن الأكاديمية",
      myLearning: "مساري التعليمي",
      profile: "الملف الشخصي والإعدادات",
      instructorPortal: "بوابة المحاضرين",
      signIn: "تسجيل الدخول",
      joinFree: "انضم مجاناً",
      logout: "تسجيل الخروج",
      darkMode: "الوضع الليلي",
      lightMode: "الوضع النهاري",
    },
    catalog: {
      heroBadge: "معايير أكاديمية عالمية بمستوى كورسيرا وديب ليرنينغ",
      heroTitlePart1: "مناهج تقنية متقدمة لـ",
      heroTitlePart2: "المدارس والجامعات والقطاع المهني",
      heroDesc: "مناهج هندسية وتطبيقية متعددة المستويات مصحوبة بمختبرات برمجية تفاعلية، ومحاضرات مباشرة مع كبار المتخصصين، مع خدمة طباعة وتوصيل المذكرات الدراسية حتى باب منزلك.",
      searchPlaceholder: "ابحث بالموضوع، الخوارزمية، أو عنوان الدورة...",
      clear: "مسح",
      targetAudience: "الفئة الأكاديمية المستهدفة",
      allTiers: "كافة المسارات",
      k12: "المدارس والناشئة (K-12)",
      higherEd: "الجامعات والمعاهد",
      professional: "المهنيون والشركات",
      allDelivery: "كافة أنماط التدريس",
      selfPaced: "تعلم ذاتي عبر المنصة",
      cohortBased: "دفعات تفاعلية حية",
      hybrid: "تعليم هجين مدمج",
      inPerson: "ورش عمل حضورية",
      allPrices: "كافة الأسعار",
      freeOnly: "المجانية فقط",
      paidOnly: "المدفوعة",
      featuredCurriculum: "المناهج المميزة",
      coursesAvailable: "دورات متوفرة",
      viewSyllabus: "المنهج والتفاصيل",
      free: "مجاناً",
      weeks: "أسابيع",
      hrsPerWeek: "ساعات/أسبوع",
      noCoursesFound: "لم يتم العثور على مناهج مطابقة للبحث",
      resetFilters: "إعادة ضبط الفلاتر",
      requestCustom: "طلب منهج مخصص",
    },
    courseDetails: {
      instructor: "المحاضر",
      duration: "المدة الزمنية",
      schedule: "الجدول والمواعيد",
      free: "مجاناً",
      lifetimeAccess: "وصول غير محدود مدى الحياة",
      startNow: "ابدأ الآن ←",
      continueLearning: "متابعة التعلم ←",
      reviewCourse: "مراجعة الدورة ←",
      enrollPaid: "التسجيل عبر بوابة الدفع الآمنة",
      enrollFree: "التسجيل مجاناً",
      orderPrintedPack: "طلب باقة المذكرات المطبوعة (19.99$ توصيل منزلي)",
      packageBreakdown: "تفاصيل وبنود باقة الدورة التدريبية",
      whatsIncluded: "ما تشمله الدورة",
      whatsNotIncluded: "ما لا تشمله الدورة",
      prerequisites: "المتطلبات التقنية المسبقة",
      gradingCriteria: "معايير التقييم والشهادة الأكاديمية",
      syllabusOverview: "نظرة عامة على المنهج الدراسي",
      curriculumModules: "وحدات المنهج الدراسي",
      studentFeedback: "آراء وتقييمات الطلاب",
      leaveReview: "هل أنت مسجل في الدورة؟ اترك تقييمك",
      rating: "التقييم",
      submitReview: "إرسال التقييم",
      facultyInstructor: "المحاضر الأكاديمي",
      printedBookletTitle: "توصيل المذكرات الدراسية المطبوعة",
      printedBookletDesc: "تفضل المذاكرة الورقية؟ اطلب مذكرات المحاضرات والدلائل المرجعية مطبوعة ومجلدة لتصلك مباشرة إلى منزلك.",
      orderPrintButton: "طلب المواد المطبوعة",
      doorstepFulfillment: "شحن وتوصيل للمنزل",
      orderPrintMaterials: "طلب المطبوعات التعليمية للدورة",
      recipientName: "اسم المستلم",
      phone: "رقم الهاتف",
      address: "العنوان بالتفصيل",
      city: "المدينة",
      state: "المنطقة / المحافظة",
      postalCode: "الرمز البريدي",
      confirmOrder: "تأكيد طلب التوصيل",
      orderQueued: "تم تسجيل طلب الطباعة والشحن بنجاح!",
    },
    customCourses: {
      badge: "برامج تدريبية مخصصة للمؤسسات والجهات التعليمية",
      title: "صمم منهجاً تعليمياً مخصصاً لمجموعتك أو مؤسستك",
      desc: "سواء كنت تمثل مدرسة، قسماً جامعياً، أو فريقاً هندسياً في شركة تقنية، سيعمل خبراؤنا الأكاديميون على تصميم مسار تعليمي متخصص يفي باحتياجاتكم الدقيقة.",
      step1Title: "بيانات الجهة ومسؤول التواصل",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني المهني / الأكاديمي",
      phone: "رقم الهاتف (مع رمز الدولة)",
      organization: "اسم المؤسسة أو الجامعة أو الشركة",
      step2Title: "الفئة الأكاديمية المستهدفة",
      step3Title: "مواصفات المنهج المطلوب",
      topic: "الموضوع أو التخصص المطلوب",
      studentCount: "العدد المتوقع للمتدربين",
      timeframe: "الإطار الزمني والبدء المطلوب",
      deliveryFormat: "نمط التدريس المفضل",
      requirements: "المتطلبات الخاصة والأهداف التعليمية",
      submitBtn: "إرسال طلب الدورة المخصصة",
      submitting: "جارٍ إرسال الطلب...",
      successTitle: "تم استلام الطلب وهو قيد المراجعة الأكاديمية",
      successDesc: "تم تسجيل استفسارك بنجاح. سيتواصل معك مدير البرامج الأكاديمية خلال 24–48 ساعة لتقديم مقترح المنهج والمحاضرين المتاحين.",
      summary: "ملخص الطلب",
      submitAnother: "تقديم طلب آخر",
      benefitsTitle: "ما تقدمه أكاديمية KLZ لمؤسستك",
    },
    events: {
      badge: "اللقاءات المعرفية والإرشادية",
      title: "الندوات والمحاضرات العلمية العامة",
      desc: "تواصل مع كبار علماء الذكاء الاصطناعي وهندسة النظم وأعضاء هيئة التدريس عبر لقاءات حية تفاعلية ونقاشات مهنية معمقة.",
      requestPrivate: "طلب ندوة مؤسسية خاصة",
      audience: "الفئة المستهدفة",
      format: "النمط",
      allFormats: "كافة الأنماط",
      reserveSeat: "حجز مقعد مجاني",
      soldOut: "اكتمل العدد",
      seatsLeft: "مقاعد متبقية",
      virtual: "جلسة افتراضية (Zoom)",
      inPerson: "حضوري",
      modalTitle: "التسجيل المجاني في الندوة",
      modalDesc: "سيتم إرسال رابط الجلسة المباشر ودعوة التقويم فور تأكيد الحجز.",
      confirmRsvp: "تأكيد التسجيل المجاني",
      rsvpSuccess: "تم تأكيد تسجيل مقعدك بنجاح!",
    },
    teach: {
      badge: "انضم إلى هيئتنا الأكاديمية العالمية",
      title: "شارك خبراتك مع أكثر من 50,000 طالب وطالبة",
      desc: "تتعاون أكاديمية KLZ مع أساتذة الجامعات، وكبار مهندسي البرمجيات في كبرى الشركات لإنشاء مناهج فائقة الجودة ومختبرات تفاعلية.",
      revShare: "نسبة عوائد تنافسية",
      revShareDesc: "احصل على ما يصل إلى 70% من إيرادات الدورات، والاشتراكات المؤسسية، وعوائد مذكرات المواد المطبوعة.",
      pedagogy: "دعم تعليمي وإنتاجي متكامل",
      pedagogyDesc: "يساعدك مصممو المناهج لدينا في هندسة الاختبارات ومراجعة المقاطع التفاعلية.",
      credibility: "اعتماد وواجهة مهنية موثوقة",
      credibilityDesc: "أبرز سيرتك الأكاديمية وخبراتك أمام الآلاف من الطلاب والشركات الراغبة في التوظيف.",
      step1: "البيانات الأكاديمية وجهة العمل",
      step2: "الروابط التوثيقية ومعرض الأعمال",
      step3: "مقترح المنهج وخطة التدريس",
      degree: "أعلى مؤهل أكاديمي أو مسمى وظيفي",
      linkedin: "رابط الملف على لينكد إن",
      portfolio: "رابط معرض الأعمال أو Google Scholar",
      resume: "رابط السيرة الذاتية (Google Drive / Dropbox)",
      courseTitle: "عنوان الدورة المقترحة",
      courseSummary: "ملخص المنهج والأهداف التعليمية",
      sampleVideo: "رابط فيديو تجريبي لشرحك (Loom / YouTube)",
      submitApp: "إرسال طلب الانضمام لهيئة التدريس",
      successTitle: "تم استلام طلبك بنجاح!",
      successDesc: "تم إرسال مقترحك إلى لجنة المراجعة الأكاديمية وسنتواصل معك خلال 3–5 أيام عمل.",
    },
    about: {
      badge: "تكامل العمق الأكاديمي مع التطبيق الصناعي",
      title: "نهندس مستقبل التعليم التقني العالي",
      desc: "تأسست أكاديمية KLZ لسد الفجوة بين النظريات الأكاديمية البحتة والهندسة السحابية التطبيقية في سوق العمل العالمي.",
      facultyBoard: "مجلس الإشراف وهيئة التدريس",
      facultyBoardDesc: "تُهندس وتُراجع مناهجنا بواسطة قادة البحث والتطوير من كبرى المعامل والجامعات المرموقة.",
      partnerTitle: "شراكات أكاديمية KLZ",
      partnerDesc: "هل ترغب في الانضمام كمحاضر أو طلب باقة تدريبية متخصصة لقسمك الجامعي أو فريق عملك؟",
    },
    stories: {
      badge: "مخرجات الخريجين المعتمدة",
      title: "أثر حقيقي ومسارات مهنية واعدة",
      desc: "تعرف على كيفية مساهمة مناهج الأكاديمية ومختبراتها في تسريع مسار الطلاب والمهندسين وحصولهم على شهادات معتمدة عالمياً.",
      shareExperience: "شارك تجربتك الأكاديمية",
      verifiedCerts: "أحدث الشهادات المعتمدة رقمياً",
      verifyBadge: "شهادة معتمدة موثقة",
      modalTitle: "أضف تجربتك وقصتك",
      roleCompany: "المسمى الوظيفي والجهة",
      yourStory: "تجربتك وتقييمك للأكاديمية",
      postReview: "نشر التقييم",
    },
    footer: {
      brandDesc: "تمكين المتعلمين الطموحين حول العالم عبر تعليم عالي التأثير، معتمد صناعياً، ومصحوب بمختبرات حديثة وإرشاد نخبوي.",
      rights: "© 2026 أكاديمية KLZ. جميع الحقوق محفوظة.",
      curriculumPortals: "المناهج والبوابات",
      contactSupport: "الدعم الأكاديمي والتواصل",
      followUs: "تابعنا على منصات التواصل",
      communityText: "انضم إلى مجتمعنا الذي يضم أكثر من 50,000 طالب وطالبة حول العالم.",
    },
  },
};
