const fs=require('node:fs'),path=require('node:path');const out=path.join(__dirname,'public');fs.mkdirSync(out,{recursive:true});
for(const name of fs.readdirSync(__dirname)){if(/\.(html|css|png|xml|txt)$/.test(name)||name==='script.js')fs.copyFileSync(path.join(__dirname,name),path.join(out,name));}
for(const name of ['work','insights'])fs.cpSync(path.join(__dirname,name),path.join(out,name),{recursive:true});
console.log('Static site built in public/; Vercel serves api/project.js separately.');
