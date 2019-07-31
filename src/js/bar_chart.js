var dataset;
var svg;
var datasetSort;
var x,y;
var tip;
var soloAcess="Ocupação do solo";
var causaAcess="TIPO\/DESCRIÇÃO DA CAUSA";
var acessData;
var dataBaseCausa="./data/OcorrenciasCausa.js";
var dataBaseSolo="./data/Area_ardida_tipo_de_solo.js";
var dataChangeFlag=true;
var margin = {top: 60, right: 20, bottom: 20, left: 40},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
var color = d3.scale.ordinal()
    .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f","#8dd3a1","#A970C2","#BC626B","#5F2E6B","#723C31"]);

d3.json(dataBaseSolo,function(data) {
  dataset= data.data;
  dataset=dataset.sort(function(a, b){ return a[year]>b[year]});

  acessData=soloAcess;
  barChart();

  });
function changeDataBaseBarChart(){
  if(dataChangeFlag){
    dataChangeFlag=false;
    d3.json(dataBaseCausa, function(error, data) {
     dataset= data.data;
      dataset=dataset.sort(function(a, b){ return a[year]>b[year]});
      acessData=causaAcess;
      updateBarChart();
    });
  }
  else{
    dataChangeFlag=true;
    d3.json(dataBaseSolo, function(error, data) {
      dataset= data.data;
       dataset=dataset.sort(function(a, b){ return a[year]>b[year]});
      acessData=soloAcess;
      updateBarChart();
    });
  }

}
function barChart(){


 tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    if(dataChangeFlag){
    return "<strong><br><center>"+ d[acessData] +"</center></br></strong>Hectares Ardidos: <span style='color:red'><center>" + d[year] + "</center></span>";
    } else {
      return "<strong><br><center>"+ d[acessData] +"</center></br></strong>Ocorrências: <span style='color:red'><center>" + d[year] + "</center></span>";
    }
  })

svg = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);


 updateBarChart();

}

function updateBarChart(){
 dataset=dataset.sort(function(a, b){ return a[year]>b[year]});
x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

 y = d3.scale.sqrt()
    .range([height, 0]);
   x.domain(dataset.map(function(d) { 
          return d[acessData];
          }));

  y.domain([0, d3.max(dataset, function(d) { 
          return d[year]; 
          })]);


/*
       var formatCount = d3.format(",.0f");

      svg.selectAll(".bar")
      .data(dataset)
      .enter().append("text")
    .attr("dy", ".75em")
    .attr("x", function(d, i) {
        return (i *(width /dataset.length)) + 5;
       })
    .attr("y", function(d) {
            return y(d[year+ ".0"])-5;
      })
    .text(function(d) { return formatCount(d.length); });
*/



var retX=0;
datasetSort=dataset.sort(function(a, b){ return a[year]>b[year]});
    svg.selectAll(".bar").remove();
 svg.selectAll(".bar")
      .data(datasetSort)

      .enter().append("rect")
      .attr("class", "bar")
    
      .attr("x", function(d) { 
        if(d[year]!=null) 
          return x(d[acessData])-retX;
        else {
          retX+=37;
          return x(d[acessData]) -retX;
        }

      })
      .style("fill", function (d) { return color(d[acessData]); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return height - .5; }) //new----
      .attr("height", 0)
      .transition()
            .ease("elastic")
            .duration(500)
            .delay(function(d,i) {return (25-i)*100;})
      .attr("y", function(d) { return y( d[year]); })
      .attr("height", function(d) { return height -y(d[year]) - .5; });


retX=0;
var dx;
if(dataChangeFlag){
  dx = "1.8em";
     } else {
   dx = "1.3em";
     }
svg.selectAll("text").remove();
      svg.selectAll("bar")
      .data(dataset)
      .enter().append("text")
      .on("mouseover", function(d){tip.show(d);}).on("mouseout", function(d){tip.hide(d);})
      .style("fill", "grey")
      .attr("dy", "0.1em")
      .attr("dx", dx)
      .text(function(d) {
        return d[year];
       })
      .attr("opacity", 0)
      .attr("y", function(d) {
            return y(d[year])+50;
       })
       .transition()
            .ease("elastic")
            .duration(500)
            .delay(function(d,i) {return (25-i)*100;})
      .attr("opacity", 100)
      .attr("x", function(d) { 
        if(d[year]!=null) 
          return x(d[acessData])-retX;
        else {
          retX+=37;
          return x(d[acessData]) -retX;
        }

      })
       .attr("y", function(d) {
            return y(d[year])-5;
       })
       .attr("text-anchor", "middle");


svg.selectAll(".bar").on("mouseover", function(d){tip.show(d);}).on("mouseout", function(d){tip.hide(d);});

 
   

  
 
/*
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var formatCount = d3.format(",.0f");

var bar = g.selectAll(".bar")
  .data(dataset)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });


bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (x(dataset[0].x1) - x(dataset[0].x0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.length); });*/
   
}
