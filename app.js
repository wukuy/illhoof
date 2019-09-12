/*
 * @Descripttion: 
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-27 21:30:58
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-12 11:42:22
 */
const path = require('path')
const Koa = require('koa')
const koaLogger = require('koa-logger')
const koaBodyparser = require('koa-bodyparser')
const koaCors = require('@koa/cors')
const koaCompress = require('koa-compress')
const koaParameter = require('koa-parameter')
const koaError = require('koa-json-error')
const koaStatic = require('koa-static')
const config = require('./app.config')
const util = require('./common/util')
const db = require('./common/database')
const cache = require('./common/cache')
const router = require('./common/router')

const app = new Koa()

app.context.db = db
app.context.util = util
app.context.cache = cache

app.use(koaError())
app.use(koaCors())
app.use(koaLogger())
app.use(koaBodyparser())
app.use(koaParameter(app))
app.use(koaCompress())
app.use(koaStatic(path.resolve(__dirname, './static')))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.port, function() {
    console.log(`api 运行在: http://localhost:${config.port}`);
})

