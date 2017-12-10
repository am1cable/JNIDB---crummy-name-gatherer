// ==UserScript==
// @name         JNIDB - crummy item name gatherer
// @description  gather names into period separated string
// @author       friendlytrenchcoat
// @match        https://items.jellyneo.net/search/*
// @require	     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var hunk = '. ';
if(typeof GM_getValue("items") !== 'undefined') hunk = GM_getValue("items");

$("img[src*='/items/']").each(function(k,v) { // each item on page
    hunk += $(v).attr("title") + ' . ';
});

console.log(hunk);
GM_setValue("items", hunk);
