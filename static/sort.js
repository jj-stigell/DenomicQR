!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).jqueryTableSortable=e()}(this,(function(){"use strict";
/**
 * A simple jQuery plugin to sort table body by a selected column
 * @license MIT
 * @author Dumitru Uzun (DUzun.Me)
 * @version 0.0.2
 */function t(t){var e,n,r="th:not(.nosort),td.sort",a={cmp:void 0},o=function(o){o=t.extend({},a,o),this.addClass("table_sortable");var s=this.children("thead"),d=this.children("tbody"),c=s.children("tr");return s.on("click",r,(function(){var a=t(this),s=a.hasClass("asc")?-1:1;c.children(r).removeClass("asc desc"),-1===s?a.removeClass("asc").addClass("desc"):a.removeClass("desc").addClass("asc");var f=a.data("_cols_");null==f&&(!function(e){var n=[];e.each((function(e,r){t(r).children("th,td").each((function(r,a){for(var o=a.rowSpan,i=a.colSpan,s=[],d={};o-- >0;)for(var c=e+o,f=i;f-- >0;){for(var l=r+f,u=n[c]||(n[c]=[]);u[l];)++l;u[l]=a,l in d||(s.push(l),d[l]=l)}s.sort(),t(a).data("_cols_",s)}))}))}(c),f=a.data("_cols_"));var l=d.find(">tr:has(td)").get().map((function(e){var n=t(e).children("td"),r=f.map((function(t){var e=n.eq(t).text().toUpperCase(),r=[e],a=parseFloat(e.trim());return isNaN(a)||(r[1]=a),r}));return r.tr=e,r}));e=s>0?1:-1,n=o.cmp,l.sort(i),d.append(l.map((function(t){return t.tr})))})),this};function i(t,r){var a;return t.some((function(t,e){var o=r[e];if(n)return a=n(t[0],o[0]);if(1 in t&&1 in o&&(a=t[1]-o[1]))return a;var i=t[0],s=o[0];return i!=s?a=i<s?-1:1:void 0})),a*e}return o.defaults=a,t.fn.tableSortable=o,o}if("undefined"!=typeof window){var e=window.jQuery||window.Zepto;e&&t(e)}return t}));