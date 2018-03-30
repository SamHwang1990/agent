/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

const Boot = require('../../fe-agent-boot/Application.js');
const CmdMapper = require('./cmdMapper.js');

const agent = new Boot();

agent.use(function* errorCatcher(context, next) {
    const res = context.res;
    res.code = 'S_OK';

    try {
        yield next();
    } catch(e) {
        res.code = 'FA_INVALID_REQUEST';
        res.msg = e.toString() + '\n' + e.stack || '';
        res.data.err = e;
    }
});

agent.use(function* xLogger(context, next) {
    // TODO: maybe need agent logger
    yield next();
});

agent.use(function* cmdInvoker(context, next) {
    let { method } = context.req;
    let api = CmdMapper(method);

    if (!api) throw new Error('FA_CMD_NOT_FOUND');

    yield api.apply(context);

    yield next();
});

module.exports = agent.startup();