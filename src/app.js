const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
//引入解析body体的函数
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(async (ctx, next) => {
    console.log(`请求方式 ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.get('/hello/:name', async (ctx, next) => {
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

app.use(bodyParser());
// add router middleware:
app.use(router.routes());

/*app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>' + `${ctx.request.method} : ${ctx.request.url}`;
});*/

app.listen(3000);
console.log('app started at port 3000...');