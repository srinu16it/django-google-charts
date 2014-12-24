$(document).ready(function() {

  function drawCharts() {
    $('[data-chart-url]').each(function() {
      drawChart(this);
    });
  }

  function drawChart(chartElement) {
    var options = $(chartElement).data('chart-options');
    var url = $(chartElement).data('chart-url');
    var loadingGif = $(chartElement).data('loading-image');

    var height = options.height;
    if (!height) {
      height = '200px';
    }

    $(chartElement).css({
      'height': height,
      'background-image': 'url(' + loadingGif + ')',
      'background-size': '32px 32px',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
    });

    $.getJSON(url, function(data) {
      var dataTable = new google.visualization.DataTable();

      var types = [];

      for (var i = 0; i < data.cols.length; i++) {
        var col = data.cols[i];
        types.push(col[0]);
        dataTable.addColumn(col[0], col[1]);
      }

      for (var i = 0; i < data.rows.length; i++) {
        var row = data.rows[i];
        var formattedRow = [];
        for (var j = 0; j < row.length; j++) {
          switch (types[j]) {
            case 'datetime':
              formattedRow.push(new Date(row[j]));
              break;
            default:
              formattedRow.push(row[j]);
          }
        }

        dataTable.addRow(formattedRow);
      }

      var chart = new google.visualization.LineChart(chartElement);
      chart.draw(dataTable, options);
    });
  }

  google.setOnLoadCallback(drawCharts);

});