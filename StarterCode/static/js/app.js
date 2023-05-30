//get the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//fetch the json data and console log it
d3.json(url).then(function (data) {
    console.log(data);
    names = data.names
    let dropdown = d3.select("#selDataset");

    names.forEach((id) => {
        dropdown
            .append("option")
            .text(id)
            .property("value", id);
    });

    buildmetadata(names[0])
    buildCharts(names[0])
});

function buildmetadata(id) {
    d3.json(url).then(function (data) {
        console.log(data);
        metadata = data.metadata
        let box = d3.select("#sample-metadata");

        let resultArray = metadata.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];

        box.html("")

        Object.keys(result).forEach((key) => {
            // box.append("h6").text(key.toUpperCase() + ":" + result[key]);
            box.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
        });

    });
}

function optionChanged(id) {
    buildmetadata(id)
    buildCharts(id)
}

function buildCharts(id) {
    d3.json(url).then(function (data) {
        samples = data.samples

        let resultArray = samples.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let barData = [
            {
              y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",
            }
          ];

          let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
          };

        Plotly.newPlot("bar", barData, barLayout);

        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
          };
          
          let bubbleData = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
              }
            }
          ];
      
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}