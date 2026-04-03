const fs = require('fs');
const path = require('path');

const directory = './frontend/src/app';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Background blobs in Hero should stay rounded-full
            if (file === 'Hero.jsx') {
                content = content.replace(/(?<!bg-pink-200 |bg-purple-200 |bg-pink-300 )rounded-full/g, 'rounded-sm');
            } else if (file === 'Header.jsx') {
                // Header search bar and cart badge
                content = content.replace(/rounded-full/g, 'rounded-sm');
            } else {
                content = content.replace(/rounded-(3xl|2xl|xl|lg|md|full)/g, 'rounded-sm');
            }
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

walk(directory);
console.log('Design migration complete.');
