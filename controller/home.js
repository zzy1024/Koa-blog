const {query, findUserData} = require('../lib/mysql');

module.exports = {
    helloName: async (ctx, next) => {
        let name = ctx.params.name;
        ctx.response.body = `<h1>hello, ${name}!</h1>`;
    },
    login: async (ctx, next) => {
        const userInfo = await query( 'SELECT * FROM users' );
        const s = await ctx.render('login', {
            userInfo: userInfo,
            userName: ctx.session.user
        });
    },
    index: async (ctx, next) => {
        await ctx.render('index', {
            userName: ctx.session.user
        });
    },
    reg: async (ctx, next) => {
        let user = {
            name: ctx.request.body.name,
            password: ctx.request.body.password
        };
        console.log('user-password:',user.name, user.password);
        let findUser = '';
        await findUserData(user.name).then(async (res) => {
            console.log('search', res);
            if(res.length){
                ctx.response.body = `此账号已经存在！`;
            }else if(user.name === '' || user.password === ''){
                ctx.response.body = `帐号密码不能为空！`;
            }else{
                let _sql = "insert into users set name=?,password=?;";
                await query(_sql, [user.name, user.password]).then(res => {
                    if(res.affectedRows === 1){
                        ctx.response.body = `注册完成，帐号：${user.name} ，密码：${user.password}`;
                    }else{
                        throw Error('未注册成功,请重试！');
                    }
                });
            }
        });

    },
    signin: async (ctx, next) => {
        let user = {
            name: ctx.request.body.name || '',
            password: ctx.request.body.password || ''
        };
        console.log(`signin with name: ${user.name}, password: ${user.password}`);
        await findUserData(user.name).then( async (res) => {
            if(res.length){
                if (user.name === res[0]['name'] && user.password === res[0]['password']) {
                    const session = ctx.session;
                    session.user = res[0]['name'];
                    //Math.random().toString(36).substr(2)
                    session.id = res[0]['id'];
                    session.isLogin = true;
                    console.log('session', ctx.session);
                    //ctx.response.body = `<h1>Welcome, ${user.name}!</h1>session:${ctx.session.user} ---- ${ctx.session.id}`;
                    ctx.response.body = {
                        'code': '1',
                        'data': user.name,
                        'msg': '登录成功'
                    };
                } else {
                    //ctx.response.body = `<h1>Login failed!</h1><p><a href="/">Password is error, try again!</a></p>`;
                    ctx.response.body = {
                        'code': '0',
                        'data': '',
                        'msg': '登录失败，账号或密码错误！'
                    };
                }
            }else{
                ctx.response.body = {
                    'code': '0',
                    'data': '',
                    'msg': '没有该用户，请注册一个账户！'
                };
            }

        });

    }

};