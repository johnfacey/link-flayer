# Link-Flayer

**Discord RSS News Bot**

Link Flayer is a Discord Bot designed to provide your Discord server with RSS Newsfeeds Instant Web Searches and more.

## Setup

- If installing the npm or source *npm install link-flayer* or *git clone https://github.com/johnfacey/link-flayer.git*
- Add your token from Discord Bot Interface to the *config.json* [https://discord.com/developers/applications/]
- Setup has been moved from config file to environment variables to assume bot runs from one instance

## Configure your feeds.json: 
Each node with a "title", "link", "category" attribute to be used from an Airtable columns. 
Setting up Airtable for multiple Discord severs still in progress. 
It should be assumed every server will need its own Airtable Base and the coresponding apiKey, base and table name.

![Airtable](./assets/airtable.png)

## Usage

- If using the bot running already from its instance this setup will come later with multiple server profiles. Refer to the above for authorizing a bot to your server.
- Running from source *npm run start* or *node index.js*
- Can be added to any discord server with admin access and this oAuth link https://discord.com/api/oauth2/authorize?client_id=820809725398089779&permissions=2048&scope=bot

## Available Commands
	
* **!help** - Lists the available commands: *!help*

* **!search** - Searches the RSS Sources: *!search google*

* **!get** - Retrieves Search By Index: *!get 25*

* **!add** - Add a new RSS Source Feed dynamically: *!add http://www.engadget.com/rss.xml*

* **!update** - Updates all current RSS Feeds: *!update*

* **!quote** - Selects a random quote: *!quote*

* **!random** - Selects a random article: *!random*

* **!random category** - Selects a random article by category: *!random sports*

* **!answer** - Instant Live Search: *!answer salesforce*

* **!slang** - Urban Dictionary Search: *!slang slang*

* **!stock** - AlphaVantage Stock Search: *!stock IBM*

* **!play** - Plays a trivia game question: *!play*

* **!answer** - Answers for a question above: *!answer 1*

* **!npm** - Gets NPM info from repository: *!npm axios*

* **!alert** - Gets weather alerts for an area: *!alert TX*

* **!calc** - Do math: *!calc 2 + 2*

* **!food** - Selects a random recipe: *!food*

* **!code** - Searches for code snippets: *!code python loop*

Example:

![Airtable](./assets/ss1.png)

