const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const { db } = require('../configure');

const app = express();
// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = process.env.PORT || 8080;

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser(process.env.COOKIE_KEY))

app.get('/', function(req, res) {
	res.redirect('/login');
    res.end();
});

app.get('/login', function(req, res) {
    res.cookie('loggedIn', false);
    res.cookie('username', '');
	res.render('./login.html');
});

app.get('/countries', function(req, res) {
    if (req.cookies.loggedIn == 'true') {
        res.render("./template.html", {
            title: 'Country',
            src: '/js/country.js',
            filters: false,
            username: req.cookies.username,
            cols: [
                'Name',
                'Eng Lang',
                'Ukr Lang',
                'Rus Lang'
            ]
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/cities', function(req, res) {
    if (req.cookies.loggedIn == 'true') {
        res.render("./template.html", {
            title: 'City',
            src: '/js/city.js',
            filters: false,
            username: req.cookies.username,
            cols: [
                'Name',
                'Eng Lang',
                'Ukr Lang',
                'Rus Lang',
                'Country'
            ]
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/categories', function(req, res) {
    if (req.cookies.loggedIn == 'true') {
        res.render("./template.html", {
            title: 'Category',
            src: '/js/category.js',
            filters: false,
            username: req.cookies.username,
            cols: [
                'Name',
                'Eng Lang',
                'Ukr Lang',
                'Rus Lang',
                'City',
                'Parent'
            ]
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/posts', function(req, res) {
    if (req.cookies.loggedIn == 'true') {
        res.render("./template.html", {
            title: 'Posts',
            src: '/js/post.js',
            filters: false,
            username: req.cookies.username,
            cols: [
                'Category',
                'Eng Lang',
                'Ukr Lang',
                'Rus Lang'
            ]
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/text', function(req, res) {
    if (req.cookies.loggedIn == 'true' && req.cookies.username == 'admin') {
        res.render("./template.html", {
            title: 'Text',
            src: '/js/text.js',
            filters: db.selectTextTypes(),
            username: req.cookies.username,
            cols: [
                'Name',
                'Eng Lang',
                'Ukr Lang',
                'Rus Lang',
                'Type'
            ]
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/state', function(req, res) {
    if (req.cookies.loggedIn == 'true' && req.cookies.username == 'admin') {
        res.render("./template.html", {
            title: 'States',
            src: '/js/state.js',
            filters: false,
            username: req.cookies.username,
            cols: [
                'Name'
            ]
        });
    } else {
        res.redirect('/login');
    }
});


// Countries
app.post("/selectCountry", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let filter = req.body.filter;
    let result = db.selectAllCountries(filter);
    return res.status(200).send({result: result});
});

app.post("/insertCountry", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    let engValue = req.body.engValue;
    let ukrValue = req.body.ukrValue;
    let rusValue = req.body.rusValue;

    let countryId = null;
    let langId;
    langId = db.selectLanguage('eng').id;
    let country = db.selectCountry(name, langId);
    if (country)
        countryId = country.id;
    db.insertCountry(name, engValue, langId, countryId);
    country = db.selectCountry(name, langId);
    if (country)
        countryId = country.id;
    langId = db.selectLanguage('ukr').id;
    db.insertCountry(name, ukrValue, langId, countryId);
    langId = db.selectLanguage('rus').id;
    db.insertCountry(name, rusValue, langId, countryId);
    return res.sendStatus(200);
});

app.post("/deleteCountry", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    db.deleteCountry(name);
    return res.sendStatus(200);
});


// Cities
app.post("/selectCity", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let filter = req.body.filter;
    let result = db.selectAllCities(filter);
    return res.status(200).send({result: result});
});

app.post("/insertCity", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    let engValue = req.body.engValue;
    let ukrValue = req.body.ukrValue;
    let rusValue = req.body.rusValue;

    let cityId = null;
    let langId;
    langId = db.selectLanguage('eng').id;
    let countryId = db.selectCountry(req.body.country, langId).id;
    let city = db.selectCity(name, langId);
    if (city)
        cityId = city.id;
    db.insertCity(name, engValue, countryId, langId, cityId);
    city = db.selectCity(name, langId);
    if (city)
        cityId = city.id;
    langId = db.selectLanguage('ukr').id;
    db.insertCity(name, ukrValue, countryId, langId, cityId);
    langId = db.selectLanguage('rus').id;
    db.insertCity(name, rusValue, countryId, langId, cityId);
    return res.sendStatus(200);
});

app.post("/deleteCity", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    db.deleteCity(name);
    return res.sendStatus(200);
});


// Categories
app.post("/selectCategory", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let filter = req.body.filter;
    let result = db.selectAllCategories(filter);
    return res.status(200).send({result: result});
});

app.post("/insertCategory", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    let engValue = req.body.engValue;
    let ukrValue = req.body.ukrValue;
    let rusValue = req.body.rusValue;
    let categoryId = null;
    let langId;
    langId = db.selectLanguage('eng').id;
    let cityId = db.selectCity(req.body.city, langId).id;
    let parentId = db.selectCategory(req.body.parent, langId).id;
    let category = db.selectCategory(name, langId);
    if (category)
        categoryId = category.id;
    db.insertCategory(name, engValue, cityId, parentId, langId, categoryId);
    category = db.selectCategory(name, langId);
    if (category)
        categoryId = category.id;
    langId = db.selectLanguage('ukr').id;
    db.insertCategory(name, ukrValue, cityId, parentId, langId, categoryId);
    langId = db.selectLanguage('rus').id;
    db.insertCategory(name, rusValue, cityId, parentId, langId, categoryId);

	db.insertState('choose_category_' + name);
    return res.sendStatus(200);
});

app.post("/deleteCategory", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    db.deleteCategory(name);
	db.deleteState('choose_category_' + name);
    return res.sendStatus(200);
});

// Posts
app.post("/selectCategoryForPost", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let result = db.selectCategoriesForPosts();
    return res.status(200).send({result: result});
});

app.post("/selectPost", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let filter = req.body.filter;
    let result = db.selectAllPosts(filter);
    return res.status(200).send({result: result});
});

app.post("/insertPost", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let engValue = req.body.engValue;
    let ukrValue = req.body.ukrValue;
    let rusValue = req.body.rusValue;

    let langId = db.selectLanguage('eng').id;
    let catId = db.selectCategory(req.body.category, langId).id;
    db.insertPost(engValue, catId, langId);
    langId = db.selectLanguage('ukr').id;
    db.insertPost(ukrValue, catId, langId);
    langId = db.selectLanguage('rus').id;
    db.insertPost(rusValue, catId, langId);
    return res.sendStatus(200);
});

app.post("/deletePost", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let catId = req.body.category_id;
    db.deletePost(catId);
    return res.sendStatus(200);
});

// Text
app.post("/selectText", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let filter = req.body['filter[]'];
    let result = db.selectAllText(filter);
    return res.status(200).send({result: result});
});

app.post("/insertText", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    let engValue = req.body.engValue;
    let ukrValue = req.body.ukrValue;
    let rusValue = req.body.rusValue;
    let type = req.body.type;

    let textId = null;
    let langId;
    langId = db.selectLanguage('eng').id;
    let text = db.selectText(name, langId);
    if (text)
        textId = text.id;
    db.insertText(name, engValue, type, langId, textId);
    text = db.selectText(name, langId);
    if (text)
        textId = text.id;
    langId = db.selectLanguage('ukr').id;
    db.insertText(name, ukrValue, type, langId, textId);
    langId = db.selectLanguage('rus').id;
    db.insertText(name, rusValue, type, langId, textId);
    return res.sendStatus(200);
});

app.post("/deleteText", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    db.deleteText(name);
    return res.sendStatus(200);
});

// State
app.post("/selectState", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let filter = req.body.filter;
    let result = db.selectAllStates(filter);
    return res.status(200).send({result: result});
});

app.post("/insertState", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    db.insertState(name);
    return res.sendStatus(200);
});

app.post("/deleteState", urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let name = req.body.name;
    db.deleteState(name);
    return res.sendStatus(200);
});

// Login
app.post('/auth', urlencodedParser, (req, res) => {
    if(!req.body)
        return res.sendStatus(400);
	const users = JSON.parse(process.env.USERS);
	const passes = JSON.parse(process.env.PASSES);
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
        let index = users.indexOf(username);
        let hash = crypto.createHash('md5').update(password).digest('hex');
		if (index != -1 && passes[index] == hash) {
            let expires = new Date();
            expires.setHours(expires.getHours() + 1);

            res.cookie('loggedIn', true, {
                expires: expires
            });
            res.cookie('username', username, {
                expires: expires
            });
			res.redirect('/countries');
		} else {
            res.redirect('/login');
			// res.send('Incorrect Username and/or Password!');
		}
		res.end();
	} else {
        res.redirect('/login');
		// res.send('Please enter Username and Password!');
		res.end();
	}
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
