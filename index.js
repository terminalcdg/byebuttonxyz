let tickers = ['GME', 'AMC', 'KOSS'];
let pricedata = [];
let datedata = [];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getStock(n) {
    let alpacaURL = `https://data.alpaca.markets/v2/stocks/${tickers[n]}/bars?start=2020-10-28T09:30:00-05:00&timeframe=1Day`;
    let prices = [];
    let dates = [];

    $.ajax({
        //start AJAX
        url: alpacaURL,
        //set the destination of the AJAX call
        headers: {
            'APCA-API-KEY-ID': 'PKYBNLVSJ3ED83W1RK1S',
            'APCA-API-SECRET-KEY': 'H2WCy6Y7of2x77qqGfIcwWvCJjQFO42ttkCEeuNA'
        },
        type: "GET",
        //set the method type, that we are getting data
        dateType: "json",
        //set the data type that we expect to receive back
        success: function (result) {
            for (i = 0; i < result.bars.length; i++) {
                prices.push(Number(result.bars[i].vw).toFixed(2));
                let placedate = new Date(result.bars[i].t)
                placedate = new Date(placedate.getTime() + (600 * 60000));
                dates.push(monthNames[placedate.getMonth()] + " " + (placedate.getDate()) + ", " + placedate.getFullYear());
            }

            pricedata.push(prices);
            datedata.push(dates);
            console.log(datedata[0]);

            let number = n + 1;

            if (number == tickers.length) {
                drawChart();
            } else {
                getStock(number);
            }
        }
    });
}

function drawChart() {
    let mouseX;
    let mouseY;

    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: datedata[0],
            datasets: [
                {
                    label: tickers[0],
                    data: pricedata[0],
                    borderColor: 'rgba(85, 199, 125, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: 'rgba(85, 199, 125, 1)',
                    hoverBorderColor: 'rgba(0, 0, 0, 1)'
                },
                {
                    label: tickers[1],
                    data: pricedata[1],
                    borderColor: 'rgba(251, 61, 49, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: 'rgba(251, 61, 49, 1)',
                    hoverBorderColor: 'rgba(0, 0, 0, 1)'
                },
                {
                    label: tickers[2],
                    data: pricedata[2],
                    borderColor: 'rgba(71, 157, 235, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: 'rgba(71, 157, 235, 1)',
                    hoverBorderColor: 'rgba(0, 0, 0, 1)'
                }
            ]
        },
        options: {
            onHover: (e) => {
                const canvasPosition = Chart.helpers.getRelativePosition(e, myChart);

                // Substitute the appropriate scale IDs
                mouseX = myChart.scales.x.getValueForPixel(canvasPosition.x);
                mouseY = myChart.scales.y.getValueForPixel(canvasPosition.y);
                console.log(datedata[0][mouseX]);
            },
            tension: .4,
            scales: {
                y: {
                    beginAtZero: true,
                    display: false
                },
                x: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 4,
                    hoverBorderWidth: 2
                }

            },
            transitions: {
                active: {
                    animation: {
                        duration: 0
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    external: function (context) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            document.querySelector('.canvas-container').appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        var tooltipModel = context.tooltip;
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(getBody);

                            var innerHtml = '<h1>';

                            titleLines.forEach(function (title) {
                                innerHtml += title;
                            });
                            innerHtml += '</h1>';

                            bodyLines.forEach(function (body, i) {
                                innerHtml += '<h4>' + body + '</h4>';
                            });
                        }

                        tooltip = document.querySelector('#chartjs-tooltip');
                        tooltip.innerHTML = innerHtml;

                        var position = context.chart.canvas.getBoundingClientRect();
                        var bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = '0px';
                        tooltipEl.style.bottom = '-100px';
                        tooltipEl.style.height = '100px';
                        tooltipEl.style.color = 'white';
                        tooltipEl.style.font = bodyFont.string;
                        tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            }
        }
    });

}

getStock(0);

let table = [];
let row = [];

let url = 'https://www.reddit.com/r/superstonk/top.json?t=all&limit=5&raw_json=1';

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            ;
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

$.ajax({
    //start AJAX
    url: url,
    //set the destination of the AJAX call
    type: "GET",
    //set the method type, that we are getting data
    dateType: "json",
    //set the data type that we expect to receive back
    success: function (result) {
        table.push(["author", "authorFlair", "postTitle", "preview", "upvotes", "comments", "awards", "timestamp"])
        for (i = 0; i < result.data.children.length; i++) {
            row = [];
            row.push(result.data.children[i].data.author);
            row.push(result.data.children[i].data.author_flair_text);
            row.push(result.data.children[i].data.title);
            let preview = result.data.children[i].data.selftext.replace(/(\r\n|\n|\r)/gm, " ");
            preview = preview.substring(0, 150);
            if (!preview) {
                row.push(result.data.children[i].data.url_overridden_by_dest);
            } else {
                preview = preview.concat("...");
                row.push(preview);
            }
            row.push(result.data.children[i].data.ups);
            row.push(result.data.children[i].data.num_comments);
            let postDate = new Date(result.data.children[i].data.created_utc * 1000);
            row.push(result.data.children[i].data.total_awards_received);
            row.push(postDate);

            table.push(row);
        }

        // exportToCsv("file1", table);
    }
});