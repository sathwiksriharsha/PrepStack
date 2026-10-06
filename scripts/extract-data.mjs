/**
 * Data extraction script for hynts.in/preparation
 * Extracts structured data from the Astro-rendered HTML pages
 * by parsing the props JSON embedded in astro-island elements.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// Since the site is built with Astro + React, data is embedded as
// serialized props in astro-island custom elements.
// The actual question/company data lives in the JS bundles loaded client-side.
// We need to fetch those JS files to get the full datasets.

const BASE = 'https://hynts.in';

async function fetchText(url) {
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    console.error(`  Failed: ${e.message}`);
    return null;
  }
}

async function extractJSBundles() {
  // Get the main page to find all JS bundle URLs
  const html = await fetchText(`${BASE}/preparation/company-wise-dsa-sheet/`);
  if (!html) return;
  
  // Find all JS module imports
  const jsUrls = new Set();
  const scriptMatches = html.matchAll(/src="(\/_astro\/[^"]+\.js)"/g);
  for (const m of scriptMatches) {
    jsUrls.add(m[1]);
  }
  
  // Also find component URLs from astro-island elements
  const componentMatches = html.matchAll(/component-url="([^"]+)"/g);
  for (const m of componentMatches) {
    jsUrls.add(m[1]);
  }
  
  console.log(`Found ${jsUrls.size} JS bundle URLs`);
  
  // Fetch and search each JS bundle for data arrays
  const dataDir = resolve('public/data');
  mkdirSync(dataDir, { recursive: true });
  
  const allBundles = {};
  for (const url of jsUrls) {
    const fullUrl = `${BASE}${url}`;
    const content = await fetchText(fullUrl);
    if (content) {
      allBundles[url] = content;
      
      // Look for large arrays/objects that might be data
      if (content.length > 10000) {
        console.log(`  Large bundle (${content.length} chars): ${url}`);
      }
      
      // Check for company names, question titles, etc.
      if (content.includes('Google') && content.includes('Amazon') && content.includes('leetcode')) {
        console.log(`  *** Likely company data bundle: ${url}`);
        writeFileSync(resolve(dataDir, `bundle_company_${url.split('/').pop()}`), content);
      }
      if (content.includes('Two Sum') || content.includes('twoSum') || content.includes('LeetCode')) {
        console.log(`  *** Likely DSA data bundle: ${url}`);
        writeFileSync(resolve(dataDir, `bundle_dsa_${url.split('/').pop()}`), content);
      }
      if (content.includes('SELECT') && content.includes('SQL')) {
        console.log(`  *** Likely SQL data bundle: ${url}`);
      }
      if (content.includes('system design') || content.includes('System Design')) {
        console.log(`  *** Likely System Design bundle: ${url}`);
      }
    }
  }
  
  // Also scan additional pages for their unique bundles
  const pages = [
    '/preparation/',
    '/preparation/20-essential-dsa-patterns/',
    '/preparation/sql-sheet/',
    '/preparation/system-design-sheet/',
    '/preparation/role-wise/',
    '/preparation/most-asked-questions/',
    '/preparation/hr-questions/',
    '/preparation/dsa-playlists/',
    '/preparation/cold-email-templets/',
    '/preparation/notes/',
    '/preparation/resume-templates/',
    '/preparation/package-wise-dsa-sheet/',
    '/preparation/system-design-playlists/',
    '/preparation/dbms-playlists/',
  ];
  
  const additionalUrls = new Set();
  for (const page of pages) {
    const pageHtml = await fetchText(`${BASE}${page}`);
    if (!pageHtml) continue;
    
    const pageScripts = pageHtml.matchAll(/src="(\/_astro\/[^"]+\.js)"/g);
    for (const m of pageScripts) {
      if (!jsUrls.has(m[1])) {
        additionalUrls.add(m[1]);
      }
    }
    const pageComponents = pageHtml.matchAll(/component-url="([^"]+)"/g);
    for (const m of pageComponents) {
      if (!jsUrls.has(m[1])) {
        additionalUrls.add(m[1]);
      }
    }
  }
  
  console.log(`\nFound ${additionalUrls.size} additional JS URLs from other pages`);
  
  for (const url of additionalUrls) {
    const content = await fetchText(`${BASE}${url}`);
    if (content) {
      allBundles[url] = content;
      if (content.length > 5000) {
        console.log(`  Large additional bundle (${content.length} chars): ${url}`);
        writeFileSync(resolve(dataDir, `bundle_${url.split('/').pop()}`), content);
      }
    }
  }
  
  return allBundles;
}

async function main() {
  console.log('=== Hynts.in Data Extraction ===\n');
  
  const bundles = await extractJSBundles();
  
  console.log('\n=== Bundle Analysis Complete ===');
  console.log(`Total bundles fetched: ${Object.keys(bundles).length}`);
  
  // List all large bundles
  const sorted = Object.entries(bundles)
    .map(([url, content]) => ({ url, size: content.length }))
    .sort((a, b) => b.size - a.size);
  
  console.log('\nTop 20 bundles by size:');
  for (const { url, size } of sorted.slice(0, 20)) {
    console.log(`  ${size.toLocaleString().padStart(10)} chars  ${url}`);
  }
}

main().catch(console.error);
