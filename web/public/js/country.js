import PageFunctions from './template.js';

const pageFunctions = new PageFunctions();

$('.btn.add').click(function() {
    addBlock({
        'name': '',
        'eng_value': '',
        'ukr_value': '',
        'rus_value': ''
    });
});

function selectData(filter = null)
{
    pageFunctions.getData("/selectCountry", filter, function(countries) {
        if (countries)
            for (let i = 0; i < countries.length; i++) {
                addBlock(countries[i]);
            }
    });
}

function addBlock(country)
{
    pageFunctions.addBlock({
        'name': country.name,
        'eng_value': country.eng_value,
        'ukr_value': country.ukr_value,
        'rus_value': country.rus_value
    });
}

$('.container').on('click', '.btn.save', function() {
    let saveBtn = $(this);
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let engValue = $('.row-' + index + ' .eng_value').val();
    let ukrValue = $('.row-' + index + ' .ukr_value').val();
    let rusValue = $('.row-' + index + ' .rus_value').val();
    console.log(name, engValue);
    if (name && engValue) {
        pageFunctions.insertCountry("/insertCountry", name, engValue, ukrValue, rusValue, saveBtn);
    }
});

$('.container').on('click', '.btn.delete', function() {
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let result;
    if (name) {
        result = confirm("Want to delete?");
        if (result) {
            pageFunctions.deleteData("/deleteCountry", name);
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
    selectData();
});
