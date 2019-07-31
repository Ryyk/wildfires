var datasetRadial;
var svgR;
var aux=0;
var segments;
var barScale;
var extent;
var arc;
var x;
var xAxis;
var circles;
var keys;
var numBars;
var tipR;
var oldYear;
var year;
var dataBasePerHour="./data/data.csv";
var dataBasePerMonth="./data/OcorrenciasMes.csv";
var onDatabaseFlag=true;
d3.csv(dataBasePerHour, function(error, data) {
  datasetRadial=data;
  radial_chart(data);
});

 var margin1 = {top: 30, right: 20, bottom: 30, left: 20},
    widthR = 400 - margin1.left - margin1.right,
    heightR = 400 - margin1.top - margin1.bottom,
    barHeight = heightR / 2 - 40;

function changeDataBaseRadial(){
  if(onDatabaseFlag){
    onDatabaseFlag=false;
    d3.csv(dataBasePerMonth, function(error, data) {
      datasetRadial=data;
      updateRadial(data);
    });
  }
  else{
    onDatabaseFlag=true;
    d3.csv(dataBasePerHour, function(error, data) {
      datasetRadial=data;
      updateRadial(data);
    });
  }

}
function updateRadial(){
    calculateBarScale();
     calculateXaxis();
    drawCircles();
    calculateArc();
    calculateTip();
    drawBars();
    drawLines();
    redrawXaxis();
}

function calculateTip(){
  tipR = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var dat="";
      if(d[year][0]=="0"){
        var i=1;
        for(;i<d[year].length;i++)
          dat+=d[year][i];
      }
      else
         dat=d[year];
     
      return "<strong><br><center>"+ d.HoraAno +"</center></br></strong>Ocorrências: <span style='color:red'>" + dat + "</span>";
    })

}
function drawLines(){
  var vis = d3.select(document.body)
    .append('svg')
    .call(tipR);
  svgR.selectAll("line").remove();
   svgR.selectAll("line")
      .data(keys)
      .enter().append("line")
      .attr("y2", -barHeight - 20)
      .style("stroke", "black")
      .style("stroke-width",".5px")
      .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });
      var labelRadius = barHeight * 1.025;

  var labels = svgR.append("g")
    .classed("labels", true);

  labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");
  svgR.selectAll("text").remove();
  labels.selectAll("text")
        .data(keys)
        .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .style("fill", function(d, i) {return "#3e3e3e";})
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';}) //distancia entre 
        .text(function(d) {return d; });
}
function drawBars(){
    svgR.selectAll("path").remove();
   segments = svgR.selectAll("path")
    .data(datasetRadial)
    .enter().append("path")
    .each(function(d) { d.outerRadius = 0; })
    //.style("fill", function (d) { return color(d.name); })
    //.style("fill", "#de4600")
    .style("fill", "#757575")
    //.style("fill", "#fdb462")
    .on("mouseover", function(d){d3.select(this).style("fill", "#b5b5b5");tipR.show(d);})
    .on("mouseout", function(d){d3.select(this).style("fill", "#757575");tipR.hide(d);})
    //.on("mouseover", function(d){d3.select(this).style("opacity", .8);tip.show(d);})
    //.on("mouseout", function(d){d3.select(this).style("opacity", 1);tip.hide(d);})
    .attr("d", arc);
    segments.transition().ease("elastic").duration(500).delay(function(d,i) {return (25-i)*100;})
          .attrTween("d", function(d,index) {
            var i = d3.interpolate(d.outerRadius, barScale(+d[year]));
            return function(t) { d.outerRadius = i(t); return arc(d,index); };
          });
}
function calculateBarScale(){

  extent = d3.extent(datasetRadial, function(d) { 
        
        if(d[year].length<4){
          d[year]="0"+d[year];
        }
        return d[year]; }
      );
   barScale = d3.scale.linear()
      .domain(extent)
      .range([0, barHeight]);
}
function calculateArc(){
   keys = datasetRadial.map(function(d,i) { return d.HoraAno; });
   numBars = keys.length;
   arc = d3.svg.arc()
      .startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; })
      .endAngle(function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; })
      .innerRadius(0);
}

function drawCircles(){
  svgR.selectAll("circle").remove();
  circles = svgR.selectAll("circle")
          .data(x.ticks(3))
          .enter().append("circle")
          .attr("r", function(d) {return barScale(d);})
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-dasharray", "2,2")
          .style("stroke-width",".5px");
          //circles.exit().remove()
    svgR.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width","1.5px");
}
function redrawXaxis(){
 svgR.selectAll("g .x.axis").remove();
  svgR.append("g")
    .attr("class", "x axis")
    .call(xAxis);
}

function calculateXaxis(){
  var formatNumber = d3.format("s");
   x = d3.scale.linear()
      .domain(extent)
      .range([0, -barHeight]);

   xAxis = d3.svg.axis()
      .scale(x).orient("left")
      .ticks(3)
      .tickFormat(formatNumber);
}
function radial_chart() {
  year="2004";
  var color = d3.scale.ordinal()
    .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);

  svgR = d3.select('#radialchart').append("svg")
    .attr("width", widthR)
    .attr("height", heightR)
    .append("g")
    .attr("transform", "translate(" + widthR/2 + "," + heightR/2 + ")");

oldYear=year;
  calculateBarScale();
  calculateXaxis();    
  drawCircles();
  calculateArc();
  calculateTip();
  drawBars();
  drawLines();
  svgR.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  // Labels
  

}