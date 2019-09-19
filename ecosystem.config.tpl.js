/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-09-17 19:31:05
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-17 20:20:43
 */
module.exports = {
  apps : [{
    name: '',
    script: '',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : '',
      host : '',
      ref  : '',
      repo : '',
      path : '',
      'post-deploy' : ''
    }
  }
};
