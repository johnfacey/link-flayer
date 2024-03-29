var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'food',
    description: 'Food',
    async execute(message, args) {
        try {

            var resultArray = await libFlayer.getFood();
            
            message.reply(` 
            [**${resultArray.strMeal}** - *${resultArray.strCategory}*]

            ${resultArray.strSource}
                
            ${resultArray.strMealThumb}
                
            `);
        } catch (err) {
            message.reply(err.toString());
        }
    }
};