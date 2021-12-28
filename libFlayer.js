// JD Requires
let Parser = require('rss-parser');
const axios = require('axios');
let parser = new Parser();
var jsonfile = require('jsonfile');
var fs = require('fs');
var file = ('./feeds.json');
var Airtable = require('airtable');

// Data Structures
var feeds = [];
let linkFlayerMap = [];
let linkFlayerCats = [];

//Aitrable Setup
var apiKey = process.env.KEY;
var userBase = process.env.BASE;
var userTable = process.env.TABLE

token = process.env.TOKEN;
var base = new Airtable({
  apiKey: apiKey
}).base(userBase);

//DuckDuckGo related structure
let answerData = {
  text: ``,
  source: ``
}

//Local DB for quotes
const {
  quotes
} = require('./quotes.json');

/**
 * Adds a new source url to configured Airtable
 * @constructor
 * @param {string} title - Title/Name of the RSS feed.
 * @param {string} link - URL of RSS feed.
 * @param {string} category - Category of RSS feed.
 */
exports.addSource = function (title, link, category) {

  for (i = 0; i < feeds.length; i++) {
    if (feeds[i].link == link) {
      return;
    }
  }

  base(userTable).create([{
    "fields": {
      "title": title,
      "link": link,
      "category": category
    }
  }], function (err, record) {
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

/**
 * Deletes a new source url to configured Airtable by title
 * @constructor
 * @param {string} title - Title/Name of the RSS feed.
 */
exports.deleteSource = function (title) {
  var deleteRecord = "";
  for (i = 0; i < feeds.length; i++) {
    if (feeds[i].title == title) {
      deleteRecord = feeds[i].id;
    }
  }
  base(userTable).destroy(deleteRecord, function (err, deletedRecord) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(deletedRecord.id);
  });
}

/**
 * Adds a new source url to configured Airtable
 * @constructor
 * @param {string} feedType - Category to select Feed by.
 */
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

exports.loadFeeds = function () {
  feeds = [];
  linkFlayerMap = [];
  linkFlayerCats = [];

  base(userTable)
    .select().eachPage(function page(records, fetchNextPage) {
      try {
        records.forEach(function (record) {
          console.log('Retrieved title: ', record.get('title'));
          console.log('Retrieved link:', record.get('link'));
          console.log('Retrieved category:', record.get('category'));

          var feedData = {
            title: `${unescape(record.get('title'))}`,
            link: `${unescape(record.get('link'))}`,
            category: `${unescape(record.get('category'))}`,
            id: record.getId()
          }

          feeds.push(feedData);

          let foundCat = false;
          linkFlayerCats.forEach(cat => {
            if (cat == record.get('category')) {
              foundCat = true;
            }
          });

          if (!foundCat) {
            linkFlayerCats.push(record.get('category'));
          }


        });
      } catch (error) {
        console.log(error);
      }


      feeds.forEach(feedBlock => {
        (async () => {
          try {
            const feed = parser.parseURL(feedBlock.link, function (err, feed) {
              if (err) {
                console.log(err + " " + feedBlock.link);
                //return;
              }
              console.log(feed.title);
              feed.items.forEach(item => {

                var linkData = {
                  title: `${unescape(item.title)}`,
                  link: `${unescape(item.link)}`,
                  category: `${unescape(feedBlock.category)}`
                }
                linkFlayerMap.push(linkData);

              });

            })
          } catch (error) {
            console.log(error);
          }
        })().then();
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
   answerData = {
    text: ``,
    source: ``
  }
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
      return answerData;
    })
    .catch(error => {
      console.log(error);
    });
  return answerData;
}

/**
 * getQuotes - Returns libFlayer feed sources
 * @constructor
 */
exports.getSources = function () {
  return feeds;
}

/**
 * getQuotes - Returns libFlayer feed quotes
 * @constructor
 */
exports.getQuotes = function () {
  return quotes;
}

/**
 * getCategories - Returns libFlayer feed categories
 * @constructor
 */
exports.getCategories = function () {
  return linkFlayerCats;
}

/**
 * sleep - sleep/wait
 * @constructor
 */
 exports.sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
})
