/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

const CreateClass = require('../classify.js').create;

const Response = CreateClass({
    initialize: function() {
        this.ctx = null;

        this.finished = false;

        this._defineProperties();
    },

    _defineProperties: function() {
        Object.defineProperties(this, {
            msg: {
                get: () => {
                    return this._msg;
                },
                set: msg => {
                    this._msg = msg;
                }
            },

            code: {
                get: () => {
                    return this._code;
                },
                set: code => {
                    this._code = code;
                }
            },

            data: {
                get: () => {
                    if (!this._data) {
                        this._data = {}
                    }
                    return this._data;
                },
                set: data => {
                    this._data = data;
                }
            }
        })
    },

    end: function(result) {
        this.finished = true;

        if (!_.isPlainObject(result)) return;

        const { data, msg, code } = result;

        data && (Object.assign(this.data, data));
        msg && (this.msg = msg);
        code && (this.code = code);
    }
});

module.exports = Response;
