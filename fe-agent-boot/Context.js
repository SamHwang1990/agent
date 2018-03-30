/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

const CreateClass = require('../classify.js').create;

const Context = CreateClass({
    initialize: function() {
        this.app = null;
        this.req = null;
        this.res = null;
    },
    throw: function(...args) {
        throw new Error(...args);
    },
    end: function() {
        this.app = null;
        this.req = null;
        this.res = null;
    }
});

module.exports = Context;