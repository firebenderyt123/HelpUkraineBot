export default class PageFunctions
{
    _resultLength = 0;

    addBlock(values)
    {
        let infoTextBlock = `<div class="row row-` + this._resultLength + ` mb-1">`;
        for (let key in values) {
            // console.log(key, values[key]);
            if (typeof values[key] === 'string' || values[key] instanceof String) {
                infoTextBlock += `<div class="col">
                    <input type="text" class="` + key + ` form-control" placeholder="` + key + `" aria-label="` + key + `" value='` + values[key] + `'>
                </div>`;
            } else {
                infoTextBlock += `<div class="col">
                <input list="` + key + '-' + this._resultLength + `" class="` + key + `" value="` + values[key][0] + `" placeholder="` + values[key][0] + `">
                <datalist id="` + key + '-' + this._resultLength + `">`;
                for (let i = 1; i < values[key].length; i++) {
                    // console.log(key, selectValues[key]);
                    infoTextBlock += `<option value="` + values[key][i] + `">` + values[key][i] + `</option>`;
                }
                infoTextBlock += `</datalist></div>`;
            }
        }
        infoTextBlock += `
            <div class="col-1">
                <button class="btn btn-danger delete" data="` + this._resultLength + `"><i class="fas fa-trash-alt"></i></button>
                <button class="btn btn-primary save" data="` + this._resultLength + `"><i class="fas fa-save"></i></button>
                <div class="bg-success rounded pt-2 pb-2 text-center" style="display: none;"><p class="text-white m-0">Saved</p></div>
            </div>
        </div>`;
        $('.blocks').append(infoTextBlock);
        this._resultLength++;
    }

    getData(url, filter = null, callback)
    {
        let pageFunctions = this;
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'filter': filter
            },
            success: function(data) {
                console.log(data.result);
                pageFunctions.removeAllBlocks();
                callback(data.result)
            }
        })
    }

    insertData(url, name, engValue, ukrValue, rusValue, type, saveBtn)
    {
        let pageFunctions = this;
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'name': name,
                'engValue': engValue,
                'ukrValue': ukrValue,
                'rusValue': rusValue,
                'type': type
            },
            success: function(data) {
                console.log(data, saveBtn);
                pageFunctions.showSavedText(saveBtn);
            }
        });
    }

    insertCountry(url, name, engValue, ukrValue, rusValue, saveBtn)
    {
        let pageFunctions = this;
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'name': name,
                'engValue': engValue,
                'ukrValue': ukrValue,
                'rusValue': rusValue
            },
            success: function(data) {
                console.log(data, saveBtn);
                pageFunctions.showSavedText(saveBtn);
            }
        });
    }

    insertCity(url, name, engValue, ukrValue, rusValue, country, saveBtn)
    {
        let pageFunctions = this;
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'name': name,
                'engValue': engValue,
                'ukrValue': ukrValue,
                'rusValue': rusValue,
                'country': country
            },
            success: function(data) {
                console.log(data, saveBtn);
                pageFunctions.showSavedText(saveBtn);
            }
        });
    }

    insertCategory(url, name, engValue, ukrValue, rusValue, city, parent, saveBtn)
    {
        let pageFunctions = this;
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'name': name,
                'engValue': engValue,
                'ukrValue': ukrValue,
                'rusValue': rusValue,
                'city': city,
                'parent': parent
            },
            success: function(data) {
                console.log(data, saveBtn);
                pageFunctions.showSavedText(saveBtn);
            }
        });
    }

    insertState(url, name, saveBtn)
    {
        let pageFunctions = this;
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'name': name
            },
            success: function(data) {
                console.log(data, saveBtn);
                pageFunctions.showSavedText(saveBtn);
            }
        });
    }

    deleteData(url, name)
    {
        $.ajax({
            url: url,
            type: "POST",
            data: {
                'name': name
            },
            success: function(data){
                console.log(data);
            }
        });
    }

    showSavedText(saveBtn)
    {
        saveBtn.hide();
        saveBtn.prev().hide();
        saveBtn.next().show();
        setTimeout(function(){
            saveBtn.next().hide();
            saveBtn.show();
            saveBtn.prev().show();
        }, 3000);
    }

    removeAllBlocks()
    {
        $('.blocks').empty();
    }

    prepend(value, array)
    {
        let newArray = array.slice();
        newArray.unshift(value);
        return newArray;
    }

    remove(value, array)
    {
        let index = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    }
}
