/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-04 20:45:25
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-05 19:32:52
 */
const Router = require('koa-router')
const api = new Router()
const Site = require('../model/site')
const Server = require('../model/server')
const Utils = require('../common/util')

api.prefix('/site')

// 新增站点
api.post('/', async ctx => {
  ctx.verifyParams({
    name: 'string',
    domain: 'string',
    server: 'string',
    passwd: 'string'
  })

  // 验证端口是否占用
  // console.log(await verifyPort());
  // ctx.body = 102
  // git clone http://192.168.160.250:8010/web/web-center.git
  // 拉取代码
  // let body = ctx.request.body;
  // let server = await Server.findById(body.server);
  // const site = await Site(body).save();
  
  // await remoteCmd(`git clone https://github.com/cyrianax/zero.git ${body.domain}`, server);

  ctx.body = await Site(ctx.request.body).save();
})




// 删除站点
api.delete('/', async ctx => {
  ctx.verifyParams({
    ids: 'array'
  })
  const { ids = [] } = ctx.request.body

  const result = await Site.remove({ _id: { $in: ids } })
  if (result) {
    ctx.body = result
  }
})

// 修改站点
api.put('/:_id', async ctx => {
  ctx.verifyParams({
    name: 'string',
    ip: 'string',
    passwd: 'string'
  })

  const { _id } = ctx.params
  const { name, ip, account, passwd } = ctx.request.body

  const site = await Site.findOneAndUpdate({ _id }, { name, ip, account, passwd })
  if (site) {
    ctx.body = site
  }
})

// 查询站点列表
api.get('/', async ctx => {
  const { size, index } = ctx.util.getPageInfo(ctx.query)
  const sites = await Site.find().sort({ createdAt: -1 }).limit(size).skip(index)
  const total = await Site.countDocuments()
  const list = sites.map(site => site.toObject({ virtuals: true }))

  ctx.body = {
    list,
    total,
  }

})

api.post('/verify_port', async ctx => {
  ctx.verifyParams({
      port: 'string'
  });

  let data = await verifyPort(ctx.request.body.port);
  if (!data) ctx.status = 409;
  ctx.body = {
      data
  };
});

// 推荐端口
function recommendPort() {

}

function remoteCmd(cmd, server = {}, options) {
  return Utils.exec(`sshpass -p '${server.passwd}' ssh ${server.account}@${server.ip} '${cmd}'`, options);
}

async function verifyPort(port) {
  let data = await remoteCmd(`sudo lsof -i:${port}`, { excludes: [1] });
  return !data;
}

module.exports = api
