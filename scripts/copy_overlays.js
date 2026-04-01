const fs = require('fs');
const path = require('path');

const sourceDir = 'C:/Users/누리아이 개발팀/.gemini/antigravity/brain/90b5acb9-5867-45ca-948a-ad47051f2c2e';
const targetDir = 'c:/0_z/play/public/logos';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = {
  spring: fs.readdirSync(sourceDir).find(f => f.startsWith('overlay_spring')),
  summer: fs.readdirSync(sourceDir).find(f => f.startsWith('overlay_summer')),
  fall: fs.readdirSync(sourceDir).find(f => f.startsWith('overlay_fall')),
  winter: fs.readdirSync(sourceDir).find(f => f.startsWith('overlay_winter')),
};

for (const [season, file] of Object.entries(images)) {
  if (file) {
    console.log(`Copying ${season}...`);
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, `${season}.png`));
  }
}

console.log('Copy complete!');
