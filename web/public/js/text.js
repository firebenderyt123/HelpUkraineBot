import PageFunctions from './template.js';

const pageFunctions = new PageFunctions();

var name = '';
var type = '';

$('.container').on('click', '.btn.filter', function() {
    type = $(this).attr('data');
    selectData([name, type]);

    $('.activeFilter').removeClass('btn-dark');
    $('.activeFilter').addClass('btn-light');
    $('.activeFilter').removeClass('activeFilter');

    $(this).removeClass('btn-light');
    $(this).addClass('btn-dark');
    $(this).addClass('activeFilter');
});

$('.btn.add').click(function() {
    addBlock({
        'name': '',
        'eng_value': '',
        'ukr_value': '',
        'rus_value': '',
        'type': ''
    });
});

function selectData(filter = null)
{
    pageFunctions.getData("/selectText", filter, function(texts) {
        if (texts)
            for (let i = 0; i < texts.length; i++) {
                addBlock(texts[i]);
            }
    });
}

function addBlock(text)
{
    pageFunctions.addBlock({
        'name': text.name,
        'eng_value': text.eng_value,
        'ukr_value': text.ukr_value,
        'rus_value': text.rus_value,
        'type': text.type
    });
}

$('.container').on('click', '.btn.save', function() {
    let saveBtn = $(this);
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let engValue = $('.row-' + index + ' .eng_value').val();
    let ukrValue = $('.row-' + index + ' .ukr_value').val();
    let rusValue = $('.row-' + index + ' .rus_value').val();
    let type = $('.row-' + index + ' .type').val();
    console.log(name, engValue);
    if (name && engValue) {
        pageFunctions.insertData("/insertText", name, engValue, ukrValue, rusValue, type, saveBtn);
    }
});

$('.container').on('click', '.btn.delete', function() {
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let result;
    if (name) {
        result = confirm("Want to delete?");
        if (result) {
            pageFunctions.deleteData("/deleteText", name);
        }
    }
    if (!name || result)
        $('.row-' + index).remove();
});

$(".search").on('input', function() {
    name = $(this).val();
    selectData([name, type]);
});

$(document).ready(function() {
    selectData();
});
