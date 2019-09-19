/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-04 20:15:14
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-18 20:30:23
 */
const mongoose = require('mongoose')
const db = require('../common/database')

const Schema = mongoose.Schema
const schema = new Schema({
	// 服务器名称
	name: { 
		type: String, 
		required: true 
	},
	// 服务器ip
	ip: { 
		type: String, 
		required: true 
	},
	// 服务器账户
	account: { 
		type: String, 
		default: 'root' 
	},
	// 服务器密码
	passwd: { 
		type: String, 
		required: true 
	},
	// nginx配置文件路径
	nginxConfigPath: {
		type: String, 
		default: '/etc/nginx/nginx.conf'
	}
}, { 
	versionKey: false,
	timestamps: true 
})

// 定义Model
const model = db.model('Server', schema)

// 导出数据模型
module.exports = model
