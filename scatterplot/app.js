async function draw() {
  //get data
  const dataset = await d3.json('data.json')

  //Accessor function
  const xAccessor = (d) => d.currently.humidity
  const yAccessor = (d) => d.currently.apparentTemperature

  //dimensions
  let dimensions = {
    width :800,
    height:800,
    margin: {
      top :50,
      bottom:50,
      left:50,
      right:50
    }
  }

  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

  dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  //draw image
  const svg = d3.select('#chart')
  //append creates an element and then inserting the element in the current selection
    .append('svg')
    // .attr('viewBox',`0 0 800 800`)
    .attr('width',dimensions.width)
    .attr('height',dimensions.height)
  
    //create a container inside a container so that the image is not cropped
    //there is a element in svg called g (group). g does not draw a shape like svg. the purpose of g is to group shapes together. it can apply properties directly to the g element. g does not support x and y attributes. hence the alternative way to move g element is by using transform attribute similar to css attribute. NOTE: g element is orignally postioned at the origin 0,0
    //`` is called template string
  const ctr = svg.append('g')
    .attr('transform',`translate(${dimensions.margin.left},${dimensions.margin.top})`)
  //tooltip
  const tooltip =d3.select('#tooltip')

  //create scales 
  //d3.extent function takes in the minimum and maximum value from the data
  const xScale =d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .rangeRound([0,dimensions.ctrWidth])
    .clamp(true)

  const yScale =d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    //video 33 explaination to why dimesnions.ctrHeight is coming first then 0
    .rangeRound([dimensions.ctrHeight,0])
    .nice()
    .clamp(true)
    //nice removes decimal values from the domain. it only applies to the domain
    //rangeRound only applies to the output range
    //clamp -will force the scale functions not to transform values outside the range of the output

  //draw circles
  ctr.selectAll('circle')
    .data(dataset)
    .join('circle')
    //accessor function is a fucntion that access a property in the object. this helps the circle get its position in scatterplot based on data
    .attr('cx', d =>xScale(xAccessor(d)))
    .attr('cy', d =>yScale(yAccessor(d)))
    .attr('r',5) 
    .attr('fill','red')
    .attr('data-temp',yAccessor)
    .on('mouseenter',function(event,datum){
      d3.select(this)
        .attr('fill', '#120078')
        .attr('r',8)

      const formatter =d3.format('.2f')
      const dateFormatter = d3.timeFormat('%B %-d, %Y')
      
      tooltip.style('display','block')
        .style('top',yScale(yAccessor(datum))-45 + "px")
        .style('left',xScale(xAccessor(datum))+ "px")

      tooltip.select('.metric-humidity span')
        .text(formatter(xAccessor(datum)))
      
      tooltip.select('.metric-temp span')
        .text(formatter(yAccessor(datum)))
      
      tooltip.select('.metric-date')
        .text(dateFormatter(datum.currently.time *1000))
     
    })
    .on('mouseleave',function(event){
      d3.select(this)
        .attr('fill','red')
        .attr('r',5)

      tooltip.style('display','none')
    })

  //Xaxis
  const xAxis =d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat((d) => d*100 + '%')
    //.tickValues([0.2,0.4,0.6,0.8,1])


  const xAxisGroup = ctr.append('g')
    .call(xAxis)
    .style('transform',`translateY(${dimensions.ctrHeight}px)`)
    .classed('axis',true)
      //adding text in svg element 
  xAxisGroup.append('text')
    .attr('x',dimensions.ctrWidth/2)
    .attr('y',dimensions.margin.bottom -10)
    .attr('fill','black')
    .text('Humidity')

  //y axis
  const yAxis =d3.axisLeft(yScale)

  const yAxisGroup = ctr.append('g')
    .call(yAxis)
    .classed('axis',true)

  yAxisGroup.append('text')
    .attr('x',-dimensions.ctrHeight/2)
    .attr('y',-dimensions.margin.left + 15)
    .attr('fill','black')
    .html('Temperature &deg; F')
    .style ('transform','rotate(270deg)')
    .style('text-anchor','middle')   

  const delaunay =d3.Delaunay.from(
    dataset,
    (d)=>xScale(xAccessor(d)),
    (d)=>yScale(yAccessor(d))
  )
  
}

draw()

