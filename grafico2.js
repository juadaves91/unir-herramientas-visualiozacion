console.log("Ya estamos en D3 :D")
d3.json("https://raw.githubusercontent.com/juadaves91/unir-herramientas-visualiozacion/main/efectos_adversos_notificados_tras_la_administracion_de_la_vacuna_contra_el_coronavirus_en_espan%CC%83a.json").then(function(data) {

    // Declaracion de variables en el ambito actual
    var title = "Efectos adversos notificados tras la administracion de la vacuna contra el coronavirus en España (Ultimos 3 meses 24 anero 2022 - 6 marzo 2022)"; 
    const X = [];
    const Y = [];
    const Periodo = [];
    
    data.forEach((item, index) => {
        X.push(item.ValorDosisAdministrada);
        Y.push(item.ValorReaccionesAdversas);
        Periodo.push(item.Periodo);
    });
    
    var valor_max_y = d3.max(Y, function(d) { return d; });
    var valor_max_x = d3.max(X, function(d) { return d; });

    console.log(X)
    console.log(Y)
        
    var height = 600
    var width = 1350
    
    var margin = {
        top: 60,
        botton: 40,
        left: 40,
        right: 50     
    }
    
    var escalaX = d3.scaleLinear()
        .domain([0, valor_max_x])
        .range([0 + margin.left, width - margin.right])
        
    var escalaY = d3.scaleLinear()
        .domain(d3.extent(data, d=> d.ValorReaccionesAdversas))     
        .range ([height-margin.botton, 0 + margin.top])
    
    var escalaColor = d3.scaleLinear()
        .domain ([0, valor_max_y])
        .range (["green", "yellow"])
    
    var escalatamanio = d3.scaleLinear ()
        .domain (d3.extent(data, d=> d.ValorReaccionesAdversas))
        .range ([8,20])
    
    var elementoSVG = d3.select ("#div_graficos_d3_n2")
        .append ("svg")
        .attr ("width", width)
        .attr ("height", height)
 
    elementoSVG
        .selectAll ("circle")
        .data(data)
        .enter()
        .append("circle")        
        .attr("r", d =>escalatamanio(d.ValorReaccionesAdversas))
        .attr("cx",d => escalaX(d.ValorDosisAdministrada))
        .attr("cy", d=> escalaY(d.ValorReaccionesAdversas))     
        .attr("fill", d => escalaColor(d.ValorReaccionesAdversas))
        .on("mouseover", d => {           
            pintarTooltip(d)
        })
        .on("mouseout", borrarTooltip);
    
    
    var text = elementoSVG.append("g").selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => escalaX(d.ValorDosisAdministrada))
            .attr("y", d=> escalaY(d.ValorReaccionesAdversas))
            .text(function (d) {
                return d.Periodo + " /" + d.Agno;
            }).attr("font-size", "12px");
  
    
    // TOOTLTIP
    var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
    
    function borrarTooltip(){
        tooltip.transition()
                .style("opacity", 0) 
    }
    
    function pintarTooltip(d){
        tooltip.text('Nro.Dosis administradas: ' + d.ValorDosisAdministrada + ", Nro.Reacciones adversas: " + d.ValorReaccionesAdversas + ', Fecha corte: ' + d.Periodo + " /" + d.Agno)
        .style("top", d3.event.pageY + "px") //DONDE SE EFECTUA EL EVENTO
        .style("left", d3.event.pageX + "px") //DONDE SE EFECTUA EL EVENTO
        .transition()
        .style("opacity", 1)        
    }
    
    //// EJES    
    var ejeY = d3.axisLeft (escalaY)
    
    // PINTAR EJE Y
    elementoSVG
        .append("g")
        .attr ("transform", "translate (" + margin.left + ",0)")
        .call (ejeY)
    
    /// VISUALIZAMOS EJE X
    var ejeX = d3.axisBottom (escalaX) 
        .ticks(10)
        .tickFormat (d3.format(".3s"))
       
    // PINTAR eje X
    elementoSVG
        .append("g")
        .attr ("transform", "translate (0," + (height - margin.botton/2) + ")")
        .text("Nro. Reacciones adversas")
        .call (ejeX)
        
})