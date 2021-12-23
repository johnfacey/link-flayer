var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'categories',
	description: 'Categories',
	async execute(message) {
		message.reply(
			`Categories: [General, Entertainment, Sports, Tech]`
		);
	}
};