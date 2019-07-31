 year="2004";
  
    // Initialize slider
   var presenteInfo="";
  var slider = d3.slider().min(2004).max(2014).tickValues([2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014]).stepValues([2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014]);
  // Render the slider in the div
   d3.select('#slider').call(slider);
   function presentInfoDisplay(){
   var allData;
   d3.csv("data/Distribuição geografica area ardida e ocorrencias.csv", function(error, data) {
      presenteInfo = data;
    presenteInfo.forEach(function(d) {
      if(d["Ano"]==year && d["Distrito"]==distritoActual){
        document.getElementById("header1").innerHTML=distritoActual + " - total da área ardida (hectares) em " +year;
        document.getElementById("header1paragraph").innerHTML=d["Total Florestal(Area Ardida)"];
         document.getElementById("header2").innerHTML=distritoActual + " - total de ocorrências em " +year;
        document.getElementById("header2paragraph").innerHTML=d["Total(Ocorrencias)"];
      }
    });
    
          /*document.getElementById("header1").innerHTML = d[""];*/

    });
 }