

// Set the dimensions of the canvas / graph
var marginL = {top: 20, right: 40, bottom: 70, left: 70},
    widthL = 1000 - marginL.left - marginL.right,
    heightL = 270 - marginL.top - marginL.bottom,
     padding = 100;
// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse; 

// Set the ranges
var xL = d3.scale.linear().range([0, widthL]);
var yL = d3.scale.linear().range([heightL, 0]);

// Define the axes
var xAxisL = d3.svg.axis().scale(xL)
    .orient("bottom").ticks(10)
    .tickFormat(d3.format("d"));

var yAxisL = d3.svg.axis().scale(yL)
    .orient("left").ticks(5)
    .tickFormat(d3.format("d"));
 var colorL = d3.scale.ordinal()
    .range(["#8dd3c7","#3333ff","#e62e00","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f","#8dd3a1","#A970C2","#BC626B","#5F2E6B","#723C31","#000000","#808080","#a6a6a6"]);
/*                     amarelo      p*/
// Define the line
var priceline = d3.svg.line()
    .x(function(d) { return xL(d["Ano"]); })
    .y(function(d) { return yL(d["Total Florestal(Area Ardida)"]); });
    
// Adds the svg canvas
var svgLine = d3.selectAll("#lineChart")
    .append("svg")
        .attr("width", widthL + marginL.left + marginL.right + 90)
        .attr("height", heightL + marginL.top + marginL.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + marginL.left + "," + marginL.top + ")");

var count= 0;


var data_active= [];
 var dataNest;
var dados = "./data/Distribuição geografica area ardida e ocorrencias.csv"
function redrawLineChart(distrit){

    dataNest.forEach(function(d, i) {

  

               if(d.key==distrit){

                var active   = d.active ? false : true;
                var index = data_active.lastIndexOf(d);



                if(active){
                    if( count < 6){
                        count = count + 1;
                        data_active.push(d);
                        newOpacity =  1;
                    }else { newOpacity = 0; active =false}
                } else{
                        count = count -1 ;
                        data_active.splice(index,1);
                        newOpacity =  0;
                }


                //print do teste
                /*console.log(d3.max(data_active, function(d) {
                    var teste = d.values;

                    return d3.max(teste,function(y){
                        return y["Total(Ocorrencias)"];
                    })
                     
                }));*/

                var ymax = d3.max(data_active, function(d) {
                    var teste = d.values;

                    return d3.max(teste,function(y){
                        return y["Total Florestal(Area Ardida)"];
                    })
                     
                });
                
                //console.log(ymax);

                yL.domain([0, ymax]); 
                /*y.domain([0,100]);*/


                svgLine.selectAll(".y.axis")
                    .transition()
                    .call(yAxisL);
                
                

                data_active.forEach(function(d, i){
                    d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .attr("d", priceline(d.values))
                    .style("opacity", 1);
                })

                
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .attr("d", priceline(d.values))
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active

                d.active = active;
            }
                
                
    });


}
// Get the data
d3.csv("./data/Distribuição geografica area ardida e ocorrencias.csv", function(error, data) {
	dados = data;
	//console.log(data);	
    data.forEach(function(d) {
    	d["Ano"] = +d["Ano"];
		d["Total Florestal(Area Ardida)"] = +d["Total Florestal(Area Ardida)"];
    });

    // Scale the range of the data
    xL.domain(d3.extent(data, function(d) { return d["Ano"]; }));
    

    yL.domain([0,0]); 

    // Nest the entries by symbol
     dataNest = d3.nest()
        .key(function(d) {return d["Distrito"];})
        .entries(data);

    //color = d3.scale.category20();  // set the colour scale

    legendSpace = (600/dataNest.length) -21	; // spacing for legend

    // Loop through each symbol / key
    dataNest.forEach(function(d, i) {

        svgLine.append("path")
            .attr("fill","none")
            .attr("class", "line")
            .style("stroke", function() { // Add dynamically
                return d.color = colorL(d.key); })
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("stroke-width","4px")
            .attr("d", priceline(d.values))
            .style("opacity", 0);

            svgLine.append("text")
            .attr("x", width + (margin.bottom/2) + 350) // spacing
            .attr("y", (legendSpace/2)+(i*legendSpace))
            .attr("class", "legendL")    // style the legend
            .style("fill", function() { // dynamic colours
                return d.color = colorL(d.key); })
            .on("click", function(){
                // Determine if current line is visible 

                   redrawLineChart(d.key);
                
            })
            .text(d.key);
            
                
    });

    // Add the X Axis
    svgLine.append("g")
        .attr("class", "x axis")
        .attr("stroke-width","1.5px")
        .attr("transform", "translate(0," + heightL + ")")
        .call(xAxisL);

    // Add the Y Axis
   svgLine.append("g")
        .attr("class", "y axis")
        .attr("stroke-width","1.5px")
        .call(yAxisL);

    
        // now add titles to the axes
        svgLine.selectAll(".xaxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
         });
    
        // now add titles to the axes
        svgLine.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("width","50")
            .attr("transform", "translate("+ (-30) +","+(-5)+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("área ardida(Ha)");

        svgLine.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (915) +","+(210)+")")  // centre below axis
            .text("anos");
});