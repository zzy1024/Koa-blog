const {query} = require('../lib/mysql');

module.exports = {
    helloName: async (ctx, next) => {
        let name = ctx.params.name;
        ctx.response.body = `<h1>hello, ${name}!</h1>`;
    },
    index: async (ctx, next) => {
        console.log('hello,world。');
        const userInfo = await query( 'SELECT * FROM users' );
            /*function () {
            let sql = 'SELECT * FROM users'
            let dataList = await query( sql )
        };*/
            console.log(userInfo,userInfo.length);
        const s = await ctx.render('hello', {
            userName: 'GoGoGo',
            userInfo: userInfo
        });
        console.log(s);
        /*ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;*/
    },
    signin: async (ctx, next) => {
        console.log(ctx.request.body.name, ctx.request.body.password);
        let name = ctx.request.body.name || '',
            password = ctx.request.body.password || '';
        console.log(`signin with name: ${name}, password: ${password}`);
        if (name === 'koa' && password === '12345') {
            ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        } else {
            ctx.response.body = `<h1>Login failed!</h1>
                                <p><a href="/">Password is error, try again!</a></p>`;
        }
    }

};