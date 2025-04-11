const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'remind',
    description: 'Set a reminder',
    async execute(message, args) {
        if (args.length < 2) {
            message.reply('Please use the format: !remind [time] [message]\nExample: !remind 2d1h30m Take out the trash\nTime units: d (days), h (hours), m (minutes), s (seconds)');
            return;
        }

        // Parse time argument
        const timeArg = args[0].toLowerCase();
        let timeInMs = 0;
        
        // Parse days
        const daysMatch = timeArg.match(/(\d+)d/);
        if (daysMatch) {
            timeInMs += parseInt(daysMatch[1]) * 24 * 60 * 60 * 1000;
        }
        
        // Parse hours
        const hoursMatch = timeArg.match(/(\d+)h/);
        if (hoursMatch) {
            timeInMs += parseInt(hoursMatch[1]) * 60 * 60 * 1000;
        }
        
        // Parse minutes
        const minutesMatch = timeArg.match(/(\d+)m/);
        if (minutesMatch) {
            timeInMs += parseInt(minutesMatch[1]) * 60 * 1000;
        }
        
        // Parse seconds
        const secondsMatch = timeArg.match(/(\d+)s/);
        if (secondsMatch) {
            timeInMs += parseInt(secondsMatch[1]) * 1000;
        }

        if (timeInMs === 0) {
            message.reply('Please specify a valid time format (e.g., 2d1h30m, 1d, 45m, 30s)');
            return;
        }

        // Get the reminder message
        const reminderMessage = args.slice(1).join(' ');

        // Create and send confirmation embed
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Reminder Set')
            .setDescription(`I'll remind you in ${timeArg} about: ${reminderMessage}`)
            .setTimestamp();

        message.reply({ embeds: [embed] });

        // Set the reminder
        setTimeout(() => {
            const reminderEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('⏰ Reminder!')
                .setDescription(reminderMessage)
                .setTimestamp();

            message.author.send({ embeds: [reminderEmbed] })
                .catch(() => {
                    message.channel.send(`<@${message.author.id}>, I couldn't DM you your reminder. Here it is: ${reminderMessage}`);
                });
        }, timeInMs);
    }
}; 