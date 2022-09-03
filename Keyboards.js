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

    getFromTo(page)
    {
        let from;
        let to;
        if (page == 1) {
            from = 0;
            to = 10;
        } else if (page >= 2) {
            from = (page - 1) * 8 - (page - 2);
            to = from + 9;
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
                kb[2][2] = nextBtn;
        }
        else if (page >= 2) {
            if (data.length < 7)
                kb.push([prevBtn]);
            else if (data.length == 7) {
                kb[2].push(kb[2][0]);
                kb[2][0] = prevBtn;
            }
            else if (data.length == 8) {
                kb[2][2] = kb[2][1];
                kb[2][1] = kb[2][0];
                kb[2][0] = prevBtn;
            }
            else if (data.length == 9) {
                let tmp = kb[2][0];
                kb[2][0] = prevBtn;
                kb[2][1] = tmp;
                kb[2][2] = nextBtn;
            }
        }
        return kb;
    }

}
module.exports = {
    Keyboards
};
