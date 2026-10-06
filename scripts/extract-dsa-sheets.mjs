import fs from 'fs';
import * as cheerio from 'cheerio';

async function extractAstroProps(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    let extractedData = null;

    $('astro-island').each((i, el) => {
      const propsAttr = $(el).attr('props');
      if (propsAttr) {
        try {
          const props = JSON.parse(propsAttr);
          // Check if this looks like the data we want
          if (props.sheet || props.sheets || props.data || props.title) {
              extractedData = props;
          }
        } catch (e) {
            // ignore
        }
      }
    });
    
    // Fallback if it's rendered as JSON in a script tag
    if (!extractedData) {
        $('script[type="application/json"]').each((i, el) => {
           try {
             extractedData = JSON.parse($(el).html());
           } catch(e){}
        });
    }

    return extractedData;
  } catch (error) {
    console.error('Error extracting from', url, error);
    return null;
  }
}

async function main() {
  console.log('Extracting DSA Sheets Index...');
  const indexData = await extractAstroProps('https://hynts.in/preparation/dsa-sheets/');
  if (indexData) {
      fs.writeFileSync('src/data/clean/dsa-sheets-index.json', JSON.stringify(indexData, null, 2));
      console.log('Saved dsa-sheets-index.json');
  } else {
      console.log('Failed to extract DSA Sheets Index');
  }

  console.log('Extracting Striver A2Z Sheet...');
  const striverData = await extractAstroProps('https://hynts.in/preparation/dsa-sheets/striver-a2z-dsa-sheet/');
  if (striverData) {
      fs.writeFileSync('src/data/clean/striver-a2z.json', JSON.stringify(striverData, null, 2));
      console.log('Saved striver-a2z.json');
  } else {
      console.log('Failed to extract Striver A2Z Sheet');
  }
}

main();
