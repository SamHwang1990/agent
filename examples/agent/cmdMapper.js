 /**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

function* Login() {
    let { usreName, password } = this.req.params;
    // 处理网络层请求或持久层读写

    this.res.data = { token: '' };
}

const cmdMap = {
    login: Login
};

module.exports = function(path) {
    let paths = path.split('.');
    let pathItem;
    let map = null;
    while ((pathItem = paths.shift())) {
        map = (map || cmdMap)[pathItem];
        if (!map) return null;
    }

    return map;
};