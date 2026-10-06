import fs from 'fs';

const rolesStr = fs.readFileSync('src/data/clean/roles.json', 'utf-8');
const roles = JSON.parse(rolesStr);

roles.categories.forEach(cat => {
    console.log(`Category: ${cat.title}`);
    cat.roles.forEach(role => {
        console.log(`  - ${role.displayName} (${role.slug}): ${role.questions?.length || 0} questions`);
    });
});

console.log('--- Checking Playlists ---');
try {
    const playlistsStr = fs.readFileSync('src/data/dsa-playlists-html.txt', 'utf-8');
    console.log('Playlists HTML length:', playlistsStr.length);
} catch (e) {
    console.log('Playlists HTML not found.');
}
