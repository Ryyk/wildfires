   var flagButtonBarChart=true;
    var flagButtonRadial=true;
    var flagButton=true;
    var flagButtonStacked = true;
    var legend;
    
 var div;


 
 
  function changeButtonRadialHora() {
       document.getElementById("ButtonRadialHora").style.backgroundColor="grey";
       document.getElementById("ButtonRadialHora").style.color="white";
        document.getElementById("ButtonRadialMes").style.backgroundColor="white";
       document.getElementById("ButtonRadialMes").style.color="black";
   
    } 
    function changeButtonRadialMes() {
       document.getElementById("ButtonRadialMes").style.backgroundColor="grey";
       document.getElementById("ButtonRadialMes").style.color="white";
        document.getElementById("ButtonRadialHora").style.backgroundColor="white";
       document.getElementById("ButtonRadialHora").style.color="black";
   
    }
  function changeButtonCausas() {

       document.getElementById("ButtonCausas").style.backgroundColor="grey";
       document.getElementById("ButtonCausas").style.color="white";
        document.getElementById("ButtonOcorrencias").style.backgroundColor="white";
       document.getElementById("ButtonOcorrencias").style.color="black";
   
    } 
    function changeButtonOcorrencias() {
       document.getElementById("ButtonOcorrencias").style.backgroundColor="grey";
       document.getElementById("ButtonOcorrencias").style.color="white";
        document.getElementById("ButtonCausas").style.backgroundColor="white";
       document.getElementById("ButtonCausas").style.color="black";
   
    }

    function changeToChoropleth(){
      resetZoomToFeature();
       if(document.getElementById("DetalharD").style.backgroundColor=="grey")
           flagButtonStacked = true;
       document.getElementById("AreaArdida").style.backgroundColor="grey";
       document.getElementById("AreaArdida").style.color="white";
        document.getElementById("Nocorrencias").style.backgroundColor="white";
       document.getElementById("Nocorrencias").style.color="black";
          map.removeLayer(heat);
          geojson.addTo(map);
           distritoActual="Portugal";
           presentInfoDisplay();
           distritoSelecionado=false;
           inHeatMap=false;


   
    }  

    function changeToHeatMap(){
      resetZoomToFeature();
       document.getElementById("Nocorrencias").style.backgroundColor="grey";
       document.getElementById("Nocorrencias").style.color="white";
        document.getElementById("AreaArdida").style.backgroundColor="white";
       document.getElementById("AreaArdida").style.color="black";
         map.removeLayer(geojson);
          heat.addTo(map);
            showIdioms();
           distritoActual="Portugal";
           addRemoveInfoBox(false);
           presentInfoDisplay();
           inHeatMap=true;
    }
  

  function DetalharDistrito() {
     document.getElementById("DetalharD").style.backgroundColor="grey";
       document.getElementById("DetalharD").style.color="white";
        document.getElementById("CompararD").style.backgroundColor="white";
       document.getElementById("CompararD").style.color="black";
         showIdioms();
          flagButtonStacked = true;
   
    distritoActual="Portugal";
    presentInfoDisplay();
  }

  function showIdioms(){

     document.getElementById("ButtonRadialMes").style.visibility="visible";
    document.getElementById("ButtonRadialHora").style.visibility="visible";
    document.getElementById("ButtonCausas").style.visibility="visible";
    document.getElementById("ButtonOcorrencias").style.visibility="visible";
    document.getElementById("radialchart").style.visibility="visible";
    document.getElementById("barchart").style.visibility="visible";
    document.getElementById("Stackedbarchart").style.visibility="hidden";
    resetZoomToFeature();
  }
   function CompararDistrito() {
    showIdioms();
    flagButtonStacked = false;
    
    document.getElementById("CompararD").style.backgroundColor="grey";
    document.getElementById("CompararD").style.color="white";
    document.getElementById("DetalharD").style.backgroundColor="white";
    document.getElementById("DetalharD").style.color="black";

    distritoActual="Portugal";
    presentInfoDisplay();
  }