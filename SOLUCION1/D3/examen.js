d3.json ("juan_david_escobar.json").then (function (data){
        
  
    
    // Obtener datos
    var datos = data.alumnos;
    console.log(datos)            
    window.mivariableglobal = datos;
    
    console.log ("Ya he cargado correctamente los datos")
    
    // Definir variables 
    var height = 400
    var width = 900
    
    // Definir limites para las margenes arriba, abajo, izquierda y derecha
    var margin = {
        top: 60,
        botton: 40,
        left: 40,
        right: 50     
    }
    
    // Definir escalas
    var escalaX = d3.scaleLinear()
        .domain ([0, 450])
        .range ([0 + margin.left, width - margin.right])
    
    var escalaY = d3.scaleLinear()
        .domain (d3.extent(datos, d=> d.nota))
        .range ([height-margin.botton, 0 + margin.top])
    
    var escalaColor = d3.scaleLinear()
        .domain ([10,0])
        .range (["green", "red"])
    
    var escalatamanio = d3.scaleLinear ()
        //.domain (d3.extent(datos, d=> d.nota))
        .domain ([10,0])
        .range ([18, 4])
    
    var elementoSVG = d3.select("#div_graficos_d3_n1")
        .append ("svg")
        .attr ("width", width)
        .attr ("height", height)
    
    // Contruir Tootip dinámicamente.
    var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
    
    function borrarTooltip(){
        tooltip.transition()
                .style("opacity", 0) 
    }
    
    function pintarTooltip(d){
        tooltip.text("Alumno: " + d.alumno + ", Ranking: " + d.nota)
        .style("top", d3.event.pageY + "px") //DONDE SE EFECTUA EL EVENTO
        .style("left", d3.event.pageX + "px") //DONDE SE EFECTUA EL EVENTO
        .transition()
        .style("opacity", 1)        
    }
    
    // Crear elemento SVG
    elementoSVG
        .selectAll ("circle")
        .data(datos)
        .enter()
        .append ("circle")
        .attr ("r", d =>escalatamanio(d.nota))
        .attr("cx",d => escalaX(d.ranking))
        .attr("cy", d=> escalaY(d.nota))
        .attr("fill", d => escalaColor(d.nota))
        // LLAMA LA FUNCION PARA EVENTO OVER O OUT
        .on("mouseover", d => {           
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
        .delay(500)  // Demora el inicio de la animacion   
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
        .transition()
        .duration(5000) 
        .ease(d3.easeBounce)
        .call (ejeX)    
})