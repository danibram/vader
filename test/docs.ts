import {
    DELETE,
    GET,
    Path,
    QueryParam,
    PathParam,
    HeaderParam,
    Response,
    Router
} from '../dist';
import * as chai from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';
import 'reflect-metadata';

@Path('/get')
class TestGetController {
    @QueryParam()
    queryParam;
    @QueryParam('echo')
    queryEcho: string;
    @PathParam()
    pathParam;
    @PathParam('echo')
    pathEcho: string;
    @HeaderParam()
    headerParam;
    @HeaderParam('echo')
    headerEcho: string;

    @GET
    @Path('/basic')
    async basic() {
        chai.assert.equal(Object.keys(this.queryParam).length, 0);
        chai.assert.equal(Object.keys(this.pathParam).length, 0);
        return new Response()
            .status(200)
            .entity('hello world')
            .build();
    }

    @GET
    @Path('/query')
    async query(
        @QueryParam() query,
        @QueryParam('echo') echo
    ) {
        chai.assert.equal(query.echo, 'hello world');
        chai.assert.equal(echo, 'hello world');
        chai.assert.equal(this.queryParam.echo, 'hello world');
        chai.assert.equal(this.queryEcho, 'hello world');
        return new Response()
            .status(200)
            .entity(echo)
            .build();
    }

    @GET
    @Path('/path/:echo')
    async path(
        @PathParam() path,
        @PathParam('echo') echo
    ) {
        chai.assert.equal(path.echo, 'hello%20world');
        chai.assert.equal(echo, 'hello%20world');
        chai.assert.equal(this.pathParam.echo, 'hello%20world');
        chai.assert.equal(this.pathEcho, 'hello%20world');
        return new Response()
            .status(200)
            .entity(echo)
            .build();
    }

    @GET
    @Path('/header')
    async header(
        @HeaderParam() header,
        @HeaderParam('echo') echo
    ) {
        chai.assert.equal(header.echo, 'hello world');
        chai.assert.equal(echo, 'hello world');
        chai.assert.equal(this.headerParam.echo, 'hello world');
        chai.assert.equal(this.headerEcho, 'hello world');
        return new Response()
            .status(200)
            .entity(echo)
            .build();
    }

    @GET
    @Path('/json')
    async json() {
        return new Response()
            .status(200)
            .set('Content-Type', 'application/json')
            .entity(JSON.stringify({
                message: 'hello world',
            }))
            .build();
    }
}

@Path('/delete')
class TestDeleteController {
    @DELETE
    @Path('/basic')
    async basic() {
        return new Response()
            .status(200)
            .build();
    }
}

const app = new Koa();
const router = new Router();

router.use(TestGetController);
router.use(TestDeleteController);

const doc = router.docs({})
@Path('/docs')
export class DocsController {
    @GET
    @Path('/json')
    async json() {
        return new Response()
            .status(200)
            .set('Content-Type', 'application/json')
            .entity(JSON.stringify(doc))
            .build();
    }
}
router.use(DocsController);

app.use(router.routes());

let server;
describe('Docs GET test', () => {
    before(() => {
        server = app.listen(3000)
    })
    after(() => {
        server.close();
    })
    it('should succeed', function (done)  {
        request(server)
            .get('/docs/json')
            .expect(200, doc, done);
    });
})