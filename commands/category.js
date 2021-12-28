var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'categories',
	description: 'Categories',
	execute(message) {
		var cats = libFlayer.getCategories();
	
		message.reply(
			`Categories: [${cats.join(', ')}]`
		);
	}
};