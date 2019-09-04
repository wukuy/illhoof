/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-28 10:14:09
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-04 20:03:55
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
const Utils = require('../common/util');
api.prefix('/server')

// 新增站点
api.post('/www', async ctx => {
    // ctx.verifyParams({
    //     port: 'number',
    //     db: 'string',
    //     domain_name: 'string',
    //     rr: 'string',
    //     value: 'string'
    // });

    // 验证端口是否占用
    // console.log(await verifyPort());
    // ctx.body = 102
    // git clone http://192.168.160.250:8010/web/web-center.git
    // 拉取代码
    console.log(await remoteCmd('git clone  --no-checkout http://wukuangyu:a19940614@192.168.160.250:8010/web/web-center.git abc'));
    // 
    ctx.body = '拉取成功';
});

api.post('/verify_port', async ctx => {
    ctx.verifyParams({
        port: 'string'
    });

    let data = await verifyPort(ctx.request.body.port);
    if(!data) ctx.status = 409;
    ctx.body = {
        data
    };
});

// 推荐端口
function recommendPort() {

}

function remoteCmd(cmd, options) {
    return Utils.exec(`sshpass -p '$me@7973**&&$' ssh root@192.168.160.250 '${cmd}'`, options);
}

async function verifyPort(port) {
    let data = await remoteCmd(`sudo lsof -i:${port}`, {excludes: [1]});
    return !data;
}


module.exports = api
