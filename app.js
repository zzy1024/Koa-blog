const config = require('./config/index');
const Koa = require('koa');
const path = require('path');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const nunjucks = require('koa-nunjucks-2');
const bodyParser = require('koa-bodyparser');

// 引入 koa-static
const staticFiles = require('koa-static');
const router = require('./router/index');
/*// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();*/

const app = new Koa();

// session存储配置
const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
};

// 配置session中间件
app.use(session({
    key: 'SESSION_ID',
    cookie: {                       // 与 cookie 相关的配置
        domain: 'localhost',                   // 写 cookie 所在的域名
        path: '/index',                    // 写 cookie 所在的路径
        maxAge: 1000 * 60 * 10,       // cookie 有效时长(单位：ms)
        httpOnly: true,               // 是否只用于 http 请求中获取
        overwrite: true               // 是否允许重写
    },
    store: new MysqlStore(sessionMysqlConfig)
}));

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

app.use(bodyParser());
router(app);

app.listen(config.port);
console.log('server is running at http://localhost:' + config.port);