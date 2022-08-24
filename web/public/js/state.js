import PageFunctions from './template.js';

const pageFunctions = new PageFunctions();

$('.btn.add').click(function() {
    addBlock({
        'name': ''
    });
});

function selectData(filter = null)
{
    pageFunctions.getData("/selectState", filter, function(states) {
        if (states)
            for (let i = 0; i < states.length; i++) {
                addBlock(states[i]);
            }
    });
}

function addBlock(state)
{
    pageFunctions.addBlock({
        'name': state.name
    });
}

$('.container').on('click', '.btn.save', function() {
    let saveBtn = $(this);
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    if (name) {
        pageFunctions.insertState("/insertState", name, saveBtn);
    }
});

$('.container').on('click', '.btn.delete', function() {
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let result;
    if (name) {
        result = confirm("Want to delete?");
        if (result) {
            pageFunctions.deleteData("/deleteState", name);
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
