var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'food',
    description: 'Food',
    async execute(message, args) {
        try {

            var resultArray = await libFlayer.getFood();
            
            message.reply(`**Retrieving**: 
            [${resultArray.strMeal} - ${resultArray.strCategory}]

            ${resultArray.strInstructions}

            ${resultArray.strSource}
                
            ${resultArray.strMealThumb}
                
            `);
        } catch (err) {
            message.reply(err.toString());
        }
    }
};