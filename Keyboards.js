const { Functions } = require('./Functions');

class Keyboards
{
    getMainMenu(langId)
    {
        return {
            "resize_keyboard": true,
            "keyboard": [
                [
                    Functions.selectText('categories_btn', langId),
                    Functions.selectText('chat_btn', langId)
                ],
                [
                    Functions.selectText('change_language_btn', langId),
                    Functions.selectText('change_country_btn', langId),
                    Functions.selectText('change_city_btn', langId),
                ],
            ]
        };
    }

    getLanguageMenu(langId)
    {
        let languages = Functions.selectLanguages();
        let kb = [];
        for (let i = 0; i < languages.length; i++)
            kb.push([languages[i].value]);
        return {
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "keyboard": kb
        };
    }

}
module.exports = {
    Keyboards
};
