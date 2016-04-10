var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");
var template = fs.readFileSync("./cv.tex.template");
var dot = require("dot");

dot.templateSettings = {
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false
};

jsdom.env({
  file: "./XavierDetant.html",
  src: [jquery],
  done: function (err, window) {
    var $ = window.$;
    var profile = $("#profile");
    var textOf = function(selector) { return profile.find(selector).text();}
    var tempFn = dot.template(template);
    var resultText = tempFn({
                               firstname : textOf("#name"),
                               title : textOf(".profile-overview-content .title"),
                               email : "xavier.detant@gmail.com",
                            });
    console.log(resultText);
  }
});
