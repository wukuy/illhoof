/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-28 11:27:47
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-08-29 10:04:28
 */

const cp = require('child_process');

module.exports = {
  getPageInfo: ({ pageSize = 20, pageIndex = 1 }) => {
    const size = Math.max(+pageSize, 10)
    const index = size * (Math.max(+pageIndex, 1) - 1)
    return { size, index }
  },
  exec(cmd, {cwd = '', excludes = []} = {}) {
    return new Promise((resolve, reject) => {
        cp.exec(cmd, {cwd}, (error, stdout, stderr) => {
            if (error && !excludes.includes(error.code)) {
                reject(error);
                console.error(`执行错误: ${error}`);
                return;
            }
            process.stdout.write(`${stdout}`);
            process.stdout.write(`${stderr}`);
            resolve(stdout || stderr);
        });
    });
}
}