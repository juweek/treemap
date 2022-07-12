/*
------------------------------
METHOD: set the size of the canvas, the list of data sources, and the js variables you'll need to access 
------------------------------
*/
const elem = document.getElementById('svganchor');
let margin = { top: 10, right: 10, bottom: 30, left: 30 }
let height = 500 - margin.top - margin.bottom;
let width = 500 - margin.left - margin.right
var svgElement = document.getElementById("treeMapContainer");
var chartElements = document.querySelectorAll(".graph");

let listOfSources = [
    "https://raw.githubusercontent.com/juweek/datasets/main/banana.csv",
    "https://raw.githubusercontent.com/juweek/datasets/main/banana.csv",
    "https://raw.githubusercontent.com/juweek/datasets/main/banana.csv",
];

let listOfColors = [
    ["E18A86", "844440", "FEDF70"],
    ["0E68B0", "fff", "EB7921"],
    ["7A69A1", "fff", "FDBFD6"],
];


/*
------------------------------
METHOD: fetch the data and draw the chart. also call this on browser resize

svg: which svg/html element are you targeting
link: which hyperlink are you using for the data?
count: what count are you on? 
------------------------------
*/
function update(svg, url) {
    d3.csv(url).then(function (data) {

        console.log(data)
        console.log('this is running')

        const root = d3.stratify()
            .id(function (d) { return d.name; })   // Name of the entity (column name is name in csv)
            .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
            (data);
        root.sum(function (d) { return +d.value })   // Compute the numeric value for each entity

        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)

        // use this information to add rectangles:
        svg
            .selectAll("rect")
            .data(root.leaves())
            .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('rx', 7)
            .attr('ry', 7)
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", "#69b3a2");

        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .join("text")
            .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) { return d.data.name })
            .attr("font-size", "15px")
            .attr("fill", "white")
    }).catch(function (error) {
        if (error) throw error;
    });
}

/*
------------------------------
METHOD: go in a loop and connect the maps together
------------------------------
*/

chartElements.forEach((element) => {

    let svg = d3.select(element)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    update(svg, listOfSources[0]);
})