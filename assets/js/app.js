var featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];
const map = L.map('map').setView([22.9074872, 79.07306671], 2);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a add target="_blank" href="http://floodlist.com/">Floodlist</a>❤️';
const tileLayer = L.tileLayer(tileUrl, { attribution });
tileLayer.addTo(map);

var footprint;
var coordinatesarray;
var cell_data;
var actualdata;
 
 
var twitsdata;
var lstartdate;
var lenddate;
var lcountry;
var country;
var s1, s2, s3, s4, s5, d1, d2, c1, c2;
var datacheck;
var satellites;
var x = 0;
var flooddatasearch;
var csvflooddata;
var ispaused = false;
var issubmit = false;
var startdate;
var enddate;
var setstart;
var setend;
var allopticaldata = [];
var allsardata = [];
var geojesonlayer2;
var rowallflooddata1 = [];
var rowallflooddata2 = [];
var requireddata1 = [];
var requireddata2 = [];
 
var finaldata = [];
var floodname1 = [];
var floodname2 = [];

var selectcountry;
var detaildata;
$(document).ready(function () {

  $.ajax({
    url: 'https://agile-hollows-34401.herokuapp.com/flooddata',
    type: 'GET',

    success: function (allflood) {

      actualdata = allflood;
      console.log(actualdata);

      $("#loading").hide();
      $("#pano").hide();


    }
    ,
    error: function (error) {
      console.log(error);

    }
  });
});
$("#sardata").hide();
$("#opticaldata").hide();
 
 

function formatDate(input) {
  var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];

  return day + '/' + month + '/' + year;
}
function getVal() {
  allopticaldata.splice(0, allopticaldata.length);
  allsardata.splice(0, allsardata.length);
  
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  tileLayer.addTo(map);
  s1 = "";
  s2 = "";
  s3 = "";
 
  document.getElementById('feature-list1').innerHTML = "";
  document.getElementById('feature-list2').innerHTML = "";
 
  $("#panelbefore").hide();

  var x = document.getElementById("startdate").value
  var y = document.getElementById("enddate").value
  if (x == "" || y == "") {
    $("#panelbefore").show();
    $("#opticaldata").hide();
    $("#sardata").hide();
    alert("please select date");
  }
  selectcountry = document.getElementById("countries").value;


  if (document.getElementById("planet").checked === true) {
    s1 = document.getElementById("planet").value;
  }
  if (document.getElementById("sentinel1").checked === true) {
    s2 = document.getElementById("sentinel1").value;
  }
  if (document.getElementById("sentinel2").checked === true) {
    s3 = document.getElementById("sentinel2").value;
  }
  
   
  x = x.replace(/\-/g, '/');
  y = y.replace(/\-/g, '/');
  setstart = formatDate(x);
  setend = formatDate(y);


 
  //flooddata-parsing
  for (var j = 0; j < actualdata.length; j++) {

    startdate = actualdata[j]["StartDate"];
    startdate.replace(/\-/g, '/');
    startdate = formatDate(startdate);
    enddate = actualdata[j]["EndDate"];
    enddate.replace(/\-/g, '/');
    enddate = formatDate(enddate);
    country = actualdata[j]["CountryName"];
    satellites = actualdata[j]["SatelliteName"];
    d1 = setstart.split("/");
    d2 = setend.split("/");
    c1 = startdate.split("/");
    c2 = enddate.split("/");
    var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
    var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
    var check1 = new Date(c1[2], parseInt(c1[1]) - 1, c1[0]);
    var check2 = new Date(c2[2], parseInt(c2[1]) - 1, c2[0]);

    if ((check1 > from && check1 < to) && (check2 > from && check2 < to) && (selectcountry === country) && (s1 === satellites || s3 === satellites ) && (s2 !== satellites  )) {
      $("#opticaldata").show();
      requireddata1.push(actualdata[j]["flooddata"]);
      floodname1.push("Flood data-" + country + " from " + startdate + " to " + enddate + " " + satellites + " sensor");
      allopticaldata.push(actualdata[j]);

    }
    else if ((check1 > from && check1 < to) && (check2 > from && check2 < to) && selectcountry === country && (s2 === satellites  ) && (s1 != satellites || s3 != satellites )) {
      $("#sardata").show();

      requireddata2.push(actualdata[j]["flooddata"]);
      allsardata.push(actualdata[j]);
      floodname2.push("Flood data-" + country + " from " + startdate + " to " + enddate + " " + satellites + " sensor");

    }

  }

  if ((document.getElementById("planet").checked === false) && (document.getElementById("sentinel2").checked === false)  ) {
    $("#opticaldata").hide();
  }
  if ((document.getElementById("sentinel1").checked === false) ) {
    $("#sardata").hide();
  }
  if ((document.getElementById("planet").checked === false) && (document.getElementById("sentinel2").checked === false)   && (document.getElementById("sentinel1").checked === false) ) {
    $("#panelbefore").show();
    $("#opticaldata").hide();
    $("#sardata").hide();
    alert("please select any sensor");
  }
  if (requireddata1.length == 0) {

    $("#opticaldata").hide();
  }
  if (requireddata2.length == 0) {

    $("#sardata").hide();
  }
  
  if (requireddata1.length == 0 && requireddata2.length == 0 ) {
    $("#panelbefore").show();
    $("#opticaldata").hide();
    $("#sardata").hide();
    
  }
  console.log(allopticaldata);
  console.log(allsardata);

  // console.log(requiredweblink);
  // console.log(requireddata1);
  // console.log(requireddata2);

 
  if (requireddata1.length != 0) {
    var text1 = "";
    for (var i = 0; i < requireddata1.length; i++) {

      // if(i>0){text=text+"<hr style='height:1px;border-width:0px;color:gray;background-color:gray'/>";}  
      text1 = text1 + "<li name='load_data' id='#load_data'  onclick='usershowtable1(" + i + ");'><img width='16' height='18' src='assets/img/flood.png'>" + floodname1[i] + "</li><div   id='optical-list" + i + "' style='overflow: auto; display: none;'></div>";


    }

    document.getElementById('feature-list1').innerHTML = text1;

  }
  if (requireddata2.length != 0) {

    var text2 = "";
    for (var i = 0; i < requireddata2.length; i++) {

      // if(i>0){text=text+"<hr style='height:1px;border-width:0px;color:gray;background-color:gray'/>";}  
      text2 = text2 + "<li name='load_data' id='#load_data'  onclick='usershowtable2(" + i + ");'><img width='16' height='18' src='assets/img/flood.png'>" + floodname2[i] + "</li><div   id='sar-list" + i + "'style='overflow: auto;display: none;'></div>";


    }
    document.getElementById('feature-list2').innerHTML = text2;

  }
  requireddata1.splice(0, requireddata1.length);
  requireddata2.splice(0, requireddata2.length);
  floodname1.splice(0, floodname1.length);
  floodname2.splice(0, floodname2.length);
}
function flyforoptical(i) {

  map.flyTo([allopticaldata[i]["flooddata"][0]["Latitude"], allopticaldata[i]["flooddata"][0]["Longitude"]], 8, {
    duration: 3
  })
  var a = parseFloat(allopticaldata[i]["flooddata"][0]["Latitude"]);
  var b = parseFloat(allopticaldata[i]["flooddata"][0]["Longitude"]);

  var x = a - 1
  var y = a + 1
  var x1 = b - 1
  var y1 = b + 1

  var latlngs = [[x, x1], [x, y1], [y, y1], [y, x1], [x, x1]];
  console.log(latlngs);
  var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);

  // // zoom the map to the polygon
  // map.fitBounds(polygon.getBounds());
}


function flyforsar(i) {

  map.flyTo([allsardata[i]["flooddata"][0]["Latitude"], allsardata[i]["flooddata"][0]["Longitude"]], 8, {
    duration: 3
  })
  var a = parseFloat(allsardata[i]["flooddata"][0]["Latitude"]);
  var b = parseFloat(allsardata[i]["flooddata"][0]["Longitude"]);

  var x = a - 1
  var y = a + 1
  var x1 = b - 1
  var y1 = b + 1

  var latlngs = [[x, x1], [x, y1], [y, y1], [y, x1], [x, x1]];
  console.log(latlngs);
  var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map)

  // // zoom the map to the polygon
  // map.fitBounds(polygon.getBounds());
}
 

function usershowtable1(i) {


  if ((allopticaldata[i]["SatelliteName"] === s1)) {

    flyforoptical(i);
    rowallflooddata1 = allopticaldata[i]["flooddata"];
    var table_data = "<div class='planet_table'  ><div class='planet_header_row' id='planet_header_row'  ><div class='planet_head_cell'><strong>AOI</strong></div><div class='planet_head_cell'><strong>Sensor</strong></div><div class='planet_head_cell'><strong>Acquired</strong></div><div class='planet_head_cell'><strong>Cloud Cover</strong></div><div class='planet_head_cell'><strong>Provider</strong></div><div class='planet_head_cell'><strong>Pixel Resolution</strong></div><div class='planet_head_cell'><strong>Details</strong></div></div>";
    for (var j = 0; j < allopticaldata[i]["flooddata"].length; j++) {
      table_data += "<div class='planet_head_row' id='planet_head_row' ><div class='planet_head_cell' ><input type='checkbox' class='custom-control-input' value=false onclick='rowclickoptical(" + i + "," + j + ");'   id='opticalcheck" + i + "" + j + "'></div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["instrument"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["acquired"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["cloud_cover"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["provider"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["pixel_resolution"] + "</div><div  class='planet_head_cell'><i class='fa fa-plus-circle' onclick='detailsoptical(" + i + "," + j + ");' style='font-size:20px;color:black'></i> </div></div><div style='display: none;' class='details_planet' id='details_planet" + i + "" + j + "'></div>";



    }
    table_data += "</div>";
    document.getElementById('optical-list' + i + '').style.height = 50 + "vh";
    $('#optical-list' + i + '').html(table_data).toggle();
  }

  if ((allopticaldata[i]["SatelliteName"] === s3)) {
    flyforoptical(i);
    rowallflooddata1 = allopticaldata[i]["flooddata"];

    var table_data = "<div class='sentinel2_table'  ><div class='planet_header_row' id='planet_header_row'  ><div class='planet_head_cell'><strong>AOI</strong></div><div class='planet_head_cell'><strong>Title</strong></div><div class='planet_head_cell'><strong>Summary</strong></div><div class='planet_head_cell'><strong>Ingestion_date</strong></div><div class='planet_head_cell'><strong>Begin_position</strong></div><div class='planet_head_cell'><strong>End_position</strong></div><div class='planet_head_cell'><strong>Cloudcoverpercentage</strong></div><div class='planet_head_cell'><strong>Details</strong></div></div>";
    for (var j = 0; j < allopticaldata[i]["flooddata"].length; j++) {
      table_data += "<div class='planet_head_row' id='planet_head_row' ><div class='planet_head_cell' ><input type='checkbox' class='custom-control-input' value=false  onclick='rowclickoptical(" + i + "," + j + ");'   id='opticalcheck" + i + "" + j + "'></div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["title"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["summary"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["ingestiondate"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["beginposition"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["endposition"] + "</div><div class='planet_head_cell'>" + allopticaldata[i]["flooddata"][j]["cloudcoverpercentage"] + "</div><div  class='planet_head_cell'><i class='fa fa-plus-circle' onclick='detailsoptical(" + i + "," + j + ");' style='font-size:20px;color:black'></i> </div></div><div class='details_planet'  style='display: none;' id='details_planet" + i + "" + j + "'></div>";

    }
    table_data += "</div>";
    document.getElementById('optical-list' + i + '').style.height = 50 + "vh";
    $('#optical-list' + i + '').html(table_data).toggle();
  }

}
function usershowtable2(i) {



  if ((allsardata[i]["SatelliteName"] === s2)) {
    flyforsar(i);
    rowallflooddata2 = allsardata[i]["flooddata"];
    var table_data = "<div class='sentinel1_table'  ><div class='planet_header_row' id='planet_header_row'  ><div class='planet_head_cell'><strong>AOI</strong></div><div class='planet_head_cell'><strong>Product Type</strong></div><div class='planet_head_cell'><strong>Orbit_number</strong></div><div class='planet_head_cell'><strong>Mode</strong></div><div class='planet_head_cell'><strong>Orbit_direction</strong></div><div class='planet_head_cell'><strong>Summary</strong></div><div class='planet_head_cell'><strong>Details</strong></div></div>";
    for (var j = 0; j < allsardata[i]["flooddata"].length; j++) {
      table_data += "<div class='planet_head_row' id='planet_head_row' ><div class='planet_head_cell' ><input type='checkbox' class='custom-control-input' value=false onclick='rowclicksar(" + i + "," + j + ");' id='sarcheck" + i + "" + j + "'></div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["producttype"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["orbitnumber"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["sensoroperationalmode"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["orbitdirection"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["summary"] + "</div><div  class='planet_head_cell'><i class='fa fa-plus-circle' onclick='detailssar(" + i + "," + j + ");' style='font-size:20px;color:black'></i> </div></div><div class='details_planet' style='display: none;' id='details_sar" + i + "" + j + "'></div>";



    }
    table_data += "</div>";
    document.getElementById('sar-list' + i + '').style.height = 50 + "vh";
    $('#sar-list' + i + '').html(table_data).toggle();
  }

  if ((allsardata[i]["SatelliteName"] === s5)) {
    flyforalos(i);
    rowallflooddata2 = allsardata[i]["flooddata"];
    var table_data = "<div class='sentinel1_table'  ><div class='planet_header_row' id='planet_header_row'  ><div class='planet_head_cell'><strong>AOI</strong></div><div class='planet_head_cell'><strong>Sensor Name</strong></div><div class='planet_head_cell'><strong>Orbit_number</strong></div><div class='planet_head_cell'><strong>Mode</strong></div><div class='planet_head_cell'><strong>Orbit_direction</strong></div><div class='planet_head_cell'><strong>Scene ID</strong></div><div class='planet_head_cell'><strong>Details</strong></div></div>";
    for (var j = 0; j < allsardata[i]["flooddata"].length; j++) {
      table_data += "<div class='planet_head_row' id='planet_head_row' ><div class='planet_head_cell' ><input type='checkbox' class='custom-control-input' value=false onclick='rowclickalos(" + i + "," + j + ");' id='aloscheck" + i + "" + j + "'></div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["Sensor Name"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["Total Orbit No"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["Operation Mode"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["Orbit Direction"] + "</div><div class='planet_head_cell'>" + allsardata[i]["flooddata"][j]["Scene ID"] + "</div><div  class='planet_head_cell'><i class='fa fa-plus-circle' onclick='detailssar(" + i + "," + j + ");' style='font-size:20px;color:black'></i> </div></div><div class='details_planet' style='display: none;' id='details_sar" + i + "" + j + "'></div>";



    }
    table_data += "</div>";
    document.getElementById('sar-list' + i + '').style.height = 50 + "vh";
    $('#sar-list' + i + '').html(table_data).toggle();
  }

}
function detailsoptical(i, j) {


  if ((allopticaldata[i]["SatelliteName"] === s1)) {


    var table_data = "<div  class='planet_head_cell'><b>Central lat:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["Latitude"]) + "<br><br><b>Central long:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["Longitude"]) + "</div>";

    table_data += "<div  class='planet_head_cell'><b>Origin x:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["origin_x"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Origin y:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["origin_y"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Footprint:</b>" + allopticaldata[i]["flooddata"][j]["footprint"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>AOI Geojson:</b>" + allopticaldata[i]["flooddata"][j]["complete_geojson_geometry"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Image_Id:</b>" + allopticaldata[i]["flooddata"][j]["image id"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>GSD:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["gsd"]) + "</div>";

    $('#details_planet' + i + "" + j + '').html(table_data).toggle();


  }

  if ((allopticaldata[i]["SatelliteName"] === s3)) {

    var table_data = "<div  class='planet_head_cell'><b>Central lat:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["Latitude"]) + "<br><br><b>Central long:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["Longitude"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Footprint:</b>" + allopticaldata[i]["flooddata"][j]["footprint"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Link:</b>" + allopticaldata[i]["flooddata"][j]["link"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Orbitnumber:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["orbitnumber"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Relativeorbitnumber:</b>" + parseFloat(allopticaldata[i]["flooddata"][j]["relativeorbitnumber"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Filename:</b>" + allopticaldata[i]["flooddata"][j]["filename"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Processinglevel:</b>" + allopticaldata[i]["flooddata"][j]["processinglevel"] + "</div>";
    table_data += "<div  class='planet_head_cell'></div>";


    $('#details_planet' + i + "" + j + '').html(table_data).toggle();

  }
}
function detailssar(i, j) {


  if ((allsardata[i]["SatelliteName"] === s2)) {

    var table_data = "<div  class='planet_head_cell'><b>Central lat:</b>" + parseFloat(allsardata[i]["flooddata"][j]["Latitude"]) + "<br><br><b>Central long:</b>" + parseFloat(allsardata[i]["flooddata"][j]["Longitude"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Footprint:</b>" + allsardata[i]["flooddata"][j]["footprint"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Link:</b>" + allsardata[i]["flooddata"][j]["link"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>UUID:</b>" + allsardata[i]["flooddata"][j]["uuid"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Relativeorbitnumber:</b>" + parseFloat(allsardata[i]["flooddata"][j]["relativeorbitnumber"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Filename:</b>" + allsardata[i]["flooddata"][j]["filename"] + "</div>";
    table_data += "<div  class='planet_head_cell'></div>";


    $('#details_sar' + i + "" + j + '').html(table_data).toggle();

  }
  if ((allsardata[i]["SatelliteName"] === s5)) {

    var table_data = "<div  class='planet_head_cell'><b>Central lat:</b>" + parseFloat(allsardata[i]["Latitude"] ) + "<br><br><b>Central long:</b>" + parseFloat(allsardata[i]["Longitude"] ) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Footprint:</b>" + allsardata[i]["flooddata"][j]["footprint"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Orbit Data Type:</b>" + allsardata[i]["flooddata"][j]["Orbit Data Type"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Start Date:</b>" + allsardata[i]["flooddata"][j]["Observation Start Date"] + "</div>";
    table_data += "<div  class='planet_head_cell'><b>End Date:</b>" + parseFloat(allsardata[i]["flooddata"][j]["Observation End Date"]) + "</div>";
    table_data += "<div  class='planet_head_cell'><b>Beam No:</b>" + allsardata[i]["flooddata"][j]["Beam No"] + "</div>";
    table_data += "<div  class='planet_head_cell'></div>";


    $('#details_sar' + i + "" + j + '').html(table_data).toggle();

  }
}

function rowclickoptical(i, j) {

  let msg = rowallflooddata1[j]["footprint"];
  console.log(msg);

  var WithOutBrackets = msg.replace(/[\[\]']+/g, '');
  var me = WithOutBrackets.replace(/"/g, "");

  //   var obj=  JSON.parse( WithOutBrackets   );
  //alert(typeof(me));
  //we have to do string to integer and understand about how array convert into chunk array

  var coordinates = me.split(',');
  console.log(coordinates);
  const chunk = coordinates => {
    const size = 2;
    const chunkedArray = [];
    for (let i = 0; i < coordinates.length; i++) {
      const last = chunkedArray[chunkedArray.length - 1];
      if (!last || last.length === size) {
        chunkedArray.push([coordinates[i]]);
      } else {
        last.push(coordinates[i]);
      }
    };
    return chunkedArray;
  };

  // alert(chunk(coordinates));
  var states = [{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[["129.86889616213875", "31.85092400331079"], ["130.13226059277255", "31.804015706859424"], ["130.11415527263486", "31.731335321675704"], ["129.85082873777677", "31.77787200251359"], ["129.86889616213875", "31.85092400331079"]]]
    }

  }];
  states[0]["geometry"]["coordinates"] = [chunk(coordinates)];
  console.log(states);

  if (document.getElementById("opticalcheck" + i + "" + j + "").checked) {

    geojesonlayer2 = L.geoJSON(states, {
      style: function (feature) {
        switch (feature.properties.party) {
          case 'Republican': return { color: "#ff0000" };
          case 'Democrat': return { color: "#0000ff" };
        }
      }
    });

    geojesonlayer2.addTo(map);

  }
  else if (!document.getElementById("opticalcheck" + i + "" + j + "").checked) {
    map.removeLayer(geojesonlayer2);
  }
  // $("#opticalcheck" + i + "," + j + "").change(function() {
  //   if (this.checked) {

  //    alert("checked");
  //   } else {
  //     map.removeLayer(geojesonlayer2);
  //   }
  // });

}

function rowclicksar(i, j) {

  let msg = rowallflooddata2[j]["footprint"];
  console.log(msg);

  var WithOutBrackets = msg.replace(/[\[\]']+/g, '');
  var me = WithOutBrackets.replace(/"/g, "");

  //   var obj=  JSON.parse( WithOutBrackets   );
  //alert(typeof(me));
  //we have to do string to integer and understand about how array convert into chunk array

  var coordinates = me.split(',');
  console.log(coordinates);
  const chunk = coordinates => {
    const size = 2;
    const chunkedArray = [];
    for (let i = 0; i < coordinates.length; i++) {
      const last = chunkedArray[chunkedArray.length - 1];
      if (!last || last.length === size) {
        chunkedArray.push([coordinates[i]]);
      } else {
        last.push(coordinates[i]);
      }
    };
    return chunkedArray;
  };

  // alert(chunk(coordinates));
  var states = [{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[["129.86889616213875", "31.85092400331079"], ["130.13226059277255", "31.804015706859424"], ["130.11415527263486", "31.731335321675704"], ["129.85082873777677", "31.77787200251359"], ["129.86889616213875", "31.85092400331079"]]]
    }

  }];
  states[0]["geometry"]["coordinates"] = [chunk(coordinates)];
  console.log(states);

  if (document.getElementById("sarcheck" + i + "" + j + "").checked) {

    geojesonlayer2 = L.geoJSON(states, {
      style: function (feature) {
        switch (feature.properties.party) {
          case 'Republican': return { color: "#ff0000" };
          case 'Democrat': return { color: "#0000ff" };
        }
      }
    });

    geojesonlayer2.addTo(map);

  }
  else if (!document.getElementById("sarcheck" + i + "" + j + "").checked) {
    map.removeLayer(geojesonlayer2);
  }

} 

$("#nav-btn").click(function () {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function () {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  return false;
});
$("#sidebar-hide-btn2").click(function () {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function () {
    map.invalidateSize();
  });
}

 