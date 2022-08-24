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

    insertUser(userId, langId, stateId)
    {
        let sql = `INSERT INTO users(id, lang_id, state_id)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            state_id = VALUES(state_id)`;
        let data = [userId, langId, stateId];
        this._con.query(sql, data);
    }

    updateUserState(userId, stateId)
    {
        let sql = `UPDATE users SET state_id = ? WHERE id = ?`;
        let data = [stateId, userId];
        this._con.query(sql, data);
    }

    // Languages
    selectLanguage(language)
    {
        let sql = 'SELECT * FROM languages WHERE lang = ?';
        let data = [language];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0];
        else
            return null;
    }

    insertLanguage(language)
    {
        let sql = `INSERT INTO languages(lang)
        VALUES (?)
        ON DUPLICATE KEY UPDATE
            lang = VALUES(lang)`;
        let data = [language];
        this._con.query(sql, data);
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

    selectState(state)
    {
        let sql = 'SELECT * FROM states WHERE name = ?';
        let data = [state];
        let result = this._con.query(sql, data);
        if (result.length > 0)
            return result[0].id;
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
    WHERE b.lang = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value
    FROM countries as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value
    FROM countries as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'rus'
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

    insertCountry(name, value, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT count(DISTINCT name) as count FROM countries')[0].count + 1;

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
    WHERE b.lang = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value
    FROM cities as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value
    FROM cities as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'rus'
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

    insertCity(name, value, countryId, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT count(DISTINCT name) as count FROM cities')[0].count + 1;

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
    WHERE b.lang = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value
    FROM categories as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value
    FROM categories as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'rus'
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

    insertCategory(name, value, cityId, parentId, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT count(DISTINCT name) as count FROM categories')[0].count + 1;

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
    WHERE b.lang = 'eng'
    GROUP BY a.name
) as a
INNER JOIN (
    SELECT
        a.name as name,
        a.value as ukr_value,
        a.type as type
    FROM text as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'ukr'
    GROUP BY a.name
) as b on a.name = b.name
INNER JOIN (
    SELECT
        a.name as name,
        a.value as rus_value,
        a.type as type
    FROM text as a
    INNER JOIN languages as b on a.lang_id = b.id
    WHERE b.lang = 'rus'
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

    insertText(name, value, type, langId, id = null)
    {
        if (!id)
            id = this._con.query('SELECT count(DISTINCT name) as count FROM text')[0].count + 1;

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

}
module.exports = {
    Database
};
