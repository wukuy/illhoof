/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-27 20:42:37
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-18 15:20:56
 */
const Router = require('koa-router')
const api = new Router()

api.prefix('/api')

const setRoute = name => {
  const router = require(`../api/${name}`)
  api.use(router.routes(), router.allowedMethods())
}

setRoute('common')
setRoute('site')
setRoute('server')
setRoute('publish')
setRoute('domain')

module.exports = api