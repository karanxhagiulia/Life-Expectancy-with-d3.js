// Define the dimensions for the SVG container and margins
const margin = { top: 60, right: 20, bottom: 60, left: 300 }; // Increase left margin for labels
const fullWidth = 1000; // Increase the width of the SVG
const fullHeight = 3000; // Increase the height of the SVG
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

// Append the SVG container to the body of the page
const svg = d3.select("#chart")
    .attr("width", fullWidth)
    .attr("height", fullHeight)
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
    const totalHeight = height;

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
            .tickValues(d3.range(40, 91, 10)))
        .selectAll(".tick line")
        .style("display", "none"); // Hide tick lines for the top X-axis

    // Add x-axis at the bottom
    svg.append("g")
        .attr("transform", `translate(0,${totalHeight})`)
        .call(d3.axisBottom(xScale)
            .tickValues(d3.range(40, 91, 10)))
        .selectAll(".tick line")
        .style("display", "none"); // Hide tick lines for the bottom X-axis

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

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll(".tick")
        .classed("location-tick", true) // Add a class to the tick elements for location names
        .selectAll("text")
        .classed("outside", true) // Add the class "outside" to position tick text outside the axis
        .attr("x", -250) // Adjust x coordinate to move text slightly to the left
        .attr("y", yScale.bandwidth() / 8); // Adjust y coordinate to center text vertically

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
    svg.selectAll(".tick text") // Select only the text elements within ticks
        .on("click", function(event, d) {
            const clickedLocation = d3.select(this.parentNode); // Select the parent tick element
            const location = clickedLocation.text();
            const isHighlighted = clickedLocation.classed("highlighted");

            // Remove highlighting and dimming if clicking again on the same location
            if (isHighlighted) {
                clickedLocation.classed("highlighted", false); // Clear highlighting from the clicked location name
                svg.selectAll(".range-bar, .range-start, .range-end, .healthy-text, .life-text, .retirement-age-dot")
                    .classed("dimmed", false); // Remove dimming from all elements
                clickedLocation.classed("bold", false); // Revert bold style to normal
            } else {
                svg.selectAll(".tick").classed("highlighted", false); // Clear all highlighted location names
                clickedLocation.classed("highlighted", true); // Highlight the clicked location name

                // Dim or highlight other elements based on the class
                svg.selectAll(".range-bar, .range-start, .range-end, .healthy-text, .life-text, .retirement-age-dot")
                    .classed("dimmed", function(data) {
                        return data.Location !== location;
                    });

                // Remove bold style from all location names
                svg.selectAll(".tick").classed("bold", false);
                // Add bold style to the clicked location name
                clickedLocation.classed("bold", true);
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
                svg.selectAll(".tick").classed("bold", false); // Revert bold style to normal for all location names
            }
        });

    // Add event listeners for healthy life expectancy dots
    svg.selectAll(".range-start")
        .on("mouseover", function(event, d) {
            const mouseX = event.pageX || event.clientX + document.body.scrollLeft;
            const mouseY = event.pageY || event.clientY + document.body.scrollTop;
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Average Healthy Life Expectancy: " + d3.format(".1f")(d.HealthyLifeExpectancy))
                .style("left", (mouseX) + "px")
                .style("top", (mouseY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add event listeners for life expectancy dots
    svg.selectAll(".range-end")
        .on("mouseover", function(event, d) {
            const mouseX = event.pageX || event.clientX + document.body.scrollLeft;
            const mouseY = event.pageY || event.clientY + document.body.scrollTop;
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Average Life Expectancy: " + d3.format(".1f")(d.LifeExpectancy))
                .style("left", (mouseX) + "px")
                .style("top", (mouseY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Create legend data
    const legendData = [
        { label: "Healthy Life Exp.", class: "range-start" },
        { label: "Life Expectancy", class: "range-end" },
        { label: "Retirement Age", class: "retirement-age-dot" }
    ];

    // Add legend group
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0,-60)`);

    // Add legend elements
    const legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 180}, 0)`)
        .on("click", function(event, d) {
            const selectedClass = d.class;
            const isHighlighted = d3.select(this).classed("highlighted");

            // Remove highlighting and dimming if clicking again on the same legend item
            if (isHighlighted) {
                d3.select(this).classed("highlighted", false); // Remove highlighting
                svg.selectAll(`.${selectedClass}`).classed("dimmed", false); // Remove dimming
            } else {
                // Clear highlighting and dimming for all legend items
                legend.selectAll(".legend-item").classed("highlighted", false);
                svg.selectAll(".range-start, .range-end, .retirement-age-dot").classed("dimmed", true); // Dim all elements

                // Highlight selected legend item
                d3.select(this).classed("highlighted", true);

                // Dim other legend items
                legend.selectAll(".legend-item").filter(item => item.class !== selectedClass).classed("dimmed", true);

                // Highlight corresponding dots
                svg.selectAll(`.${selectedClass}`).classed("dimmed", false);
            }

            // Toggle bold style for legend item text
            d3.select(this).select("text").classed("bold", !isHighlighted);
        });

    // Add legend colored circles
    legendItems.append("circle")
        .attr("cx", function(d) {
            // Calculate the x-coordinate based on the length of the corresponding label
            const labelWidth = this.parentNode.getBBox().width; // Get the width of the parent group containing the text
            const xOffset = labelWidth / 2 + 60; // Adjusted offset for better positioning
            return xOffset;
        })
        .attr("cy", 10)
        .attr("r", 5)
        .attr("fill", function(d) {
            return d.class === "range-start" ? "#66c2ff" : (d.class === "range-end" ? "#001449" : "red");
        });

    // Add legend labels
    legendItems.append("text")
        .attr("x", function(d) {
            // Calculate the x-coordinate based on the length of the corresponding label
            const labelWidth = this.getBBox().width; // Get the width of the text element
            let xOffset = labelWidth + 70; // Adjusted offset for better positioning
            if (d.label === "Life Expectancy" || d.label === "Retirement Age") {
                xOffset += 0; // Additional offset for "Life Expectancy" and "Retirement Age"
            }
            return xOffset;
        })
        .attr("y", 10)
        .attr("dy", "0.350em")
        .text(d => d.label);

    // Add click event handler to legend items
    legendItems.on("click", function(event, d) {
        const selectedClass = d.class;
        const clickedLegendItem = d3.select(this);
        const isHighlighted = clickedLegendItem.classed("highlighted");

        // Toggle highlighting for the clicked legend item
        clickedLegendItem.classed("highlighted", !isHighlighted);

        // Toggle bold style for legend item text
        clickedLegendItem.select("text").classed("bold", !isHighlighted);

        // Update highlighting and dimming based on legend item selection
        if (isHighlighted) {
            // If the legend item was previously highlighted, remove highlighting and dimming
            svg.selectAll(`.${selectedClass}`).classed("dimmed", false);
        } else {
            // If the legend item was not previously highlighted, toggle highlighting for other legend items
            legendItems.classed("highlighted", false); // Clear highlighting from all legend items
            svg.selectAll(".range-start, .range-end, .retirement-age-dot").classed("dimmed", true); // Dim all elements

            // Highlight selected legend item
            clickedLegendItem.classed("highlighted", true);

            // Remove dimming for corresponding elements
            svg.selectAll(`.${selectedClass}`).classed("dimmed", false);
        }

        // Check if the legend item is already highlighted
        if (isHighlighted) {
            // If it is, remove all highlighting and dimming from the chart
            legendItems.classed("highlighted", false); // Clear highlighting from all legend items
            svg.selectAll(".range-start, .range-end, .retirement-age-dot").classed("dimmed", false); // Remove dimming from all elements
        }
    });

    // Select and hide the vertical line for the Y-axis
    svg.select(".tick line")
        .style("display", "none");

    // Hide tick lines for X-axis
    svg.selectAll(".x-axis .tick line")
        .style("display", "none");
/*
// Add event listener to the sort button
document.getElementById("sort-button").addEventListener("click", function() {
    // Sort the data by location alphabetically
    data.sort((a, b) => (a.Location > b.Location) ? 1 : -1);
    
    // Update the yScale domain with sorted locations
    yScale.domain(data.map(d => d.Location));
    
    // Update the y-axis with the new domain
    svg.selectAll(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));
    
    // Move the elements to their new positions based on the sorted data
    svg.selectAll(".row-line")
        .transition()
        .duration(1000)
        .attr("y1", d => yScale(d.Location) + yScale.bandwidth() / 2)
        .attr("y2", d => yScale(d.Location) + yScale.bandwidth() / 2);
    
    // Move the location ticks to their new positions and update the text
    svg.selectAll(".location-tick text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d) + yScale.bandwidth() / 8)
        .text(d => d); // Update the location names
    
    // Move the range bars to their new positions
    svg.selectAll(".range-bar")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.Location) + yScale.bandwidth() / 4);
    
    // Move the range start dots to their new positions
    svg.selectAll(".range-start")
        .transition()
        .duration(1000)
        .attr("cy", d => yScale(d.Location) + yScale.bandwidth() / 2);
    
    // Move the range end dots to their new positions
    svg.selectAll(".range-end")
        .transition()
        .duration(1000)
        .attr("cy", d => yScale(d.Location) + yScale.bandwidth() / 2);
    
    // Move the healthy life expectancy text to their new positions
    svg.selectAll(".healthy-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.Location) + yScale.bandwidth() / 2);
    
    // Move the life expectancy text to their new positions
    svg.selectAll(".life-text")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.Location) + yScale.bandwidth() / 2);
    
    // Move the retirement age dots to their new positions
    svg.selectAll(".retirement-age-dot")
        .transition()
        .duration(1000)
        .attr("cy", d => yScale(d.Location) + yScale.bandwidth() / 2);
});

*/
    
});
