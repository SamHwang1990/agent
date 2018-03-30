/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

const Agent = require('./agent');
const co = require('../fe-agent-boot/co');

function login(userName, userPassword) {
    return co(function*() {
        const response = yield Agent('login', {
            params: {
                userName,
                password: userPassword
            }
        });

        if (response.code === 'S_OK') {
            // login success
            console.log(response.data.token);
        } else {
            console.log('login failed');
        }
    })
}

login('foo', 'bar');