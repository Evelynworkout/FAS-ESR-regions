(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Define columns in the table
        var cols = [{
            id: "statisticalYear",
            alias: "Year",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "productType",
            alias: "Type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "reporterCode",
            alias: "Code",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "releaseTimeStamp",
            alias: "Time",
            dataType: tableau.dataTypeEnum.string  // 修正为正确的 dataType
        }, {
            id: "lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lon",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "ESR-regions",
            alias: "FAS ESR Regions Returns a set of records with Region Codes and Region Names",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.fas.usda.gov/api/esr/regions?api_key=XleE0kQPZ4F92XTPE2MsDb1cg8PoZjHwv9qsJ4D9", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "statisticalYear": feat[i].properties.statisticalYear,
                    "productType": feat[i].properties.productType,
                    "reporterCode": feat[i].properties.reporterCode,
                    "releaseTimeStamp": feat[i].properties.releaseTimeStamp,
                    "lat": feat[i].geometry.coordinates[1],
                    "lon": feat[i].geometry.coordinates[0]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "FAS ESR Regions Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
