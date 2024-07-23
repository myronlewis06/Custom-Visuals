async function draw(el,scale) {
  // Data
  const dataset = await d3.json('data.json')
  dataset.sort((a,b) => a-b)  //sorts in ascending

  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
  };

  const box =30
  //box is created inside the dimensions, in this case since height is 150, 150/30 = 5 boxes in rows and 600/30 = 20 boxes in columns  so 20*5 =100 squares are created 

  // Draw Image
  const svg = d3.select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  //scales
  let colorScale;
  if (scale==='linear'){
    colorScale =d3.scaleLinear()
      .domain(d3.extent(dataset))
      .range(['white','red'])
  } else if (scale === 'quantize') {
    colorScale =d3.scaleQuantize()
    .domain(d3.extent(dataset))
    .range(['white','pink','red'])
    //console.log('Quantize' ,colorScale.thresholds()) -- gives the threshold
  } 
  else if (scale === 'quantile') {
    colorScale =d3.scaleQuantile()
    .domain(dataset)
    .range(['white','pink','red'])
  } 
  else if (scale === 'threshold') {
    colorScale =d3.scaleThreshold()
    .domain([45200,135600])
    .range(d3.schemeReds[3]) //using built in color scheme by d3 video 45
  }

  //draw rectangle
  //attributes here are added to the group. we can also add it to the rectangle
  svg.append('g')
    .attr('transform','translate(2,2)')
    .attr('stroke','black')
    .selectAll('rect')
    .data(dataset)
    .join('rect')
    .attr('width',box-3)
    .attr('height',box-3)
    .attr('x',(d,i)=>box * (i % 20))
    .attr('y',(d,i)=>box * ((i/20)|0))  //bitwise operator works like math.floor where if i =1 1/20 will be equal to 0 and 21/20 will be equal to 1
    .attr('fill', (d) => colorScale(d))
    
    

}

draw('#heatmap1','linear')

draw('#heatmap2','quantize')

draw('#heatmap3','quantile')

draw('#heatmap4','threshold')