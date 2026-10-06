/**
 * Extract ALL company detail pages and most-asked-questions detail pages.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const BASE = 'https://hynts.in';
const OUT = resolve('src/data');

function decodeAstroValue(tagged) {
  if (!Array.isArray(tagged)) return tagged;
  const [type, val] = tagged;
  switch (type) {
    case 0:
      if (typeof val !== 'object' || val === null) return val;
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, decodeAstroValue(v)])
      );
    case 1: return val.map(decodeAstroValue);
    default: return val;
  }
}

function extractProps(html) {
  const regex = /props="([^"]+)"/g;
  let match;
  const results = [];
  while ((match = regex.exec(html)) !== null) {
    try {
      const decoded = match[1]
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#38;/g, '&').replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'");
      const parsed = JSON.parse(decoded);
      results.push(decodeAstroValue([0, parsed]));
    } catch (e) {}
  }
  return results;
}

async function fetchAndExtract(path) {
  try {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) return null;
    const html = await res.text();
    return extractProps(html);
  } catch (e) {
    console.error(`Failed: ${path}: ${e.message}`);
    return null;
  }
}

// Delay to be polite
const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  // Load companies list
  const companiesRaw = JSON.parse(readFileSync(resolve(OUT, 'companies-raw.json'), 'utf8'));
  const companies = companiesRaw[1].companies;
  
  console.log(`\n=== Extracting ${companies.length} Company Detail Pages ===\n`);
  
  const allCompanyQuestions = {};
  let totalQuestions = 0;
  
  for (const company of companies) {
    const path = company.href.endsWith('/') ? company.href : company.href + '/';
    process.stdout.write(`  ${company.name} (${company.questionCount} expected)... `);
    
    const props = await fetchAndExtract(path);
    if (props && props.length > 1) {
      const data = props[1];
      const slug = company.href.split('/').filter(Boolean).pop();
      
      allCompanyQuestions[slug] = {
        companyName: data.companyName || company.name,
        description: data.description || company.description,
        logoSrc: data.logoSrc || company.logoSrc,
        totalQuestions: data.totalQuestions || company.questionCount,
        storageKey: data.storageKey,
        questions: data.questions || [],
        slug: slug,
        href: company.href,
      };
      
      totalQuestions += (data.questions || []).length;
      console.log(`✓ ${(data.questions || []).length} questions`);
    } else {
      console.log(`✗ No data found`);
    }
    
    await delay(200); // Be polite with requests
  }
  
  writeFileSync(
    resolve(OUT, 'all-company-questions.json'),
    JSON.stringify(allCompanyQuestions, null, 2)
  );
  
  console.log(`\n  Total companies: ${Object.keys(allCompanyQuestions).length}`);
  console.log(`  Total questions: ${totalQuestions}`);
  
  // Now extract most-asked-questions detail pages
  console.log(`\n=== Extracting Most Asked Questions Detail Pages ===\n`);
  
  const mostAskedRaw = JSON.parse(readFileSync(resolve(OUT, 'most-asked-raw.json'), 'utf8'));
  const categories = mostAskedRaw[1].categories;
  
  const allTechQuestions = {};
  let totalTechQuestions = 0;
  
  for (const cat of categories) {
    for (const q of cat.questions) {
      const path = q.href.endsWith('/') ? q.href : q.href + '/';
      const slug = q.href.split('/').filter(Boolean).pop();
      process.stdout.write(`  ${q.title}... `);
      
      const props = await fetchAndExtract(path);
      if (props && props.length > 1) {
        const data = props[1];
        
        allTechQuestions[slug] = {
          title: data.title || q.title,
          description: data.description || q.description,
          icon: q.icon,
          totalQuestions: data.totalQuestions,
          storageKey: data.storageKey,
          questions: data.questions || [],
          slug: slug,
          href: q.href,
          category: cat.title,
          questionCount: q.questionCount,
        };
        
        const count = (data.questions || []).length;
        totalTechQuestions += count;
        console.log(`✓ ${count} questions`);
      } else {
        console.log(`✗ No data found`);
      }
      
      await delay(200);
    }
  }
  
  writeFileSync(
    resolve(OUT, 'all-tech-questions.json'),
    JSON.stringify(allTechQuestions, null, 2)
  );
  
  console.log(`\n  Total tech subjects: ${Object.keys(allTechQuestions).length}`);
  console.log(`  Total tech questions: ${totalTechQuestions}`);
  
  // Extract cold email template details
  console.log(`\n=== Extracting Cold Email Template Details ===\n`);
  
  const coldRaw = JSON.parse(readFileSync(resolve(OUT, 'cold-emails-raw.json'), 'utf8'));
  const emailCategories = coldRaw[1].categories;
  
  const allEmailTemplates = {};
  
  for (const cat of emailCategories) {
    for (const tmpl of cat.templates) {
      const path = `/preparation/cold-email-templets/${tmpl.id}/`;
      process.stdout.write(`  ${tmpl.title}... `);
      
      const props = await fetchAndExtract(path);
      if (props && props.length > 1) {
        const data = props[1];
        allEmailTemplates[tmpl.id] = {
          ...data,
          category: cat.title,
          id: tmpl.id,
        };
        console.log(`✓`);
      } else {
        console.log(`✗`);
      }
      
      await delay(200);
    }
  }
  
  writeFileSync(
    resolve(OUT, 'all-email-templates.json'),
    JSON.stringify(allEmailTemplates, null, 2)
  );
  
  console.log(`\n  Total email templates: ${Object.keys(allEmailTemplates).length}`);
  
  // Extract DSA playlists page content via HTML parsing
  console.log(`\n=== Extracting Playlist Pages ===\n`);
  
  for (const playlistPage of ['dsa-playlists', 'dbms-playlists', 'system-design-playlists']) {
    process.stdout.write(`  ${playlistPage}... `);
    const res = await fetch(`${BASE}/preparation/${playlistPage}/`);
    const html = await res.text();
    
    // Extract playlist data from HTML - look for YouTube links
    const ytLinks = [...html.matchAll(/href="(https:\/\/(?:www\.)?youtube\.com\/[^"]+)"/g)];
    const channelLinks = [...html.matchAll(/href="(https:\/\/(?:www\.)?youtube\.com\/@[^"]+)"/g)];
    
    console.log(`${ytLinks.length} YouTube links, ${channelLinks.length} channel links`);
    
    // Save raw HTML for further processing
    writeFileSync(resolve(OUT, `${playlistPage}-html.txt`), html);
  }
  
  console.log('\n=== All Extraction Complete ===');
}

main().catch(console.error);
