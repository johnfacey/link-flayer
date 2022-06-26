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
var stockKey = process.env.STOCK_KEY;

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
    .select().firstPage(function(err, records) {
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

          var foundMatch = false;
          feeds.forEach(feedBlock => {
            if (feedBlock.link == feedData.link) {
              foundMatch = true;
            }
          });
          if (!foundMatch) {
            feeds.push(feedData);
          }

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

            const feed = parser.parseURL(feedBlock.link, function (err, feed) {
              if (err) {
                console.log(err + " " + feedBlock.link);
                //return;
              }
              
              feed.items.forEach(item => {
                var foundFeed = false;
                linkFlayerMap.forEach(linkFlay => {
                  if (linkFlay.link == item.link) {
                    foundFeed = true;
                  }
                });

                if (!foundFeed) {
                  var linkData = {
                    title: `${unescape(item.title)}`,
                    link: `${unescape(item.link)}`,
                    category: `${unescape(feedBlock.category)}`
                  }
                  linkFlayerMap.push(linkData);
                }

              });

            })
         
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
    text: `No answer found try using a simpler search term`,
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

exports.getSlang = async function (question) {

  var answerURL = `https://api.urbandictionary.com/v0/define?term=${question}`;
  console.log(answerURL);
  slangData = {
    definition: `No answer found try using a simpler search term`,
    example: ``
  }
  await axios.get(answerURL)
    .then(response => {
      console.log(response.data.list[0]);
    
        slangData = {
          definition: `${unescape(response.data.list[0].definition)}`,
          example: `${unescape(response.data.list[0].example)}`,
          thumbs_down: `${unescape(response.data.list[0].thumbs_down)}`,
          thumbs_up: `${unescape(response.data.list[0].thumbs_up)}`
        }
     
      return slangData;
    })
    .catch(error => {
      console.log(error);
    });
  return slangData;
}

exports.getStock = async function (stock) {

  var answerURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&interval=5min&apikey=${stockKey}`;
  console.log(answerURL);
  stockData = {
    symbol: `Not Found`,
    open: ``,
    high: ``,
    low: ``,
    price: ``,
    volume: ``,
    latest: ``,
    previous: ``,
    change: ``,
    percent: ``
  }
  await axios.get(answerURL)
    .then(response => {
      //console.log(response.data.list[0]);
    
      stockData = {
          symbol: `${unescape(response.data["Global Quote"]['01. symbol'])}`,
          open: `${unescape(response.data["Global Quote"]['02. open'])}`,
          high: `${unescape(response.data["Global Quote"]['03. high'])}`,
          low: `${unescape(response.data["Global Quote"]['04. low'])}`,
          price: `${unescape(response.data["Global Quote"]['05. price'])}`,
          volume: `${unescape(response.data["Global Quote"]['06. volume'])}`,
          latest: `${unescape(response.data["Global Quote"]['07. latest trading day'])}`,
          previous: `${unescape(response.data["Global Quote"]['08. previous close'])}`,
          change: `${unescape(response.data["Global Quote"]['09. change'])}`,
          percent: `${unescape(response.data["Global Quote"]['10. change percent'])}`
        }
     
      return stockData;
    })
    .catch(error => {
      console.log(error);
    });
  return stockData;
}



/**
 * getSources - Returns libFlayer feed sources
 * @constructor
 */
exports.getSources = function () {
  return feeds;
}

/**
 * getQuotes - Returns libFlayer feed quotes
 * @constructor
 */
exports.getQuotes =  async function (quote_url) {

var data = [];
  await axios.get(quote_url)
    .then(response => {
      console.log(response.data[0].q);
      console.log(response.data[0].a);
      data = response.data;
  
      return data;
    })
    .catch(error => {
      console.log(error);
    });
    return data;
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
