console.log("Ya estamos en D3")

d3.json("https://output.jsbin.com/lixujex/1.js").then(function(datos)
{
    console.log(datos)
    
    // PINTAR CIRCULOS A ESCALAS
    
    var height = 700 
    var width = 800    
    
    var margin = {
        top: 60,
        botton: 40,
        left: 40,
        right: 50        
    }
    
    // DEFINIR ESCALA TAMAÑO TEXTO (dominio numero de valores distiontos posibles y rango 
    // o aquellos valores que se acercan a 3000 les asigna un tamaño de 50px y los 
    // que se aproximan a 0 les asigna 6px)
    var escalaX = d3.scaleLinear()
        .domain([0, 10])
        .range([0 + margin.left, width - margin.right])
    
    var escalaY = d3.scaleLinear()
        .domain(d3.extent(datos, d=> d.votantes))
        .range(["675", "25"])
    
    var escalaColor = d3.scaleLinear()
        .domain([0, 10])
        .range(["red", "blue"])
    
    var escalatamanio = d3.scaleLinear()
        .domain(d3.extent(datos, d=> d.votantes))
        .range([8, 30])

    var elementoSVG = d3.select("body")
     .append("svg")
     .attr("width", width)
     .attr("height", height)
     .selectAll("circle")
     .data(datos)
     .enter()
     .append("circle")
     //.attr("r", 15)
    
     .attr("r", d => escalatamanio(d.votantes))
     //.attr("cx", d => d.mediaAutoubicacion)
     //.attr("cy", d => d.votantes)
     .attr("cx", d => escalaX(d.mediaAutoubicacion))
     .attr("cy", d => escalaY(d.votantes))
    
     .attr("fill", d => escalaColor(d.mediaAutoubicacion))
    
    
    // PINTAR PLANO CARTESIANO (https://github.com/d3/d3-axis VERRRRRRRR)...........OJOOOO
    
    // axisLeft, nos dice hacia a donde apuntan los palitos de cada punto (vertical left -)
    // en los ejes, esta no es la posicion del eje
    var ejeY = d3.axisLeft(escalaY)
    
    // Pintar eje y
    elementoSVG
        .append("g") // Definir el grupo
        .attr("transform", "translate (" + margin.left + ",0)")   //margin.left = 40px moviendo a la derecha el eje
        .call(ejeY) // Pinta el eje con la escala de los numeros de Y
    
    // axisLeft, nos dice hacia a donde apuntan los palitos de cada punto (hacia abajo bottom |)
    // en los ejes, esta no es la posicion del eje
    var ejeX = d3.axisBottom(escalaX) // Escala para distribuir los circulos en el eje de las X
        .ticks(8) // Determina cuantos ticks quiero utilizar // poner ticks
        .tickFormat(d3.format(".3s")) // 
    
    
    // Pintar eje x
    elementoSVG
        .append("g") // Definir el grupo
        .attr("transform", "translate (0, " + (height - margin.botton/2) + ")" )   //margin.left = 40px moviendo a la derecha el eje
        .call(ejeX) // Pinta el eje con la escala de los numeros de X
   
    
})