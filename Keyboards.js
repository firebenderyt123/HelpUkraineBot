const { Functions } = require('./Functions');

class Keyboards
{
    getMainMenu(lang_id)
    {
        return {
            "resize_keyboard": true,
            "keyboard": [
                [
                    Functions.selectText('help_ukraine_btn', lang_id),
                    Functions.selectText('guide_btn', lang_id)
                ],
                [
                    Functions.selectText('services_btn', lang_id),
                    Functions.selectText('where_to_go_btn', lang_id)
                ],
                [
                    Functions.selectText('languages_btn', lang_id)
                ]
            ]
        };
    }

}
module.exports = {
    Keyboards
};
