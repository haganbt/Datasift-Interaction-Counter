$(document).ready(function() {
	var InteractionCounter = (function() {
	
		var socket = io.connect('http://localhost:8080');
		var countTotal = 1;
		
		var n = 243,
		    duration = 750,
		    now = new Date(Date.now() - duration), //is set to 0.75 seconds behind now
		    count = 0,
		    data = d3.range(n).map(function() { return 0; }); // Create an empty data set e.g. 0,0,0,0, etc
		
		var margin = {top: 6, right: 0, bottom: 20, left: 50},
		    width = 600 - margin.right,
		    height = 400 - margin.top - margin.bottom;
		
		// X axis
		var x = d3.time.scale()
		    .domain([now - (n - 2) * duration, now - duration])  // current time - .75 s  - (486) * 750, current time
		    .range([0, width]);
		
		// Y axis
		var y = d3.scale.linear()
		    .range([height, 0]);
		
		var line = d3.svg.line()
		    .interpolate("basis")
		    .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
		    .y(function(d, i) { return y(d); });

		
		var svg = d3.select("#interactions").append("p").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .style("margin-left", -margin.left + "px")
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("defs").append("clipPath")
		    .attr("id", "clip")
		  .append("rect")
		    .attr("width", width)
		    .attr("height", height);
		
		// X Axis
		var axis = svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
	
		// Y Axis
		var yaxsis = svg.append("g")
	      .attr("class", "y axis")
	      .call(d3.svg.axis().scale(y).ticks(10).orient("left"));
	      	
		// Line
		var path = svg.append("g")
		    .attr("clip-path", "url(#clip)")
		  .append("path")
		    .data([data])
		    .attr("class", "line");
	      
		// Y axis label
		yaxsis.append("text")
		    .attr("transform", "rotate(-90),translate(-250,-40)")
		    .text("Interactions Per Second");
		
			
		this.tick = (function() {

		  	// update the domains
		  	now = new Date();
		  	
		  	// your data minimum and maximum e.g. domain([0, 20]) 
		  	//  now - 0.75 seconds - (245) * 750
		  	x.domain([now - (n - 2) * duration, now - duration]);
		  
		  	y.domain([0, d3.max(data)]);
	
		  	// push the accumulated count onto the back, and reset the count
		  	data.push(Math.min(100, count));
		 
		  	count = 0;
		
		  	// redraw the line
		  	svg.select(".line")
		      	.attr("d", line)
		      	.attr("transform", null);
		
		  	// slide the x-axis left
		  	axis.transition()
		      	.duration(duration)
		      	.ease("linear")
		      	.call(x.axis);
		
		  	// slide the line left
		  	path.transition()
		  		.duration(duration)
		      	.ease("linear")
		      	.attr("transform", "translate(" + x(now - (n - 1) * duration) + ")")
		      	.each("end", tick);
		
			// Y Axis
			yaxsis.transition()
		 		.attr("class", "y axis")
	      		.ease("linear")
	      		.call(d3.svg.axis().scale(y).ticks(10).orient("left"));
		
		  	// pop the old data point off the front
		  	data.shift();
		
		})
	
		this.tick();

		socket.on('data', function(streamData) {
	
			$('#countTotal').html(countTotal++);
			if(streamData.source.interaction.id != undefined)
			{
				++count;
			}
		});	
	})(); 

});