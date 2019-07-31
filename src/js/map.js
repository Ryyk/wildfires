var inHeatMap=false;
    var distritoActual="Portugal", areaArdida;
    var distritoSelecionado = false;
     var DistritoClicado = false;
     //var legend;

        var map = L.map('map').setView([39.562305,-8.291390], 7);
      /*  mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            //'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
            'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 7,
        }).addTo(map);*/

   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
     minZoom: 7,
    id: 'mapbox.light'
  }).addTo(map);
        
        var heat = L.heatLayer(wildfirePoints[year],{
            radius : 20,
            blur: 15, 
            maxZoom: 17,
        });
  // control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h4>Distrito</h4>' +  (props ?
      '<b>' + props.name + '</b><br />'
      : 'Selecione um distrito');
  };

  info.addTo(map);


  //LEAFLET CHOROPLETH
  function getColor(d) {
    return d > 30000 ? '#800026' :
           d > 20000  ? '#BD0026' :
           d > 10000  ? '#E31A1C' :
           d > 5000  ? '#FC4E2A' :
           d > 2000   ? '#FD8D3C' :
           d > 1000   ? '#FEB24C' :
           d > 500   ? '#FED976' :
                      '#FFEDA0';
    }


  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.density)
    };
  }

    

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    info.update(layer.feature.properties);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }
  function resetZoomToFeature() {
    map.setView([39.562305,-8.291390], 7);
  }

  map.on("zoomstart", function(){
    zoomLev = map.getZoom();
    if(zoomLev == 9 && distritoSelecionado){
      distritoSelecionado = false;
      document.getElementById("ButtonRadialMes").style.visibility="visible";
      document.getElementById("ButtonRadialHora").style.visibility="visible";
      document.getElementById("ButtonCausas").style.visibility="visible";
      document.getElementById("ButtonOcorrencias").style.visibility="visible";
      document.getElementById("radialchart").style.visibility="visible";
      document.getElementById("barchart").style.visibility="visible";
      document.getElementById("Stackedbarchart").style.visibility="hidden";
      removeTextLegend();
      distritoActual="Portugal";
      presentInfoDisplay();
    }
  
   
    if(zoomLev==8 && distritoSelecionado){
       distritoSelecionado = false;
     document.getElementById("ButtonRadialMes").style.visibility="visible";
      document.getElementById("ButtonRadialHora").style.visibility="visible";
      document.getElementById("ButtonCausas").style.visibility="visible";
      document.getElementById("ButtonOcorrencias").style.visibility="visible";
      document.getElementById("radialchart").style.visibility="visible";
      document.getElementById("barchart").style.visibility="visible";
      document.getElementById("Stackedbarchart").style.visibility="hidden";
      removeTextLegend();
      distritoActual="Portugal";
      presentInfoDisplay();
    }

  });

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
     layer.on('click', function (e) {
      console.log(distritoSelecionado + " " + flagButtonStacked);
       distritoActual = feature.properties.name;
      if(flagButtonStacked){
        if(!distritoSelecionado){
          zoomToFeature(e);
          distritoSelecionado = true;
           DistritoClicado=true;
      document.getElementById("ButtonRadialMes").style.visibility="hidden";
      document.getElementById("ButtonRadialHora").style.visibility="hidden";
      document.getElementById("ButtonCausas").style.visibility="hidden";
      document.getElementById("ButtonOcorrencias").style.visibility="hidden";
      document.getElementById("radialchart").style.visibility="hidden";
      document.getElementById("barchart").style.visibility="hidden";
      document.getElementById("Stackedbarchart").style.visibility="visible";

          updateStackedBarChart(distritoActual);
          presentInfoDisplay();
        }
        else{
          resetZoomToFeature(e);
          distritoSelecionado = false;
          document.getElementById("ButtonRadialMes").style.visibility="visible";
          document.getElementById("ButtonRadialHora").style.visibility="visible";
          document.getElementById("ButtonCausas").style.visibility="visible";
          document.getElementById("ButtonOcorrencias").style.visibility="visible";
          document.getElementById("radialchart").style.visibility="visible";
          document.getElementById("barchart").style.visibility="visible";
          document.getElementById("Stackedbarchart").style.visibility="hidden";
          removeTextLegend();
          distritoActual="Portugal";
           presentInfoDisplay();
        }

      }
      else{
       
        redrawLineChart(distritoActual);
      }
        
        


      
        areaArdida = feature.properties.density;
       
       // console.log(areaArdida+" "+distritoActual);
        
        
        });

  }

  geojson = L.geoJson(dadosDistritos[year], {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
addRemoveInfoBox(true);



     var southWest = L.latLng(36.625119, -9.915100),
        northEast = L.latLng(42.198012, -6.111882),
        bounds = L.latLngBounds(southWest, northEast);

      map.setMaxBounds(bounds);

     map.doubleClickZoom.disable();

     //map.removeLayer(heat);
    // heat.addTo(map);
    

        //map.setOpacity(0.5);    
        //map.dragging.disable();
        //map.zoomControl.disable();
        function updateMap(){
          
         map.removeLayer(geojson);
          map.removeLayer(heat);
          heat = L.heatLayer(wildfirePoints[year],{
                    radius : 20,
                    blur: 15, 
                    maxZoom: 17,
                });
          geojson= L.geoJson(dadosDistritos[year], {style: style, onEachFeature: onEachFeature});
          if(inHeatMap){
            addRemoveInfoBox(false);
            heat.addTo(map);
          }
          else
            geojson.addTo(map);
        }



      function addRemoveInfoBox(flag){
         

           if(flag){

          legend = L.control({position: 'bottomright'});

          legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 500, 1000, 2000, 5000, 10000, 20000, 30000],
              labels = [],
              from, to;


            for (var i = 0; i < grades.length; i++) {
              from = grades[i];
              to = grades[i + 1]-1;

              labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
          };

          
          legend.addTo(map);
          info.addTo(map);
          }
          else {
          legend.remove();
          info.remove();
        }
       
        }
      

   

  