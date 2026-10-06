/**
 * Extract serialized props from Astro island elements in HTML pages.
 * The data is in the 'props' attribute of astro-island elements,
 * encoded in Astro's serialization format.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const BASE = 'https://hynts.in';
const OUT = resolve('src/data');
mkdirSync(OUT, { recursive: true });

async function fetchHTML(path) {
  console.log(`Fetching: ${BASE}${path}`);
  const res = await fetch(`${BASE}${path}`);
  return res.text();
}

/**
 * Decode Astro's serialized props format.
 * Format: JSON with type-tagged values like [0, value], [1, [items]], etc.
 */
function decodeAstroValue(tagged) {
  if (!Array.isArray(tagged)) return tagged;
  const [type, val] = tagged;
  switch (type) {
    case 0: // object
      if (typeof val !== 'object' || val === null) return val;
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, decodeAstroValue(v)])
      );
    case 1: // array
      return val.map(decodeAstroValue);
    case 2: return new RegExp(val);
    case 3: return new Date(val);
    case 4: return new Map(val.map(decodeAstroValue));
    case 5: return new Set(val.map(decodeAstroValue));
    case 6: return BigInt(val);
    case 7: return val; // URL as string
    default: return val;
  }
}

function extractProps(html) {
  const propsMatches = [];
  // Find all astro-island elements with props
  const regex = /props="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      // Decode HTML entities
      const decoded = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#38;/g, '&')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'");
      const parsed = JSON.parse(decoded);
      const result = decodeAstroValue([0, parsed]);
      propsMatches.push(result);
    } catch (e) {
      // Skip non-JSON props
    }
  }
  return propsMatches;
}

function saveJSON(filename, data) {
  const path = resolve(OUT, filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`  Saved: ${filename} (${JSON.stringify(data).length} bytes)`);
}

async function extractPage(path, label) {
  console.log(`\n=== ${label} ===`);
  const html = await fetchHTML(path);
  const props = extractProps(html);
  
  console.log(`  Found ${props.length} prop sets`);
  
  for (let i = 0; i < props.length; i++) {
    const p = props[i];
    const keys = Object.keys(p);
    console.log(`  Props[${i}]: keys = ${keys.join(', ')}`);
    
    // Print interesting field values
    for (const key of keys) {
      const val = p[key];
      if (Array.isArray(val)) {
        console.log(`    ${key}: Array[${val.length}]`);
        if (val.length > 0 && typeof val[0] === 'object') {
          console.log(`      Sample: ${JSON.stringify(val[0]).substring(0, 200)}`);
        }
      } else if (typeof val === 'object' && val !== null) {
        console.log(`    ${key}: Object keys = ${Object.keys(val).join(', ')}`);
      } else {
        const str = String(val);
        console.log(`    ${key}: ${str.substring(0, 100)}`);
      }
    }
  }
  
  return { html, props };
}

async function main() {
  const report = {};
  
  // 1. Company Wise DSA
  const company = await extractPage('/preparation/company-wise-dsa-sheet/', 'Company Wise DSA Sheet');
  if (company.props.length > 0) {
    saveJSON('companies-raw.json', company.props);
  }
  
  // 2. A sample company detail page (Google)
  const googleDetail = await extractPage('/preparation/company-wise-dsa-sheet/google-dsa-interview-questions/', 'Google DSA Questions');
  if (googleDetail.props.length > 0) {
    saveJSON('google-questions-raw.json', googleDetail.props);
  }
  
  // 3. DSA Patterns
  const patterns = await extractPage('/preparation/20-essential-dsa-patterns/', '20 DSA Patterns');
  if (patterns.props.length > 0) {
    saveJSON('dsa-patterns-raw.json', patterns.props);
  }
  
  // 4. Package Wise DSA
  const packageDsa = await extractPage('/preparation/package-wise-dsa-sheet/', 'Package Wise DSA');
  if (packageDsa.props.length > 0) {
    saveJSON('package-dsa-raw.json', packageDsa.props);
  }
  
  // 5. SQL Sheet
  const sql = await extractPage('/preparation/sql-sheet/', 'SQL Sheet');
  if (sql.props.length > 0) {
    saveJSON('sql-raw.json', sql.props);
  }
  
  // 6. System Design Sheet
  const sd = await extractPage('/preparation/system-design-sheet/', 'System Design Sheet');
  if (sd.props.length > 0) {
    saveJSON('system-design-raw.json', sd.props);
  }
  
  // 7. Role Wise
  const roles = await extractPage('/preparation/role-wise/', 'Role Wise');
  if (roles.props.length > 0) {
    saveJSON('roles-raw.json', roles.props);
  }
  
  // 8. Most Asked Questions
  const mostAsked = await extractPage('/preparation/most-asked-questions/', 'Most Asked Questions');
  if (mostAsked.props.length > 0) {
    saveJSON('most-asked-raw.json', mostAsked.props);
  }
  
  // 9. HR Questions
  const hr = await extractPage('/preparation/hr-questions/', 'HR Questions');
  if (hr.props.length > 0) {
    saveJSON('hr-raw.json', hr.props);
  }
  
  // 10. DSA Playlists
  const dsaPlaylists = await extractPage('/preparation/dsa-playlists/', 'DSA Playlists');
  if (dsaPlaylists.props.length > 0) {
    saveJSON('dsa-playlists-raw.json', dsaPlaylists.props);
  }
  
  // 11. Core Subjects (DBMS Playlists)
  const coreSubjects = await extractPage('/preparation/dbms-playlists/', 'Core Subjects');
  if (coreSubjects.props.length > 0) {
    saveJSON('core-subjects-raw.json', coreSubjects.props);
  }
  
  // 12. System Design Playlists
  const sdPlaylists = await extractPage('/preparation/system-design-playlists/', 'System Design Playlists');
  if (sdPlaylists.props.length > 0) {
    saveJSON('sd-playlists-raw.json', sdPlaylists.props);
  }
  
  // 13. Cold Email Templates
  const coldEmails = await extractPage('/preparation/cold-email-templets/', 'Cold Email Templates');
  if (coldEmails.props.length > 0) {
    saveJSON('cold-emails-raw.json', coldEmails.props);
  }
  
  // 14. Cool Notes
  const notes = await extractPage('/preparation/notes/', 'Cool Notes');
  if (notes.props.length > 0) {
    saveJSON('notes-raw.json', notes.props);
  }
  
  // 15. Resume Templates
  const resumes = await extractPage('/preparation/resume-templates/', 'Resume Templates');
  if (resumes.props.length > 0) {
    saveJSON('resumes-raw.json', resumes.props);
  }
  
  // 16. Dashboard
  const dashboard = await extractPage('/preparation/', 'Dashboard');
  if (dashboard.props.length > 0) {
    saveJSON('dashboard-raw.json', dashboard.props);
  }
  
  console.log('\n=== Extraction Complete ===');
}

main().catch(console.error);
