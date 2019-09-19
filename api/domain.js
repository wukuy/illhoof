/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-12 13:52:12
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-19 13:44:26
 */
const Router = require('koa-router')
const api = new Router({ prefix: '/domain' })
const Core = require('@alicloud/pop-core');

const client = new Core({
    accessKeyId: '',
    accessKeySecret: '',
    endpoint: 'https://alidns.aliyuncs.com',
    apiVersion: '2015-01-09'
});

// 添加域名
api.post('/', async (ctx) => {
    ctx.verifyParams({
        domainName: 'string',
        ip: 'string'
    });
    let {domainName, ip} = ctx.request.body;
    let [_, RR, domain] = domainName.match(/(.+)\.(\w+\.\w+$)/);
    let params = {
        "RegionId": "default",
        "DomainName": domain,
        RR,
        "Type": "A",
        "Value": ip
    }
    let result;
    
    try {
        result = await client.request('AddDomainRecord', params, 'POST');
    } catch (error) {
        result = error.data;
    }
    ctx.body = result;
});

// 根据id查询域名
api.get('/:id', async (ctx) => {
    ctx.verifyParams = {
        RecordId: 'string'
    };

    let params = {
        "RecordId": ctx.params.id
    }
    let result;

    try {
        result = await client.request('DescribeDomainRecordInfo', params, 'POST');
    } catch (error) {
        result = error.data;
    }
    ctx.body = result;
});

// 查询域名列表
api.get('/', async (ctx) => {
    ctx.verifyParams = {
        DomainName: 'string'
    };

    let params = {
        "DomainName": ctx.query.domainName
    }
    let result;

    try {
        result = await client.request('DescribeDomainRecords', params, 'POST');
    } catch (error) {
        result = error.data;
    }
    ctx.body = result;
});

// 删除域名
api.get('/:id', async (ctx) => {
    ctx.verifyParams = {
        RecordId: 'string'
    };

    let params = {
        "RecordId": ctx.params.id
    }
    let result;

    try {
        result = await client.request('DeleteDomainRecord', params, 'POST');
    } catch (error) {
        result = error.data;
    }
    ctx.body = result;
});

// 更新域名
api.get('/:id', async (ctx) => {
    ctx.verifyParams = {
        RecordId: 'string'
    };

    let params = {
        "RecordId": ctx.params.id
    }
    let result;

    try {
        result = await client.request('UpdateDomainRecord', params, 'POST');
    } catch (error) {
        result = error.data;
    }
    ctx.body = result;
});


module.exports = api;