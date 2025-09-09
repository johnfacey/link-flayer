const { Client } = require('discord.js');

const RANDOM_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours
const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

class Scheduler {
    constructor(client) {
        this.client = client;
        this.randomInterval = null;
        this.updateInterval = null;
        this.lastRandomRun = null;
        this.lastUpdateRun = null;
    }

    getTimeUntilNextRandom() {
        if (!this.lastRandomRun) return 'Not started yet';
        const nextRun = new Date(this.lastRandomRun.getTime() + RANDOM_INTERVAL_MS);
        const now = new Date();
        const diff = nextRun - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${hours} hours and ${minutes} minutes`;
    }

    getTimeUntilNextUpdate() {
        if (!this.lastUpdateRun) return 'Not started yet';
        const nextRun = new Date(this.lastUpdateRun.getTime() + UPDATE_INTERVAL_MS);
        const now = new Date();
        const diff = nextRun - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${hours} hours and ${minutes} minutes`;
    }

    start() {
        // Run random command every 2 hours
        this.randomInterval = setInterval(async () => {
            try {
                this.lastRandomRun = new Date();
                // Get all guilds the bot is in
                const guilds = this.client.guilds.cache;
                
                for (const [guildId, guild] of guilds) {
                    try {
                        // Find the #general channel in each guild
                        const generalChannel = guild.channels.cache.find(
                            channel => channel.name === 'science-and-news' && channel.type === 'GUILD_TEXT'
                        );

                        if (!generalChannel) {
                            console.error(`Could not find #science-and-news channel in guild ${guild.name}`);
                            continue;
                        }

                        // Create a message-like object for the random command
                        const randomMessage = {
                            channel: generalChannel,
                            reply: async (content) => {
                                await generalChannel.send(content);
                            }
                        };

                        // Execute random command with 'general' argument
                        const randomCommand = this.client.commands.get('random');
                        if (randomCommand) {
                            await randomCommand.execute(randomMessage, ['general']);
                            console.log(`Random command executed in guild ${guild.name}`);
                        } else {
                            console.error('Random command not found');
                        }
                    } catch (guildError) {
                        console.error(`Error processing guild ${guild.name}:`, guildError);
                    }
                }
            } catch (error) {
                console.error('Error in random scheduled task:', error);
            }
        }, RANDOM_INTERVAL_MS);

        // Run update command once a day
        this.updateInterval = setInterval(async () => {
            try {
                this.lastUpdateRun = new Date();
                // Get all guilds the bot is in
                const guilds = this.client.guilds.cache;
                
                for (const [guildId, guild] of guilds) {
                    try {
                        // Find the #general channel in each guild
                        const generalChannel = guild.channels.cache.find(
                            channel => channel.name === 'science-and-news' && channel.type === 'GUILD_TEXT'
                        );

                        if (!generalChannel) {
                            console.error(`Could not find #science-and-news channel in guild ${guild.name}`);
                            continue;
                        }

                        // Create a message-like object for the update command
                        const updateMessage = {
                            channel: generalChannel,
                            reply: async (content) => {
                                await generalChannel.send(content);
                            }
                        };

                        // Execute update command
                        const updateCommand = this.client.commands.get('update');
                        if (updateCommand) {
                            await updateCommand.execute(updateMessage, []);
                            console.log(`Update command executed in guild ${guild.name}`);
                        } else {
                            console.error('Update command not found');
                        }
                    } catch (guildError) {
                        console.error(`Error processing guild ${guild.name}:`, guildError);
                    }
                }
            } catch (error) {
                console.error('Error in update scheduled task:', error);
            }
        }, UPDATE_INTERVAL_MS);

        // Set initial run times
        this.lastRandomRun = new Date();
        this.lastUpdateRun = new Date();

        console.log('Scheduler started:');
        console.log(`- Next random command in: ${this.getTimeUntilNextRandom()}`);
        console.log(`- Next update command in: ${this.getTimeUntilNextUpdate()}`);
    }

    stop() {
        if (this.randomInterval) {
            clearInterval(this.randomInterval);
            this.randomInterval = null;
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('Scheduler stopped');
    }
}

module.exports = Scheduler; 