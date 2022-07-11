console.log ("Ya estamos otra vez en D3")
d3.json ("https://gist.githubusercontent.com/double-thinker/817b155fd4fa5fc865f7b32007bd8744/raw/13068b32f82cc690fb352f405c69c156529ca464/partidos2.json").then (function (datosCompletos){
    
    
    // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe (ANIMACIONES D3)
    // https://observablehq.com/@d3/easing-animations  (TOOLTIP)   
    
    var datosPartidos = datosCompletos.partidos;
    
    datos = datosPartidos;
    
    window.mivariableglobal = datosCompletos;
    
    console.log ("Ya he cargado correctamente los datos")
    
    var height = 700
    var width = 500
    
    var margin = {
        top: 60,
        botton: 40,
        left: 40,
        right: 50     
    }
    
    var escalaX = d3.scaleLinear()
        .domain ([0,10])
        //.range (["25","475"])
        .range ([0 + margin.left, width - margin.right])
    
    var escalaY = d3.scaleLinear()
        .domain (d3.extent(datos, d=> d.votantes))
        //.range (["700","0"])
        //  .range (["675","25"])
        .range ([height-margin.botton, 0 + margin.top])
    
    var escalaColor = d3.scaleLinear()
        .domain ([0,10])
        .range (["blue", "red"])
    
    var escalatamanio = d3.scaleLinear ()
        .domain (d3.extent(datos, d=> d.votantes))
        .range ([8,30])
    
    var elementoSVG = d3.select ("body")
        .append ("svg")
        .attr ("width", width)
        .attr ("height", height)

    var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
    
    function borrarTooltip(){
        tooltip.transition()
                .style("opacity", 0) 
    }
    
    function pintarTooltip(d){
        tooltip.text(d.partido + "-*-" + d.mediaAutoubicacion)
        .style("top", d3.event.pageY + "px") //DONDE SE EFECTUA EL EVENTO
        .style("left", d3.event.pageX + "px") //DONDE SE EFECTUA EL EVENTO
        .transition()
        .style("opacity", 1)        
    }
    
    elementoSVG
        .selectAll ("circle")
        .data(datos)
        .enter()
        .append ("circle")
        
        // .attr("r",15)
        .attr ("r", d =>escalatamanio(d.votantes))
    
        //.attr ("cx", d=>d.mediaAutoubicacion)
        .attr("cx",d => escalaX(d.mediaAutoubicacion))
        .attr("cy", d=> escalaY(d.votantes))
        //.attr("fill", "red")
        .attr("fill", d => escalaColor(d.mediaAutoubicacion))
        // LLAMA LA FUNCION PARA EVENTO OVER O OUT
        .on("mouseover", d => {
            //pintarHistograma(d.partido)
            pintarTooltip(d)
        })
        .on("mouseout", borrarTooltip)
    
        
    //// EJES
    // VISUALIZAMOS EJE Y
    var ejeY = d3.axisLeft (escalaY)
    
    // PINTAR eje y
    elementoSVG
        .append("g")
        .attr ("transform", "translate (" + margin.left + ",0)")
        .transition()
        .duration(3000)
        .ease(d3.easeBounce) // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe (ANIMACIONES D3)
        .delay(500) // Demora el inicio de la animacion    
        .call (ejeY)
    
    
    /// VISUALIZAMOS EJE X
    var ejeX = d3.axisBottom (escalaX)
    // PONER TICKS
        .ticks (5)
        .tickFormat (d3.format(".3s"))
    
    // PINTAR eje X
    elementoSVG
        .append("g")
        .attr ("transform", "translate (0," + (height - margin.botton/2) + ")")
        .call (ejeX)
    
    //// EJES
    
    /// ANIMACIONES
    
    
    
    
    
})