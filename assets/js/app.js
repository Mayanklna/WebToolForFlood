
 
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
var weblinkdata;
var linkdata;
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
var requiredweblink = [];
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
$("#weblink").hide();
$(document).ready(function () {

  $.ajax({
    url: 'https://agile-hollows-34401.herokuapp.com/weblinks',
    type: 'GET',

    success: function (alllink) {

      weblinkdata = alllink;
      console.log(weblinkdata);

    }
    ,
    error: function (error) {
      console.log(error);

    }
  });
});

function formatDate(input) {
  var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];

  return day + '/' + month + '/' + year;
}
function getVal() {
  allopticaldata.splice(0, allopticaldata.length);
  allsardata.splice(0, allsardata.length);
  requiredweblink.splice(0, requiredweblink.length);
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  tileLayer.addTo(map);
  s1 = "";
  s2 = "";
  s3 = "";
  s4 = "";
  s5 = "";
  document.getElementById('feature-list1').innerHTML = "";
  document.getElementById('feature-list2').innerHTML = "";
  document.getElementById('feature-list3').innerHTML = "";
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
  if (document.getElementById("digital").checked === true) {
    s4 = document.getElementById("digital").value;
  }
  if (document.getElementById("alos2").checked === true) {
    s5 = document.getElementById("alos2").value;
  }
  x = x.replace(/\-/g, '/');
  y = y.replace(/\-/g, '/');
  setstart = formatDate(x);
  setend = formatDate(y);



  //weblink-parsing
  for (var j = 0; j < weblinkdata.length; j++) {

    linkdata = weblinkdata[j]["weblinkdata"];
    for (var i = 0; i < linkdata.length; i++) {
      lstartdate = linkdata[i]["start_date"];
      lenddate = linkdata[i]["end_date"];
      lcountry = linkdata[i]["country"];
      d1 = setstart.split("/");
      d2 = setend.split("/");
      c1 = lstartdate.split("/");
      c2 = lenddate.split("/");
      var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
      var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
      var check1 = new Date(c1[2], parseInt(c1[1]) - 1, c1[0]);
      var check2 = new Date(c2[2], parseInt(c2[1]) - 1, c2[0]);

      if ((((check1 >= from && check1 <= to) && (check2 >= from && check2 <= to)) || ((from >= check1 && from <= check2) || (to >= check1 && to <= check2))) && (selectcountry === lcountry)) {
        $("#weblink").show();
        requiredweblink.push(linkdata[i]["weblink"]);
      }
    }
  }
  console.log(requiredweblink);
  //  ||((from >= check1  && from<= check2) && (to >= check1 && to <= check2)) )
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

    if ((check1 > from && check1 < to) && (check2 > from && check2 < to) && (selectcountry === country) && (s1 === satellites || s3 === satellites || s4 === satellites) && (s2 !== satellites || s5 != satellites)) {
      $("#opticaldata").show();
      requireddata1.push(actualdata[j]["flooddata"]);
      floodname1.push("Flood data-" + country + " from " + startdate + " to " + enddate + " " + satellites + " sensor");
      allopticaldata.push(actualdata[j]);

    }
    else if ((check1 > from && check1 < to) && (check2 > from && check2 < to) && selectcountry === country && (s2 === satellites || s5 === satellites) && (s1 != satellites || s3 != satellites || s4 != satellites)) {
      $("#sardata").show();

      requireddata2.push(actualdata[j]["flooddata"]);
      allsardata.push(actualdata[j]);
      floodname2.push("Flood data-" + country + " from " + startdate + " to " + enddate + " " + satellites + " sensor");

    }

  }

  if ((document.getElementById("planet").checked === false) && (document.getElementById("sentinel2").checked === false) && (document.getElementById("digital").checked === false)) {
    $("#opticaldata").hide();
  }
  if ((document.getElementById("sentinel1").checked === false) && (document.getElementById("alos2").checked === false)) {
    $("#sardata").hide();
  }
  if ((document.getElementById("planet").checked === false) && (document.getElementById("sentinel2").checked === false) && (document.getElementById("digital").checked === false) && (document.getElementById("sentinel1").checked === false) && (document.getElementById("alos2").checked === false) && (weblinkdata.length === 0)) {
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
  if (requiredweblink.length == 0) {

    $("#weblink").hide();
  }
  if (requireddata1.length == 0 && requireddata2.length == 0 && requiredweblink.length == 0) {
    $("#panelbefore").show();
    $("#opticaldata").hide();
    $("#sardata").hide();
    $("#weblink").hide();
  }
  console.log(allopticaldata);
  console.log(allsardata);

  // console.log(requiredweblink);
  // console.log(requireddata1);
  // console.log(requireddata2);

  if (requiredweblink.length != 0) {
    var text = "";
    for (var i = 0; i < requiredweblink.length; i++) {

      // if(i>0){text=text+"<hr style='height:1px;border-width:0px;color:gray;background-color:gray'/>";}  
      text = text + "<li name='load_data' id='#load_data'   '><img width='16' height='18' src='assets/img/floodlist-icon.png'><a add target='_blank's href='" + requiredweblink[i] + "'>" + requiredweblink[i] + "</a></li>";


    }

    document.getElementById('feature-list3').innerHTML = text;

  }
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
function flyforalos(i) {

  map.flyTo([allsardata[i]["Latitude"] ,allsardata[i]["Longitude"] ], 8, {
    duration: 3
  })
  var a = parseFloat(allsardata[i]["Latitude"] );
  var b = parseFloat(allsardata[i]["Longitude"] );

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
  // $("#opticalcheck" + i + "," + j + "").change(function() {
  //   if (this.checked) {

  //    alert("checked");
  //   } else {
  //     map.removeLayer(geojesonlayer2);
  //   }
  // });

}
function rowclickalos(i, j) {

  // let msg =   rowallflooddata2[j]["relativeorbitnumber"]
 
  // var coordinates = me.split(',');
  // console.log(coordinates);
  // const chunk = coordinates => {
  //   const size = 2;
  //   const chunkedArray = [];
  //   for (let i = 0; i < coordinates.length; i++) {
  //     const last = chunkedArray[chunkedArray.length - 1];
  //     if (!last || last.length === size) {
  //       chunkedArray.push([coordinates[i]]);
  //     } else {
  //       last.push(coordinates[i]);
  //     }
  //   };
  //   return chunkedArray;
  // };

  // alert(chunk(coordinates));
  var states = [{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[rowallflooddata2[j]["Scene Upper Left Longitude"],rowallflooddata2[j]["Scene Upper Left Latitude"]], [ rowallflooddata2[j]["Scene Upper Right Longitude"],rowallflooddata2[j]["Scene Upper Right Latitude"]],  [ rowallflooddata2[j]["Scene Lower Right Longitude"],rowallflooddata2[j]["Scene Lower Right Latitude"]],[ rowallflooddata2[j]["Scene Lower Left Longitude"],rowallflooddata2[j]["Scene Lower Left Latitude"]]]]
    }

  }];
  // states[0]["geometry"]["coordinates"] = [chunk(coordinates)];
    console.log(states);
    
    if (document.getElementById("aloscheck" + i + "" + j + "").checked) {

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
    else if (!document.getElementById("aloscheck" + i + "" + j + "").checked) {
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



// $(document).on("click", ".feature-row", function(e) {
//   $(document).off("mouseout", ".feature-row", clearHighlight);
//   sidebarClick(parseInt($(this).attr("id"), 10));
// });

// if ( !("ontouchstart" in window) ) {
//   $(document).on("mouseover", ".feature-row", function(e) {
//     highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
//   });
// }

// $(document).on("mouseout", ".feature-row", clearHighlight);

// $("#about-btn").click(function() {
//   $("#aboutModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#full-extent-btn").click(function() {
//   map.fitBounds(boroughs.getBounds());
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#legend-btn").click(function() {
//   $("#legendModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#login-btn").click(function() {
//   $("#loginModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#list-btn").click(function() {
//   animateSidebar();
//   return false;
// });

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


// function sizeLayerControl() {
//   $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
// }

// function clearHighlight() {
//   highlight.clearLayers();
// }

// function sidebarClick(id) {
//   var layer = markerClusters.getLayer(id);
//   map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
//   layer.fire("click");
//   /* Hide sidebar and go to the map on small screens */
//   if (document.body.clientWidth <= 767) {
//     $("#sidebar").hide();
//     map.invalidateSize();
//   }
// }

// function syncSidebar() {
//   /* Empty sidebar features */
//   $("#feature-list tbody").empty();
//   /* Loop through theaters layer and add only features which are in the map bounds */
//   theaters.eachLayer(function (layer) {
//     if (map.hasLayer(theaterLayer)) {
//       if (map.getBounds().contains(layer.getLatLng())) {
//         $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       }
//     }
//   });
//   /* Loop through museums layer and add only features which are in the map bounds */
//   museums.eachLayer(function (layer) {
//     if (map.hasLayer(museumLayer)) {
//       if (map.getBounds().contains(layer.getLatLng())) {
//         $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       }
//     }
//   });
//   /* Update list.js featureList */
//   featureList = new List("features", {
//     valueNames: ["feature-name"]
//   });
//   featureList.sort("feature-name", {
//     order: "asc"
//   });
// }

// /* Basemap Layers */
// var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
// });
// var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
//   maxZoom: 15,
// }), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
//   minZoom: 16,
//   maxZoom: 19,
//   layers: "0",
//   format: 'image/jpeg',
//   transparent: true,
//   attribution: "Aerial Imagery courtesy USGS"
// })]);

// /* Overlay Layers */
// var highlight = L.geoJson(null);
// var highlightStyle = {
//   stroke: false,
//   fillColor: "#00FFFF",
//   fillOpacity: 0.7,
//   radius: 10
// };

// var boroughs = L.geoJson(null, {
//   style: function (feature) {
//     return {
//       color: "black",
//       fill: false,
//       opacity: 1,
//       clickable: false
//     };
//   },
//   onEachFeature: function (feature, layer) {
//     boroughSearch.push({
//       name: layer.feature.properties.BoroName,
//       source: "Boroughs",
//       id: L.stamp(layer),
//       bounds: layer.getBounds()
//     });
//   }
// });
// $.getJSON("data/boroughs.geojson", function (data) {
//   boroughs.addData(data);
// });

// //Create a color dictionary based off of subway route_id
// var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
//     "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
//     "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
//     "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
//     "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
//     "Q":"#ffff00", "R":"#ffff00" };

// var subwayLines = L.geoJson(null, {
//   style: function (feature) {
//       return {
//         color: subwayColors[feature.properties.route_id],
//         weight: 3,
//         opacity: 1
//       };
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.Line);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");

//         }
//       });
//     }
//     layer.on({
//       mouseover: function (e) {
//         var layer = e.target;
//         layer.setStyle({
//           weight: 3,
//           color: "#00FFFF",
//           opacity: 1
//         });
//         if (!L.Browser.ie && !L.Browser.opera) {
//           layer.bringToFront();
//         }
//       },
//       mouseout: function (e) {
//         subwayLines.resetStyle(e.target);
//       }
//     });
//   }
// });
// $.getJSON("data/subways.geojson", function (data) {
//   subwayLines.addData(data);
// });

// /* Single marker cluster layer to hold all clusters */
// var markerClusters = new L.MarkerClusterGroup({
//   spiderfyOnMaxZoom: true,
//   showCoverageOnHover: false,
//   zoomToBoundsOnClick: true,
//   disableClusteringAtZoom: 16
// });

// /* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
// var theaterLayer = L.geoJson(null);
// var theaters = L.geoJson(null, {
//   pointToLayer: function (feature, latlng) {
//     return L.marker(latlng, {
//       icon: L.icon({
//         iconUrl: "assets/img/theater.png",
//         iconSize: [24, 28],
//         iconAnchor: [12, 28],
//         popupAnchor: [0, -25]
//       }),
//       title: feature.properties.NAME,
//       riseOnHover: true
//     });
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.NAME);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");
//           highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
//         }
//       });
//       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       theaterSearch.push({
//         name: layer.feature.properties.NAME,
//         address: layer.feature.properties.ADDRESS1,
//         source: "Theaters",
//         id: L.stamp(layer),
//         lat: layer.feature.geometry.coordinates[1],
//         lng: layer.feature.geometry.coordinates[0]
//       });
//     }
//   }
// });
// $.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
//   theaters.addData(data);
//   map.addLayer(theaterLayer);
// });

// /* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
// var museumLayer = L.geoJson(null);
// var museums = L.geoJson(null, {
//   pointToLayer: function (feature, latlng) {
//     return L.marker(latlng, {
//       icon: L.icon({
//         iconUrl: "assets/img/museum.png",
//         iconSize: [24, 28],
//         iconAnchor: [12, 28],
//         popupAnchor: [0, -25]
//       }),
//       title: feature.properties.NAME,
//       riseOnHover: true
//     });
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.NAME);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");
//           highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
//         }
//       });
//       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       museumSearch.push({
//         name: layer.feature.properties.NAME,
//         address: layer.feature.properties.ADRESS1,
//         source: "Museums",
//         id: L.stamp(layer),
//         lat: layer.feature.geometry.coordinates[1],
//         lng: layer.feature.geometry.coordinates[0]
//       });
//     }
//   }
// });
// $.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
//   museums.addData(data);
// });

// map = L.map("map", {
//   zoom: 10,
//   center: [40.702222, -73.979378],
//   layers: [cartoLight, boroughs, markerClusters, highlight],
//   zoomControl: false,
//   attributionControl: false
// });

// /* Layer control listeners that allow for a single markerClusters layer */
// map.on("overlayadd", function(e) {
//   if (e.layer === theaterLayer) {
//     markerClusters.addLayer(theaters);
//     syncSidebar();
//   }
//   if (e.layer === museumLayer) {
//     markerClusters.addLayer(museums);
//     syncSidebar();
//   }
// });

// map.on("overlayremove", function(e) {
//   if (e.layer === theaterLayer) {
//     markerClusters.removeLayer(theaters);
//     syncSidebar();
//   }
//   if (e.layer === museumLayer) {
//     markerClusters.removeLayer(museums);
//     syncSidebar();
//   }
// });

// /* Filter sidebar feature list to only show features in current map bounds */
// map.on("moveend", function (e) {
//   syncSidebar();
// });

// /* Clear feature highlight when map is clicked */
// map.on("click", function(e) {
//   highlight.clearLayers();
// });

// /* Attribution control */
// function updateAttribution(e) {
//   $.each(map._layers, function(index, layer) {
//     if (layer.getAttribution) {
//       $("#attribution").html((layer.getAttribution()));
//     }
//   });
// }
// map.on("layeradd", updateAttribution);
// map.on("layerremove", updateAttribution);

// var attributionControl = L.control({
//   position: "bottomright"
// });
// attributionControl.onAdd = function (map) {
//   var div = L.DomUtil.create("div", "leaflet-control-attribution");
//   div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
//   return div;
// };
// map.addControl(attributionControl);

// var zoomControl = L.control.zoom({
//   position: "bottomright"
// }).addTo(map);

// /* GPS enabled geolocation control set to follow the user's location */
// var locateControl = L.control.locate({
//   position: "bottomright",
//   drawCircle: true,
//   follow: true,
//   setView: true,
//   keepCurrentZoomLevel: true,
//   markerStyle: {
//     weight: 1,
//     opacity: 0.8,
//     fillOpacity: 0.8
//   },
//   circleStyle: {
//     weight: 1,
//     clickable: false
//   },
//   icon: "fa fa-location-arrow",
//   metric: false,
//   strings: {
//     title: "My location",
//     popup: "You are within {distance} {unit} from this point",
//     outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
//   },
//   locateOptions: {
//     maxZoom: 18,
//     watch: true,
//     enableHighAccuracy: true,
//     maximumAge: 10000,
//     timeout: 10000
//   }
// }).addTo(map);

// /* Larger screens get expanded layer control and visible sidebar */
// if (document.body.clientWidth <= 767) {
//   var isCollapsed = true;
// } else {
//   var isCollapsed = false;
// }

// var baseLayers = {
//   "Street Map": cartoLight,
//   "Aerial Imagery": usgsImagery
// };

// var groupedOverlays = {
//   "Points of Interest": {
//     "<img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters": theaterLayer,
//     "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
//   },
//   "Reference": {
//     "Boroughs": boroughs,
//     "Subway Lines": subwayLines
//   }
// };

// var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
//   collapsed: isCollapsed
// }).addTo(map);

// /* Highlight search box text on click */
// $("#searchbox").click(function () {
//   $(this).select();
// });

// /* Prevent hitting enter from refreshing the page */
// $("#searchbox").keypress(function (e) {
//   if (e.which == 13) {
//     e.preventDefault();
//   }
// });

// $("#featureModal").on("hidden.bs.modal", function (e) {
//   $(document).on("mouseout", ".feature-row", clearHighlight);
// });

// /* Typeahead search functionality */
// $(document).one("ajaxStop", function () {
//   $("#loading").hide();
//   sizeLayerControl();
//   /* Fit map to boroughs bounds */
//   map.fitBounds(boroughs.getBounds());
//   featureList = new List("features", {valueNames: ["feature-name"]});
//   featureList.sort("feature-name", {order:"asc"});

//   var boroughsBH = new Bloodhound({
//     name: "Boroughs",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: boroughSearch,
//     limit: 10
//   });

//   var theatersBH = new Bloodhound({
//     name: "Theaters",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: theaterSearch,
//     limit: 10
//   });

//   var museumsBH = new Bloodhound({
//     name: "Museums",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: museumSearch,
//     limit: 10
//   });

//   var geonamesBH = new Bloodhound({
//     name: "GeoNames",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     remote: {
//       url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
//       filter: function (data) {
//         return $.map(data.geonames, function (result) {
//           return {
//             name: result.name + ", " + result.adminCode1,
//             lat: result.lat,
//             lng: result.lng,
//             source: "GeoNames"
//           };
//         });
//       },
//       ajax: {
//         beforeSend: function (jqXhr, settings) {
//           settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
//           $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
//         },
//         complete: function (jqXHR, status) {
//           $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
//         }
//       }
//     },
//     limit: 10
//   });
//   boroughsBH.initialize();
//   theatersBH.initialize();
//   museumsBH.initialize();
//   geonamesBH.initialize();

//   /* instantiate the typeahead UI */
//   $("#searchbox").typeahead({
//     minLength: 3,
//     highlight: true,
//     hint: false
//   }, {
//     name: "Boroughs",
//     displayKey: "name",
//     source: boroughsBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'>Boroughs</h4>"
//     }
//   }, {
//     name: "Theaters",
//     displayKey: "name",
//     source: theatersBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
//       suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//     }
//   }, {
//     name: "Museums",
//     displayKey: "name",
//     source: museumsBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums</h4>",
//       suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//     }
//   }, {
//     name: "GeoNames",
//     displayKey: "name",
//     source: geonamesBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
//     }
//   }).on("typeahead:selected", function (obj, datum) {
//     if (datum.source === "Boroughs") {
//       map.fitBounds(datum.bounds);
//     }
//     if (datum.source === "Theaters") {
//       if (!map.hasLayer(theaterLayer)) {
//         map.addLayer(theaterLayer);
//       }
//       map.setView([datum.lat, datum.lng], 17);
//       if (map._layers[datum.id]) {
//         map._layers[datum.id].fire("click");
//       }
//     }
//     if (datum.source === "Museums") {
//       if (!map.hasLayer(museumLayer)) {
//         map.addLayer(museumLayer);
//       }
//       map.setView([datum.lat, datum.lng], 17);
//       if (map._layers[datum.id]) {
//         map._layers[datum.id].fire("click");
//       }
//     }
//     if (datum.source === "GeoNames") {
//       map.setView([datum.lat, datum.lng], 14);
//     }
//     if ($(".navbar-collapse").height() > 50) {
//       $(".navbar-collapse").collapse("hide");
//     }
//   }).on("typeahead:opened", function () {
//     $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
//     $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
//   }).on("typeahead:closed", function () {
//     $(".navbar-collapse.in").css("max-height", "");
//     $(".navbar-collapse.in").css("height", "");
//   });
//   $(".twitter-typeahead").css("position", "static");
//   $(".twitter-typeahead").css("display", "block");
// });

// // Leaflet patch to make layer control scrollable on touch browsers
// var container = $(".leaflet-control-layers")[0];
// if (!L.Browser.touch) {
//   L.DomEvent
//   .disableClickPropagation(container)
//   .disableScrollPropagation(container);
// } else {
//   L.DomEvent.disableClickPropagation(container);
// }


