"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var translateToken = require('./token');
var axios_https_proxy_fix_1 = require("axios-https-proxy-fix");
var util_1 = require("./util");
var language_1 = require("./language");
function handletranslate(data, extra) {
    var e;
    if (extra.from) {
        if (!language_1.isSupport(extra.from)) {
            e = new Error();
            e.language = extra.from;
        }
    }
    if (!language_1.isSupport(extra.to)) {
        e = new Error();
        e.language = extra.to;
    }
    if (e) {
        e.code = 400;
        e.message = 'The language \'' + e.language + '\' is not supported';
        return new Promise(function (_, reject) {
            reject(e);
        });
    }
    var tld = extra.tld || 'com';
    return translateToken
        .get(data.join(''), {
        tld: tld,
        proxy: extra.proxy || false,
    })
        .then(function (res) {
        var query = {
            anno: 3,
            client: "webapp",
            format: extra.format,
            v: 1.0,
            key: null,
            logld: "vTE_20190506_00",
            sl: extra.from || 'auto',
            tl: extra.to || 'zh-CN',
            hl: 'zh-CN',
            sp: "nmt",
            tc: 2,
            sr: 1,
            tk: res.value,
            mode: 1
        };
        var headers = {
            "content-type": "application/x-www-form-urlencoded",
            "Accept": "application/json, text/plain, */*",
            'X-Requested-With': 'XMLHttpRequest'
        };
        if (typeof extra.isUserAgent === 'undefined' || extra.isUserAgent) {
            headers['User-Agent'] = extra.userAgent ? extra.userAgent : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
        }
        var options = __assign({ method: "POST", headers: headers, data: util_1.arrayStringify(data), url: '/translate_a/t', baseURL: "https://translate.google." + tld, params: query, proxy: extra.proxy || false }, (extra.config));
        var browersUrl = 'https://cors-anywhere.herokuapp.com/';
        if (extra.browersUrl) {
            browersUrl = extra.browersUrl;
        }
        if (extra.browers) {
            options.baseURL = browersUrl + options.baseURL;
        }
        return axios_https_proxy_fix_1.default(options);
    });
}
exports.default = handletranslate;
