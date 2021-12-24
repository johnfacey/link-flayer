let Parser = require('rss-parser');
const axios = require('axios');
let parser = new Parser();

var feeds = [];
var jsonfile = require('jsonfile');
var fs = require('fs');
var file = ('./feeds.json');
var Airtable = require('airtable');

var apiKey=process.env.KEY;
var userBase=process.env.BASE;
var userTable =process.env.TABLE

token = process.env.TOKEN;
var base = new Airtable({apiKey: apiKey}).base(userBase);

let linkFlayerMap = [];
let answerData = {
  text: ``,
  source: ``
}

const { quotes } = require('./quotes.json');

exports.addSource = function(title,link,category){

  for (i=0; i<feeds.length; i++){
    if (feeds[i].link == link){
      return;
    }
  }

  base(userTable).create([
    {
      "fields": {
        "title": title,
        "link": link,
        "category": category
      }
    }
  ], function(err, record) {
    if (err) {
      console.error(err);
      return;
    }

      console.log(record.getId());

      var linkData = {
        title: `${title}`,
        link: `${link}`,
        category: `${category}`,
        id: record.getId()
      }

      feeds.push(linkData);

  });



}

exports.deleteSource = function(title) {
  var deleteRecord = "";
  for (i=0; i<feeds.length; i++){
    if (feeds[i].title == title){
      deleteRecord = feeds[i].id;
    }
  }
  base(userTable).destroy(deleteRecord, function(err, deletedRecord) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(deletedRecord.id);
  });
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
                  title: `${item.title}`,
                  link: `${item.link}`,
                  category: `${feedBlock.category}`,
                  id: record.getId()
                }
                linkFlayerMap.push(linkData);
              });
            }) 
          })().then();
    });

}

exports.getFeeds = function (feedType) {
  var linkFlayerFilteredMap = [];
    if (feedType == null || feedType == undefined || feedType == "") {
      return linkFlayerMap;
    } else {
      
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

exports.getConfig = function() {
  feeds = [];
  base(userTable)
            .select().eachPage(function page(records, fetchNextPage) {

              records.forEach(function(record) {
                console.log('Retrieved title: ', record.get('title'));
                console.log('Retrieved link:', record.get('link'));
                console.log('Retrieved category:', record.get('category'));

                var linkData = {
                  title: `${record.get('title')}`,
                  link: `${record.get('link')}`,
                  category: `${record.get('category')}`
                }

                feeds.push(linkData);
              
            });
            return;
              //fetchNextPage();
          }, function done(error) {
              console.log(error);
          });
}

exports.getAnswer = async function (question) {

  var answerURL = `https://api.duckduckgo.com/?q=${question}&format=json&pretty=1`;
  console.log(answerURL);
    await axios.get(answerURL)
    .then(response => {
      console.log(response.data.RelatedTopics[0].Text);
      console.log(response.data.RelatedTopics[0].FirstURL);

      if (response.data.Abstract != "") {
        answerData = {
          text: `${unescape(response.data.Abstract)}`,
          source: `${unescape(response.data.AbstractSource)}`
        }
      } else {
        answerData = {
          text: `${unescape(response.data.RelatedTopics[0].Text)}`,
          source: `${unescape(response.data.RelatedTopics[0].FirstURL)}`
        }
      }
     
    })
    .catch(error => {
      console.log(error);
    });
    return answerData;
}

this.getConfig();