/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-16 15:49:39
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-16 16:30:03
 */
const mongoose = require('mongoose')
const db = require('../common/database')

const Schema = mongoose.Schema
const schema = new Schema({
	logs: {type: Array, }
}, { 
	versionKey: false,
	timestamps: true 
})

// 定义Model
const model = db.model('Publish', schema)

// 导出数据模型
module.exports = model
