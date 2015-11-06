var jsdom = require('jsdom'),
    fs = require('fs'),
    path = require('path'),
    table = require('text-table'),
    trim = require('./trim'),
    stripJsonComments = require('strip-json-comments'),
    config = JSON.parse(stripJsonComments(fs.readFileSync(path.join(__dirname, './config.json'), 'utf-8')));

var window = jsdom.jsdom().defaultView;
var fileStr = fs.readFileSync(path.join(__dirname, './lan.html'), 'utf-8'),
    ary = [],
    total = 0,
    alignAry = [],
    TEXT_SEL = "div.ewr-ca div.cv-wl,div.ewr-ca div.cv-wr",
    aryIndex = 0;

jsdom.jQueryify(window, './jquery.js', function() {
    var $ = window.$;

    $("body").append(fileStr);

    var titleParEls = $("div.ewr-nglr");

    total = titleParEls.eq(0).find(TEXT_SEL).length;
    while (total--) {
        ary.push([]);
        alignAry.push(config.align);
    }

    titleParEls.each(function(index, item) {
        item = $(item);
        item.find(TEXT_SEL).each(function(subIndex, subItem) {
            subItem = $(subItem);

            aryIndex = config.style === 'horizontal' ? subIndex : index;

            ary[aryIndex] && ary[aryIndex].push(trim(subItem.text()));
        });
    });

    console.log( table(ary, {
        align: alignAry
    }));

    fs.writeFileSync('./result.txt', table(ary, {
        align: alignAry
    }));
});
