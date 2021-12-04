var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'exit',
	description: 'Exit',
	execute(message) {
		message.reply(
			`!Goodbye world - someone respawn my process`
		);
        await new Promise(resolve => setTimeout(process.exit(), 5000));
	}
};