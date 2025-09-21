const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../docs/index.html');
const baseHref = '/angular-portfolio-project2/';

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  content = content.replace(/href="([^"]*\.css)"/g, 'href="/$1"');
  content = content.replace(/src="([^"]*\.js)"/g, 'src="/$1"');
  content = content.replace(/<base href="[^"]*">/, `<base href="${baseHref}">`);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✅ Fixed paths in index.html for GitHub Pages');
} else {
  console.log('❌ index.html not found in docs/');
}
