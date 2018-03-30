/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

const CreateClass = require('../classify.js').create;

const Request = CreateClass({
    initialize: function(options = {}) {
        this.method = options.method;
        this.reformer = options.reformer;
        this.params = options.params || {};

        this.ctx = null;
    }
});

module.exports = Request;
