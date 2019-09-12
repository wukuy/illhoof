/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-28 10:30:11
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-08-28 11:31:56
 */
const cp = require('child_process');

class Git {
    constructor({ cwd,  }) {
        this.cwd = cwd;
    }

    pull() {
        this.exec('git clone http://192.168.160.250:8010/web/web-center.git');
    }
}

const git = new Git('./');
git.pull();