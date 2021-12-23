let Parser = require('rss-parser');
let parser = new Parser();
let feeds = require('./feeds.json');
var jsonfile = require('jsonfile');
var fs = require('fs');
var file = ('./feeds.json');
let linkFlayerMap = [];

const { quotes } = require('./quotes.json');

exports.addSource = function(title,source){
  var linkData = {
    title: `${title}`,
    link: `${source}`
  }

  for (i=0; i<feeds.length; i++){
    if (feeds[i].link == source){
      return;
    }
  }
  feeds.push(linkData);

}

exports.sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); })

exports.loadFeeds = function() {
    linkFlayerMap = [];
    feeds.forEach(feedBlock => {
        (async () => {
            const feed = parser.parseURL(feedBlock.link, function(err, feed) {
              if (err) throw err;
              console.log(feed.title);
              feed.items.forEach(item => {

                var linkData = {
                  title: `${unescape(item.title)}`,
                  link: `${unescape(item.link)}`,
                  category: `${unescape(item.category)}`
                }
                linkFlayerMap.push(linkData);
              });
            }) 
          })().then();
    });

}


exports.writeFeed = function (feeds) {
    
    jsonfile.writeFile(file, feeds, function (err) {
        if (err != null) {
            console.error(err);
        }
    });

    console.log("saving feeds.json");

};
exports.getFeeds = function (feedType) {
    if (feedType == null || feedType == undefined || feedType == "") {
      return linkFlayerMap;
    } else {
      var linkFlayerFilteredMap = [];
      linkFlayerMap.forEach(linkFlay => {
        if (linkFlay.category.toLowerCase().indexOf(feedType.toLowerCase()) > -1) {
          linkFlayerFilteredMap.push(linkFlay);
        }
      });
      return linkFlayerFilteredMap;
    }
}

exports.getSources = function () {
  return feeds;
}

exports.getQuotes = function () {
  return quotes;
}