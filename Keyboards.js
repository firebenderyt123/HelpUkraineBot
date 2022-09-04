const { Functions } = require('./Functions');

class Keyboards
{
    getMainMenu(langId)
    {
        return {
            "resize_keyboard": true,
            "keyboard": [
                [
                    Functions.selectText('profile_btn', langId),
                    Functions.selectText('categories_btn', langId),
                    Functions.selectText('chat_btn', langId)
                ],
                [
                    Functions.selectText('create_offer_btn', langId)
                ],
                [
                    Functions.selectText('change_language_btn', langId),
                    Functions.selectText('change_country_btn', langId),
                    Functions.selectText('change_city_btn', langId),
                ],
            ]
        };
    }

    getLanguageMenu()
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

    getCountriesMenu(langId, page = 1)
    {
        let res = this.getFromTo(page);
        let countries = Functions.selectCountries(langId, res[0], res[1]);

        return {
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "keyboard": this.createKb(countries, langId, page)
        };
    }

    getCitiesMenu(langId, countryId, page = 1)
    {
        let res = this.getFromTo(page);
        let cities = Functions.selectCities(langId, countryId, res[0], res[1]);

        return {
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "keyboard": this.createKb(cities, langId, page)
        };
    }

    getCategoriesMenu(categories, langId, page = 1)
    {
        let res = this.getFromTo(page);
        let cats = [];
        for (let i = res[0]; i < res[1]; i++)
            if (categories[i])
                cats.push(categories[i]);
        return {
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "keyboard": this.createKb(cats, langId, page)
        };
    }

    getPriceKeyboard(langId)
    {
        return {
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "keyboard": [
                [
                    Functions.selectText('1_btn', langId),
                    Functions.selectText('2_btn', langId),
                    Functions.selectText('5_btn', langId)
                ],
                [
                    Functions.selectText('10_btn', langId),
                    Functions.selectText('20_btn', langId),
                    Functions.selectText('50_btn', langId)
                ],
                [
                    Functions.selectText('100_btn', langId),
                    Functions.selectText('200_btn', langId),
                    Functions.selectText('500_btn', langId)
                ],
                [
                    Functions.selectText('free_btn', langId)
                ]
            ]
        };
    }

    getPhotoKeyboard(langId)
    {
        return {
            "resize_keyboard": true,
            "one_time_keyboard": true,
            "keyboard": [
                [
                    Functions.selectText('no_photo_btn', langId)
                ]
            ]
        };
    }

    getFromTo(page)
    {
        let from;
        let to;
        if (page == 1) {
            from = 0;
            to = 10;
        } else if (page >= 2) {
            from = (page - 1) * 9;
            to = from + 10;
        }
        return [from, to];
    }

    createKb(data, langId, page) // for 3x3
    {
        let nextBtn = Functions.selectText('page_btn', langId) + ' ' + (parseInt(page) + 1) + ' ➡️';
        let prevBtn = '⬅️ ' + Functions.selectText('page_btn', langId) + ' ' + (parseInt(page) - 1);
        let kb = [];

        for (let i = 0; i < data.length; i += 3) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                if (data[i+j]) {
                    row.push(data[i+j].value);
                }
            }
            kb.push(row);
        }

        if (page == 1) {
            if (data.length == 10)
                kb[3][0] = nextBtn;
        }
        else if (page >= 2) {
            if (data.length < 10)
                kb.push([prevBtn]);
            else if (data.length == 10) {
                kb[3][0] = prevBtn;
                kb[3].push(nextBtn);
            }
        }
        return kb;
    }

}
module.exports = {
    Keyboards
};
