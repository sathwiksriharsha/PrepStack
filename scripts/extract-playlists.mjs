import fs from 'fs';
import * as cheerio from 'cheerio';

const files = [
  { file: 'dsa-playlists-html.txt', key: 'dsa-playlists', title: 'DSA Playlists', desc: 'Best Data Structures and Algorithms playlists on YouTube.' },
  { file: 'dbms-playlists-html.txt', key: 'dbms-playlists', title: 'Core Subjects Playlists', desc: 'Best CS Fundamentals (DBMS, OS, CN) playlists.' },
  { file: 'system-design-playlists-html.txt', key: 'system-design-playlists', title: 'System Design Playlists', desc: 'Best System Design playlists for interviews.' }
];

const playlists = {};

files.forEach(({ file, key, title, desc }) => {
  try {
    const html = fs.readFileSync(`src/data/${file}`, 'utf-8');
    const $ = cheerio.load(html);
    
    const items = [];
    // Looking for a typical card layout - links to youtube
    $('a[href*="youtube.com"]').each((i, el) => {
      const href = $(el).attr('href');
      // Look for a heading inside or nearby
      const title = $(el).find('h2, h3').text().trim() || $(el).text().trim() || 'YouTube Playlist';
      
      // Some cards might have an image
      const img = $(el).find('img').attr('src') || '';
      
      // Only add if it looks like a card
      if ($(el).hasClass('group') || img || title.length > 3) {
         if (!items.find(x => x.url === href)) {
             items.push({ url: href, title, img });
         }
      }
    });

    playlists[key] = {
      title,
      description: desc,
      items
    };
  } catch (e) {
    console.error(`Error reading ${file}`, e);
  }
});

fs.writeFileSync('src/data/clean/playlists.json', JSON.stringify(playlists, null, 2));
console.log('Playlists generated.');
