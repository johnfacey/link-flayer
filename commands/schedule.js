const Scheduler = require('../libScheduler.js');

module.exports = {
    name: 'schedule',
    description: 'Adjust the interval for the random command (in minutes)',
    execute(message, args) {
        try {
            if (args.length !== 1) {
                return message.reply('Please provide the interval in minutes. Usage: !schedule <minutes>');
            }

            const minutes = parseInt(args[0]);
            if (isNaN(minutes) || minutes < 1) {
                return message.reply('Please provide a valid number of minutes (greater than 0)');
            }

            // Get the scheduler instance
            const scheduler = message.client.scheduler;
            if (!scheduler) {
                return message.reply('Scheduler not initialized');
            }

            // Stop the current random interval
            if (scheduler.randomInterval) {
                clearInterval(scheduler.randomInterval);
            }

            // Start a new interval with the specified minutes
            const milliseconds = minutes * 60 * 1000;
            scheduler.randomInterval = setInterval(async () => {
                try {
                    scheduler.lastRandomRun = new Date();
                    const generalChannel = message.guild.channels.cache.find(
                        channel => channel.name === 'science-and-news' && channel.type === 'GUILD_TEXT'
                    );

                    if (!generalChannel) {
                        console.error('Could not find #science-and-news channel');
                        return;
                    }

                    const randomMessage = {
                        channel: generalChannel,
                        reply: async (content) => {
                            await generalChannel.send(content);
                        }
                    };

                    const randomCommand = message.client.commands.get('random');
                    if (randomCommand) {
                        await randomCommand.execute(randomMessage, ['general']);
                        console.log(`Random command executed in guild ${message.guild.name}`);
                    }
                } catch (error) {
                    console.error('Error in scheduled random task:', error);
                }
            }, milliseconds);

            // Set initial run time
            scheduler.lastRandomRun = new Date();

            message.reply(`Random command interval set to ${minutes} minutes\nNext run in: ${scheduler.getTimeUntilNextRandom()}`);
            console.log(`Random command interval updated to ${minutes} minutes`);
        } catch (error) {
            console.error('Error in schedule command:', error);
            message.reply('There was an error setting the schedule');
        }
    }
}; 