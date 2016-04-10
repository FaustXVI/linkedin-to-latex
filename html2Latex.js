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
    var safe = function(elm){ return elm.text().replace(" ","~").trim();}
    var profile = $("#profile");
    profile.find("br").replaceWith("\\endgraf ")
    var textOf = function(selector) { return profile.find(selector).text();}
    var summary = function(selector) {
        var section = profile.find(selector);
        return {
            title : safe(section.find(".title")),
            content : safe(section.find(".description")),
        }
     }
    var section = function(selector, subselector) {
        var section = profile.find(selector);
        var items = section.find(subselector).toArray().map(function(li){
            return {
                startDate: safe($(li).find(".date-range time:nth(0)")),
                endDate: safe($(li).find(".date-range time:nth(1)")),
                title: safe($(li).find(".item-title")),
                subtitle: safe($(li).find(".item-subtitle")),
                content: safe($(li).find(".description"))
            }
        })
        return {
            title : safe(section.children(".title")),
            items : items
        }
     }
    
    var tempFn = dot.template(template);
    var resultText = tempFn({
                               firstname : textOf("#name"),
                               title : textOf(".profile-overview-content .title"),
                               email : "xavier.detant@gmail.com",
                               summary : summary("#summary"),
                               sections : [
                                            section("#projects",".project"),
                                            section("#experience",".position"),
                                            section("#education",".school"),
                                            section("#volunteering",".position")
                                          ],
                               skillsTitle : "Compétences",
                               skills : profile.find("#skills .skill").filter(function(i,elm){
                                                return !$(elm).hasClass("see-more") && !$(elm).hasClass("see-less")
                                        }).toArray().map(function(skill){ 
                                                return $(skill).text();
                                        })
                            });
    console.log(resultText);
  }
});
