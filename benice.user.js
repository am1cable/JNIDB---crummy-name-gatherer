// ==UserScript==
// @name         JNIDB - crummy item name gatherer VERSION MEGA
// @description  gather names into downloadable json
// @author       friendlytrenchcoat & am1cable
// @match        https://items.jellyneo.net/search/*
// @require	     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

$(document).ready(function () {
    var collectAndMove = '<button type="button" class= "small round jnbutton" id="grabGo">Scrape data and continue</button>',
        downloadResults = '<button type="button" class= "small round jnbutton" id="printMe">Download results</button>',
        clearAllData = '<button type="button" class= "small round jnbutton" download="itemList.json" id="clearList">Clear all stored item data</button>';
    $('ul[class="breadcrumbs"]').next().after('<br>' + collectAndMove + downloadResults + clearAllData + '<br>');

    $('#grabGo').on("click", function () {
        continueFlow();
    });
    $('#printMe').on("click", function () {
        returnData();
    });
    $('#clearList').on("click", function () {
        clearData();
    });
});


//FUN-ctions(´∀`)//
function continueFlow() {
    var link = canLoad();
    if (link !== false) {
        setData();
        link[0].click();
    }
}

function getNames() {
    var list = [];

    $("img[src*='/items/']").each(function (k, v) { // each item on page
        var name = $(v).attr('title');
        list.push(name);
    });

    return list;
}

function canLoad() {
    var next = $("ul.pagination li.current").first().next("li");
    if (next.attr("class") !== "arrow unavailable") {
        return next.find("a");
    }
    return false;
}

function getRarity() {
    var url = window.location.href,
        rarities = /\?min_rarity=(\d{1,3})\&max_rarity=(\d{1,3})/,
        values = {};

    values.min = url.match(rarities)[1];
    values.max = url.match(rarities)[2];

    return numberRarity(values);
}

function numberRarity(values) {
    if (values.max !== undefined) {
        return values.min + '-' + values.max;
    }
    return values.min + '+';
}

function updateList() {
    var rarity = getRarity(''),
        newList = createNew(rarity),
        oldList = getData(),
        compiledList;

    if (oldList !== undefined) {
        debugger;
        var mergeList = oldList;
        mergeList[rarity] = mergeList[rarity] === undefined ? newList[rarity] : combineLists(oldList[rarity], newList[rarity]);
        compiledList = convert(mergeList, "string");
    } else {
        compiledList = convert(newList, "string");
    }
    return compiledList;
}

function combineLists(oldList, newList, currentRarity) {
    var combined = oldList;
    for (var i = 0; i < newList.length; i++) {
        if (!oldList.includes(newList[i])) {
            combined.push(newList[i]);
        }
    }
    return combined;
}

function createNew(rarity) {
    var newList = {};
    newList[rarity] = getNames();

    return newList;
}

function setData() {
    var currentList = updateList();
    console.log(currentList);
    GM_setValue('items', currentList);
}

function getData() {
    var oldList = typeof GM_getValue('items') !== undefined ? oldList = convert(GM_getValue('items'), "JSON") : undefined;
    return oldList;
}

function clearData() {
    GM_deleteValue('items');
}

function convert(value, result) {
    var returning = value;
    if (result == "string") {
        returning = typeof value == "string" ? value : JSON.stringify(value);
    }
    if (result == "JSON") {
        returning = typeof value == "string" ? JSON.parse(value) : value;
    }
    return returning;
}

function returnData() {
    var list = convert(GM_getValue('items'), "string"),
        data = new Blob([list], {
            type: 'text/txt'
        });
    if (list !== null) {
        window.URL.revokeObjectURL(list);
    }
    list = window.URL.createObjectURL(data);

    var link = document.createElement("a");
    link.download = 'itemList.json';
    link.href = list;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
