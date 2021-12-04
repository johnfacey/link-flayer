var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'exit',
	description: 'Exit',
	async execute(message) {
		message.reply(
			`Goodbye world - Disconnection imminent.`
		);
		await libFlayer.sleep(5000);
        await new Promise(resolve => setTimeout(process.exit(), 5000));
	}
};