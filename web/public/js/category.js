import PageFunctions from './template.js';

const pageFunctions = new PageFunctions();
var allCities;
var allCats;

$('.btn.add').click(function() {
    addBlock({
        'name': '',
        'eng_value': '',
        'ukr_value': '',
        'rus_value': '',
        'city': '',
        'parent': ''
    });
});

function selectData(filter = null)
{
    pageFunctions.getData("/selectCategory", filter, function(categories) {
        if (categories)
            for (let i = 0; i < categories.length; i++) {
                addBlock(categories[i]);
            }
    });
}

function addBlock(category)
{
    let cities = allCities;
    let parents = allCats;
    if (category.city)
        cities = pageFunctions.prepend(category.city, allCities);
    else
        cities = pageFunctions.prepend(cities[0], allCities);
    if (category.parent)
        parents = pageFunctions.prepend(category.parent, parents);
    else parents = pageFunctions.prepend('default', parents);
    if (category.name)
        parents = pageFunctions.remove(category.name, parents);
    // console.log(parents);
    pageFunctions.addBlock({
        'name': category.name,
        'eng_value': category.eng_value,
        'ukr_value': category.ukr_value,
        'rus_value': category.rus_value,
        'city': cities,
        'parent': parents
    }, {
        'name': false,
        'eng_value': false,
        'ukr_value': false,
        'rus_value': false,
        'city': false,
        'parent': false
    });
}

function getAllCities()
{
    pageFunctions.getData("/selectCity", null, function(cities) {
        allCities = [];
        for (let i = 0; i < cities.length; i++) {
            allCities.push(cities[i].name)
        }
    });
}

function getAllCategories()
{
    pageFunctions.getData("/selectCategory", null, function(categories) {
        allCats = ["default"];
        for (let i = 0; i < categories.length; i++) {
            allCats.push(categories[i].name);
        }
    });
}


$('.container').on('click', '.btn.save', function() {
    let saveBtn = $(this);
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let engValue = $('.row-' + index + ' .eng_value').val();
    let ukrValue = $('.row-' + index + ' .ukr_value').val();
    let rusValue = $('.row-' + index + ' .rus_value').val();
    let city = $('.row-' + index + ' .city').val();
    let parent = $('.row-' + index + ' .parent').val();
    console.log(name, engValue, city, parent);
    if (name && engValue && parent) {
        pageFunctions.insertCategory("/insertCategory", name, engValue, ukrValue, rusValue, city, parent, saveBtn);
    }
});

$('.container').on('click', '.btn.delete', function() {
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let result;
    if (name) {
        result = confirm("Want to delete?");
        if (result) {
            pageFunctions.deleteData("/deleteCategory", name);
        }
    }
    if (!name || result)
        $('.row-' + index).remove();
});

$(".search").on('input', function() {
    let value = $(this).val();
    selectData(value);
});

$(document).ready(function() {
    getAllCategories();
    getAllCities();
    selectData();
});
