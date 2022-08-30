const { Functions } = require('./Functions');

class Keyboards
{
    getMainMenu(lang_id)
    {
        return {
            "resize_keyboard": true,
            "keyboard": [
                [
                    Functions.selectText('categories_btn', lang_id),
                    Functions.selectText('chat_btn', lang_id)
                ],
                [
                    Functions.selectText('change_language_btn', lang_id),
                    Functions.selectText('change_country_btn', lang_id),
                    Functions.selectText('change_city_btn', lang_id),
                ],
            ]
        };
    }

}
module.exports = {
    Keyboards
};
