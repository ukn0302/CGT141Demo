document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("#network2");
    svg.selectAll("*").remove();
  
    const width = +svg.attr("width");
    const height = +svg.attr("height");
  
    const nodes = [
      { id: "Environment", idea: "Recycle leftover peels machine", color: "lightgreen" },
      { id: "F&B", idea: "Garden theme restaurant", color: "pink" },
      { id: "Technology", idea: "Ramen-making robot", color: "lightsteelblue" },
    ];
  
    const links = [
      { source: "Environment", target: "Technology" },
      { source: "F&B", target: "Environment" },
      { source: "Technology", target: "F&B" },
    ];
  
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));
  
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#bbb")
      .attr("stroke-width", 2);
  
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );
  
    const shapePath = `
    M 0 30 
    q 80 5 74 -70
    q 2 70 80 70
    q -84 -10 -80 70.9
    q 5 -80 -70 -70
    Z
    `;
    

  node.append("path")
    .attr("d", shapePath)
    .attr("fill", d => d.color)
    .attr("transform", "translate (-30, -10) scale(0.4)");

  
    node.append("text")
      .text(d => d.idea)
      .attr("text-anchor", "middle")
      .attr("dy", -40) 
      .style("fill", "white")
      .style("font-size", "10px")
      .style("font-weight", "bold");
  
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });
  
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
  
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  });
  



  
  