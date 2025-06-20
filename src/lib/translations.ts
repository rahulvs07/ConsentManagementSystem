export interface Translation {
  // Navigation & Header
  dashboard: string;
  myConsents: string;
  dataRequests: string;
  privacySettings: string;
  grievances: string;
  profile: string;
  logout: string;
  language: string;
  
  // Dashboard
  welcome: string;
  consentOverview: string;
  activeConsents: string;
  withdrawnConsents: string;
  pendingRequests: string;
  recentActivity: string;
  quickActions: string;
  
  // Consent Management
  consentHistory: string;
  consentStatus: string;
  granted: string;
  withdrawn: string;
  expired: string;
  pending: string;
  purpose: string;
  grantedOn: string;
  expiresOn: string;
  dataFiduciary: string;
  dataCategories: string;
  
  // Actions
  view: string;
  edit: string;
  withdraw: string;
  renew: string;
  download: string;
  export: string;
  submit: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  
  // Forms
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  subject: string;
  
  // Privacy Rights
  accessData: string;
  correctData: string;
  eraseData: string;
  portData: string;
  restrictProcessing: string;
  
  // Status Messages
  success: string;
  error: string;
  warning: string;
  info: string;
  loading: string;
  
  // Common UI
  search: string;
  filter: string;
  sort: string;
  date: string;
  time: string;
  status: string;
  actions: string;
  details: string;
  
  // Consent Specific
  consentPurpose: string;
  dataProcessing: string;
  marketing: string;
  analytics: string;
  essential: string;
  functional: string;
  
  // Grievance
  grievanceForm: string;
  complaintCategory: string;
  referenceNumber: string;
  submitGrievance: string;
  grievanceStatus: string;
  
  // Grievance & Request Status - BRD Section 4.5 & 4.3.3 Compliant
  submitted: string;
  inProgress: string;
  pendingInfo: string;
  resolved: string;
  closed: string;
  escalated: string;
  fulfilled: string;
  rejected: string;
  
  // Data Requests
  requestType: string;
  requestStatus: string;
  requestDate: string;
  completionDate: string;
  
  // Messages
  noDataFound: string;
  loadingData: string;
  dataUpdated: string;
  requestSubmitted: string;
  consentWithdrawn: string;
  consentRenewed: string;
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation & Header
    dashboard: "Dashboard",
    myConsents: "My Consents",
    dataRequests: "Data Requests",
    privacySettings: "Privacy Settings",
    grievances: "Grievances",
    profile: "Profile",
    logout: "Logout",
    language: "Language",
    
    // Dashboard
    welcome: "Welcome",
    consentOverview: "Consent Overview",
    activeConsents: "Active Consents",
    withdrawnConsents: "Withdrawn Consents",
    pendingRequests: "Pending Requests",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    
    // Consent Management
    consentHistory: "Consent History",
    consentStatus: "Consent Status",
    granted: "Granted",
    withdrawn: "Withdrawn",
    expired: "Expired",
    pending: "Pending",
    purpose: "Purpose",
    grantedOn: "Granted On",
    expiresOn: "Expires On",
    dataFiduciary: "Data Fiduciary",
    dataCategories: "Data Categories",
    
    // Actions
    view: "View",
    edit: "Edit",
    withdraw: "Withdraw",
    renew: "Renew",
    download: "Download",
    export: "Export",
    submit: "Submit",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    
    // Forms
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    description: "Description",
    category: "Category",
    subject: "Subject",
    
    // Privacy Rights
    accessData: "Access My Data",
    correctData: "Correct My Data",
    eraseData: "Erase My Data",
    portData: "Port My Data",
    restrictProcessing: "Restrict Processing",
    
    // Status Messages
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    loading: "Loading",
    
    // Common UI
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    date: "Date",
    time: "Time",
    status: "Status",
    actions: "Actions",
    details: "Details",
    
    // Consent Specific
    consentPurpose: "Consent Purpose",
    dataProcessing: "Data Processing",
    marketing: "Marketing",
    analytics: "Analytics",
    essential: "Essential",
    functional: "Functional",
    
    // Grievance
    grievanceForm: "Grievance Form",
    complaintCategory: "Complaint Category",
    referenceNumber: "Reference Number",
    submitGrievance: "Submit Grievance",
    grievanceStatus: "Grievance Status",
    
    // Grievance & Request Status - BRD Section 4.5 & 4.3.3 Compliant
    submitted: "Submitted",
    inProgress: "In Progress",
    pendingInfo: "Pending Info",
    resolved: "Resolved",
    closed: "Closed",
    escalated: "Escalated",
    fulfilled: "Fulfilled",
    rejected: "Rejected",
    
    // Data Requests
    requestType: "Request Type",
    requestStatus: "Request Status",
    requestDate: "Request Date",
    completionDate: "Completion Date",
    
    // Messages
    noDataFound: "No data found",
    loadingData: "Loading data...",
    dataUpdated: "Data updated successfully",
    requestSubmitted: "Request submitted successfully",
    consentWithdrawn: "Consent withdrawn successfully",
    consentRenewed: "Consent renewed successfully"
  },
  
  hi: {
    // Navigation & Header
    dashboard: "डैशबोर्ड",
    myConsents: "मेरी सहमति",
    dataRequests: "डेटा अनुरोध",
    privacySettings: "गोपनीयता सेटिंग्स",
    grievances: "शिकायतें",
    profile: "प्रोफ़ाइल",
    logout: "लॉगआउट",
    language: "भाषा",
    
    // Dashboard
    welcome: "स्वागत",
    consentOverview: "सहमति अवलोकन",
    activeConsents: "सक्रिय सहमति",
    withdrawnConsents: "वापस ली गई सहमति",
    pendingRequests: "लंबित अनुरोध",
    recentActivity: "हाल की गतिविधि",
    quickActions: "त्वरित कार्य",
    
    // Consent Management
    consentHistory: "सहमति इतिहास",
    consentStatus: "सहमति स्थिति",
    granted: "प्रदान की गई",
    withdrawn: "वापस ली गई",
    expired: "समाप्त",
    pending: "लंबित",
    purpose: "उद्देश्य",
    grantedOn: "प्रदान किया गया",
    expiresOn: "समाप्त होता है",
    dataFiduciary: "डेटा न्यासी",
    dataCategories: "डेटा श्रेणियां",
    
    // Actions
    view: "देखें",
    edit: "संपादित करें",
    withdraw: "वापस लें",
    renew: "नवीनीकृत करें",
    download: "डाउनलोड",
    export: "निर्यात",
    submit: "जमा करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    save: "सहेजें",
    delete: "हटाएं",
    
    // Forms
    name: "नाम",
    email: "ईमेल",
    phone: "फोन",
    address: "पता",
    description: "विवरण",
    category: "श्रेणी",
    subject: "विषय",
    
    // Privacy Rights
    accessData: "मेरा डेटा एक्सेस करें",
    correctData: "मेरा डेटा सही करें",
    eraseData: "मेरा डेटा मिटाएं",
    portData: "मेरा डेटा पोर्ट करें",
    restrictProcessing: "प्रसंस्करण प्रतिबंधित करें",
    
    // Status Messages
    success: "सफलता",
    error: "त्रुटि",
    warning: "चेतावनी",
    info: "जानकारी",
    loading: "लोड हो रहा है",
    
    // Common UI
    search: "खोजें",
    filter: "फिल्टर",
    sort: "क्रमबद्ध करें",
    date: "दिनांक",
    time: "समय",
    status: "स्थिति",
    actions: "कार्य",
    details: "विवरण",
    
    // Consent Specific
    consentPurpose: "सहमति उद्देश्य",
    dataProcessing: "डेटा प्रसंस्करण",
    marketing: "मार्केटिंग",
    analytics: "विश्लेषिकी",
    essential: "आवश्यक",
    functional: "कार्यात्मक",
    
    // Grievance
    grievanceForm: "शिकायत फॉर्म",
    complaintCategory: "शिकायत श्रेणी",
    referenceNumber: "संदर्भ संख्या",
    submitGrievance: "शिकायत जमा करें",
    grievanceStatus: "शिकायत स्थिति",
    
    // Grievance & Request Status - BRD Section 4.5 & 4.3.3 Compliant
    submitted: "Submitted",
    inProgress: "In Progress",
    pendingInfo: "Pending Info",
    resolved: "Resolved",
    closed: "Closed",
    escalated: "Escalated",
    fulfilled: "Fulfilled",
    rejected: "Rejected",
    
    // Data Requests
    requestType: "अनुरोध प्रकार",
    requestStatus: "अनुरोध स्थिति",
    requestDate: "अनुरोध दिनांक",
    completionDate: "पूर्ण होने की तारीख",
    
    // Messages
    noDataFound: "कोई डेटा नहीं मिला",
    loadingData: "डेटा लोड हो रहा है...",
    dataUpdated: "डेटा सफलतापूर्वक अपडेट किया गया",
    requestSubmitted: "अनुरोध सफलतापूर्वक जमा किया गया",
    consentWithdrawn: "सहमति सफलतापूर्वक वापस ली गई",
    consentRenewed: "सहमति सफलतापूर्वक नवीनीकृत की गई"
  },
  
  mr: {
    // Navigation & Header
    dashboard: "डॅशबोर्ड",
    myConsents: "माझी संमती",
    dataRequests: "डेटा विनंत्या",
    privacySettings: "गुप्तता सेटिंग्ज",
    grievances: "तक्रारी",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    language: "भाषा",
    
    // Dashboard
    welcome: "स्वागत",
    consentOverview: "संमती विहंगावलोकन",
    activeConsents: "सक्रिय संमती",
    withdrawnConsents: "मागे घेतलेली संमती",
    pendingRequests: "प्रलंबित विनंत्या",
    recentActivity: "अलीकडील क्रियाकलाप",
    quickActions: "द्रुत क्रिया",
    
    // Consent Management
    consentHistory: "संमती इतिहास",
    consentStatus: "संमती स्थिती",
    granted: "मंजूर",
    withdrawn: "मागे घेतले",
    expired: "कालबाह्य",
    pending: "प्रलंबित",
    purpose: "उद्देश",
    grantedOn: "मंजूर केले",
    expiresOn: "संपते",
    dataFiduciary: "डेटा विश्वस्त",
    dataCategories: "डेटा श्रेणी",
    
    // Actions
    view: "पहा",
    edit: "संपादित करा",
    withdraw: "मागे घ्या",
    renew: "नूतनीकरण करा",
    download: "डाउनलोड",
    export: "निर्यात",
    submit: "सबमिट करा",
    cancel: "रद्द करा",
    confirm: "पुष्टी करा",
    save: "जतन करा",
    delete: "हटवा",
    
    // Forms
    name: "नाव",
    email: "ईमेल",
    phone: "फोन",
    address: "पत्ता",
    description: "वर्णन",
    category: "श्रेणी",
    subject: "विषय",
    
    // Privacy Rights
    accessData: "माझा डेटा अॅक्सेस करा",
    correctData: "माझा डेटा दुरुस्त करा",
    eraseData: "माझा डेटा मिटवा",
    portData: "माझा डेटा पोर्ट करा",
    restrictProcessing: "प्रक्रिया प्रतिबंधित करा",
    
    // Status Messages
    success: "यश",
    error: "त्रुटी",
    warning: "चेतावणी",
    info: "माहिती",
    loading: "लोड होत आहे",
    
    // Common UI
    search: "शोधा",
    filter: "फिल्टर",
    sort: "क्रमवारी लावा",
    date: "दिनांक",
    time: "वेळ",
    status: "स्थिती",
    actions: "क्रिया",
    details: "तपशील",
    
    // Consent Specific
    consentPurpose: "संमती उद्देश",
    dataProcessing: "डेटा प्रक्रिया",
    marketing: "मार्केटिंग",
    analytics: "विश्लेषणे",
    essential: "आवश्यक",
    functional: "कार्यात्मक",
    
    // Grievance
    grievanceForm: "तक्रार फॉर्म",
    complaintCategory: "तक्रार श्रेणी",
    referenceNumber: "संदर्भ क्रमांक",
    submitGrievance: "तक्रार सबमिट करा",
    grievanceStatus: "तक्रार स्थिती",
    
    // Grievance & Request Status - BRD Section 4.5 & 4.3.3 Compliant
    submitted: "Submitted",
    inProgress: "In Progress",
    pendingInfo: "Pending Info",
    resolved: "Resolved",
    closed: "Closed",
    escalated: "Escalated",
    fulfilled: "Fulfilled",
    rejected: "Rejected",
    
    // Data Requests
    requestType: "विनंती प्रकार",
    requestStatus: "विनंती स्थिती",
    requestDate: "विनंती दिनांक",
    completionDate: "पूर्ण होण्याची तारीख",
    
    // Messages
    noDataFound: "डेटा सापडला नाही",
    loadingData: "डेटा लोड होत आहे...",
    dataUpdated: "डेटा यशस्वीरित्या अपडेट झाला",
    requestSubmitted: "विनंती यशस्वीरित्या सबमिट केली",
    consentWithdrawn: "संमती यशस्वीरित्या मागे घेतली",
    consentRenewed: "संमती यशस्वीरित्या नूतनीकरण केली"
  },
  
  bn: {
    // Navigation & Header
    dashboard: "ড্যাশবোর্ড",
    myConsents: "আমার সম্মতি",
    dataRequests: "ডেটা অনুরোধ",
    privacySettings: "গোপনীয়তা সেটিংস",
    grievances: "অভিযোগ",
    profile: "প্রোফাইল",
    logout: "লগআউট",
    language: "ভাষা",
    
    // Dashboard
    welcome: "স্বাগতম",
    consentOverview: "সম্মতি পর্যালোচনা",
    activeConsents: "সক্রিয় সম্মতি",
    withdrawnConsents: "প্রত্যাহৃত সম্মতি",
    pendingRequests: "অপেক্ষমাণ অনুরোধ",
    recentActivity: "সাম্প্রতিক কার্যকলাপ",
    quickActions: "দ্রুত কার্যক্রম",
    
    // Consent Management
    consentHistory: "সম্মতির ইতিহাস",
    consentStatus: "সম্মতির অবস্থা",
    granted: "প্রদত্ত",
    withdrawn: "প্রত্যাহৃত",
    expired: "মেয়াদোত্তীর্ণ",
    pending: "অপেক্ষমাণ",
    purpose: "উদ্দেশ্য",
    grantedOn: "প্রদান করা হয়েছে",
    expiresOn: "মেয়াদ শেষ",
    dataFiduciary: "ডেটা ট্রাস্টি",
    dataCategories: "ডেটা বিভাগ",
    
    // Actions
    view: "দেখুন",
    edit: "সম্পাদনা",
    withdraw: "প্রত্যাহার",
    renew: "নবায়ন",
    download: "ডাউনলোড",
    export: "রপ্তানি",
    submit: "জমা দিন",
    cancel: "বাতিল",
    confirm: "নিশ্চিত করুন",
    save: "সংরক্ষণ",
    delete: "মুছুন",
    
    // Forms
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    address: "ঠিকানা",
    description: "বিবরণ",
    category: "বিভাগ",
    subject: "বিষয়",
    
    // Privacy Rights
    accessData: "আমার ডেটা অ্যাক্সেস করুন",
    correctData: "আমার ডেটা সংশোধন করুন",
    eraseData: "আমার ডেটা মুছুন",
    portData: "আমার ডেটা পোর্ট করুন",
    restrictProcessing: "প্রক্রিয়াকরণ সীমাবদ্ধ করুন",
    
    // Status Messages
    success: "সফল",
    error: "ত্রুটি",
    warning: "সতর্কতা",
    info: "তথ্য",
    loading: "লোড হচ্ছে",
    
    // Common UI
    search: "অনুসন্ধান",
    filter: "ফিল্টার",
    sort: "সাজান",
    date: "তারিখ",
    time: "সময়",
    status: "অবস্থা",
    actions: "কার্যক্রম",
    details: "বিস্তারিত",
    
    // Consent Specific
    consentPurpose: "সম্মতির উদ্দেশ্য",
    dataProcessing: "ডেটা প্রক্রিয়াকরণ",
    marketing: "বিপণন",
    analytics: "বিশ্লেষণ",
    essential: "অপরিহার্য",
    functional: "কার্যকরী",
    
    // Grievance
    grievanceForm: "অভিযোগ ফর্ম",
    complaintCategory: "অভিযোগের বিভাগ",
    referenceNumber: "রেফারেন্স নম্বর",
    submitGrievance: "অভিযোগ জমা দিন",
    grievanceStatus: "অভিযোগের অবস্থা",
    
    // Grievance & Request Status - BRD Section 4.5 & 4.3.3 Compliant
    submitted: "Submitted",
    inProgress: "In Progress",
    pendingInfo: "Pending Info",
    resolved: "Resolved",
    closed: "Closed",
    escalated: "Escalated",
    fulfilled: "Fulfilled",
    rejected: "Rejected",
    
    // Data Requests
    requestType: "অনুরোধের ধরন",
    requestStatus: "অনুরোধের অবস্থা",
    requestDate: "অনুরোধের তারিখ",
    completionDate: "সমাপ্তির তারিখ",
    
    // Messages
    noDataFound: "কোন ডেটা পাওয়া যায়নি",
    loadingData: "ডেটা লোড হচ্ছে...",
    dataUpdated: "ডেটা সফলভাবে আপডেট হয়েছে",
    requestSubmitted: "অনুরোধ সফলভাবে জমা দেওয়া হয়েছে",
    consentWithdrawn: "সম্মতি সফলভাবে প্রত্যাহার করা হয়েছে",
    consentRenewed: "সম্মতি সফলভাবে নবায়ন করা হয়েছে"
  },
  
  ml: {
    // Navigation & Header
    dashboard: "ഡാഷ്ബോർഡ്",
    myConsents: "എന്റെ സമ്മതം",
    dataRequests: "ഡാറ്റ അഭ്യർത്ഥനകൾ",
    privacySettings: "സ്വകാര്യത ക്രമീകരണങ്ങൾ",
    grievances: "പരാതികൾ",
    profile: "പ്രൊഫൈൽ",
    logout: "ലോഗൗട്ട്",
    language: "ഭാഷ",
    
    // Dashboard
    welcome: "സ്വാഗതം",
    consentOverview: "സമ്മത അവലോകനം",
    activeConsents: "സജീവ സമ്മതങ്ങൾ",
    withdrawnConsents: "പിൻവലിച്ച സമ്മതങ്ങൾ",
    pendingRequests: "കാത്തിരിപ്പിലുള്ള അഭ്യർത്ഥനകൾ",
    recentActivity: "സമീപകാല പ്രവർത്തനം",
    quickActions: "വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ",
    
    // Consent Management
    consentHistory: "സമ്മത ചരിത്രം",
    consentStatus: "സമ്മത നില",
    granted: "അനുവദിച്ചു",
    withdrawn: "പിൻവലിച്ചു",
    expired: "കാലഹരണപ്പെട്ടു",
    pending: "കാത്തിരിപ്പിൽ",
    purpose: "ഉദ്ദേശ്യം",
    grantedOn: "അനുവദിച്ച തീയതി",
    expiresOn: "കാലഹരണപ്പെടുന്ന തീയതി",
    dataFiduciary: "ഡാറ്റ ട്രസ്റ്റി",
    dataCategories: "ഡാറ്റ വിഭാഗങ്ങൾ",
    
    // Actions
    view: "കാണുക",
    edit: "എഡിറ്റ് ചെയ്യുക",
    withdraw: "പിൻവലിക്കുക",
    renew: "പുതുക്കുക",
    download: "ഡൗൺലോഡ്",
    export: "കയറ്റുമതി",
    submit: "സമർപ്പിക്കുക",
    cancel: "റദ്ദാക്കുക",
    confirm: "സ്ഥിരീകരിക്കുക",
    save: "സേവ് ചെയ്യുക",
    delete: "ഇല്ലാതാക്കുക",
    
    // Forms
    name: "പേര്",
    email: "ഇമെയിൽ",
    phone: "ഫോൺ",
    address: "വിലാസം",
    description: "വിവരണം",
    category: "വിഭാഗം",
    subject: "വിഷയം",
    
    // Privacy Rights
    accessData: "എന്റെ ഡാറ്റ ആക്‌സസ് ചെയ്യുക",
    correctData: "എന്റെ ഡാറ്റ ശരിയാക്കുക",
    eraseData: "എന്റെ ഡാറ്റ മായ്ക്കുക",
    portData: "എന്റെ ഡാറ്റ പോർട്ട് ചെയ്യുക",
    restrictProcessing: "പ്രോസസ്സിംഗ് നിയന്ത്രിക്കുക",
    
    // Status Messages
    success: "വിജയം",
    error: "പിശക്",
    warning: "മുന്നറിയിപ്പ്",
    info: "വിവരം",
    loading: "ലോഡിംഗ്",
    
    // Common UI
    search: "തിരയുക",
    filter: "ഫിൽട്ടർ",
    sort: "അടുക്കുക",
    date: "തീയതി",
    time: "സമയം",
    status: "നില",
    actions: "പ്രവർത്തനങ്ങൾ",
    details: "വിശദാംശങ്ങൾ",
    
    // Consent Specific
    consentPurpose: "സമ്മത ഉദ്ദേശ്യം",
    dataProcessing: "ഡാറ്റ പ്രോസസ്സിംഗ്",
    marketing: "മാർക്കറ്റിംഗ്",
    analytics: "അനലിറ്റിക്സ്",
    essential: "അത്യാവശ്യം",
    functional: "പ്രവർത്തനപരം",
    
    // Grievance
    grievanceForm: "പരാതി ഫോം",
    complaintCategory: "പരാതി വിഭാഗം",
    referenceNumber: "റഫറൻസ് നമ്പർ",
    submitGrievance: "പരാതി സമർപ്പിക്കുക",
    grievanceStatus: "പരാതി നില",
    
    // Grievance & Request Status - BRD Section 4.5 & 4.3.3 Compliant
    submitted: "Submitted",
    inProgress: "In Progress",
    pendingInfo: "Pending Info",
    resolved: "Resolved",
    closed: "Closed",
    escalated: "Escalated",
    fulfilled: "Fulfilled",
    rejected: "Rejected",
    
    // Data Requests
    requestType: "അഭ്യർത്ഥന തരം",
    requestStatus: "അഭ്യർത്ഥന നില",
    requestDate: "അഭ്യർത്ഥന തീയതി",
    completionDate: "പൂർത്തീകരണ തീയതി",
    
    // Messages
    noDataFound: "ഡാറ്റ കണ്ടെത്തിയില്ല",
    loadingData: "ഡാറ്റ ലോഡ് ചെയ്യുന്നു...",
    dataUpdated: "ഡാറ്റ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു",
    requestSubmitted: "അഭ്യർത്ഥന വിജയകരമായി സമർപ്പിച്ചു",
    consentWithdrawn: "സമ്മതം വിജയകരമായി പിൻവലിച്ചു",
    consentRenewed: "സമ്മതം വിജയകരമായി പുതുക്കി"
  }
};

export const useTranslation = (language: string = 'en'): Translation => {
  return translations[language] || translations.en;
}; 