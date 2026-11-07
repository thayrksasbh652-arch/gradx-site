/* =========================================================
   GradX · Research Hub — script.js
   1. Icons       → small SVG library (Feather style)
   2. Language    → English by default, Arabic with one click: L("English", "العربية")
   3. Data        → fake data + PERMISSIONS per role (later this comes from the backend API)
   4. State       → language, role, archive filters, AI chat
   5. Helpers     → tiny functions that build repeated HTML pieces
   6. Views       → one function per page (+ access-denied page)
   7. Router      → reads the URL hash (#archive), checks permissions, shows the right view
   8. Motion      → Lenis smooth scroll + GSAP animations
   9. Events      → clicks, menu, search, filters, language switch
   ========================================================= */

/* ---------- 1. ICONS ---------- */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  checkSquare: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  sparkles: '<path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  sort: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
};

/** Returns an inline SVG string. stroke="currentColor" lets CSS control the color. */
// Icons that point left/right are mirrored in Arabic (right-to-left) by the .rtl-flip class
const FLIP_IN_RTL = ["chevronRight", "arrowRight", "send", "logout"];
function icon(name, size = 20) {
  return `<svg ${FLIP_IN_RTL.includes(name) ? 'class="rtl-flip" ' : ""}width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

/* ---------- 2. LANGUAGE (English by default, Arabic on demand) ----------
   L("English", "العربية") returns the text in the current language.
   The choice is saved, and <html dir="rtl"> flips the whole layout for Arabic. */
function loadLang() {
  try { return localStorage.getItem("gradx-lang") === "ar" ? "ar" : "en"; } catch { return "en"; }
}
function saveLang(lang) {
  try { localStorage.setItem("gradx-lang", lang); } catch { /* ignore */ }
}
const L = (en, ar) => (state.lang === "ar" ? ar : en);

// Text that lives in index.html (marked with data-i18n / data-i18n-ph / data-i18n-aria)
const STATIC_TEXT = {
  mainMenu: ["MAIN MENU", "القائمة الرئيسية"],
  openMenu: ["Open menu", "فتح القائمة"],
  search: ["Search projects, tasks, people…", "ابحث عن مشاريع، مهام، أشخاص…"],
  notifications: ["Notifications", "الإشعارات"],
  profile: ["Profile", "الملف الشخصي"],
  logout: ["Log out", "تسجيل الخروج"],
};

function applyLanguage() {
  const ar = state.lang === "ar";
  document.documentElement.lang = ar ? "ar" : "en";
  document.documentElement.dir = ar ? "rtl" : "ltr";
  document.title = ar ? "GradX · منصة مشاريع التخرج" : "GradX · Research Hub";
  const pick = (key) => STATIC_TEXT[key][ar ? 1 : 0];
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = pick(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = pick(el.dataset.i18nPh)));
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", pick(el.dataset.i18nAria)));
  $("#lang-btn").innerHTML = langButtonLabel();
}
// The button shows the language you will switch TO
const langButtonLabel = () => `${icon("globe", 16)}${state.lang === "ar" ? "English" : "عربي"}`;

function toggleLanguage() {
  state.lang = state.lang === "ar" ? "en" : "ar";
  saveLang(state.lang);
  state.filters = { q: "", year: "all", supervisor: "all", tech: "all", sort: state.filters.sort }; // filter values are in the old language
  applyLanguage();
  render();
}

/* ---------- 3. DATA (functions, so they come back in the current language) ---------- */
const users = () => ({
  student: { name: L("Noor Mohammed", "نور محمد"), role: L("Student · Computer Science", "طالب · علم الحاسوب"),
             initials: L("NM", "ن م"), first: L("Noor", "نور"), email: "noor@university.edu.jo" },
  supervisor: { name: L("Dr. Ahmed Al-Salem", "د. أحمد السالم"), role: L("Academic supervisor", "مشرف أكاديمي"),
                initials: L("AS", "أ س"), first: L("Dr. Ahmed", "د. أحمد"), email: "a.salem@university.edu.jo" },
});
const roleLabel = (r) => (r === "student" ? L("Student", "طالب") : L("Supervisor (Doctor)", "مشرف (دكتور)"));
const roleThe = (r) => (r === "student" ? L("students", "بالطالب") : L("supervisors (doctors)", "بالمشرف (الدكتور)"));

/* ---------- PERMISSIONS (who can do what) ----------
   Each role has a list of permissions. The menu, the pages and the buttons all ask can("...").
   ⚠️ This only hides things in the browser. The real check must also happen in the backend later,
   because anyone can change JavaScript in their own browser. */
const PERMISSIONS = {
  student: ["view_archive", "use_ai", "submit_idea", "form_team", "manage_tasks", "submit_work", "ask_questions"],
  supervisor: ["view_archive", "use_ai", "review_ideas", "supervise_teams", "review_submissions", "grade", "answer_questions", "add_archive"],
};
const permissionLabel = (p) => ({
  view_archive: L("Browse the projects archive", "تصفّح أرشيف المشاريع"),
  use_ai: L("Use the AI assistant", "استخدام مساعد الذكاء الاصطناعي"),
  submit_idea: L("Submit a project idea", "تقديم فكرة مشروع"),
  form_team: L("Build a team and find teammates", "تكوين فريق والبحث عن زملاء"),
  manage_tasks: L("Add and assign team tasks", "إضافة مهام الفريق وتوزيعها"),
  submit_work: L("Submit project chapters and files", "تسليم فصول وملفات المشروع"),
  ask_questions: L("Ask the supervisor questions", "طرح أسئلة على المشرف"),
  review_ideas: L("Approve or reject project ideas", "قبول أو رفض أفكار المشاريع"),
  supervise_teams: L("Follow the supervised teams", "متابعة الفرق المُشرف عليها"),
  review_submissions: L("Review submissions and write feedback", "مراجعة التسليمات وكتابة الملاحظات"),
  grade: L("Grade and evaluate projects", "وضع العلامات وتقييم المشاريع"),
  answer_questions: L("Answer students’ questions", "الرد على أسئلة الطلاب"),
  add_archive: L("Add projects to the archive", "إضافة مشاريع للأرشيف"),
}[p]);

/** true if the signed-in role has this permission */
const can = (perm) => PERMISSIONS[state.role].includes(perm);

// Every page: its icon, the permission needed (null = everyone signed in), and its label per language
const PAGES = {
  profile: { icon: "user", perm: null },
  dashboard: { icon: "grid", perm: null },
  archive: { icon: "archive", perm: "view_archive" },
  ai: { icon: "sparkles", perm: "use_ai" },
  ideas: { icon: "bulb", perm: { student: "submit_idea", supervisor: "review_ideas" } },
  teammates: { icon: "userPlus", perm: "form_team" },
  team: { icon: "users", perm: "form_team" },
  tasks: { icon: "checkSquare", perm: "manage_tasks" },
  teams: { icon: "users", perm: "supervise_teams" },
  submissions: { icon: "send", perm: { student: "submit_work", supervisor: "review_submissions" } },
  grading: { icon: "fileText", perm: "grade" },
  qa: { icon: "help", perm: { student: "ask_questions", supervisor: "answer_questions" } },
};
function pageLabel(id, role = state.role) {
  const s = role === "student";
  return {
    profile: L("Profile", "الملف الشخصي"),
    dashboard: L("Dashboard", "لوحة التحكم"),
    archive: L("Projects Archive", "أرشيف المشاريع"),
    ai: L("AI Assistant", "المساعد الذكي"),
    ideas: s ? L("My Ideas", "أفكاري") : L("Review Ideas", "مراجعة الأفكار"),
    teammates: L("Find Teammates", "البحث عن زملاء"),
    team: L("My Team", "فريقي"),
    tasks: L("Tasks", "المهام"),
    teams: L("My Teams", "فرقي"),
    submissions: s ? L("My Submissions", "تسليماتي") : L("Review Submissions", "مراجعة التسليمات"),
    grading: L("Grading", "التقييم والعلامات"),
    qa: L("Q&A", "الأسئلة والأجوبة"),
  }[id];
}

// Menu order per role — the profile comes first
const MENUS = {
  student: ["profile", "dashboard", "archive", "ideas", "ai", "teammates", "team", "tasks", "submissions", "qa"],
  supervisor: ["profile", "dashboard", "archive", "teams", "submissions", "grading", "ideas", "ai", "qa"],
};
const COUNTS = { student: { submissions: 2 }, supervisor: { submissions: 8, ideas: 5 } };

/** Can the current role open this page? */
function canOpen(id) {
  const page = PAGES[id];
  if (!page) return false;
  const perm = page.perm && typeof page.perm === "object" ? page.perm[state.role] : page.perm;
  return perm === null || (perm !== undefined && can(perm));
}

// What each role will be able to do on the pages that aren't designed yet
const pageAbilities = (id) => ({
  ideas: { student: [L("Submit a new project idea", "تقديم فكرة مشروع جديدة"), L("Track your ideas: approved, rejected or in review", "متابعة حالة أفكارك: مقبولة، مرفوضة، أو قيد المراجعة")],
           supervisor: [L("Review the ideas students submitted", "مراجعة الأفكار اللي قدّمها الطلاب"), L("Approve or reject an idea with a note", "قبول أو رفض فكرة مع كتابة ملاحظة")] },
  submissions: { student: [L("Upload project chapters and files", "رفع فصول وملفات المشروع"), L("See the supervisor’s notes on each submission", "مشاهدة ملاحظات المشرف على كل تسليم")],
                 supervisor: [L("Review every team’s submissions", "مراجعة تسليمات كل الفرق"), L("Write feedback and ask for changes", "كتابة ملاحظات وطلب تعديلات")] },
  qa: { student: [L("Ask your supervisor a question", "طرح سؤال على المشرف"), L("Browse common questions", "تصفّح الأسئلة الشائعة")],
        supervisor: [L("Answer students’ questions", "الرد على أسئلة الطلاب"), L("Pin important questions for all students", "تثبيت الأسئلة المهمة لكل الطلاب")] },
  teammates: { student: [L("Search students by skills", "البحث عن طلاب حسب المهارات"), L("Invite someone to join your team", "إرسال دعوة للانضمام لفريقك")] },
  team: { student: [L("Manage team members", "إدارة أعضاء الفريق"), L("Give each member a role", "تحديد دور كل عضو")] },
  tasks: { student: [L("Add tasks and assign them", "إضافة مهام وتوزيعها على الأعضاء"), L("Update each task’s status", "تحديث حالة كل مهمة")] },
  teams: { supervisor: [L("Follow each team’s progress", "متابعة تقدّم كل فريق"), L("Contact team members", "التواصل مع أعضاء الفريق")] },
  grading: { supervisor: [L("Give a mark for each phase", "وضع علامة لكل مرحلة"), L("Approve the project’s final grade", "اعتماد العلامة النهائية للمشروع")] },
}[id] || {})[state.role] || [];

const may = (day) => L(`${day} May, 2025`, `${day} أيار 2025`);
const tasks = () => [
  { title: L("Complete login flow", "إكمال صفحة تسجيل الدخول"), assignee: L("Sarah Ahmed", "سارة أحمد"), initials: L("SA", "س أ"), deadline: may(12), status: "progress" },
  { title: L("Write research methodology chapter", "كتابة فصل منهجية البحث"), assignee: L("Mohammed Ali", "محمد علي"), initials: L("MA", "م ع"), deadline: may(14), status: "todo" },
  { title: L("Test application interfaces", "اختبار واجهات التطبيق"), assignee: L("Reem Khaled", "ريم خالد"), initials: L("RK", "ر خ"), deadline: may(16), status: "progress" },
  { title: L("Prepare initial presentation", "تجهيز العرض الأولي"), assignee: L("You", "أنت"), initials: L("NM", "ن م"), deadline: may(18), status: "todo" },
];
const statusLabel = (s) => ({ progress: L("In Progress", "قيد التنفيذ"), todo: L("To Do", "لم تبدأ"), done: L("Done", "منجزة"), urgent: L("Urgent", "عاجلة") }[s]);

const teams = () => [
  { name: L("Team Nebras", "فريق نبراس"), project: L("Interactive Learning Platform", "منصة التعلم التفاعلي"), members: 4, progress: 68 },
  { name: L("Team Baseera", "فريق بصيرة"), project: L("Plant Disease Detection", "كشف أمراض النباتات"), members: 3, progress: 82 },
  { name: L("Team Mada", "فريق مدى"), project: L("Smart City System", "نظام المدينة الذكية"), members: 4, progress: 46 },
];

const reviews = () => [
  { title: L("Chapter 3: Methodology", "الفصل الثالث: المنهجية"), team: L("Team Nebras", "فريق نبراس"), time: L("2 hours ago", "قبل ساعتين"), icon: "fileText", tone: "danger", urgent: true },
  { title: L("Application prototype", "النموذج الأولي للتطبيق"), team: L("Team Baseera", "فريق بصيرة"), time: L("5 hours ago", "قبل 5 ساعات"), icon: "monitor", tone: "info" },
  { title: L("Database schema", "تصميم قاعدة البيانات"), team: L("Team Mada", "فريق مدى"), time: L("Yesterday", "أمس"), icon: "database", tone: "info" },
];

const projects = () => {
  const salem = L("Dr. Ahmed Al-Salem", "د. أحمد السالم"), mona = L("Dr. Mona Al-Harbi", "د. منى الحربي"), khaled = L("Dr. Khaled Mahmoud", "د. خالد محمود");
  return [
    { title: L("AI Plant Disease Detection", "كشف أمراض النباتات بالذكاء الاصطناعي"), year: 2025, supervisor: salem, tech: ["Python", "TensorFlow", "React"],
      desc: L("An AI-powered platform that analyzes plant images, detects diseases early, and recommends treatments.", "منصة بتحلّل صور النباتات، بتكشف الأمراض بدري، وبتقترح العلاج المناسب.") },
    { title: L("Nebras Interactive Learning Platform", "منصة نبراس للتعلم التفاعلي"), year: 2025, supervisor: mona, tech: ["React", "Node.js", "MongoDB"],
      desc: L("An interactive learning environment where students follow lessons, complete activities, and connect with instructors.", "بيئة تعليمية تفاعلية، الطالب فيها بيتابع الدروس، بيحل أنشطة، وبيتواصل مع المدرّسين.") },
    { title: L("Smart City Management with IoT", "إدارة المدينة الذكية بإنترنت الأشياء"), year: 2024, supervisor: salem, tech: ["IoT", "Flutter", "Firebase"],
      desc: L("A system that monitors urban energy use and traffic, analyzing data to support better decisions.", "نظام بيراقب استهلاك الطاقة وحركة السير بالمدينة، وبيحلّل البيانات عشان قرارات أفضل.") },
    { title: L("Arabic Legal Assistant", "المساعد القانوني العربي"), year: 2024, supervisor: khaled, tech: ["NLP", "Python", "Vue.js"],
      desc: L("A digital assistant that uses NLP to answer common Arabic legal questions.", "مساعد رقمي بيستخدم معالجة اللغة الطبيعية ليجاوب على الأسئلة القانونية الشائعة بالعربي.") },
    { title: L("Mental Wellness App", "تطبيق الصحة النفسية"), year: 2023, supervisor: mona, tech: ["Flutter", "Firebase"],
      desc: L("A supportive app that helps users monitor their mental well-being and access resources and specialists.", "تطبيق داعم بيساعد المستخدم يتابع حالته النفسية ويوصل لمصادر ومختصين.") },
    { title: L("University Bus Tracking System", "نظام تتبّع باصات الجامعة"), year: 2023, supervisor: khaled, tech: ["React Native", "Maps API"],
      desc: L("An app showing university bus locations in real time, with route and arrival alerts.", "تطبيق بيعرض مكان باصات الجامعة مباشرة، مع تنبيهات للمسار ووقت الوصول.") },
  ];
};

/* ---------- 4. STATE ---------- */
const state = {
  lang: loadLang(),
  loggedIn: loadSession(),
  role: loadRole(),
  email: loadEmail(),
  filters: { q: "", year: "all", supervisor: "all", tech: "all", sort: "newest" },
  ai: { messages: [], loading: false }, // AI chat lives in memory (cleared on refresh)
};

// localStorage can throw in private windows, so it's wrapped in try/catch
function loadRole() {
  try { return localStorage.getItem("gradx-role") === "supervisor" ? "supervisor" : "student"; } catch { return "student"; }
}
function saveRole(role) {
  try { localStorage.setItem("gradx-role", role); } catch { /* ignore */ }
}
function loadEmail() {
  try { return localStorage.getItem("gradx-email") || ""; } catch { return ""; }
}
function saveEmail(email) {
  try { email ? localStorage.setItem("gradx-email", email) : localStorage.removeItem("gradx-email"); } catch { /* ignore */ }
}
// Demo "session": just a flag. A real app gets a token from the backend after checking the password
function loadSession() {
  try { return localStorage.getItem("gradx-session") === "1"; } catch { return false; }
}
function saveSession(on) {
  try { on ? localStorage.setItem("gradx-session", "1") : localStorage.removeItem("gradx-session"); } catch { /* ignore */ }
}

/* ---------- 5. HELPERS (small HTML builders = our "components") ---------- */
const $ = (sel) => document.querySelector(sel);

// Prevents HTML injection when showing text the user typed
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const tile = (iconName, tone = "accent") => `<span class="tile tile--${tone}">${icon(iconName)}</span>`;
const avatar = (initials, size = "sm") => `<span class="avatar avatar--${size}">${initials}</span>`;
// The GradX logo (two crossing leaves). Same drawing as the sidebar logo in index.html
const logoMark = (size = 40) => `
  <svg class="logo__mark" viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">
    <rect x="0.5" y="0.5" width="39" height="39" rx="11.5" class="logo__bg" />
    <g transform="rotate(-42 20 20)"><path d="M20 3.5 C25.5 10 25.5 28 20 36.5 C14.5 28 14.5 10 20 3.5 Z" class="logo__leaf-teal" /><path d="M20 8 L20 32" class="logo__vein" /></g>
    <g transform="rotate(42 20 20)"><path d="M20 3.5 C25.5 10 25.5 28 20 36.5 C14.5 28 14.5 10 20 3.5 Z" class="logo__leaf-orange" /><path d="M20 8 L20 32" class="logo__vein" /></g>
    <circle cx="20" cy="20" r="3" class="logo__drop" /><circle cx="19.1" cy="19.1" r="0.9" class="logo__drop-shine" />
  </svg>`;
const badge = (status) => `<span class="badge badge--${status}">${statusLabel(status)}</span>`;
// --value starts at 0; animateProgress() sets the real value after render so the bar "grows"
const progress = (value) => `<div class="progress" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><div class="progress__value" data-value="${value}"></div></div>`;
const soon = (what) => `${what} — ${L("coming soon", "قريبًا")}`;

function statCard({ label, value, unit = "", hint, hintTone = "", iconName, tone }) {
  return `
    <article class="card stat">
      <div class="card__head">
        <p class="body-sm">${label}</p>
        ${tile(iconName, tone)}
      </div>
      <div class="stat__value">
        <span class="stat-value">${value}</span>
        ${unit ? `<span class="stat__unit">${unit}</span>` : ""}
      </div>
      <p class="stat__hint ${hintTone ? "stat__hint--" + hintTone : ""}">${hint}</p>
    </article>`;
}

function pageHead({ eyebrow, title, subtitle, action }) {
  return `
    <section class="page-head">
      <div class="page-head__text">
        <p class="eyebrow">${eyebrow}</p>
        <h1 class="page-title">${title}</h1>
        <p>${subtitle}</p>
      </div>
      ${action ? `<button class="btn btn--primary" data-toast="${soon(action)}">${icon("plus", 16)}${action}</button>` : ""}
    </section>`;
}

// Fixed "today" so it matches the demo deadlines (May 12 = 1 day remaining).
const demoToday = () => L("Sunday, May 11, 2025", "الأحد، 11 أيار 2025");

/* ---------- 6. VIEWS ---------- */
function profileView() {
  const u = users()[state.role];
  const other = state.role === "student" ? "supervisor" : "student";
  const mine = PERMISSIONS[state.role];
  const notMine = PERMISSIONS[other].filter((p) => !mine.includes(p));
  const email = state.email || u.email;
  const info = state.role === "student"
    ? [[L("University email", "البريد الجامعي"), email], [L("Major", "التخصص"), L("Computer Science", "علم الحاسوب")], [L("Team", "الفريق"), L("Team Nebras", "فريق نبراس")], [L("Supervisor", "المشرف"), L("Dr. Ahmed Al-Salem", "د. أحمد السالم")]]
    : [[L("University email", "البريد الجامعي"), email], [L("Department", "القسم"), L("Computer Science", "علم الحاسوب")], [L("Teams", "عدد الفرق"), L("6 teams", "6 فرق")], [L("Office hours", "ساعات المكتب"), L("Sun & Tue 10–12", "الأحد والثلاثاء 10–12")]];

  return `
    ${pageHead({ eyebrow: L("Your account", "حسابك"), title: L("Profile", "الملف الشخصي"), subtitle: L("Your details and what you’re allowed to do on GradX.", "معلوماتك وصلاحياتك على المنصة.") })}

    <section class="card">
      <div class="profile-hero">
        <span class="avatar--xl">${u.initials}</span>
        <div class="profile-hero__info">
          <h2>${u.name}</h2>
          <p class="body-sm">${u.role}</p>
          <span class="role-chip role-chip--${state.role}">${icon("shield", 14)}${roleLabel(state.role)}</span>
        </div>
        <button class="btn btn--secondary" data-toast="${soon(L("Edit profile", "تعديل الملف الشخصي"))}">${L("Edit profile", "تعديل الملف")}</button>
      </div>
      <div class="info-list">
        ${info.map(([k, v]) => `<div class="info-item"><span>${k}</span><strong${v.includes("@") ? ' class="ltr"' : ""}>${esc(v)}</strong></div>`).join("")}
      </div>
    </section>

    <section class="grid-2">
      <article class="card">
        <h2 class="section-title">${L("Your permissions", "صلاحياتك")}</h2>
        <p class="body-sm">${L(`What you can do as a ${roleLabel(state.role).toLowerCase()}.`, `الأشياء اللي بتقدر تعملها ك${roleLabel(state.role)}.`)}</p>
        <ul class="perm-list perm-list--yes">
          ${mine.map((p) => `<li>${icon("check", 16)}${permissionLabel(p)}</li>`).join("")}
        </ul>
      </article>
      <article class="card">
        <h2 class="section-title">${L(`Only for ${roleThe(other)}`, `خاصة ${roleThe(other)}`)}</h2>
        <p class="body-sm">${L("These aren’t yours, so you won’t see their pages or buttons.", "هاي الصلاحيات مش إلك، وما رح تشوف صفحاتها أو أزرارها.")}</p>
        <ul class="perm-list perm-list--no">
          ${notMine.map((p) => `<li>${icon("lock", 16)}${permissionLabel(p)}</li>`).join("")}
        </ul>
      </article>
    </section>`;
}

function studentDashboard() {
  const done = 18, total = 24;
  const nebras = L("Nebras Learning Platform", "منصة نبراس للتعلم");
  return `
    ${pageHead({ eyebrow: demoToday(), title: L(`Welcome back, ${users().student.first}`, `أهلًا فيك، ${users().student.first}`),
      subtitle: L("Here’s a summary of your project progress and what needs your attention today.", "هاد ملخص تقدّم مشروعك والأشياء اللي بدها انتباهك اليوم."),
      action: can("manage_tasks") ? L("Add task", "إضافة مهمة") : "" })}

    <section class="grid-3">
      ${statCard({ label: L("Tasks completed", "المهام المنجزة"), value: done, unit: `/ ${total}`, hint: L(`${Math.round((done / total) * 100)}% of tasks`, `${Math.round((done / total) * 100)}% من المهام`), iconName: "check", tone: "success" })}
      ${statCard({ label: L("Next deadline", "أقرب موعد تسليم"), value: L("May 12", "12 أيار"), hint: L("1 day remaining", "باقي يوم واحد"), hintTone: "accent", iconName: "calendar", tone: "accent" })}
      ${statCard({ label: L("Team members", "أعضاء الفريق"), value: 4, unit: L("members", "أعضاء"), hint: L("All members active", "كل الأعضاء نشطين"), iconName: "users", tone: "info" })}
    </section>

    <section class="grid-side">
      <article class="card progress-card">
        <div class="card__head">
          <div>
            <h2 class="section-title">${L("Overall project progress", "التقدّم العام للمشروع")}</h2>
            <p class="body-sm">${nebras}</p>
          </div>
          <div class="progress-card__value">
            <p class="stat-value">68%</p>
            <p class="stat__hint">${L("+12% this month", "+12% هالشهر")}</p>
          </div>
        </div>
        ${progress(68)}
        <div class="progress-card__labels">
          <span class="meta">${L("Project start · Feb 2025", "بداية المشروع · شباط 2025")}</span>
          <span class="meta">${L("Final submission · Jun 2025", "التسليم النهائي · حزيران 2025")}</span>
        </div>
      </article>

      <article class="card phase">
        <h2 class="section-title">${L("Current phase", "المرحلة الحالية")}</h2>
        <div class="phase__row">
          ${tile("clock", "accent")}
          <div>
            <p class="card-title">${L("Development &amp; testing", "التطوير والاختبار")}</p>
            <p class="body-sm">${L("Week 8 of 12", "الأسبوع 8 من 12")}</p>
          </div>
        </div>
        <div class="phase__segments" aria-label="${L("Phase 3 of 4", "المرحلة 3 من 4")}">
          ${[1, 2, 3, 4].map((i) => `<span class="${i <= 3 ? "is-done" : ""}"></span>`).join("")}
        </div>
      </article>
    </section>

    <section class="grid-side">
      <article class="card table-card">
        <div class="card__head">
          <div>
            <h2 class="section-title">${L("Upcoming tasks", "المهام القادمة")}</h2>
            <p class="body-sm">${L("Track your team’s tasks and deadlines", "تابع مهام فريقك ومواعيد تسليمها")}</p>
          </div>
          <a class="link" href="#tasks">${L("View all", "عرض الكل")} ${icon("chevronRight", 16)}</a>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>${L("Task", "المهمة")}</th><th>${L("Assignee", "المسؤول")}</th><th>${L("Deadline", "الموعد")}</th><th>${L("Status", "الحالة")}</th></tr></thead>
            <tbody>
              ${tasks().map((t) => `
                <tr>
                  <td><p class="task__title">${t.title}</p><p class="meta">${nebras}</p></td>
                  <td><span class="person">${avatar(t.initials)}${t.assignee}</span></td>
                  <td><span class="date">${icon("calendar", 16)}${t.deadline}</span></td>
                  <td>${badge(t.status)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </article>

      <article class="card feedback">
        <div class="phase__row">
          ${tile("message", "accent")}
          <div>
            <p class="card-title">${L("Latest supervisor feedback", "آخر ملاحظة من المشرف")}</p>
            <p class="meta">${L("2 hours ago", "قبل ساعتين")}</p>
          </div>
        </div>
        <blockquote>${L("“Great work on the first prototype. In the next phase, focus on improving the reports experience and documenting test results more clearly.”",
                        "«شغل ممتاز على النموذج الأولي. بالمرحلة الجاية ركّزوا على تحسين تجربة التقارير، ووثّقوا نتائج الاختبار بشكل أوضح.»")}</blockquote>
        <div class="feedback__footer">
          ${avatar(users().supervisor.initials, "md")}
          <div class="feedback__who"><strong>${users().supervisor.name}</strong><span class="meta">${users().supervisor.role}</span></div>
          <button class="btn btn--secondary btn--sm" data-toast="${L("Opening feedback details…", "فتح تفاصيل الملاحظة…")}">${L("Details", "التفاصيل")}</button>
        </div>
      </article>
    </section>`;
}

function supervisorDashboard() {
  return `
    ${pageHead({ eyebrow: L("Overview", "نظرة عامة"), title: L("Supervisor Dashboard", "لوحة المشرف"),
      subtitle: L("Track teams, submissions, and new project ideas in one place.", "تابع الفرق والتسليمات وأفكار المشاريع الجديدة من مكان واحد."),
      action: can("add_archive") ? L("Add project idea", "إضافة فكرة مشروع") : "" })}

    <section class="grid-3">
      ${statCard({ label: L("Supervised teams", "الفرق المُشرف عليها"), value: 6, unit: L("teams", "فرق"), hint: L("18 students", "18 طالب"), iconName: "users", tone: "info" })}
      ${statCard({ label: L("Submissions to review", "تسليمات بانتظار المراجعة"), value: 8, hint: L("3 urgent submissions", "3 تسليمات عاجلة"), hintTone: "danger", iconName: "fileText", tone: "danger" })}
      ${statCard({ label: L("New project ideas", "أفكار مشاريع جديدة"), value: 12, hint: L("+4 this week", "+4 هالأسبوع"), iconName: "bulb", tone: "success" })}
    </section>

    <section class="grid-side">
      <article class="card">
        <div class="card__head" style="margin-bottom: 18px">
          <div>
            <h2 class="section-title">${L("Supervised teams", "الفرق المُشرف عليها")}</h2>
            <p class="body-sm">${L("Progress across your active teams", "تقدّم فرقك النشطة")}</p>
          </div>
          <a class="link" href="#teams">${L("View all", "عرض الكل")} ${icon("chevronRight", 16)}</a>
        </div>
        <div class="list">
          ${teams().map((t) => `
            <div class="team">
              <div class="team__head">
                ${tile("users", "accent")}
                <div class="team__meta">
                  <p class="card-title">${t.name}</p>
                  <p class="body-sm">${t.project} · ${t.members} ${L("members", "أعضاء")}</p>
                </div>
                <span class="team__pct">${t.progress}%</span>
              </div>
              ${progress(t.progress)}
            </div>`).join("")}
        </div>
      </article>

      <article class="card">
        <div style="margin-bottom: 18px">
          <h2 class="section-title">${L("Needs your review", "بانتظار مراجعتك")}</h2>
          <p class="body-sm">${L("Latest incoming submissions", "آخر التسليمات الواصلة")}</p>
        </div>
        <div class="list">
          ${reviews().map((r) => `
            <button class="review" data-toast="${L(`Opening “${r.title}”…`, `فتح «${r.title}»…`)}">
              ${tile(r.icon, r.tone)}
              <span class="review__meta">
                <span class="review__title">${r.title}</span>
                <span class="meta">${r.team} · ${r.time}${r.urgent ? ` · <span class="urgent">${L("Urgent", "عاجل")}</span>` : ""}</span>
              </span>
              ${icon("chevronRight", 18)}
            </button>`).join("")}
        </div>
      </article>
    </section>`;
}

function archiveView() {
  const f = state.filters;
  const list = projects();
  const unique = (arr) => [...new Set(arr)];
  const years = unique(list.map((p) => p.year)).sort((a, b) => b - a);
  const sups = unique(list.map((p) => p.supervisor)).sort();
  const techs = unique(list.flatMap((p) => p.tech)).sort();
  const option = (value, label, current) => `<option value="${value}" ${String(current) === String(value) ? "selected" : ""}>${label}</option>`;

  return `
    ${pageHead({ eyebrow: L("Discover & learn", "اكتشف وتعلّم"), title: L("Projects Archive", "أرشيف المشاريع"),
      subtitle: L("Browse previous graduation projects and find inspiration for your next idea.", "تصفّح مشاريع التخرج السابقة ولاقي إلهام لفكرتك الجاية."),
      action: can("add_archive") ? L("Add project to archive", "إضافة مشروع للأرشيف") : "" })}

    <form class="card filters" id="filters" role="search">
      <label class="search">
        ${icon("search", 18)}
        <input type="search" name="q" placeholder="${L("Search by project title or keyword…", "ابحث باسم المشروع أو كلمة مفتاحية…")}" value="${esc(f.q)}" />
      </label>
      <select class="select" name="year" aria-label="${L("Year", "السنة")}">
        ${option("all", L("Year: All", "السنة: الكل"), f.year)}${years.map((y) => option(y, y, f.year)).join("")}
      </select>
      <select class="select" name="supervisor" aria-label="${L("Supervisor", "المشرف")}">
        ${option("all", L("Supervisor: All", "المشرف: الكل"), f.supervisor)}${sups.map((s) => option(s, s, f.supervisor)).join("")}
      </select>
      <select class="select" name="tech" aria-label="${L("Technology", "التقنية")}">
        ${option("all", L("Technology: All", "التقنية: الكل"), f.tech)}${techs.map((t) => option(t, t, f.tech)).join("")}
      </select>
      <button type="button" class="btn btn--secondary" id="reset-filters">${L("Reset", "مسح الفلاتر")}</button>
    </form>

    <div class="results-bar">
      <p><strong>${L("Available projects", "المشاريع المتاحة")}</strong> <span id="count"></span></p>
      <button class="btn btn--ghost" id="sort-btn">${icon("sort", 16)}<span id="sort-label"></span></button>
    </div>

    <section class="grid-3" id="projects"></section>`;
}

/* Only the card grid re-renders when filters change, so the input keeps focus while typing */
function renderProjects() {
  const f = state.filters;
  const q = f.q.trim().toLowerCase();

  const list = projects()
    .filter((p) => !q || [p.title, p.desc, p.supervisor, ...p.tech].join(" ").toLowerCase().includes(q))
    .filter((p) => f.year === "all" || String(p.year) === f.year)
    .filter((p) => f.supervisor === "all" || p.supervisor === f.supervisor)
    .filter((p) => f.tech === "all" || p.tech.includes(f.tech))
    .sort((a, b) => (f.sort === "newest" ? b.year - a.year : a.year - b.year));

  $("#count").textContent = `(${list.length})`;
  $("#sort-label").textContent = f.sort === "newest" ? L("Newest first", "الأحدث أولًا") : L("Oldest first", "الأقدم أولًا");
  $("#projects").innerHTML = list.length
    ? list.map((p) => `
        <article class="card project">
          <div class="project__body">
            <div class="project__head">
              <h3 class="card-title">${p.title}</h3>
              <span class="year">${p.year}</span>
            </div>
            <p class="supervisor">${icon("user", 14)}${p.supervisor}</p>
            <p class="body-sm project__desc">${p.desc}</p>
            <div class="tags">${p.tech.map((t) => `<span class="tag ltr">${t}</span>`).join("")}</div>
            <a class="link" href="#archive" data-toast="${soon(L("Project details page", "صفحة تفاصيل المشروع"))}">${L("Open project details", "تفاصيل المشروع")} ${icon("chevronRight", 16)}</a>
          </div>
        </article>`).join("")
    : `<p class="empty">${L("No projects match your filters. Try a different keyword or reset the filters.", "ما في مشاريع بتطابق الفلاتر. جرّب كلمة ثانية أو امسح الفلاتر.")}</p>`;

  animateProjects();
}

function loginView() {
  return `
    <section class="auth">
      <!-- Brand panel -->
      <div class="auth__brand">
        <div class="auth__leaves" aria-hidden="true">${logoMark(520)}</div>
        <a class="logo" href="#login">
          ${logoMark(44)}
          <span class="logo__text"><strong>GradX</strong><small>RESEARCH HUB</small></span>
        </a>
        <div class="auth__pitch">
          <p class="eyebrow">${L("Graduation projects", "مشاريع التخرج")}</p>
          <h2 class="auth__headline">${L("Every graduation project, from first idea to final submission.", "كل مشروع تخرج، من أول فكرة لحد التسليم النهائي.")}</h2>
          <ul class="auth__points">
            <li>${tile("checkSquare", "accent")}<span><strong>${L("Plan as a team", "خطّطوا كفريق")}</strong>${L("Split tasks, set deadlines, see who’s on what.", "وزّعوا المهام، حدّدوا المواعيد، وشوفوا مين ماسك شو.")}</span></li>
            <li>${tile("message", "info")}<span><strong>${L("Hear from your supervisor", "ملاحظات المشرف")}</strong>${L("Feedback on every chapter and prototype.", "تعليقات على كل فصل وكل نموذج أولي.")}</span></li>
            <li>${tile("archive", "success")}<span><strong>${L("Learn from past projects", "تعلّم من المشاريع السابقة")}</strong>${L("Browse the archive for ideas and tech stacks.", "تصفّح الأرشيف عشان أفكار وتقنيات.")}</span></li>
          </ul>
        </div>
        <p class="meta">© 2025 GradX · ${L("Computer Science Department", "قسم علم الحاسوب")}</p>
      </div>

      <!-- Sign-in form -->
      <div class="auth__panel">
        <button class="lang-btn auth__lang" type="button" data-action="toggle-lang">${langButtonLabel()}</button>
        <form class="auth__form" id="login-form" novalidate>
          <div class="auth__head">
            <p class="eyebrow">${L("Welcome back", "أهلًا من جديد")}</p>
            <h1 class="page-title">${L("Sign in to GradX", "سجّل دخولك على GradX")}</h1>
            <p class="body-sm">${L("Use your university account to continue.", "استخدم حسابك الجامعي عشان تكمّل.")}</p>
          </div>

          <!-- Role switch: the role chosen here decides the permissions for the whole session -->
          <fieldset class="segmented">
            <legend class="sr-only">${L("I am a", "أنا")}</legend>
            <label><input type="radio" name="role" value="student" ${state.role === "student" ? "checked" : ""} /><span>${icon("user", 16)}${roleLabel("student")}</span></label>
            <label><input type="radio" name="role" value="supervisor" ${state.role === "supervisor" ? "checked" : ""} /><span>${icon("users", 16)}${roleLabel("supervisor")}</span></label>
          </fieldset>

          <div class="field">
            <label for="login-email">${L("University email", "البريد الجامعي")}</label>
            <div class="input">
              ${icon("mail", 18)}
              <input id="login-email" name="email" type="email" dir="ltr" autocomplete="username" placeholder="name@university.edu.jo" />
            </div>
            <p class="field__error" id="email-error"></p>
          </div>

          <div class="field">
            <div class="field__row">
              <label for="login-password">${L("Password", "كلمة السر")}</label>
              <a class="link link--sm" href="#login" data-toast="${L("A reset link would be sent to your university email (demo)", "رح يوصلك رابط لتغيير كلمة السر على بريدك الجامعي (تجريبي)")}">${L("Forgot password?", "نسيت كلمة السر؟")}</a>
            </div>
            <div class="input">
              ${icon("lock", 18)}
              <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="${L("At least 6 characters", "6 أحرف على الأقل")}" />
              <button type="button" class="input__btn" id="toggle-password" aria-label="${L("Show password", "إظهار كلمة السر")}">${icon("eye", 18)}</button>
            </div>
            <p class="field__error" id="password-error"></p>
          </div>

          <label class="check"><input type="checkbox" name="remember" id="login-remember" checked /><span></span>${L("Keep me signed in", "خلّيني مسجّل دخول")}</label>

          <button type="submit" class="btn btn--primary btn--block" id="login-submit">${L("Sign in", "تسجيل الدخول")} ${icon("arrowRight", 16)}</button>

          <p class="auth__note">${icon("alert", 14)}${L("Demo: any valid email and a password of 6+ characters works.", "تجريبي: أي إيميل صحيح وكلمة سر من 6 أحرف أو أكثر بتشتغل.")}</p>
          <p class="body-sm auth__alt">${L("New to GradX?", "جديد على GradX؟")} <a class="link" href="#login" data-toast="${L("Accounts are created by the department (demo)", "الحسابات بيعملها القسم (تجريبي)")}">${L("Request access", "اطلب حساب")}</a></p>
        </form>
      </div>
    </section>`;
}

/* ---------- AI ASSISTANT ---------- */
// Your Cloudflare Worker (the proxy). The Gemini key is stored there as a secret — never here.
const AI_URL = "https://gradx-ai.thayrksasbh652.workers.dev";

const aiSuggestions = () => ({
  student: [
    L("Suggest 3 graduation project ideas in web development", "اقترحلي 3 أفكار مشاريع تخرج بتطوير الويب"),
    L("Split my project into tasks for a team of 4", "قسّم مشروعي لمهام لفريق من 4 أشخاص"),
    L("How do I write a good project abstract?", "كيف بكتب ملخص (Abstract) قوي لمشروعي؟"),
    L("Which database should I use: MySQL or PostgreSQL?", "أي قاعدة بيانات أستخدم: MySQL ولا PostgreSQL؟"),
  ],
  supervisor: [
    L("Give me a checklist to review a project proposal", "أعطيني قائمة نقاط لمراجعة مقترح مشروع تخرج"),
    L("How do I grade a graduation project fairly?", "كيف بقيّم مشروع تخرج بشكل عادل؟"),
    L("Write feedback for a team that missed a deadline", "اكتب ملاحظة لفريق تأخر عن موعد التسليم"),
    L("Suggest 3 research-based project ideas for students", "اقترح 3 أفكار مشاريع بحثية للطلاب"),
  ],
})[state.role];

// Very small Markdown → HTML: escape first (safety), then **bold**, `code`, lists and paragraphs
function formatAI(text) {
  const lines = esc(text).split("\n");
  let html = "", list = null;
  const inline = (t) => t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
  const close = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const raw of lines) {
    const line = raw.trim();
    const ol = line.match(/^\d+[.)]\s+(.*)/), ul = line.match(/^[-*•]\s+(.*)/);
    if (ol || ul) {
      const type = ol ? "ol" : "ul";
      if (list !== type) { close(); html += `<${type}>`; list = type; }
      html += `<li>${inline((ol || ul)[1])}</li>`;
    } else if (!line) close();
    else { close(); html += `<p>${inline(line.replace(/^#+\s*/, ""))}</p>`; }
  }
  close();
  return html;
}

function aiMessagesHTML() {
  const { messages, loading } = state.ai;
  if (!messages.length && !loading) {
    return `
      <div class="ai-empty">
        <span class="ai-empty__icon">${icon("sparkles", 28)}</span>
        <h2 class="section-title">${L("How can I help with your project?", "كيف بقدر أساعدك بمشروعك؟")}</h2>
        <p class="body-sm">${L("Ask anything about ideas, planning, writing or technologies — or pick a suggestion below.", "اسأل عن الأفكار، التخطيط، الكتابة أو التقنيات، أو اختار سؤال من تحت.")}</p>
      </div>`;
  }
  const bubbles = messages.map((m) => m.role === "user"
    ? `<div class="ai-msg ai-msg--user"><div class="ai-bubble" dir="auto">${esc(m.text)}</div></div>`
    : `<div class="ai-msg ai-msg--bot${m.error ? " ai-msg--error" : ""}">
         <span class="ai-avatar">${icon(m.error ? "alert" : "sparkles", 16)}</span>
         <div class="ai-bubble" dir="auto">${m.error ? esc(m.text) : formatAI(m.text)}</div>
       </div>`).join("");
  const typing = loading
    ? `<div class="ai-msg ai-msg--bot"><span class="ai-avatar">${icon("sparkles", 16)}</span>
         <div class="ai-bubble ai-typing" aria-label="${L("GradX AI is typing", "المساعد عم يكتب")}"><i></i><i></i><i></i></div></div>`
    : "";
  return bubbles + typing;
}

function aiView() {
  return `
    ${pageHead({ eyebrow: L("POWERED BY GEMINI", "بدعم من Gemini"), title: L("AI Assistant", "المساعد الذكي"),
      subtitle: L("Your graduation-project helper — ideas, planning, writing and technical questions.", "مساعدك بمشروع التخرج: أفكار، تخطيط، كتابة، وأسئلة تقنية.") })}
    <section class="card ai-card">
      <div class="ai-messages" id="ai-messages" data-lenis-prevent aria-live="polite">${aiMessagesHTML()}</div>
      <div class="ai-suggest" id="ai-suggest" ${state.ai.messages.length ? "hidden" : ""}>
        ${aiSuggestions().map((q) => `<button type="button" class="ai-chip" data-ai-q="${esc(q)}">${esc(q)}</button>`).join("")}
      </div>
      <form class="ai-form" id="ai-form">
        <textarea id="ai-input" name="q" rows="1" maxlength="2000" dir="auto" placeholder="${L("Ask GradX AI…", "اسأل المساعد الذكي…")}" aria-label="${L("Your question", "سؤالك")}"></textarea>
        <button type="submit" class="btn btn--primary ai-send" id="ai-send" aria-label="${L("Send", "إرسال")}">${icon("send", 18)}</button>
      </form>
      <p class="ai-note">${L("AI answers can be wrong — check important information with your supervisor.", "إجابات الذكاء الاصطناعي ممكن تكون غلط، فتأكد من المعلومات المهمة مع مشرفك.")}</p>
    </section>`;
}

function renderAIMessages() {
  const box = $("#ai-messages");
  if (!box) return; // the user left the page while waiting
  box.innerHTML = aiMessagesHTML();
  box.scrollTop = box.scrollHeight;
  const sug = $("#ai-suggest");
  if (sug) sug.hidden = state.ai.messages.length > 0;
  const send = $("#ai-send");
  if (send) send.disabled = state.ai.loading;
}

// Sends the question to the Worker; the Worker adds the secret key and calls Gemini
async function askAI(question) {
  const q = question.trim();
  if (!q || state.ai.loading || !can("use_ai")) return;
  state.ai.messages.push({ role: "user", text: q });
  state.ai.loading = true;
  renderAIMessages();

  try {
    const roleNote = state.role === "supervisor" ? "I am a graduation-project supervisor." : "I am a Computer Science student working on my graduation project.";
    // The answer comes back in the language the site is showing
    const langNote = state.lang === "ar" ? "Answer in Arabic, and keep technical terms in English." : "Answer in English.";
    const res = await fetch(AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${roleNote} ${langNote}\n\n${q}` }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || `Request failed (${res.status})`);
    state.ai.messages.push({ role: "bot", text: data.text });
  } catch (err) {
    const busy = /high demand|overloaded|quota|rate/i.test(err.message);
    state.ai.messages.push({ role: "bot", error: true,
      text: busy ? L("The AI is busy right now. Please try again in a minute.", "المساعد مشغول هلأ. جرّب كمان دقيقة.")
                 : L(`Couldn’t reach the AI (${err.message}). Check your connection and try again.`, `ما قدرنا نوصل للمساعد (${err.message}). تأكد من الإنترنت وجرّب مرة ثانية.`) });
  } finally {
    state.ai.loading = false;
    renderAIMessages();
  }
}

/* A page that isn't designed yet: shows what THIS role will be able to do there */
function placeholderView(id) {
  const abilities = pageAbilities(id);
  return `
    <section class="card placeholder">
      ${tile(PAGES[id].icon, "accent")}
      <h1 class="section-title">${pageLabel(id)}</h1>
      <p class="body-sm">${L(`This page isn’t designed yet. Here’s what you’ll be able to do as a ${roleLabel(state.role).toLowerCase()}:`, `هاي الصفحة لسا قيد التصميم. شو رح تقدر تعمل فيها ك${roleLabel(state.role)}:`)}</p>
      ${abilities.length ? `<ul class="abilities">${abilities.map((a) => `<li>${icon("check", 16)}${a}</li>`).join("")}</ul>` : ""}
      <a class="btn btn--secondary" href="#dashboard">${L("Back to dashboard", "رجوع للوحة التحكم")}</a>
    </section>`;
}

/* Shown when a role opens a page that belongs to the other role (e.g. a student types #grading) */
function deniedView(id) {
  const owner = state.role === "student" ? "supervisor" : "student";
  return `
    <section class="card denied">
      ${tile("lock", "danger")}
      <h1 class="section-title">${L("You don’t have permission to open this page", "ما عندك صلاحية تفتح هاي الصفحة")}</h1>
      <p class="body-sm">${L(`“${pageLabel(id, owner)}” is only for ${roleThe(owner)}. If you think this is a mistake, contact the department.`,
                             `صفحة «${pageLabel(id, owner)}» خاصة ${roleThe(owner)}. إذا بتعتقد إنه في غلط، تواصل مع إدارة القسم.`)}</p>
      <a class="btn btn--secondary" href="#profile">${L("See your permissions", "شوف صلاحياتك")}</a>
    </section>`;
}

function notFoundView() {
  return `
    <section class="card placeholder">
      ${tile("alert", "accent")}
      <h1 class="section-title">${L("Page not found", "الصفحة مش موجودة")}</h1>
      <a class="btn btn--secondary" href="#dashboard">${L("Back to dashboard", "رجوع للوحة التحكم")}</a>
    </section>`;
}

/* ---------- 7. ROUTER ---------- */
function currentRoute() {
  return location.hash.replace(/^#\/?/, "") || "dashboard";
}

function render() {
  let route = currentRoute();
  // Route guard 1: no session → login page; already signed in → skip the login page
  if (!state.loggedIn && route !== "login") { history.replaceState(null, "", "#login"); route = "login"; }
  if (state.loggedIn && route === "login") { history.replaceState(null, "", "#dashboard"); route = "dashboard"; }

  const view = $("#view");
  document.body.classList.toggle("is-auth", route === "login"); // hides sidebar + top bar

  // Route guard 2: permissions — every page checks canOpen() before it shows anything
  if (route === "login") view.innerHTML = loginView();
  else if (!PAGES[route]) view.innerHTML = notFoundView();
  else if (!canOpen(route)) view.innerHTML = deniedView(route);
  else if (route === "profile") view.innerHTML = profileView();
  else if (route === "dashboard") view.innerHTML = state.role === "student" ? studentDashboard() : supervisorDashboard();
  else if (route === "archive") view.innerHTML = archiveView();
  else if (route === "ai") view.innerHTML = aiView();
  else view.innerHTML = placeholderView(route);

  // CSS fallback entrance (only visible when GSAP didn't load)
  view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";

  renderSidebar(route);
  renderUser();
  animateProgress();
  closeSidebar();
  scrollToTop();
  animatePage();
  // The archive cards are rendered after animatePage(), because animatePage() clears old ScrollTriggers
  if (route === "archive" && canOpen("archive")) renderProjects();
  if (route === "ai" && canOpen("ai")) renderAIMessages();
}

function renderSidebar(route) {
  // The menu only lists pages this role is allowed to open
  $("#nav-list").innerHTML = MENUS[state.role].filter(canOpen).map((id) => {
    const count = COUNTS[state.role][id];
    return `
    <li>
      <a class="nav__link ${id === route ? "is-active" : ""}" href="#${id}" ${id === route ? 'aria-current="page"' : ""}>
        ${icon(PAGES[id].icon)}
        <span class="nav__label">${pageLabel(id)}</span>
        ${count ? `<span class="nav__count">${count}</span>` : ""}
      </a>
    </li>`;
  }).join("");

  $("#nav-footer").innerHTML = `
    <li><a class="nav__link" href="#" data-toast="${soon(L("Settings", "الإعدادات"))}">${icon("settings")}<span class="nav__label">${L("Settings", "الإعدادات")}</span></a></li>
    <li><button class="nav__link nav__link--danger" style="width:100%" data-action="logout">${icon("logout")}<span class="nav__label">${L("Log out", "تسجيل الخروج")}</span></button></li>`;
}

function renderUser() {
  const u = users()[state.role];
  $("#user-name").textContent = u.name;
  $("#user-role").textContent = u.role;
  $("#user-avatar").textContent = u.initials;
}

function animateProgress() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".progress__value").forEach((el) => {
      el.style.setProperty("--value", el.dataset.value + "%");
    });
  });
}

/* ---------- 8. MOTION (Lenis + GSAP) ---------- */
// If the device asks for less motion, we skip every animation
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// The libraries come from a CDN. Without internet they're missing, and the site must still work
const hasGsap = !reduceMotion && typeof window.gsap !== "undefined";
let lenis = null;
let projectTriggers = [];

function setupMotion() {
  if (hasGsap) {
    document.documentElement.classList.add("has-motion");
    gsap.registerPlugin(...[window.ScrollTrigger, window.SplitText].filter(Boolean));
  }

  if (!reduceMotion && typeof window.Lenis !== "undefined") {
    // With GSAP we drive Lenis ourselves (below), so autoRaf is only used when GSAP is missing
    lenis = new Lenis({ lerp: 0.1, autoRaf: !hasGsap });

    if (hasGsap) {
      // One clock for both libraries: GSAP's ticker moves Lenis every frame,
      // and every Lenis scroll tells ScrollTrigger to re-check positions
      if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000)); // GSAP gives seconds, Lenis wants ms
      gsap.ticker.lagSmoothing(0);
    }
  }
}

function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo({ top: 0 });
}

function animatePage() {
  if (!hasGsap) return;
  if (window.ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
  const view = $("#view");

  // 1. Each section slides up, one after another (stagger)
  gsap.from(view.children, {
    y: 18, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.07,
    clearProps: "transform,opacity,visibility",
  });

  // 2. The page title appears letter by letter (like React Bits "SplitText").
  //    Arabic letters are joined to each other, so in Arabic we split by WORDS instead.
  const title = view.querySelector(".page-title");
  if (title && window.SplitText) {
    const ar = state.lang === "ar";
    const split = SplitText.create(title, { type: ar ? "words" : "words,chars" });
    gsap.from(ar ? split.words : split.chars, {
      yPercent: 60, autoAlpha: 0, duration: 0.5, ease: "power3.out", stagger: 0.018,
      onComplete: () => split.revert(), // put the plain text back when done
    });
  }

  // 3. Numbers count up from 0 (like React Bits "CountUp")
  view.querySelectorAll(".stat-value").forEach(countUp);
}

function countUp(el) {
  const match = el.textContent.trim().match(/^(\d+)(%?)$/);
  if (!match) return; // "May 12" isn't a plain number, so it's skipped
  const end = Number(match[1]);
  const suffix = match[2];
  const counter = { value: 0 };
  gsap.to(counter, {
    value: end, duration: 1.1, ease: "power2.out",
    onUpdate: () => (el.textContent = Math.round(counter.value) + suffix),
  });
}

// Archive cards fade in as they scroll into view (ScrollTrigger.batch groups cards that enter together)
function animateProjects() {
  if (!hasGsap || !window.ScrollTrigger) return;
  projectTriggers.forEach((t) => t.kill()); // remove triggers from the previous filter result
  const cards = gsap.utils.toArray("#projects .project");
  gsap.set(cards, { y: 24, autoAlpha: 0 });
  projectTriggers = ScrollTrigger.batch(cards, {
    start: "top 95%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out", stagger: 0.07, overwrite: true }),
  });
}

/* ---------- 9. EVENTS ---------- */
let toastTimer;
function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2200);
}

function openSidebar() { $("#sidebar").classList.add("is-open"); $("#backdrop").classList.add("is-visible"); }
function closeSidebar() { $("#sidebar").classList.remove("is-open"); $("#backdrop").classList.remove("is-visible"); }

function toggleUserMenu(open) {
  const btn = $("#user-btn");
  const isOpen = open ?? btn.getAttribute("aria-expanded") !== "true";
  btn.setAttribute("aria-expanded", String(isOpen));
  $("#user-menu").classList.toggle("is-open", isOpen);
}

function setFieldError(field, message) {
  field.classList.toggle("has-error", Boolean(message));
  field.querySelector(".field__error").textContent = message;
  const input = field.querySelector("input");
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function handleLogin(form) {
  const email = form.email.value.trim();
  const password = form.password.value;
  const role = form.role.value === "supervisor" ? "supervisor" : "student";
  const emailField = form.email.closest(".field");
  const passField = form.password.closest(".field");

  // 1. Validate (the backend must check again — never trust the browser alone)
  let ok = true;
  if (!email) { setFieldError(emailField, L("Enter your university email.", "اكتب بريدك الجامعي.")); ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError(emailField, L("That doesn’t look like an email. Check for typos.", "هاد مش شكل إيميل صحيح. تأكد من الكتابة.")); ok = false; }
  if (password.length < 6) { setFieldError(passField, L("Password must be at least 6 characters.", "كلمة السر لازم تكون 6 أحرف على الأقل.")); ok = false; }
  if (!ok) { form.querySelector("[aria-invalid='true']").focus(); return; }

  // 2. Fake "request to the server" — shows the loading state for a moment
  const btn = $("#login-submit");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span>${L("Signing in…", "جاري تسجيل الدخول…")}`;

  setTimeout(() => {
    state.loggedIn = true;
    state.role = role;
    state.email = email;
    state.ai = { messages: [], loading: false }; // a new person starts a new chat
    saveRole(role);
    saveEmail(email);
    if (form.remember.checked) saveSession(true); // "Keep me signed in" survives a refresh
    location.hash = "#dashboard";
    toast(L(`Welcome back, ${users()[role].first}`, `أهلًا فيك، ${users()[role].first}`));
  }, 700);
}

function logout() {
  state.loggedIn = false;
  state.email = "";
  state.ai = { messages: [], loading: false };
  saveSession(false);
  saveEmail("");
  toggleUserMenu(false);
  location.hash = "#login";
  toast(L("You’ve been signed out", "تم تسجيل الخروج"));
}

function init() {
  setupMotion();
  applyLanguage(); // English or Arabic, from the saved choice

  // Spotlight: tell the hovered card where the mouse is (CSS draws the light)
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  // Fill the static icons that live in index.html (data-icon="bell" → SVG)
  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon, el.dataset.icon === "chevronDown" ? 18 : 20)));
  $("#menu-btn").innerHTML = icon("menu");

  // Event delegation: one listener on document handles every button, even ones rendered later
  document.addEventListener("click", (e) => {
    const toastEl = e.target.closest("[data-toast]");
    if (toastEl) { e.preventDefault(); toast(toastEl.dataset.toast); }

    if (e.target.closest('[data-action="logout"]')) { logout(); return; }
    if (e.target.closest('[data-action="toggle-lang"]')) { toggleLanguage(); return; }

    if (e.target.closest("#user-btn")) toggleUserMenu();
    else if (!e.target.closest("#user-menu") || e.target.closest("#menu-profile")) toggleUserMenu(false);

    if (e.target.closest("#reset-filters")) {
      state.filters = { q: "", year: "all", supervisor: "all", tech: "all", sort: state.filters.sort };
      render();
    }
    if (e.target.closest("#sort-btn")) {
      state.filters.sort = state.filters.sort === "newest" ? "oldest" : "newest";
      renderProjects();
    }

    // AI suggestion chips
    const chip = e.target.closest("[data-ai-q]");
    if (chip) askAI(chip.dataset.aiQ);

    // Show / hide password
    const eyeBtn = e.target.closest("#toggle-password");
    if (eyeBtn) {
      const input = $("#login-password");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      eyeBtn.innerHTML = icon(show ? "eyeOff" : "eye", 18);
      eyeBtn.setAttribute("aria-label", show ? L("Hide password", "إخفاء كلمة السر") : L("Show password", "إظهار كلمة السر"));
    }
  });

  // Forms: login + AI question (every other form just doesn't reload the page)
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.id === "ai-form") {
      const input = $("#ai-input");
      askAI(input.value);
      input.value = ""; input.style.height = "";
    } else if (e.target.id === "login-form") {
      handleLogin(e.target);
    }
  });

  // AI: Enter sends, Shift+Enter makes a new line
  document.addEventListener("keydown", (e) => {
    if (e.target.id === "ai-input" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $("#ai-form").requestSubmit();
    }
    if (e.key === "Escape") { closeSidebar(); toggleUserMenu(false); }
  });

  document.addEventListener("input", (e) => {
    // AI textarea grows with the text
    if (e.target.id === "ai-input") {
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
    }
    // Clear a login field's error as soon as the user edits it
    if (e.target.closest("#login-form")) {
      const field = e.target.closest(".field");
      if (field) setFieldError(field, "");
    }
    // Archive filters: "input" fires on every keystroke and every select change
    if (e.target.closest("#filters")) {
      state.filters[e.target.name] = e.target.value;
      renderProjects();
    }
  });

  // Top-bar search → jump to the archive with the query applied
  $("#global-search").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    state.filters.q = e.target.value;
    e.target.value = "";
    location.hash = "#archive";
    if (currentRoute() === "archive") render();
  });

  $("#menu-btn").addEventListener("click", openSidebar);
  $("#backdrop").addEventListener("click", closeSidebar);

  window.addEventListener("hashchange", render);
  render();
}

init();