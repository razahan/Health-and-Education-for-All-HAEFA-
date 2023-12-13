/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.1574074074074075E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "HTTP Request_Reporting_agewisedx-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_disease-rate-date-range"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_fulldatadump-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_Reporting_agewisedx"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_Reporting_agewisedx-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_fulldatadump-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_glucosegraph-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_glucosegraph-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_prescription"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patientcountagewise-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_treatment"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_customreport"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_datewisedx-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_customreport-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_datewisedx-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patientcountagewise-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_customreport-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patientcountagewise"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_provisionaldx-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_provisionaldx-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_disease-rate-date-range-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_followupdate-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_fulldatadump"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patient"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_hypertension"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_disease-rate-date-range-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_followupdate-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_hypertension-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_hypertension-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_followupdate"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_user"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patient-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_datewisedx"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_user-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_glucosegraph"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patient-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_top-ten-diseases-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patient-blood-pressure-graph-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_top-ten-diseases-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patient-blood-pressure-graph"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_treatment-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_provisionaldx"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_patient-blood-pressure-graph-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_treatment-1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_top-ten-diseases"], "isController": false}, {"data": [0.005555555555555556, 500, 1500, "HTTP Request_reporting_user-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_prescription-0"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_reporting_prescription-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4320, 0, 0.0, 51032.64166666669, 1354, 89208, 39050.0, 77786.0, 78477.0, 82671.64, 1.1696042595254386, 31.92832964774877, 0.1989317140631646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request_Reporting_agewisedx-1", 90, 0, 0.0, 37964.53333333332, 37267, 39168, 37730.0, 39043.0, 39099.05, 39168.0, 0.0352956540461173, 1.3929095142719938, 0.004239614694992605], "isController": false}, {"data": ["HTTP Request_reporting_disease-rate-date-range", 90, 0, 0.0, 75425.3444444445, 73728, 77126, 75220.0, 76994.3, 77044.0, 77126.0, 0.034742756907246104, 1.4225081776970416, 0.008957117015149388], "isController": false}, {"data": ["HTTP Request_reporting_fulldatadump-1", 90, 0, 0.0, 38743.66666666667, 37850, 39701, 38734.0, 39342.4, 39482.5, 39701.0, 0.035313976565645146, 1.393664399166041, 0.004241815544506205], "isController": false}, {"data": ["HTTP Request_Reporting_agewisedx", 90, 0, 0.0, 75946.35555555555, 74318, 78206, 75323.0, 77901.2, 78077.0, 78206.0, 0.034793379515745744, 1.4241905024270314, 0.012367959124737744], "isController": false}, {"data": ["HTTP Request_Reporting_agewisedx-0", 90, 0, 0.0, 37981.63333333334, 36635, 39368, 37851.0, 39109.9, 39263.35, 39368.0, 0.03530198099027548, 0.051849784579467116, 0.008308376385406633], "isController": false}, {"data": ["HTTP Request_reporting_fulldatadump-0", 90, 0, 0.0, 38580.85555555557, 37793, 39367, 38375.5, 39243.0, 39305.05, 39367.0, 0.035306135578698945, 0.05185588663121408, 0.004482224243389514], "isController": false}, {"data": ["HTTP Request_reporting_glucosegraph-0", 90, 0, 0.0, 38460.333333333336, 37268, 39992, 38197.0, 39772.7, 39881.95, 39992.0, 0.03523733716924375, 0.051754838967326765, 0.004473490070314149], "isController": false}, {"data": ["HTTP Request_reporting_glucosegraph-1", 90, 0, 0.0, 38630.622222222235, 36917, 40584, 38184.0, 40425.2, 40483.45, 40584.0, 0.035233102204182874, 1.3909414005980232, 0.004232101143666497], "isController": false}, {"data": ["HTTP Request_reporting_prescription", 90, 0, 0.0, 78108.37777777779, 77145, 79794, 78048.0, 79525.5, 79671.7, 79794.0, 0.03478301197695046, 1.4242012950874794, 0.008593849638836392], "isController": false}, {"data": ["HTTP Request_reporting_patientcountagewise-1", 90, 0, 0.0, 37662.44444444445, 36691, 38634, 37523.0, 38407.3, 38462.6, 38634.0, 0.03530351807402834, 1.3932539536998283, 0.004240559299907701], "isController": false}, {"data": ["HTTP Request_reporting_treatment", 90, 0, 0.0, 77601.1888888889, 76387, 79052, 77322.5, 78884.2, 79011.8, 79052.0, 0.0347856200884637, 1.424200889758186, 0.008492583029410083], "isController": false}, {"data": ["HTTP Request_reporting_customreport", 90, 0, 0.0, 76704.9, 73828, 78811, 77410.5, 78610.2, 78740.7, 78811.0, 0.03474670041472117, 1.4235892067482725, 0.00858487812980904], "isController": false}, {"data": ["HTTP Request_reporting_datewisedx-0", 90, 0, 0.0, 38310.5, 37008, 39193, 38750.0, 39100.9, 39138.6, 39193.0, 0.03528776584920597, 0.05182890609102127, 0.004410970731150746], "isController": false}, {"data": ["HTTP Request_reporting_customreport-1", 90, 0, 0.0, 38230.3, 36642, 39659, 38592.5, 39458.2, 39558.65, 39659.0, 0.035274668163357774, 1.3934106331959712, 0.004237093929778326], "isController": false}, {"data": ["HTTP Request_reporting_datewisedx-1", 90, 0, 0.0, 38479.622222222206, 37484, 39377, 38451.0, 39165.2, 39290.1, 39377.0, 0.035290104262652486, 1.3939503111655929, 0.0042389480706115775], "isController": false}, {"data": ["HTTP Request_reporting_patientcountagewise-0", 90, 0, 0.0, 37730.5777777778, 37233, 38568, 37681.0, 38317.2, 38403.35, 38568.0, 0.035298616490337005, 0.05184484297018247, 0.004722568807789228], "isController": false}, {"data": ["HTTP Request_reporting_customreport-0", 90, 0, 0.0, 38474.355555555536, 37060, 39477, 38831.5, 39250.9, 39312.25, 39477.0, 0.0352771984260098, 0.051813385188201895, 0.004478550581427026], "isController": false}, {"data": ["HTTP Request_reporting_patientcountagewise", 90, 0, 0.0, 75393.41111111114, 74253, 76835, 74927.5, 76710.8, 76771.9, 76835.0, 0.03478528396966569, 1.4238927216044828, 0.00883220100792293], "isController": false}, {"data": ["HTTP Request_reporting_provisionaldx-1", 90, 0, 0.0, 38181.45555555553, 36826, 39226, 38610.5, 39067.2, 39193.95, 39226.0, 0.03529280281714995, 1.3944942339157953, 0.004239272213388129], "isController": false}, {"data": ["HTTP Request_reporting_provisionaldx-0", 90, 0, 0.0, 37877.56666666669, 36710, 38926, 37851.5, 38707.3, 38821.75, 38926.0, 0.0352988795351216, 0.051845229317209855, 0.004515774628028252], "isController": false}, {"data": ["HTTP Request_reporting_disease-rate-date-range-1", 90, 0, 0.0, 37775.21111111112, 36877, 38600, 37713.0, 38422.6, 38504.05, 38600.0, 0.035244126272655614, 1.3912714451942088, 0.00423342532376625], "isController": false}, {"data": ["HTTP Request_reporting_followupdate-1", 90, 0, 0.0, 38872.97777777779, 36993, 41559, 38575.5, 41397.4, 41462.25, 41559.0, 0.035303254960107326, 1.3932435699043673, 0.004240527695403516], "isController": false}, {"data": ["HTTP Request_reporting_fulldatadump", 90, 0, 0.0, 77324.67777777775, 76036, 78885, 77024.0, 78598.8, 78741.45, 78885.0, 0.03478955988500891, 1.424065485983093, 0.008595467432526614], "isController": false}, {"data": ["HTTP Request_reporting_patient", 90, 0, 0.0, 77662.74444444447, 70327, 88908, 77620.5, 86441.0, 87760.15, 88908.0, 0.0348570512328939, 1.4276674340301256, 0.008441942095466492], "isController": false}, {"data": ["HTTP Request_reporting_hypertension", 90, 0, 0.0, 75724.2, 73412, 77943, 75806.5, 77726.2, 77763.45, 77943.0, 0.03474415178716196, 1.4226237244070716, 0.008584248439601538], "isController": false}, {"data": ["HTTP Request_reporting_disease-rate-date-range-0", 90, 0, 0.0, 37649.73333333334, 36683, 38733, 37505.0, 38609.1, 38627.9, 38733.0, 0.03526289270128647, 0.051792373655014504, 0.00485553503015761], "isController": false}, {"data": ["HTTP Request_reporting_followupdate-0", 90, 0, 0.0, 38821.755555555545, 37576, 41477, 38447.0, 40488.8, 41416.75, 41477.0, 0.03526578055515392, 0.05179661519038232, 0.0044771010470410245], "isController": false}, {"data": ["HTTP Request_reporting_hypertension-0", 90, 0, 0.0, 37919.26666666666, 36576, 39285, 38085.0, 39093.0, 39167.2, 39285.0, 0.035271018587826795, 0.051804308550870606, 0.004477766031657698], "isController": false}, {"data": ["HTTP Request_reporting_hypertension-1", 90, 0, 0.0, 37804.64444444445, 36760, 38935, 37704.0, 38773.6, 38838.05, 38935.0, 0.03526565618806469, 1.392180656258596, 0.004236011436652302], "isController": false}, {"data": ["HTTP Request_reporting_followupdate", 90, 0, 0.0, 77694.9555555556, 75227, 80739, 77015.0, 80681.7, 80714.15, 80739.0, 0.03475283206620646, 1.4225643429378576, 0.00858639307885765], "isController": false}, {"data": ["HTTP Request_reporting_user", 90, 0, 0.0, 71845.44444444445, 35609, 89208, 77712.0, 87671.3, 88575.3, 89208.0, 0.03545583798100276, 1.4509386059020575, 0.008483086235689137], "isController": false}, {"data": ["HTTP Request_reporting_patient-0", 90, 0, 0.0, 39511.533333333326, 34584, 48377, 38605.0, 46933.5, 47997.15, 48377.0, 0.03538307485997148, 0.051968891200583116, 0.004319223005367612], "isController": false}, {"data": ["HTTP Request_reporting_datewisedx", 90, 0, 0.0, 76790.28888888886, 74534, 78189, 77510.0, 77942.2, 78058.2, 78189.0, 0.034764148429008136, 1.4242350300024258, 0.008521290288751017], "isController": false}, {"data": ["HTTP Request_reporting_user-1", 90, 0, 0.0, 39512.58888888887, 34253, 48295, 39063.5, 47066.5, 47924.45, 48295.0, 0.03547533400026961, 1.3996320333298646, 0.00426119734573551], "isController": false}, {"data": ["HTTP Request_reporting_glucosegraph", 90, 0, 0.0, 77090.73333333334, 74788, 80361, 76405.5, 80100.0, 80239.7, 80361.0, 0.034722074867737825, 1.421764980453401, 0.008578793888220382], "isController": false}, {"data": ["HTTP Request_reporting_patient-1", 90, 0, 0.0, 38151.02222222225, 35741, 40530, 38707.5, 39507.5, 39766.6, 40530.0, 0.03533030696540928, 1.3951595498261358, 0.004243777106196622], "isController": false}, {"data": ["HTTP Request_reporting_top-ten-diseases-1", 90, 0, 0.0, 38693.233333333344, 37343, 39535, 39067.5, 39276.1, 39392.1, 39535.0, 0.035277295219220954, 1.3926807047600047, 0.004237409484340017], "isController": false}, {"data": ["HTTP Request_reporting_patient-blood-pressure-graph-0", 90, 0, 0.0, 38841.17777777778, 38134, 39499, 38926.5, 39314.6, 39428.7, 39499.0, 0.03528744762754648, 0.05182843870295889, 0.005031218118771275], "isController": false}, {"data": ["HTTP Request_reporting_top-ten-diseases-0", 90, 0, 0.0, 39050.70000000002, 38278, 39585, 39051.0, 39425.4, 39468.45, 39585.0, 0.035281029077056124, 0.051819011456926176, 0.004616853414380391], "isController": false}, {"data": ["HTTP Request_reporting_patient-blood-pressure-graph", 90, 0, 0.0, 77668.55555555558, 76477, 78570, 77923.0, 78373.6, 78431.6, 78570.0, 0.03475025570396489, 1.4232473243992356, 0.009128729281607963], "isController": false}, {"data": ["HTTP Request_reporting_treatment-0", 90, 0, 0.0, 38610.75555555556, 37459, 39710, 38542.5, 39484.2, 39621.15, 39710.0, 0.03531638774568433, 0.05187094450147387, 0.004380059808302647], "isController": false}, {"data": ["HTTP Request_reporting_provisionaldx", 90, 0, 0.0, 76059.7888888889, 73687, 77622, 76969.0, 77486.1, 77524.4, 77622.0, 0.034767908756645496, 1.4248199112867834, 0.008624071117371051], "isController": false}, {"data": ["HTTP Request_reporting_patient-blood-pressure-graph-1", 90, 0, 0.0, 38827.14444444444, 38192, 39426, 38911.5, 39166.2, 39200.65, 39426.0, 0.03528409973011584, 1.3932881623756628, 0.0042382268230510235], "isController": false}, {"data": ["HTTP Request_reporting_treatment-1", 90, 0, 0.0, 38990.33333333332, 38534, 39750, 38902.0, 39548.4, 39624.75, 39750.0, 0.03531083144060738, 1.3938414305320204, 0.004241437760932332], "isController": false}, {"data": ["HTTP Request_reporting_top-ten-diseases", 90, 0, 0.0, 77744.43333333333, 75706, 78919, 78130.0, 78644.9, 78777.0, 78919.0, 0.03474730409180392, 1.422792763169325, 0.008720758937103133], "isController": false}, {"data": ["HTTP Request_reporting_user-0", 90, 0, 0.0, 32332.81111111111, 1354, 41050, 38671.5, 40844.0, 40906.3, 41050.0, 0.03614348965392609, 0.053085750429203944, 0.004306157947049788], "isController": false}, {"data": ["HTTP Request_reporting_prescription-0", 90, 0, 0.0, 38959.96666666667, 38567, 39393, 38976.5, 39216.2, 39319.8, 39393.0, 0.03531203677473981, 0.05186455401289909, 0.0044829734186681396], "isController": false}, {"data": ["HTTP Request_reporting_prescription-1", 90, 0, 0.0, 39148.07777777779, 38426, 40617, 39011.5, 40334.2, 40563.05, 40617.0, 0.03531497425538377, 1.3941137883785482, 0.004241935384191604], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4320, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
