const router = require('koa-router')();
const homeController = require('../controller/home');

module.exports = (app) => {

    router.get('/', homeController.index);

    router.post('/signin', homeController.signin);

    router.post('/reg', homeController.reg);

    router.get('/hello/:name', homeController.helloName);

    /*router.get('/hello/:name', async (ctx, next) => {
        let name = ctx.params.name;
        ctx.response.body = `<h1>hello, ${name}!</h1>`;
    });

    router.get('/', async (ctx, next) => {
        ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
    });

    router.post('/signin', async (ctx, next) => {
        let name = ctx.request.body.name || '',
            password = ctx.request.body.password || '';
        console.log(`signin with name: ${name}, password: ${password}`);
        if (name === 'koa' && password === '12345') {
            ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        } else {
            ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Password is error, try again!</a></p>`;
        }
    });*/

    app.use(router.routes())
        .use(router.allowedMethods())
};