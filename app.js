const config = require('./config/index');
const Koa = require('koa');
const path = require('path');
const nunjucks = require('koa-nunjucks-2');
const bodyParser = require('koa-bodyparser');
// 引入 koa-static
const staticFiles = require('koa-static');
const router = require('./router/index');
/*// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();*/

const app = new Koa();

// 指定 public目录为静态资源目录，用来存放 js css /koa2/images 等
app.use(staticFiles(path.resolve(__dirname, "./public")))

// console.log('路径', __dirname, path.join(__dirname, 'views'));
app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),// 指定视图目录
    nunjucksConfig: {
        trimBlocks: true // 开启转义 防Xss
    }
}));

app.use(async (ctx, next) => {
    console.log(`请求方式 ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

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
});
// add router middleware:
app.use(router.routes());*/
app.use(bodyParser());
router(app);

/*app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>' + `${ctx.request.method} : ${ctx.request.url}`;
});*/

app.listen(config.port);
console.log('server is running at http://localhost:' + config.port);