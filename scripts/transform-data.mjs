/**
 * Transform raw extracted data into clean, structured JSON files
 * for the application to consume.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const RAW = resolve('src/data');
const OUT = resolve('src/data/clean');
mkdirSync(OUT, { recursive: true });

function readJSON(filename) {
  return JSON.parse(readFileSync(resolve(RAW, filename), 'utf8'));
}

function saveJSON(filename, data) {
  writeFileSync(resolve(OUT, filename), JSON.stringify(data, null, 2));
  const size = JSON.stringify(data).length;
  console.log(`  ✓ ${filename} (${(size/1024).toFixed(1)}KB)`);
}

// ===== COMPANIES =====
console.log('=== Companies ===');
const companiesRaw = readJSON('companies-raw.json');
const companies = companiesRaw[1].companies.map((c, i) => ({
  id: c.href.split('/').filter(Boolean).pop(),
  name: c.name,
  description: c.description,
  questionCount: c.questionCount,
  logoSrc: c.logoSrc,
  href: c.href,
  index: i + 1,
}));
saveJSON('companies.json', companies);

// ===== ALL COMPANY QUESTIONS =====
console.log('=== Company Questions ===');
const allCompanyQ = readJSON('all-company-questions.json');
const companyQuestions = {};
for (const [slug, data] of Object.entries(allCompanyQ)) {
  companyQuestions[slug] = {
    companyName: data.companyName,
    description: data.description,
    logoSrc: data.logoSrc,
    totalQuestions: data.totalQuestions,
    storageKey: data.storageKey,
    slug: data.slug,
    href: data.href,
    questions: data.questions.map(q => ({
      index: q.index,
      title: q.question_name,
      tags: q.tags || [],
      provider: q.platform_name,
      providerUrl: q.platform_link,
      difficulty: q.difficulty,
      popularity: q.question_popularity,
    })),
  };
}
saveJSON('company-questions.json', companyQuestions);

// Count totals
let totalCompanyQuestions = 0;
for (const data of Object.values(companyQuestions)) {
  totalCompanyQuestions += data.questions.length;
}
console.log(`  Total: ${totalCompanyQuestions} questions across ${Object.keys(companyQuestions).length} companies`);

// ===== DSA PATTERNS =====
console.log('=== DSA Patterns ===');
const patternsRaw = readJSON('dsa-patterns-raw.json');
const patternsData = patternsRaw[1];
const dsaPatterns = {
  title: patternsData.title,
  description: patternsData.description,
  creatorName: patternsData.creatorName,
  totalProblems: patternsData.totalProblems,
  storageKey: patternsData.storageKey,
  hasVideoLinks: patternsData.hasVideoLinks,
  sections: patternsData.sections.map(s => ({
    topic: s.topic,
    subTopic: s.subTopic,
    problems: s.problems.map(p => ({
      id: p._id,
      title: p.title,
      problemUrl: p.problemUrl,
      platform: p.platform,
      difficulty: p.difficulty,
      videoUrl: p.videoUrl || null,
    })),
  })),
};
saveJSON('dsa-patterns.json', dsaPatterns);

// ===== PACKAGE WISE DSA =====
console.log('=== Package Wise DSA ===');
const packageRaw = readJSON('package-dsa-raw.json');
const packageData = packageRaw[1];
const packageDsa = {
  title: packageData.title,
  description: packageData.description,
  totalQuestions: packageData.totalQuestions,
  storageKey: packageData.storageKey,
  packages: packageData.packages,
  questions: packageData.questions.map(q => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    package: q.package,
    topic: q.topic,
    leetcode: q.leetcode || '',
    gfg: q.gfg || '',
  })),
};
saveJSON('package-dsa.json', packageDsa);

// ===== SQL SHEET =====
console.log('=== SQL Sheet ===');
const sqlRaw = readJSON('sql-raw.json');
const sqlData = sqlRaw[1];
const sql = {
  title: sqlData.title,
  description: sqlData.description,
  totalQuestions: sqlData.totalQuestions,
  storageKey: sqlData.storageKey,
  questions: sqlData.questions.map(q => ({
    index: q.index,
    title: q.title,
    answer: q.answer,
    difficulty: q.difficulty,
    category: q.category,
  })),
};
saveJSON('sql.json', sql);

// ===== SYSTEM DESIGN =====
console.log('=== System Design ===');
const sdRaw = readJSON('system-design-raw.json');
const sdData = sdRaw[1];
const systemDesign = {
  title: sdData.title,
  description: sdData.description,
  totalQuestions: sdData.totalQuestions,
  storageKey: sdData.storageKey,
  questions: sdData.questions.map(q => ({
    id: q.id,
    title: q.title,
    type: q.type,
    articleLink: q.articleLink || '',
    ytLink: q.ytLink || '',
  })),
};
saveJSON('system-design.json', systemDesign);

// ===== ROLES =====
console.log('=== Roles ===');
const rolesRaw = readJSON('roles-raw.json');
const rolesData = rolesRaw[1];
const roles = {
  categories: rolesData.categories.map(cat => ({
    title: cat.title,
    roles: cat.roles.map(r => ({
      slug: r.slug,
      displayName: r.displayName,
      category: r.category,
      metadata: {
        listName: r.data?.metadata?.list_name,
        totalQuestions: r.data?.metadata?.total_questions,
        description: r.data?.metadata?.description,
        storageKey: r.data?.metadata?.storage_key,
      },
      questions: (r.data?.questions || []).map((q, i) => ({
        index: i + 1,
        title: q.title,
        answer: q.answer || '',
      })),
    })),
  })),
};
saveJSON('roles.json', roles);

// Count role totals
let totalRoles = 0;
let totalRoleQuestions = 0;
for (const cat of roles.categories) {
  totalRoles += cat.roles.length;
  for (const role of cat.roles) {
    totalRoleQuestions += role.questions.length;
  }
}
console.log(`  Total: ${totalRoleQuestions} questions across ${totalRoles} roles`);

// ===== MOST ASKED QUESTIONS INDEX =====
console.log('=== Most Asked Questions ===');
const mostAskedRaw = readJSON('most-asked-raw.json');
const mostAskedData = mostAskedRaw[1];
const mostAsked = {
  categories: mostAskedData.categories.map(cat => ({
    title: cat.title,
    questions: cat.questions.map(q => ({
      title: q.title,
      icon: q.icon,
      href: q.href,
      description: q.description,
      questionCount: q.questionCount,
    })),
  })),
};
saveJSON('most-asked-index.json', mostAsked);

// ===== ALL TECH QUESTIONS =====
console.log('=== Tech Questions ===');
const allTechQ = readJSON('all-tech-questions.json');
const techQuestions = {};
for (const [slug, data] of Object.entries(allTechQ)) {
  techQuestions[slug] = {
    title: data.title,
    description: data.description,
    icon: data.icon,
    totalQuestions: data.totalQuestions,
    storageKey: data.storageKey,
    slug: data.slug,
    href: data.href,
    category: data.category,
    questions: (data.questions || []).map(q => ({
      index: q.index,
      title: q.title,
      answer: q.answer || '',
      difficulty: q.difficulty,
      category: q.category,
    })),
  };
}
saveJSON('tech-questions.json', techQuestions);

let totalTechQ = 0;
for (const data of Object.values(techQuestions)) {
  totalTechQ += data.questions.length;
}
console.log(`  Total: ${totalTechQ} questions across ${Object.keys(techQuestions).length} subjects`);

// ===== HR QUESTIONS =====
console.log('=== HR Questions ===');
const hrRaw = readJSON('hr-raw.json');
const hrData = hrRaw[1];
const hr = {
  totalQuestions: hrData.totalQuestions,
  storageKey: hrData.storageKey,
  questions: hrData.questions.map(q => ({
    index: q.index,
    title: q.title,
    answer: q.answer,
    difficulty: q.difficulty,
    category: q.category,
  })),
};
saveJSON('hr.json', hr);

// ===== COLD EMAILS =====
console.log('=== Cold Emails ===');
const coldEmailsIndex = readJSON('cold-emails-raw.json');
const coldEmailsDetail = readJSON('all-email-templates.json');
const coldEmails = {
  categories: coldEmailsIndex[1].categories.map(cat => ({
    title: cat.title,
    templates: cat.templates.map(t => ({
      id: t.id,
      title: t.title,
      role: t.role,
      category: t.category || cat.title,
    })),
  })),
  templates: coldEmailsDetail,
};
saveJSON('cold-emails.json', coldEmails);

// ===== NOTES =====
console.log('=== Notes ===');
const notesRaw = readJSON('notes-raw.json');
const notesData = notesRaw[1];
const notes = notesData.allNotes.map(n => ({
  id: n.id,
  title: n.title,
  description: n.description,
  category: n.category,
  fileUrl: n.file_url,
  iconUrl: n.icon_url || null,
  createdAt: n.created_at || null,
}));
saveJSON('notes.json', notes);

// ===== RESUME TEMPLATES =====
console.log('=== Resume Templates ===');
const resumesRaw = readJSON('resumes-raw.json');
const resumesData = resumesRaw[1];
const resumes = resumesData.templates.map(t => ({
  id: t.id,
  name: t.name,
  image: t.image,
  link: t.link,
}));
saveJSON('resumes.json', resumes);

// ===== SITE MAP =====
console.log('=== Site Map ===');
const siteMap = {
  dashboard: '/preparation',
  sections: {
    sheets: {
      label: 'Sheets',
      items: [
        { label: 'DSA Sheets', href: '/preparation/dsa-sheets', icon: 'FileCode' },
        { label: 'Company Wise DSA', href: '/preparation/company-wise-dsa-sheet', icon: 'Building2' },
        { label: '20 DSA Patterns', href: '/preparation/20-essential-dsa-patterns', icon: 'Fingerprint' },
        { label: 'Package Wise DSA', href: '/preparation/package-wise-dsa-sheet', icon: 'BadgeDollarSign' },
        { label: 'SQL Sheet', href: '/preparation/sql-sheet', icon: 'Database' },
        { label: 'System Design Sheet', href: '/preparation/system-design-sheet', icon: 'Boxes' },
      ],
    },
    learning: {
      label: 'Start Learning',
      items: [
        { label: 'DSA Playlists', href: '/preparation/dsa-playlists', icon: 'MonitorPlay' },
        { label: 'Core Subjects', href: '/preparation/dbms-playlists', icon: 'BookOpen' },
        { label: 'System Design Playlists', href: '/preparation/system-design-playlists', icon: 'Boxes' },
      ],
    },
    resources: {
      label: 'Resources',
      items: [
        { label: 'Role Wise', href: '/preparation/role-wise', icon: 'Users' },
        { label: 'Interview Questions', href: '/preparation/most-asked-questions', icon: 'Sparkles' },
        { label: 'HR Questions', href: '/preparation/hr-questions', icon: 'MessageSquare' },
        { label: 'Cold Email Templates', href: '/preparation/cold-email-templets', icon: 'Mail' },
        { label: 'Cool Notes', href: '/preparation/notes', icon: 'NotebookText' },
        { label: 'Resume Templates', href: '/preparation/resume-templates', icon: 'FileText' },
      ],
    },
  },
};
saveJSON('site-map.json', siteMap);

console.log('\n=== Transformation Complete ===');
console.log(`Companies: ${companies.length} (${totalCompanyQuestions} questions)`);
console.log(`Tech Subjects: ${Object.keys(techQuestions).length} (${totalTechQ} questions)`);
console.log(`Roles: ${totalRoles} (${totalRoleQuestions} questions)`);
console.log(`HR: ${hr.questions.length} questions`);
console.log(`SQL: ${sql.questions.length} questions`);
console.log(`System Design: ${systemDesign.questions.length} questions`);
console.log(`DSA Patterns: ${dsaPatterns.totalProblems} problems`);
console.log(`Package DSA: ${packageDsa.questions.length} questions`);
console.log(`Cold Emails: ${Object.keys(coldEmailsDetail).length} templates`);
console.log(`Notes: ${notes.length}`);
console.log(`Resumes: ${resumes.length}`);
