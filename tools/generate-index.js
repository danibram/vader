'use strict';
const fs = require('fs');
const path = require('path');
const dirs = fs.readdirSync(path.resolve(__dirname, '../src'));

let output = `import 'app-module-path/register'; \n`;
output += `import * as Koa from 'koa';\n`;

for (const dir of dirs) {
    const stat = fs.statSync(path.resolve(__dirname, `../src/${dir}`));
    if (stat.isDirectory()) {
        const files = fs.readdirSync(path.resolve(__dirname, `../src/${dir}`));
        let modules = '';
        for (const file of files) {
            const name= path.basename(file, path.extname(file));
            if (name[0] === 'I') continue;
            output += `import ${dir}_${name} from './${dir}/${name}'\n`;
            modules += `\t${name}: ${dir}_${name},\n`;
        }
        output += `export const ${dir} = {\n`;
        output += modules;
        output += '};\n';
    }
}
console.log(output);
fs.writeFileSync(path.resolve(__dirname, `../src/index.ts`), output);
