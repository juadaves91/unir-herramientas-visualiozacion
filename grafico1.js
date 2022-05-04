console.log("Ya estamos en D3 :D")
d3.json("https://raw.githubusercontent.com/juadaves91/unir-herramientas-visualiozacion/main/muertos_por_coronavirus_en_espa%C3%B1a_los_ultimos_120_dias_segun_fecha_de_defuncion.json").then(function(data) {

    // Declaracion de variables en el ambito actual
    var title = "Muertos por coronavirus en España los ultimos 120 días según la fecha de definición"; 
    const X = [];
    const Y = [];
    data.forEach((item, index) => {
        X.push(item.Periodo);
        Y.push(item.Valor);
    });

    console.log(X)
    console.log(Y)
    var valor_max_y = d3.max(Y, function(d) { return d; });

    var margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 40
        },
        width = 1350 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // EJES FORMATO FECHA EJE - Y    
    var crearFecha = function(periodo, agno){
                
        per = periodo.replaceAll(' ', '');
        per = per.split("de");
        dia = per[0];        
        dia = dia.replace('dic', '12')
                 .replace('ene', '01')
                 .replace('feb', '02')
                 .replace('mar', '03');
        mes = per[1];        
        
        periodo_formated = dia + "-" + mes + "-" + agno;
        
        return periodo_formated;
    }
    
    data.forEach(function(d){   
        console.log(crearFecha(d.Periodo, d.Agno))
        d.Periodo = crearFecha(d.Periodo, d.Agno);
    })
    
    console.log('data: ', data);
    
    // EJES 
    var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.5); // scaleBand se utiliza para variables cualitativos, paddingInner se aplica para que las barras no queden pegadas.
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x); //Orientación de los ticks del eje X = Bottom       

    var yAxis = d3.axisLeft(y); //Orientación de los ticks del eje X = Left       

    
    x.domain(data.map(function(d) {
        return d.Periodo; // La funcion map recorre y retorna los valores de Periodo del dataset 
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.Valor; // Obtiene el valor maximo del atributo Valor 
    })]);    
   
    
    // ESCALA DE COLORES PARA LAS BARRAS
    var escalaColor = d3.scaleLinear()
        .domain ([0, valor_max_y])
        .range (["yellow", "red"])  
    
    // TOOTLTIP
    var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
    
    function borrarTooltip(){
        tooltip.transition()
                .style("opacity", 0) 
    }
    
    function pintarTooltip(d){
        tooltip.text('Nro. Fallecidos: ' + d.Valor + ", Periodo: " + d.Periodo)
        .style("top", d3.event.pageY + "px") //DONDE SE EFECTUA EL EVENTO
        .style("left", d3.event.pageX + "px") //DONDE SE EFECTUA EL EVENTO
        .transition()
        .style("opacity", 1)        
    }

    // SVG
    var svg = d3.select("#div_graficos_d3_n1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
   
    // CONFIGURACION SVG
    svg.append("g")
        .attr("class", "x axis") // Selecciona al eje x
        .attr("transform", "translate(0, " + height + ")")
        .transition()
        .duration(3000)
        .ease(d3.easeBounce) // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe (ANIMACIONES D3)
        .delay(500) // Demora el inicio de la animacion   
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end") //end
        .style("transform-origin", "2px 6px")  //  -4px 38px
        .attr("dx", "-.2em")
        .attr("dy", "-.50em")
        .attr("transform", "rotate(-90)"); //45
        
        
    svg.append("g")
        .attr("class", "y axis") // Selecciona al eje y
        .call(yAxis)
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".41em")
        .style("text-anchor", "end")        
        .text("Nro. Fallecidos");

    svg.selectAll("bar") // Selecciona todas las barras del SVG
        .data(data) // Agrega la data
        .enter()
        .append("rect") // Se agrega una figura tipo rectangulo en funcion de los datos
        .attr("x", function(d) {
            return x(d.Periodo);
        })    
        .attr("width", x.bandwidth())
        .attr("y", function(d) {
            return y(d.Valor);
        })
        .attr("height", function(d) {
            return height - y(d.Valor); // Altura menos el valor actual de Y, la altura se mide de arriba hacia abajo, por lo cual se resta el valor de la barra. 
        })
        .style("fill", d => escalaColor(d.Valor))
        .on("mouseover", d => {           
            pintarTooltip(d)
        })
        .on("mouseout", borrarTooltip);

})