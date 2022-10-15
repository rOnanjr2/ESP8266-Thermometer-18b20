'use strict';

const settings = {
  graphRefreshPeriod: 5,      //seconds
  tempRefreshPeriod:  2,      //seconds
  graphYAxisMin:      0,     //degrees
  graphYAxisMax:      30,     //degrees
  graphYAxisDecimals: 0,      //digits
}

let dataset = [];
const datasetShifted = [];
let graphPointer;

const opts = {
 angle: -0.25,
    lineWidth: 0.2,
    radiusScale:0.9,
    pointer: {
      length: 0.7,
      strokeWidth: 0.05,
      color: '#000000'
    },
    staticLabels: {
      font: "14px sans-serif",
      labels: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
      fractionDigits: 0
    },
    staticZones: [
       {strokeStyle: "#F2F2F2", min: 0, max: 40},
       {strokeStyle: "#FFDD00", min: 40, max: 60},
       {strokeStyle: "#FFC300", min: 60, max: 75},
       {strokeStyle: "#30B32D", min: 75, max: 95},
       {strokeStyle: "#F03E3E", min: 95, max: 100}
    ],
    limitMax: false,
    limitMin: false,
    highDpiSupport: true
};
const target = document.getElementById('demo'); // your canvas element
const gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 100; // set max gauge value
gauge.setMinValue(0);  // set min value
gauge.set(0); // set actual value

const options = {
  series: [
    {
      name: "Temperature",
      data: dataset,
    },
  ],
  chart: {
    height: 300,
    type: "area",
    background: "#fff",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
    width: 1,
  },
  colors: ["#008ffb"],
  tooltip: {
    enabled: true,
  },
  xaxis: {
    type: "numeric",
    min: 0,
    decimalsInFloat: settings.graphYAxisDecimals,
    tickAmount: 10,
    hideOverlappingLabels: true,
    labels: { style: { cssClass: "apexcharts-xaxis-label" } },
  },
  yaxis: {
  tickAmount: 6,
  // min: settings.graphYAxisMin,
  // max: settings.graphYAxisMax,
  decimalsInFloat: 0,
    labels: { style: { cssClass: "apexcharts-yaxis-label" } },
  },
};
const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


const shift = () => {
  let is = graphPointer;
  for (let i = 0; i < dataset.length; i++) {
    if (is < dataset.length) {
      datasetShifted[i] = dataset[is];
      is++;
    }else{
      datasetShifted[i] = dataset[is - dataset.length];
      is++;
    }
  }
};


const draw_temp = () => {
  const request = new XMLHttpRequest();
  request.open('GET', '/temperature', true);
  request.onload = function() {
    if (request.readyState == 4 && request.status == 200) {
      const response = request.responseText;
      const element = document.getElementById('temp_text');
      element.innerHTML = response;
      gauge.set(response);
    }
  }
  request.send();
};


const draw_graph = () => {
  const request = new XMLHttpRequest();
  request.open('GET', '/graph', true);
  request.onload = function() {
    if (request.readyState == 4 && request.status == 200) {
      const response = request.responseText;
      dataset = response.split(',').map(function(str) {
         return parseInt(str) / 10;
       });
      graphPointer = Number(dataset.pop()) * 10;
      shift();
      chart.updateSeries([{data: datasetShifted}])
    }
  }
  request.send();
};



const refresh = () => {
  draw_temp();
  draw_graph();
};

setInterval (draw_temp, settings.tempRefreshPeriod * 1000);
setInterval (draw_graph, settings.graphRefreshPeriod * 1000);

document.addEventListener('DOMContentLoaded', refresh);