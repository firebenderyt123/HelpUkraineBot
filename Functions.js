const { db } = require('./configure');

class Functions
{
    static selectUser(userId)
    {
        let user = db.selectUser(userId);
        if (!user)
            return {
                id: null,
                state_id: null,
                lang_id: null,
                country_id: null,
                city_id: null
            };
        return user;
    }

    static insertUser(userId, stateId)
    {
        db.insertUser(userId, stateId);
    }

    static updateUserLang(userId, langId)
    {
        db.updateUserLang(userId, langId);
    }

    static updateUserState(userId, stateId)
    {
        db.updateUserState(userId, stateId);
    }

    static updateUserCountry(userId, countryId)
    {
        db.updateUserCountry(userId, countryId);
    }

    static updateUserCity(userId, cityId)
    {
        db.updateUserCity(userId, cityId);
    }

    static setUserState(userId, state)
    {
        let stateId = db.selectState(state).id;
        db.updateUserState(userId, stateId);
    }

    static selectPost(catId, langId)
    {
        return db.selectPost(catId, langId);
    }

    static selectState(state)
    {
        return db.selectState(state);
    }

    static selectStateById(stateId)
    {
        return db.selectStateById(stateId);
    }

    static selectText(name, langId)
    {
        return db.selectText(name, langId).value;
    }

    static selectTextByValue(value)
    {
        return db.selectTextByValue(value);
    }

    static selectLanguages()
    {
        return db.selectLanguages();
    }

    static selectLanguage(lang)
    {
        return db.selectLanguage(lang);
    }

    static selectLanguageByValue(value)
    {
        return db.selectLanguageByValue(value);
    }

    static selectCountries(langId)
    {
        return db.selectCountries(langId);
    }

    static selectCountryByValue(value, langId)
    {
        return db.selectCountryByValue(value, langId);
    }

    static selectCities(langId, countryId)
    {
        return db.selectCities(langId, countryId);
    }

    static selectCityByValue(value, langId)
    {
        return db.selectCityByValue(value, langId);
    }

    static selectCategories(parent = 'default', cityId, langId)
    {
        return db.selectCategories(parent, cityId, langId);
    }

    static selectCategory(name, langId)
    {
        return db.selectCategory(name, langId);
    }

    static selectCategoryByValue(value, cityId, langId)
    {
        return db.selectCategoryByValue(value, cityId, langId);
    }
}
module.exports = {
    Functions
};
