const { db } = require('./configure');

class Functions
{
    static selectUser(userId)
    {
        return db.selectUser(userId);
    }

    static insertUser(userId, langId, stateId)
    {
        db.insertUser(userId, langId, stateId);
    }

    static setUserState(userId, state)
    {
        let stateId = db.selectState(state);
        db.updateUserState(userId, stateId);
    }

    static selectLanguage(lang)
    {
        return db.selectLanguage(lang);
    }

    static selectState(state)
    {
        return db.selectState(state);
    }

    static selectText(name, langId)
    {
        return db.selectText(name, langId);
    }
}
module.exports = {
    Functions
};
