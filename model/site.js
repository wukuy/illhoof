/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-04 20:30:29
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-04 20:41:35
 */
const mongoose = require('mongoose')
const db = require('../common/database')

const Schema = mongoose.Schema
const schema = new Schema({
	// 站点名称
	name: {
		type: String,
		required: true
	},
	// 站点域名
	domain: { 
		type: String, 
		required: true 
	},
	// 部署服务器
	server: { 
		type: Schema.Types.ObjectId, 
		required: true 
	},
	// 部署目录
	path: {
		type: String,
		required: true,
		default: '/opt/app'
	},
	
}, { 
	versionKey: false,
	timestamps: true 
})

// 定义Model
const model = db.model('Site', schema)

// 导出数据模型
module.exports = model
