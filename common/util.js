/*
 * @Descripttion: wukuy
 * @version: 
 * @Author: 웃□宇♂
 * @Date: 2019-08-28 11:27:47
 * @LastEditors: 웃□宇♂
 * @LastEditTime: 2019-09-19 13:14:47
 */

const cp = require('child_process');

module.exports = {
	getPageInfo: ({ pageSize = 20, pageIndex = 1 }) => {
		const size = Math.max(+pageSize, 10)
		const index = size * (Math.max(+pageIndex, 1) - 1)
		return { size, index }
	},
	exec(cmd, { excludes = [], ...options } = {}) {
		return new Promise((resolve, reject) => {
			const exec = cp.exec(cmd, options);

			exec.stdout.on('data', (data) => {
				process.stdout.write(`${data}`);
			});

			exec.stderr.on('data', (data) => {
				process.stdout.write(`${data}`);
			});

			exec.on('close', (code) => {
				if(code === 0 || excludes.includes(code)) {
					resolve(code);
				}else {
					process.stdout.write(`errorCode: ${code}\n`);
					reject(code);
				}
			});
		});
	},

}