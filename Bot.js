const { Telegraf } = require('telegraf');

const { Keyboards } = require('./Keyboards');
const { Functions } = require('./Functions');
const { OfferGenerator } = require('./OfferGenerator');

const kb = new Keyboards();
const og = new OfferGenerator();

class Bot
{
    _defaultState = Functions.selectState('start').id;
    _bot = null;

    constructor(token)
    {
        this._bot = new Telegraf(token);
    }

    getBot()
    {
        return this._bot;
    }

    async start(ctx)
    {
        let userId = ctx.message.chat.id;
        let user = Functions.selectUser(userId);
        let langId = user.lang_id;
        let stateId = user.state_id;
        let countryId = user.country_id;
        let cityId = user.city_id;
        // console.log(user);

        if (!stateId)
            stateId = this._defaultState;
        Functions.insertUser(userId, stateId);
        // console.log(userId, langId, stateId, Functions.selectState('main_menu'));
        if (!langId) {
            // select Language
            await this.selectLanguage(ctx, userId);
        } else if (countryId && cityId) {
            // Main Menu
            await this.mainMenu(ctx, userId, langId);
        } else if (!countryId) {
            // select Country
            await this.selectCountry(ctx, userId, langId);
        } else if (!cityId) {
            // select City
            await this.selectCity(ctx, userId, langId, user.country_id);
        }
    }

    async onMessage(ctx)
    {
        let userId = ctx.message.chat.id;
        let text = ctx.message.text;
        let user = Functions.selectUser(userId);
        let langId = user.lang_id;
        let state = Functions.selectStateById(user.state_id);
        // console.log(text);

        // First auth
        if (state.name == 'select_language') {
            // Select Language
            let lang = Functions.selectLanguageByValue(text);
            // console.log(country, text, langId);
            if (lang) {
                Functions.updateUserLang(userId, lang.id);
                await this.selectCountry(ctx, userId, lang.id);
            } else {
                await this.selectLanguage(ctx, userId);
            }
        } else if (state.name == 'select_country') {
            // Select Country
            let country = Functions.selectCountryByValue(text, langId);
            // console.log(country, text, langId);
            if (country) {
                Functions.updateUserCountry(userId, country.id);
                await this.selectCity(ctx, userId, langId, country.id);
            } else {
                let page = await this.getPage(text, langId);
                await this.selectCountry(ctx, userId, langId, page);
            }
        } else if (state.name == 'select_city') {
            // Select City
            let city = Functions.selectCityByValue(text, langId);
            // console.log(country, text, langId);
            if (city) {
                Functions.updateUserCity(userId, city.id);
                await this.mainMenu(ctx, userId, langId);
            } else {
                let page = await this.getPage(text, langId);
                await this.selectCity(ctx, userId, langId, user.country_id, page);
            }
        }

        else if (state.name == 'main_menu') {
            // Main Menu
            let textName = Functions.selectTextByValue(text);
            if (!textName) return;
            if (textName == 'profile_btn') {
                // Profile
                await this.profile(ctx, user, userId, langId);
            } else if (textName == 'categories_btn') {
                // Information (Category)
                await this.info(ctx, userId, user.city_id, langId);
            } else if (textName == 'chat_btn') {
                // Chat
                await this.chat(ctx, userId, langId);
            }

            else if (textName == 'create_offer_btn') {
                // Create Offer
                await this.createOffer(ctx, userId, langId);
            }

            else if (textName == 'change_language_btn') {
                // Change Language
                await this.changeLanguage(ctx, userId);
            } else if (textName == 'change_country_btn') {
                // Change Country
                await this.changeCountry(ctx, userId, langId);
            } else if (textName == 'change_city_btn') {
                // Change City
                await this.changeCity(ctx, userId, langId, user.country_id);
            }
        }

        // Create Offer
        else if (state.name == 'offer_description') {
            // Offer Description
        }

        else if (state.name == 'change_language') {
            // Change Language
            let lang = Functions.selectLanguageByValue(text);
            if (lang) {
                Functions.updateUserLang(userId, lang.id);
                await this.mainMenu(ctx, userId, lang.id);
            } else {
                await this.changeLanguage(ctx, userId);
            }
        } else if (state.name == 'change_country') {
            // Change Country
            let country = Functions.selectCountryByValue(text, langId);
            if (country) {
                Functions.updateUserCity(userId, null);
                Functions.updateUserCountry(userId, country.id);
                await this.changeCity(ctx, userId, langId, country.id);
            } else {
                let page = await this.getPage(text, langId);
                await this.changeCountry(ctx, userId, langId, page);
            }
        } else if (state.name == 'change_city') {
            // Change City
            let city = Functions.selectCityByValue(text, langId);
            if (city) {
                Functions.updateUserCity(userId, city.id);
                await this.mainMenu(ctx, userId, langId);
            } else {
                let page = await this.getPage(text, langId);
                await this.changeCity(ctx, userId, langId, user.country_id, page);
            }
        } else if (state.name.includes('choose_category')) {
            // Information (Category)
            let parent = Functions.selectCategoryByValue(text, user.city_id, langId);
            if (!parent)
                parent = Functions.selectCategoryByValue(text, Functions.selectCity('default', langId).id, langId);
            let page = await this.getPage(text, langId);
            if (parent) {
                await this.info(ctx, userId, user.city_id, langId, parent.name, page);
            } else {
                let stateName = Functions.selectStateById(stateId).name;
                parent = 'default';
                if (stateName != 'choose_category')
                    parent = stateName.replace('choose_category_', '');
                await this.info(ctx, userId, user.city_id, langId, parent, page);
            }
        }
    }

    async selectLanguage(ctx, userId)
    {
        let langId = Functions.selectLanguage('eng').id;
        await ctx.telegram.sendMessage(userId, Functions.selectText('select_language', langId), {
            "reply_markup": kb.getLanguageMenu(),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'select_language');
    }

    async selectCountry(ctx, userId, langId, page = 1)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('select_country', langId), {
            "reply_markup": kb.getCountriesMenu(langId, page),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'select_country');
    }

    async selectCity(ctx, userId, langId, countryId, page = 1)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('select_city', langId), {
            "reply_markup": kb.getCitiesMenu(langId, countryId, page),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'select_city');
    }

    async mainMenu(ctx, userId, langId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('welcome_text', langId), {
            "reply_markup": kb.getMainMenu(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'main_menu');
    }

    async profile(ctx, user, userId, langId)
    {
        let json = JSON.parse(Functions.selectText('profile_info', langId));
        let text = '<b>' + json[0] + '</b>' + Functions.selectCountryById(user.country_id, langId).value + '\n';
        text += '<b>' + json[1] + '</b>' + Functions.selectCityById(user.city_id, langId).value + '\n';
        text += '<b>' + json[2] + '</b>' + Functions.selectLanguageById(langId).value;
        await ctx.telegram.sendMessage(userId, text, {
            "reply_markup": kb.getMainMenu(langId),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'main_menu');
    }

    async info(ctx, userId, cityId, langId, parent = 'default', page = 1)
    {
        let categories = Functions.selectCategories(parent, cityId, langId);
        if (!categories)
            categories = Functions.selectCategories(parent, Functions.selectCity('default', langId).id, langId);

        if (!categories && parent == 'default') {
            cityId = Functions.selectCity('default', langId).id;
            categories = Functions.selectCategories(parent, cityId, langId);
        }

        if (!categories) {
            let catId = Functions.selectCategory(parent, langId).id;
            let post = Functions.selectPost(catId, langId);
            if (post)
                await ctx.telegram.sendMessage(userId, post.text, {
                    "reply_markup": kb.getMainMenu(langId),
                    "parse_mode": "HTML"
                });
            else {
                await ctx.telegram.sendMessage(userId, Functions.selectText('nothing_found', langId), {
                    "reply_markup": kb.getMainMenu(langId),
                    "parse_mode": "HTML"
                });
            }
            Functions.setUserState(userId, 'main_menu');
        } else {
            let text = '';
            for (let i = 0; i < categories.length; i++)
                text += (i + 1) + '. ' + categories[i].value + '\n';
            text += '\n' + Functions.selectText('select_category', langId);
            await ctx.telegram.sendMessage(userId, text, {
                "reply_markup": kb.getCategoriesMenu(categories, langId, page),
                "parse_mode": "HTML"
            });

            let cat = 'choose_category';
            if (parent != 'default')
                Functions.setUserState(userId, cat + '_' + parent);
            else
                Functions.setUserState(userId, cat);
        }
    }

    async chat(ctx, userId, langId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('coming_soon', langId), {
            "reply_markup": kb.getMainMenu(langId),
            "parse_mode": "HTML"
        });
    }

    async createOffer(ctx, userId, langId)
    {
        await og.inputDescription(ctx, userId, langId);
    }

    async changeLanguage(ctx, userId)
    {
        await ctx.telegram.sendMessage(userId, Functions.selectText('select_language', langId), {
            "reply_markup": kb.getLanguageMenu(),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'change_language');
    }

    async changeCountry(ctx, userId, langId, page = 1)
    {
        // let countries = Functions.selectCountries(langId);
        // let text = '';
        // for (let i = 0; i < countries.length; i++) {
        //     text += '<code>' + countries[i].value + '</code>' + '\n';
        // }
        // text += '\n' + Functions.selectText('select_country', langId);
        await ctx.telegram.sendMessage(userId, Functions.selectText('select_country', langId), {
            "reply_markup": kb.getCountriesMenu(langId, page),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'change_country');
    }

    async changeCity(ctx, userId, langId, countryId, page = 1)
    {
        // let cities = Functions.selectCities(langId, countryId);
        // let text = '';
        // for (let i = 0; i < cities.length; i++) {
        //     text += '<code>' + cities[i].value + '</code>' + '\n';
        // }
        // text += '\n' + Functions.selectText('select_city', langId);

        await ctx.telegram.sendMessage(userId, Functions.selectText('select_city', langId), {
            "reply_markup": kb.getCitiesMenu(langId, countryId, page),
            "parse_mode": "HTML"
        });
        Functions.setUserState(userId, 'change_city');
    }

    async getPage(text, langId)
    {
        let page = 1;
        let pageName = Functions.selectText('page_btn', langId);
        if (text.includes(pageName)) {
            let re = new RegExp('(?<=' + pageName + '\\s).*?(?=\\s|$)', 'gisu');
            page = text.match(re);
        }
        return page;
    }
}
module.exports = {
    Bot
};
