

        var dados;

        var linha=[];
        var tipS;
        var ano_select= 2014;
        var svgS;
        var distrito_select="Aveiro";
            var margins = {
                top: 12,
                left: 200,
                right: 24,
                bottom: 24
                },
            legendPanel = {
                width: 240
            },
            widthS = 1000 - margins.left - margins.right - legendPanel.width,
            heightS = 110 - margins.top - margins.bottom
        d3.csv("./data/Distribuição geografica area ardida e ocorrencias.csv", function(error, data) {
          dados = data;
            svgS = d3.select('#Stackedbarchart')
            .append('svg')
                .attr('width', widthS + margins.left + margins.right + legendPanel.width)
                .attr('height', heightS + margins.top + margins.bottom)
            .append('g')
                .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

                tipS = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-15, -7])
                  .html(function(d) {
                   return "Área ardida: <span style='color:red'>" + d[0].x + "</span>";
                  
                  });
svgS.call(tipS);
          //updateStackedBarChart();
        });
        function removeTextLegend(){
             svgS.selectAll('text').remove();
        }
        function updateStackedBarChart(distrito_select){


             dados.forEach(function(d) {
            if(d["Ano"] == year && d["Distrito"] == distrito_select ){
                d["Matos(Area Ardida)"]= + d["Matos(Area Ardida)"];
                d["Povoamentos(Area Ardida)"]= +d["Povoamentos(Area Ardida)"];
              linha = d;
                
              }
            });
   
          var  dataset = [
                {
                    data: [
                        { month: 'Aug', count: linha["Matos(Area Ardida)"] },
                    ],
                    name: 'Matos'
                },
                {
                    data: [
                        { month: 'Aug', count: linha["Povoamentos(Area Ardida)"] },
                    ],
                    name: 'Povoamentos'
                }

            ],
            series = dataset.map(function(d) { return d.name; }),
            dataset = dataset.map(function(d) {
                return d.data.map(function(o, i) {
                    // Structure it so that your numeric
                    // axis (the stacked amount) is y
                    return {
                        y: o.count,
                        x: o.month
                    };
                });
            }),
            stack = d3.layout.stack();

        stack(dataset);

        var dataset = dataset.map(function(group) {
            return group.map(function(d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0
                };
            });
        });
       
       var xMax = d3.max(dataset, function(group) {
            return d3.max(group, function(d) {
                aux= d.x + d.x0;
               
                return aux;
            });
        });
    var    xScale = d3.scale.linear()
            .domain([0, xMax])
            .range([0, widthS]);
    var    months = dataset[0].map(function(d) { return d.y; });
     var   yScale = d3.scale.ordinal()
            .domain([1,2])
            .rangeRoundBands([0, heightS], .1);
     var   xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
     var   yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');
       var colours = d3.scale.ordinal().range(["#8dd3c7","#fb8072"]);
               // svgS.selectAll('rect').remove();
    
            svgS.selectAll('.bar').remove();
             svgS.selectAll('.bar')
              .data(dataset)
            .enter()
            .append('rect')
             .text(function(d) {
                return "55";
           })
            .attr("font-family", "sans-serif")
           .attr("font-size", "11px")
            .attr('x', function(d) {  return xScale(d[0].x0); })
            .attr('y', function(d, i) {  return yScale(d[0].y); })
            .attr('height', function(d) { return yScale.rangeBand(); })
            .attr('width', function(d) { return xScale(d[0].x); })
            .style('fill', function(d, i) {
                return colours(i);
            })
            .on("mouseover", function(d){ tipS.show(d);}).on("mouseout", function(d){tipS.hide(d);});
                   
     

       
         if(DistritoClicado){

            series.forEach(function(s, i) {
                svgS.append('text')
                    .attr('fill', 'black')
                    .attr('x', 720 )
                    .attr('y', i * 24 + 24 -15)
                    .text(s);

                svgS.append('rect')
                    .attr('fill', colours(i))
                    .attr('width', 60)
                    .attr('height', 20)
                    .attr('x', 650)
                    .attr('y', i * 24 + 6 - 10);
            });


        }

    }