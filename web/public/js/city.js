import PageFunctions from './template.js';

const pageFunctions = new PageFunctions();
var allCountries;

$('.btn.add').click(function() {
    addBlock({
        'name': '',
        'eng_value': '',
        'ukr_value': '',
        'rus_value': '',
        'country': ''
    });
});

function selectData(filter = null)
{
    pageFunctions.getData("/selectCity", filter, function(cities) {
        if (cities)
            for (let i = 0; i < cities.length; i++) {
                addBlock(cities[i]);
            }
    });
}

function addBlock(city)
{
    let countries = allCountries;
    if (city.country)
        countries = pageFunctions.prepend(city.country, allCountries);
    else
        countries = pageFunctions.prepend(countries[0], allCountries);
    // console.log(countries, city.country);
    pageFunctions.addBlock({
        'name': city.name,
        'eng_value': city.eng_value,
        'ukr_value': city.ukr_value,
        'rus_value': city.rus_value,
        'country': countries
    });
}

function getAllCountries()
{
    pageFunctions.getData("/selectCountry", null, function(countries) {
        allCountries = [];
        for (let i = 0; i < countries.length; i++) {
            allCountries.push(countries[i].name)
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
    let country = $('.row-' + index + ' .country').val();
    console.log(name, engValue);
    if (name && engValue) {
        pageFunctions.insertCity("/insertCity", name, engValue, ukrValue, rusValue, country, saveBtn);
    }
});

$('.container').on('click', '.btn.delete', function() {
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let result;
    if (name) {
        result = confirm("Want to delete?");
        if (result) {
            pageFunctions.deleteData("/deleteCity", name);
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
    getAllCountries();
    selectData();
});
