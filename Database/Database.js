const MySql = require('sync-mysql');

require('dotenv').config({ path: __dirname + '/../.env' });

class Database
{
    _con = null;

    constructor()
    {
        this._con = new MySql({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            charset: 'utf8mb4'
        });
    }

    // User
    selectUser(userId)
    {
        let sql = 'SELECT * FROM users WHERE id = ?';
        let data = [userId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    insertUser(userId, stateId)
    {
        let sql = `INSERT INTO users(id, state_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            state_id = VALUES(state_id)`;
        let data = [userId, stateId];
        this._con.query(sql, data);
    }

    updateUserLang(userId, langId)
    {
        let sql = `UPDATE users SET lang_id = ? WHERE id = ?`;
        let data = [langId, userId];
        this._con.query(sql, data);
    }

    updateUserState(userId, stateId)
    {
        let sql = `UPDATE users SET state_id = ? WHERE id = ?`;
        let data = [stateId, userId];
        this._con.query(sql, data);
    }

    updateUserCountry(userId, countryId)
    {
        let sql = `UPDATE users SET country_id = ? WHERE id = ?`;
        let data = [countryId, userId];
        this._con.query(sql, data);
    }

    updateUserCity(userId, cityId)
    {
        let sql = `UPDATE users SET city_id = ? WHERE id = ?`;
        let data = [cityId, userId];
        this._con.query(sql, data);
    }

    // Languages
    selectLanguages()
    {
        let sql = 'SELECT * FROM languages';
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectLanguage(language)
    {
        let sql = 'SELECT * FROM languages WHERE name = ?';
        let data = [language];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectLanguageById(langId)
    {
        let sql = 'SELECT * FROM languages WHERE id = ?';
        let data = [langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectLanguageByValue(value)
    {
        let sql = 'SELECT * FROM languages WHERE value = ?';
        let data = [value];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    // States
    selectAllStates(filter = null)
    {
        let sql = `SELECT name FROM states`;
        if (filter)
            sql += ` WHERE name LIKE '%` + filter + `%'`;
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectStateById(stateId)
    {
        let sql = 'SELECT * FROM states WHERE id = ?';
        let data = [stateId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectState(state)
    {
        let sql = 'SELECT * FROM states WHERE name = ?';
        let data = [state];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    insertState(state)
    {
        let sql = `INSERT INTO states(name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name)`;
        let data = [state];
        this._con.query(sql, data);
    }

    deleteState(state)
    {
        let sql = `DELETE FROM states WHERE name = ?`;
        let data = [
            state
        ];
        this._con.query(sql, data);
    }

    // Countries
    selectAllCountries(filter = null)
    {
        let sql = `
SELECT
    a.name as name,
    eng_value,
    ukr_value,
    rus_value
FROM (
    SELECT
        a.name as name,
        a.value as eng_value
    FROM countries as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value
    FROM countries as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value
    FROM countries as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'rus'
    GROUP BY a.name
) as c on a.name = c.name
WHERE a.name NOT LIKE 'default'`;
        if (filter)
            sql += ` AND a.name LIKE '%` + filter + `%'`;
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectCountry(country, langId)
    {
        let sql = 'SELECT * FROM countries WHERE name = ? AND lang_id = ?';
        let data = [country, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCountryById(countryId, langId)
    {
        let sql = 'SELECT * FROM countries WHERE id = ? AND lang_id = ?';
        let data = [countryId, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCountryByValue(value, langId)
    {
        let sql = 'SELECT * FROM countries WHERE value = ? AND lang_id = ?';
        let data = [value, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCountries(langId, from = 0, to = 9)
    {
        let sql = `SELECT * FROM countries WHERE lang_id = ? AND name NOT LIKE 'default' LIMIT ?, ?`;
        let data = [langId, from, to];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    insertCountry(name, value, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT MAX(id) as max FROM countries')[0].max + 1;

        let sql = `INSERT INTO countries(id, name, value, lang_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            value = VALUES(value)`;
        let data = [id, name, value, langId];
        this._con.query(sql, data);
    }

    deleteCountry(country)
    {
        let sql = `DELETE FROM countries WHERE name = ?`;
        let data = [country];
        this._con.query(sql, data);
    }

    // Cities
    selectAllCities(filter = null)
    {
        let sql = `
SELECT
    a.name as name,
    eng_value,
    ukr_value,
    rus_value,
    d.name as country
FROM (
    SELECT
        a.name as name,
        a.value as eng_value,
        a.country_id,
        a.lang_id
    FROM cities as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value
    FROM cities as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value
    FROM cities as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'rus'
    GROUP BY a.name
) as c on a.name = c.name
INNER JOIN countries as d on a.country_id = d.id
AND a.lang_id = d.lang_id
WHERE a.name NOT LIKE 'default'`;
        if (filter)
            sql += ` AND a.name LIKE '%` + filter + `%'`;
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectCity(city, langId)
    {
        let sql = 'SELECT * FROM cities WHERE name = ? AND lang_id = ?';
        let data = [city, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCityById(cityId, langId)
    {
        let sql = 'SELECT * FROM cities WHERE id = ? AND lang_id = ?';
        let data = [cityId, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCityByValue(value, langId)
    {
        let sql = 'SELECT * FROM cities WHERE value = ? AND lang_id = ?';
        let data = [value, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCities(langId, countryId, from, to)
    {
        let sql = `SELECT * FROM cities WHERE lang_id = ? AND country_id = ? LIMIT ?, ?`;
        let data = [langId, countryId, from, to];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    insertCity(name, value, countryId, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT MAX(id) as max FROM cities')[0].max + 1;

        let sql = `INSERT INTO cities(id, name, value, country_id, lang_id)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            value = VALUES(value),
            country_id = VALUES(country_id)`;
        let data = [id, name, value, countryId, langId];
        this._con.query(sql, data);
    }

    deleteCity(city)
    {
        let sql = `DELETE FROM cities WHERE name = ?`;
        let data = [city];
        this._con.query(sql, data);
    }

    // Categories
    selectAllCategories(filter = null)
    {
        let sql = `
SELECT
    a.name as name,
    eng_value,
    ukr_value,
    rus_value,
    d.name as city,
    parent
FROM (
    SELECT
        a.name as name,
        a.value as eng_value,
        a.city_id,
        a.lang_id,
    	c.name as parent
    FROM categories as a
    INNER JOIN languages as b on a.lang_id = b.id
    INNER JOIN categories as c on a.parent_id = c.id
    WHERE b.name = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value
    FROM categories as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value
    FROM categories as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'rus'
    GROUP BY a.name
) as c on a.name = c.name
INNER JOIN cities as d on a.city_id = d.id
AND a.lang_id = d.lang_id`;
        if (filter)
            sql += ` WHERE a.name LIKE '%` + filter + `%'`;
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectCategoriesForPosts()
    {
        let sql = 'SELECT DISTINCT name FROM categories WHERE id NOT IN (SELECT DISTINCT parent_id FROM categories WHERE parent_id IS NOT NULL)';
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectCategories(parent = 'default', cityId, langId)
    {
        let sql = `
SELECT DISTINCT a.* FROM categories as a
INNER JOIN categories as b on a.parent_id = b.id
WHERE b.name = ? AND a.city_id = ? AND a.lang_id = ?`;
        let data = [parent, cityId, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectCategory(category, langId)
    {
        let sql = 'SELECT * FROM categories WHERE name = ? AND lang_id = ?';
        let data = [category, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectCategoryByValue(value, cityId, langId)
    {
        let sql = 'SELECT * FROM categories WHERE value = ? AND city_id = ? AND lang_id = ?';
        let data = [value, cityId, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    insertCategory(name, value, cityId, parentId, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT MAX(id) as max FROM categories')[0].max + 1;

        let sql = `INSERT INTO categories(id, name, value, city_id, parent_id, lang_id)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            value = VALUES(value),
            city_id = VALUES(city_id),
            parent_id = VALUES(parent_id)`;
        let data = [id, name, value, cityId, parentId, langId];
        this._con.query(sql, data);
    }

    deleteCategory(category)
    {
        let sql = `DELETE FROM categories WHERE name = ?`;
        let data = [category];
        this._con.query(sql, data);
    }

    // Posts
    selectAllPosts(filter = null)
    {
        let sql = `
SELECT
    DISTINCT category,
    eng_value,
    ukr_value,
    rus_value
FROM (
    SELECT
        category_id,
        a.text as eng_value,
        c.name as category,
        a.lang_id
    FROM posts as a
    INNER JOIN languages as b on a.lang_id = b.id
    INNER JOIN categories as c on a.category_id = c.id
    WHERE b.name = 'eng'
) as a
INNER JOIN (
    SELECT
    	category_id,
        a.text as ukr_value
    FROM posts as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'ukr'
) as b on a.category_id = b.category_id
INNER JOIN (
    SELECT
    	category_id,
        a.text as rus_value
    FROM posts as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'rus'
) as c on a.category_id = c.category_id`;
        if (filter)
            sql += ` WHERE a.name LIKE '%` + filter + `%'`;
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectPost(catId, langId)
    {
        let sql = 'SELECT * FROM posts WHERE category_id = ? AND lang_id = ?';
        let data = [catId, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    insertPost(text, catId, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT MAX(id) as max FROM posts')[0].max + 1;

        let sql = `INSERT INTO posts(id, text, category_id, lang_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            text = VALUES(text),
            category_id = VALUES(category_id)`;
        let data = [id, text, catId, langId];
        this._con.query(sql, data);
    }

    deletePost(catId)
    {
        let sql = `DELETE FROM posts WHERE catId = ?`;
        let data = [catId];
        this._con.query(sql, data);
    }

    // Text
    selectAllText(filters = null)
    {
        let sql = `
SELECT
    a.name as name,
    eng_value,
    ukr_value,
    rus_value,
    a.type as type
FROM (
    SELECT
        a.name as name,
        a.value as eng_value,
        a.type as type
    FROM text as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value,
        a.type as type
    FROM text as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value,
        a.type as type
    FROM text as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.name = 'rus'
    GROUP BY a.name
) as c on a.name = c.name`;
        if (filters) {
            if (filters[0] != '' && filters[1] != '') {
                sql += ` WHERE a.name LIKE '%` + filters[0] + `%'`;
                sql += ` AND a.type = '` + filters[1] + `'`;
            } else if (filters[0] != '') {
                sql += ` WHERE a.name LIKE '%` + filters[0] + `%'`;
            } else if (filters[1] != '') {
                sql += ` WHERE a.type = '` + filters[1] + `'`;
            }
        }
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectTextTypes()
    {
        let sql = 'SELECT DISTINCT type FROM text';
        let result = this._con.query(sql);
        if (result.length > 0)
            return result;
        else
            return null;
    }

    selectText(name, langId)
    {
        let sql = 'SELECT * FROM text WHERE name = ? AND lang_id = ?';
        let data = [name, langId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    selectTextByValue(value)
    {
        let sql = 'SELECT * FROM text WHERE value = ?';
        let data = [value];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0].name;
        else
            return null;
    }

    insertText(name, value, type, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT MAX(id) as max FROM text')[0].max + 1;

        let sql = `INSERT INTO text(id, name, value, type, lang_id)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            value = VALUES(value),
            type = VALUES(type)`;
        let data = [id, name, value, type, langId];
        this._con.query(sql, data);
    }

    deleteText(name)
    {
        let sql = `DELETE FROM text WHERE name = ?`;
        let data = [name];
        this._con.query(sql, data);
    }

    // Ads (Offers)
    selectOfferById(offerId)
    {
        let sql = `SELECT * FROM ads WHERE id = ?`;
        let data = [offerId];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    insertOffer(description, price, photo_id, address, userId, date, id = null)
    {
        if (!id)
            id = this._con.query('SELECT MAX(id) as max FROM ads')[0].max + 1;

        let sql = `INSERT INTO ads(id, description, price, photo_id, address, user_id, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        let data = [id, description, price, photo_id, address, userId, date];
        this._con.query(sql, data);
    }

    deleteOffer(offerId)
    {
        let sql = `DELETE FROM ads WHERE id = ?`;
        let data = [offerId];
        this._con.query(sql, data);
    }

}
module.exports = {
    Database
};
