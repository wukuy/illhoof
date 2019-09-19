/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-12 13:52:12
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-19 13:33:38
 */
const Router = require('koa-router')
const Site = require('../model/site')
const Server = require('../model/server')
const Publish = require('../model/publish')
const api = new Router({ prefix: '/publish' })
const Utils = require('../common/util')
const path = require('path')
const fs = require('fs');
const os = require('os');

// 启动部署
api.post('/', async (ctx) => {
    ctx.verifyParams({
        id: 'string'
    });

    let site = await Site.findById(ctx.request.body.id).populate('server');
    if (!site) ctx.status = 404;

    ctx.body = await new Publish().save();

    startPublish(site);
});

// 获取部署日志
api.get('/:id/logs', (ctx) => {
    ctx.params.id
});

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

async function startPublish(site) {
    let remoteCmd = new RemoteCmd(site.server);

    if (site.path) {
        await remoteCmd.exe(`mkdir -p ${site.path}`);
    }
    remoteCmd.cwd = path.join(site.path, site.domain);

    await remoteCmd.exe(`rm -r ${remoteCmd.cwd}`, { excludes: [1] });

    console.log('◉ 配置nginx');
    await nginxConfig(site);

    console.log('◉ 生成pm2部署文件');
    let ecosystemPath = makeEcosystemConfig(site);
    console.log(ecosystemPath);

    console.log('◉ 初始化远程文件夹');
    await Utils.exec(`pm2 deploy ${ecosystemPath} production setup`);

    console.log('◉ 复制ecosystem.json到项目下');
    await remoteCmd.scp(ecosystemPath, path.join(remoteCmd.cwd, 'current'));

    console.log('◉ 启动项目');
    await Utils.exec(`pm2 deploy ${ecosystemPath} production --force`);
}

function makeEcosystemConfig(site) {
    let template = require('../ecosystem.config.tpl');
    const tmepDir = fs.mkdtempSync(path.join(os.tmpdir(), site.domain + '-'));

    template.apps[0].name = site.domain;
    template.apps[0].script = 'app.js';
    template.apps[0]['env_production'].PORT = site.port;
    template.apps[0]['env'].PORT = site.port;
    template.deploy.production.user = site.server.account;
    template.deploy.production.host = site.server.ip;
    template.deploy.production.ref = 'origin/master';
    template.deploy.production.repo = 'https://github.com/cyrianax/zero.git';
    template.deploy.production.path = path.join(site.path, site.domain);
    template.deploy.production['post-deploy'] = 'npm install && pm2 reload ecosystem.json --env production';

    let configPath = path.join(tmepDir, 'ecosystem.json');

    fs.writeFileSync(configPath, JSON.stringify(template));
    return configPath;
}

class RemoteCmd {
    constructor(server = {}) {
        this.server = server;
        this.cwd = '';
    }
    async exe(cmd, options) {
        let server = this.server;

        this.serverCmd = `sshpass -p '${server.passwd}' ssh ${server.account}@${server.ip} `;
        await Utils.exec(`${this.serverCmd} '${cmd}'`, options);
    }

    async scp(local, remote, toServer = true) {
        let server = this.server;

        if (toServer) {
            await Utils.exec(`sshpass -p '${server.passwd}' scp ${local} ${server.account}@${server.ip}:${remote}`);
        } else {
            await Utils.exec(`sshpass -p '${server.passwd}' scp ${server.account}@${server.ip}:${remote} ${local}`);
        }
    }
}

async function nginxConfig(site) {
    const tmepDir = fs.mkdtempSync(path.join(os.tmpdir(), site.domain + '-'));
    let remoteCmd = new RemoteCmd(site.server);    
    let NginxConfFile = require('nginx-conf').NginxConfFile;
    let includePath = path.join(site.path, '*');
    let nginxConfigFile = path.join(tmepDir, path.basename(site.server.nginxConfigPath));
    let nginxServerConfigFile = path.join(tmepDir, 'server_nginx.conf');

    console.log('拉取服务器 nginx.conf 文件');
    await remoteCmd.scp(tmepDir, site.server.nginxConfigPath, false);

    console.log('加入include');
    NginxConfFile.create(nginxConfigFile, (err, conf) => {
        let exist = false;
        if(Array.isArray(conf.nginx.http.include)) {
            exist = conf.nginx.http.include.find(item => item.toString().includes(includePath));
        }else if (typeof conf.nginx.http.include === 'object') {
            exist = conf.nginx.http.include.toString().includes(includePath);
        }
        
        if(!exist) {
            conf.nginx.http._add('include', includePath);
        }
        
        conf.flush();
    });
    console.log('替换服务器nginx.conf');
    await remoteCmd.scp(nginxConfigFile, site.server.nginxConfigPath);

    console.log('生成nginx server');
    try {
        await remoteCmd.scp(tmepDir, path.join(site.path, 'server_nginx.conf'), false);
    } catch (error) {
        if(error === 1) fs.writeFileSync(nginxServerConfigFile, '');
    }
    
    NginxConfFile.create(nginxServerConfigFile, (err, conf) => {
        let isExist = false;
        if(Array.isArray(conf.nginx.server)) {
            isExist = conf.nginx.server.find(item => item.server_name.toString().includes(site.domain));
        } else if(conf.nginx.server && conf.nginx.server.server_name.toString().includes(site.domain)) {
            isExist = true;
        }
        
        if(!isExist) {
            conf.nginx._add('server');
    
            if(Array.isArray(conf.nginx.server)) {
                let serverLength = conf.nginx.server.length;
    
                conf.nginx.server[serverLength - 1]._add('listen', 80);
                conf.nginx.server[serverLength - 1]._add('server_name', site.domain);
                conf.nginx.server[serverLength - 1]._add('location', '/');
                conf.nginx.server[serverLength - 1].location._add('proxy_pass', `http://127.0.0.1:${site.port}`);
                conf.nginx.server[serverLength - 1].location._add('index', 'index.html index.htm');
            }else {
                if(conf.nginx.server === undefined) {
                    conf.nginx.server._add('server_name', '');
                }
                conf.nginx.server._add('listen', 80);
                conf.nginx.server._add('server_name', site.domain);
                conf.nginx.server._add('location', '/');
                conf.nginx.server.location._add('proxy_pass', `http://127.0.0.1:${site.port}`);
                conf.nginx.server.location._add('index', 'index.html index.htm');
            }
        }
    
        conf.flush();
    });

    console.log('替换服务器server_nginx.conf');
    remoteCmd.scp(nginxServerConfigFile, site.path);
}

module.exports = api;