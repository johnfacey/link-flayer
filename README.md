# Link-Flayer

**Discord RSS News Bot**

Link Flayer is a Discord Bot designed to provide your Discord server with news.

## Setup

- *npm install link-flayer* or *git clone https://github.com/johnfacey/link-flayer.git*
- Add your token from Discord Bot Interface to the *config.json* [https://discord.com/developers/applications/]
<pre>
Example: config.json 
{
	"prefix": "!",
	"token": "{Your Discord Bot Token Here}"
}
</pre>

## Configure your feeds.json: 
Each node with a "title" and "link" attribute.

<pre>
Example: feeds.json 
[
    {
	    "title": "CNN Top Stories",
	    "link": "http://rss.cnn.com/rss/cnn_topstories.rss"
    },
    {
	    "title": "Reddit Front Page",
	    "link": "http://www.reddit.com/.rss"
    },
    {
	    "title": "Arstechnica",
	    "link": "http://feeds.arstechnica.com/arstechnica/index"
    }
    
]
</pre>

## Usage

- *npm run start* or *node index.js*



## Available Commands
	
* **!help** - Lists the available commands: *!help*

* **!search** - Searches the RSS Sources: *!search google*

* **!get** - Retrieves Search By Index: *!get 25*

* **!add** - Add a new RSS Source Feed dynamically: *!add http://www.engadget.com/rss.xml*

* **!update** - Updates all current RSS Feeds: *!update*

