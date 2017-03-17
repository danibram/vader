export type IgeneralSwagger = {
    paths: any
    definitions: any
    swagger: string
    schemes: string[]
    tags: string[],
    basePath: string
    consumes: string[]
    produces: string[]
    info: any
}
export const swaggerGen = function(swagger: any) : IgeneralSwagger {
    return Object.assign({
        paths: {},
        definitions: {},
        swagger: '2.0',
        schemes: ['http', 'https'],
        tags: [],
        basePath: '',
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {}
    }, swagger || {})
}

export const composePath = function(doc: any){
    return Object.assign({
        parameters: [],
        responses: [],
        description: 'Under construction',
        summary: '',
        tags: [],
        consumes: [],
        produces: [],
        security: (doc.auth) ? [{'api_key' : {
            'type': 'apiKey',
            'name': 'api_key',
            'in': 'header'
        }}] : []
    }, doc || {})
}

export const turnSwaggerIds = function(url: any){
    url = url
        .split('/')
        .map((u: string) => {
            if (u[0] === ':'){
                return `{${u.slice(1)}}`
            }
            return u
        })

    return url.join('/')
}