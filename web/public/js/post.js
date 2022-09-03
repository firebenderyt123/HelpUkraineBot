import PageFunctions from './template.js';

const pageFunctions = new PageFunctions();
var allCategories;

$('.btn.add').click(function() {
    addBlock({
        'category': '',
        'eng_value': '',
        'ukr_value': '',
        'rus_value': ''
    });
});

function selectData(filter = null)
{
    pageFunctions.getData("/selectPost", filter, function(posts) {
        if (posts)
            for (let i = 0; i < posts.length; i++) {
                addBlock(posts[i]);
            }
    });
}

function addBlock(post)
{
    let categories = allCategories;
    if (post.category)
        categories = pageFunctions.prepend(post.category, allCategories);
    else
        categories = pageFunctions.prepend(categories[0], allCategories);
    // console.log(countries, city.country);
    pageFunctions.addBlock({
        'category': categories,
        'eng_value': post.eng_value,
        'ukr_value': post.ukr_value,
        'rus_value': post.rus_value
    }, {
        'category': false,
        'eng_value': true,
        'ukr_value': true,
        'rus_value': true
    });
}

function getAllCategories()
{
    pageFunctions.getData("/selectCategoryForPost", null, function(categories) {
        allCategories = [];
        console.log(categories);
        for (let i = 0; i < categories.length; i++) {
            allCategories.push(categories[i].name)
        }
    });
}

$('.container').on('click', '.btn.save', function() {
    let saveBtn = $(this);
    let index = $(this).attr('data');
    let category = $('.row-' + index + ' .category').val();
    let engValue = $('.row-' + index + ' .eng_value').val();
    let ukrValue = $('.row-' + index + ' .ukr_value').val();
    let rusValue = $('.row-' + index + ' .rus_value').val();
    console.log(category, engValue);
    if (category && engValue) {
        pageFunctions.insertPost("/insertPost", category, engValue, ukrValue, rusValue, saveBtn);
    }
});

$('.container').on('click', '.btn.delete', function() {
    let index = $(this).attr('data');
    let name = $('.row-' + index + ' .name').val();
    let result;
    if (name) {
        result = confirm("Want to delete?");
        if (result) {
            pageFunctions.deleteData("/deletePost", name);
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
    selectData();
});
