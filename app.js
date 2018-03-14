const Koa = require('koa');
const debug = require('debug')('http');

const app = new Koa();

app.use(async ctx => {
    ctx.body = '<h1>Hello World</h1>';
});


// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});


// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});


// response
app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);
console.log("Listen on port 3000");


