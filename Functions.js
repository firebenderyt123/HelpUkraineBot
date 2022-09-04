const { db, kb } = require('./configure');

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

    static selectLanguageById(langId)
    {
        return db.selectLanguageById(langId);
    }

    static selectLanguageByValue(value)
    {
        return db.selectLanguageByValue(value);
    }

    static selectCountries(langId, from = 0, to = 9)
    {
        return db.selectCountries(langId, from, to);
    }

    static selectCountryById(countryId, langId)
    {
        return db.selectCountryById(countryId, langId);
    }

    static selectCountryByValue(value, langId)
    {
        return db.selectCountryByValue(value, langId);
    }

    static selectCities(langId, countryId, from = 0, to = 9)
    {
        return db.selectCities(langId, countryId, from, to);
    }

    static selectCity(name, langId)
    {
        return db.selectCity(name, langId);
    }

    static selectCityById(cityId, langId)
    {
        return db.selectCityById(cityId, langId);
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

    // Ads
    selectOfferById(offerId)
    {
        return db.selectOfferById(offerId);
    }

    insertOffer(description, price, photo_id, address, userId, date, id = null)
    {
        return db.insertOffer(description, price, photo_id, address, userId, date, id);
    }
}
module.exports = {
    Functions, kb
};
