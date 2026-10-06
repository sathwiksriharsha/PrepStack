import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('src/data/clean/striver-a2z.json', 'utf-8'));

function decodeAstro(val) {
  if (Array.isArray(val) && val.length === 2 && typeof val[0] === 'number') {
    if (val[0] === 0) {
      if (typeof val[1] === 'object' && val[1] !== null && !Array.isArray(val[1])) {
         const out = {};
         for (const key in val[1]) {
           out[key] = decodeAstro(val[1][key]);
         }
         return out;
      }
      return val[1];
    } else if (val[0] === 1 && Array.isArray(val[1])) {
       return val[1].map(decodeAstro);
    }
  }
  return val;
}

const cleaned = {
  title: decodeAstro(raw.title),
  description: decodeAstro(raw.description),
  creatorName: decodeAstro(raw.creatorName),
  totalProblems: decodeAstro(raw.totalProblems),
  sections: decodeAstro(raw.sections)
};

fs.writeFileSync('src/data/clean/striver-a2z-clean.json', JSON.stringify(cleaned, null, 2));
console.log('Cleaned striver a2z data');
