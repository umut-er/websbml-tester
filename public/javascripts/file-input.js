var jquery = $ = require('jquery');
var Plotly = require('plotly.js-dist');

module.exports = function () {
    $("#file-input").on('change', async function(event) {
        const file = this.files[0];
        if(!file)
            return;
        var sbml = await file.text(); 
        $("#file-input").prop('disabled', true);               // disable the input filed
        $.ajax({
            url: "/",
            type: "POST",
            data: {file: sbml},
            success: function(data){
                drawPlotOnPage(data);
                $("#file-input").prop('disabled', false); 
            },
            error: function(err) {
                console.log(err.responseText);
                $("#file-input").prop('disabled', false); 
            }
        });
    });

    var drawPlotOnPage = function(rawData) {
        // Process Data
        console.log(rawData);
        var legendItems = rawData.substring(0, rawData.indexOf('\n'));
        legendItems = legendItems.split(',');
        for (let i = 0; i < legendItems.length; i++) {
            legendItems[i] = legendItems[i].trim();
        }
        var dataRows = rawData.split(',\n');

        let processedData = [];        
        for (let i = 1; i < dataRows.length; i++) {
            dataRows[i] = dataRows[i].replace(/[\[\]\n]/g, "");
            let splitRow = dataRows[i].split(',');
            for (let j = 0; j < splitRow.length; j++) {
                splitRow[j] = parseFloat(splitRow[j].trim());
            }
            processedData.push(splitRow);
        }

        let time = processedData.map(row => row[0]);
        let data = [];
        for (let i = 1; i < legendItems.length; i++) {
            var trace = {
                x: time,
                y: processedData.map(row => row[i]),
                mode: "lines",
                name: legendItems[i]
            };
            data.push(trace);
        }

        var layout = {
            margin: {
                pad: 15
            }
        }

        // Plot Data
        plotElement = document.getElementById("plot");
        Plotly.newPlot(plotElement, data, layout);
    }
}
