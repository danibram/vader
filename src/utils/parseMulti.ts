import * as Koa from 'koa';
import 'reflect-metadata';
const formy: any = require('formidable');

export default function parseMulti(koaContext: Koa.Context, opts?: any):Promise<any> {
    opts = opts || {};
    return new Promise<any>((resolve, reject) => {
        var fields = {};
        var files = {};
        var form = new formy.IncomingForm(opts);
        form
            .on('end', () => resolve({fields: fields, files: files}))
            .on('error', err => reject(err))
            .on('field', (field, value) => {
                if (fields[field]) {
                    if (Array.isArray(fields[field])) {
                        fields[field].push(value);
                    } else {
                        fields[field] = [fields[field], value];
                    }
                } else {
                    fields[field] = value;
                }
            })
            .on('file', (field, file) => {
                if (files[field]) {
                    if (Array.isArray(files[field])) {
                        files[field].push(file);
                    } else {
                        files[field] = [files[field], file];
                    }
                } else {
                    files[field] = file;
                }
            });
            if(opts.onFileBegin) {
                form.on('fileBegin', opts.onFileBegin);
            }
            form.parse(koaContext.req);
     });
}
