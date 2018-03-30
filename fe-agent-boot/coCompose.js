/**
 * Created by zhiyuan.huang@rdder.com.
 *
 * mainly referred to koa-compose: https://raw.githubusercontent.com/koajs/compose/master/index.js
 *
 * only require this module when Promise is available
 */

'use strict';

const co = require('./co.js')

function compose(middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
    for (let fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    /**
     * @return {Promise}
     * @api public
     */

    return function (context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch (i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                fn = co.wrap(fn);
                return Promise.resolve(fn(context, function next () {
                    return dispatch(i + 1);
                }))
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
}

function Executor(initContext, next) {
    if (Object.prototype.toString.apply(initContext) !== '[object Object]') initContext = {};

    this.finalMD = next;
    this.context = initContext;
    this.middlewares = [];
}

Executor.prototype.use = function(middleware) {
    this.middlewares.push(middleware);
};

Executor.prototype.action = function() {
    return compose(this.middlewares)(this.context, this.finalMD);
};

module.exports = {
    co,
    Executor,
    compose
}