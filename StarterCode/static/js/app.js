var sampleUrl = "/StarterCode/data/samples.json"
var metadataPanel;
var selector;

function buildMetadata(sample) {
    d3.json(sampleUrl).then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      
      metadataPanel.html("");
      Object.entries(result).forEach(([key, value]) => {
        metadataPanel.append("h6").text(`${key}: ${value}`);
      });

    
    
    });
  }


function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(sampleUrl).then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]
    console.log(result)
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;


    // Bubble Chart using the sample data
    var bubbleLayout = {
      margin: { t: 0 },
      xaxis: { title: "Id's" },
      hovermode: "closest",
    }

    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ]

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //  Build the Bar Chart
    
    var barData =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ]

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    }

    Plotly.newPlot("bar", barData, barLayout);
  })
}
   
 
function init() {
    metadataPanel = d3.select("#sample-metadata");

    
    selector = d3.select("#selDataset");

    // Use the list of sample names to select options
    d3.json(sampleUrl).then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Change charts and metadata everytime a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize everything
init();