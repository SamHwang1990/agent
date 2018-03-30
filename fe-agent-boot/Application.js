/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

const CreateClass = require('../classify.js').create;

const { compose } = require('../coCompose.js');

const Context = require('./Context.js');
const Request = require('./Request.js');
const Response = require('./Response.js');

const Application = CreateClass({
    initialize: function() {
        this._middlewares = [];
    },

    use: function(fn) {
        this._middlewares.push(fn);
        return this;
    },

    createContext: function(requestOptions) {
        const context = new Context();
        const request = new Request(requestOptions);
        const response = new Response();

        context.app = this;
        context.req = request;
        context.res = response;

        request.ctx = context;
        response.ctx = context;

        return context;
    },

    startup: function() {
        const fn = compose(this._middlewares);
        const self = this;
        return function handleRequest(cmd, options) {
            let requestOptions = null;

            if (_.isPlainObject(cmd)) {
                requestOptions = Object.assign({}, cmd);
            } else if (typeof cmd === 'string') {
                if (_.isPlainObject(options)) {
                    requestOptions = Object.assign({ method: cmd }, options)
                } else if (!options) {
                    requestOptions = { method: cmd };
                 }
            }

            if (!requestOptions) {
                throw new Error('can\' not execute cmd without valid params');
            }

            const context = self.createContext(requestOptions);
            const onerror = err => onError(context, err);
            const handleResponse = () => respond(context);

            return fn(context).then(handleResponse).catch(onerror);
        };
    }
});

function respond(ctx) {
    const res = ctx.res;

    const msg = res.msg;
    const code = res.code;
    const data = res.data;

    return {
        msg,
        code,
        data: shadowClone(data)
    }
}

function onError(ctx, err) {
    if (err == null) return;

    if (!(err instanceof Error)) err = new Error('non-error thrown: ' + err);

    ctx.res.end();
    throw err;
}

function shadowClone(v) {
    let type = typeof v;
    if (v == null || type !== 'object') return v;

    if (Array.isArray(v)) {
        return Array.from(v);
    } else {
        return Object.assign({}, v);
    }
}

module.exports = Application;