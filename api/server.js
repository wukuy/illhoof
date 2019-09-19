/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-28 10:14:09
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-16 14:44:31
 */

const Router = require('koa-router')

// 线上管理项目
/**
 * 1.停止、启动、重启项目
 * 2.移除项目
 * 3.运行日志查询
 * 4.远程执行命令
 * 5.检查项目是否挂掉，警报通知
 */

// 自动化部署
/**
 * 1.拉取git代码(zere，zere-admin,)
//  * 2.给zero新建数据库(查询部署服务器数据库名称是否重名)
 * 3.给zero设置服务端口(查询部署服务器端口是否冲突)
 * 4.添加域名(域名设置，ip地址指定，通过阿里云api新增域名记录)
 * 5.部署服务器nginx转发到指定项目
 * 6.推送代码到部署服务器
 * 7.npm i
 * 8.pm2 start app.js
 * 9.生成配置文件
 */

const api = new Router()
const Utils = require('../common/util')
const Server = require('../model/server')

api.prefix('/server')

// 新增服务器
api.post('/', async ctx => {
    ctx.verifyParams({
        name: 'string',
        ip: 'string',
        passwd: 'string'
    })

    const server = await Server(ctx.request.body).save()
    ctx.body = server
})

// 删除服务器
api.delete('/', async ctx => {
    ctx.verifyParams({
        ids: 'array'
    })
    const { ids = [] } = ctx.request.body

    const result = await Server.remove({ _id: { $in: ids } })
    if (result) {
        ctx.body = result
    }
})

// 修改服务器
api.put('/:_id', async ctx => {
    ctx.verifyParams({
        name: 'string',
        domain: 'string',
        passwd: 'string'
    })

    const { _id } = ctx.params
    const { name, ip, account, passwd } = ctx.request.body

    const server = await Server.findOneAndUpdate({ _id }, { name, ip, account, passwd })
    if (server) {
        ctx.body = server
    }
})

// 查询服务器列表
api.get('/', async ctx => {
    const { size, index } = ctx.util.getPageInfo(ctx.query)
    const servers = await Server.find().sort({ createdAt: -1 }).limit(size).skip(index)
    const total = await Server.countDocuments()
    const list = servers.map(server => server.toObject({ virtuals: true }))

    ctx.body = {
        list,
        total,
    }

})

module.exports = api
