// Define the dimensions for the SVG container and margins
const margin = { top: 60, right: 20, bottom: 60, left: 180 };
const width = 800 - margin.left - margin.right;
const height = 2800 - margin.top - margin.bottom;

// Append the SVG container to the body of the page
const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Define tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Read the CSV file
d3.csv("FinalDataCleaned.csv").then(function(data) {
    // Convert strings to numbers
    data.forEach(function(d) {
        console.log("Retirement Age for " + d.Location + ":", d.RetirementAge);
        d.HealthyLifeExpectancy = +d.HealthyLifeExpectancy;
        d.LifeExpectancy = +d.LifeExpectancy;
        d.RetirementAge = +d.RetirementAge; // Convert retirement age to number
    });


    // Create scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([40, 90]) // Age range
        .range([0, width]);

    // Calculate the total height available for the chart area
    const totalHeight = height + margin.top + margin.bottom - 50;

    // Determine the height per data point
    const heightPerDataPoint = totalHeight / data.length;

    // Update the yScale range and padding
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.Location))
        .range([0, totalHeight])
        .padding(0.3); // Increase the padding between rows

    // Add horizontal lines for each row
    svg.selectAll(".row-line")
        .data(data)
        .enter().append("line")
        .attr("class", "row-line")
        .attr("x1", 0)
        .attr("y1", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("x2", width)
        .attr("y2", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("stroke", "#f0f0f0") // Very light gray color for the lines
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2"); // Dotted line style

    // Add x-axis at the top
    svg.append("g")
        .attr("transform", `translate(0,0)`)
        .call(d3.axisTop(xScale)
            .tickValues(d3.range(40, 91, 10))); // Adjust tick values for every 10 years

    // Add vertical lines for each 10 years of age
    svg.selectAll(".vertical-line")
        .data(d3.range(40, 91, 10))
        .enter().append("line")
        .attr("class", "vertical-line")
        .attr("x1", d => xScale(d))
        .attr("y1", 0)
        .attr("x2", d => xScale(d))
        .attr("y2", totalHeight)
        .attr("stroke", "#ddd") // Light gray color for the lines
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2"); // Dotted line style

    // Add x-axis at the bottom
    svg.append("g")
        .attr("transform", `translate(0,${totalHeight})`)
        .call(d3.axisBottom(xScale)
            .tickValues(d3.range(40, 91, 10))); // Adjust tick values for every 10 years

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Create range bars
    svg.selectAll(".range-bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "range-bar")
        .attr("x", d => xScale(d.HealthyLifeExpectancy))
        .attr("y", d => yScale(d.Location) + yScale.bandwidth() / 4) // Adjust y position
        .attr("width", d => xScale(d.LifeExpectancy) - xScale(d.HealthyLifeExpectancy))
        .attr("height", yScale.bandwidth() / 2) // Adjust height
        .attr("fill", "#dddddd");

    // Create dots for range start
    svg.selectAll(".range-start")
        .data(data)
        .enter().append("circle")
        .attr("class", "range-start")
        .attr("cx", d => xScale(d.HealthyLifeExpectancy))
        .attr("cy", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("r", 5)
        .attr("fill", "#66c2ff"); // Light blue color for healthy life expectancy dots

    // Create dots for range end
    svg.selectAll(".range-end")
        .data(data)
        .enter().append("circle")
        .attr("class", "range-end")
        .attr("cx", d => xScale(d.LifeExpectancy))
        .attr("cy", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("r", 5)
        .attr("fill", "#001449"); // Dark blue color for life expectancy dots

    // Add healthy life expectancy text
    svg.selectAll(".healthy-text")
        .data(data)
        .enter().append("text")
        .attr("class", "healthy-text")
        .attr("x", d => xScale(d.HealthyLifeExpectancy) - 10) // Adjust position to the left
        .attr("y", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end") // Anchor to end
        .text(d => d3.format(".1f")(d.HealthyLifeExpectancy)); // Format to one decimal place

    // Add life expectancy text
    svg.selectAll(".life-text")
        .data(data)
        .enter().append("text")
        .attr("class", "life-text")
        .attr("x", d => xScale(d.LifeExpectancy) + 10) // Adjust position to the right
        .attr("y", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start") // Anchor to start
        .text(d => d3.format(".1f")(d.LifeExpectancy)); // Format to one decimal place


    // Add red dots for retirement age
    svg.selectAll(".retirement-age-dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "retirement-age-dot")
    .attr("cx", d => xScale(d.RetirementAge))
    .attr("cy", d => yScale(d.Location) + yScale.bandwidth() / 2)
    .attr("r", 5)
    .attr("fill", "red") // Red color for retirement age dots
    // Add event listeners to show tooltip on hover
    .on("mouseover", function(event, d) {
        const mouseX = event.pageX || event.clientX + document.body.scrollLeft;
        const mouseY = event.pageY || event.clientY + document.body.scrollTop;
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Average Retirement Age: " + d3.format(".1f")(d.RetirementAge))
            .style("left", (mouseX) + "px")
            .style("top", (mouseY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Add event listeners to y-axis location names for highlighting
svg.selectAll(".tick")
    .on("click", function(event, d) {
        const clickedLocation = d3.select(this);
        const location = clickedLocation.text();
        const isHighlighted = clickedLocation.classed("highlighted");
        
        // Remove highlighting and dimming if clicking again on the same location
        if (isHighlighted) {
            svg.selectAll(".tick").classed("highlighted", false); // Clear all highlighted location names
            svg.selectAll(".range-bar, .range-start, .range-end, .healthy-text, .life-text, .retirement-age-dot")
                .classed("dimmed", false); // Remove dimming from all elements
        } else {
            svg.selectAll(".tick").classed("highlighted", false); // Clear all highlighted location names
            clickedLocation.classed("highlighted", true); // Highlight the clicked location name
            
            // Dim or highlight other elements based on the class
            svg.selectAll(".range-bar, .range-start, .range-end, .healthy-text, .life-text, .retirement-age-dot")
                .classed("dimmed", function(data) {
                    return data.Location !== location;
                });
        }
    });

// Add event listener to the body to remove highlighting and dimming when clicking outside the visualization
d3.select("body")
    .on("click", function(event) {
        const clickedElement = d3.event.target;
        const isOutsideViz = !clickedElement.closest("#chart");

        if (isOutsideViz) {
            svg.selectAll(".tick").classed("highlighted", false); // Clear all highlighted location names
            svg.selectAll(".range-bar, .range-start, .range-end, .healthy-text, .life-text, .retirement-age-dot")
                .classed("dimmed", false); // Remove dimming from all elements
        }
    });





    
});
