let Parser = require('rss-parser');
let parser = new Parser();
let feeds = require('./feeds.json');


let linkFlayerMap = [];

const { quotes } = require('./quotes.json');

exports.addSource = function(title,source){
  var linkData = {
    title: `${title}`,
    link: `${source}`
  }
  feeds.push(linkData);
}

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
                  link: `${unescape(item.link)}`
                }
                linkFlayerMap.push(linkData);
              });
            })

            
            
          })().then();
    });

}

exports.getFeeds = function () {
    return linkFlayerMap;

}

exports.getSources = function () {
  return feeds;

}

exports.getQuotes = function () {
  return quotes;
}