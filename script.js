"use strict";

(function () {

  const graphStr = "156,158,157,156,157,156,158,156,156,157,158,160,160,160,162,163,160,161,160,161,161,159,162,165,165,166,165,163,164,165,166,168,166,165,165,167,169,171,171,169,170,168,166,168,166,168,167,168,178,189,205,209,210,211,213,210,213,213,221,214,218,215,220,218,221,222,223,230,235,235,231,222,221,220,221,225,232,228,230,236,226,226,230,225,225,227,225,226,226,228,228,228,224,221,223,225,230,225,226,228,226,224,230,228,225,224,230,230,230,231,226,229,223,220,225,227,230,228,233,233,230,230,236,234,239,239,245,241,236,232,236,238,238,238,240,237,240,227,225,228,238,241,236,236,230,220,219,225,225,225,228,231,228,233,231,233,235,242,251,248,241,247,238,235,236,242,237,231,234,240,238,233,238,233,234,235,230,226,225,221,223,222,210,201,198,204,217,231,237,231,238,237,237,245,245,243,236,240,243,236,240,243,238,241,238,238,238,240,245,240,231,235,235,230,235,235,236,237,236,232,230,236,236,230,231,225,224,216,210,199,193,190,187,185,183,182,182,181,180,180,180,179,179,179,179,179,177,177,176,176,176,176,176,176,175,175,175,175,173,173,173,173,172,172,171,171,171,170,171,170,169,168,168,168,167,166,165,163,163,163,160,156,151,150,145,142,140,136,135,135,133,131,130,130,128,128,126,126,126,126,124,123,121,120,120,119,118,117,115,115,113,113,113,112,111,111,111,110,110,109,108,107,107,106,106,105,105,104,104,103,101,101,101,100,100,100,98,97,97,96,96,95,95,95,95,94,92,91,91,91,91,91,91,91,90,90,89,89,88,89,89,89,89,89,89,88,87,86,86,85,84,85,84,82,83,82,81,81,82,82,82,82,83,82,82,82,82,81,81,81,82,82,81,81,81,80,79,80,80,80,80,80,80,80,80,79,79,79,79,79,79,79,78,78,78,78,78,78,78,78,79,78,78,78,77,77,77,76,76,76,76,75,75,75,75,75,75,74,73,73,72,71,71,71,71,71,71,70,70,70,70,69,69,69,69,69,69,69,69,69,69,69,69,69,69,68,68,68,68,68,66,66,66,65,64,65,65,65,65,66,66,66,65,66,66,65,65,65,65,65,65,64,65,65,65,65,64,65,64,65,65,64,64,63,63,64,65,64,63,64,63,63,63,63,63,64,64,64,63,63,64,63,65,523,10,6";
  const tempStr = "22.50";

  let datesTempArr = [[2]];

  const settings = {
    graphRefreshPeriod: 5, //seconds
    tempRefresh: 1, //seconds
    graphYAxisMin: 0, //degrees
    graphYAxisMax: 30, //degrees
    graphYAxisDecimals: 0, //digits
  };

  let dataset = [];
  const datasetShifted = [];
  // let graphPointer;

  const opts = {
    angle: -0.25,
    lineWidth: 0.2,
    radiusScale: 0.9,
    pointer: {
      length: 0.7,
      strokeWidth: 0.05,
      color: "#000000",
    },
    staticLabels: {
      font: "14px sans-serif",
      labels: [
      20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
      ],
      fractionDigits: 0,
      // color:"red"
    },
    staticZones: [
    { strokeStyle: "#F2F2F2", min: 0, max: 40 },
    { strokeStyle: "#FFDD00", min: 40, max: 60 },
    { strokeStyle: "#FFC300", min: 60, max: 75 },
    { strokeStyle: "#30B32D", min: 75, max: 95 },
    { strokeStyle: "#F03E3E", min: 95, max: 100 },
    ],
    limitMax: false,
    limitMin: false,
    highDpiSupport: true,
  };
  const target = document.getElementById("demo"); // your canvas element
  const gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
  gauge.maxValue = 100; // set max gauge value
  gauge.setMinValue(0); // set min value
  gauge.set(0); // set actual value

  const apexchartsOptions = {
    series: [
    {
      name: "Temperature",
      data: dataset,
    },
    ],
    chart: {
      width: "100%",
      height: '60%',
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
      x: {
        format: 'HH:mm'
      }
    },
    xaxis: {
      type: "datetime",
      // min: 0,
      // decimalsInFloat: settings.graphYAxisDecimals,
      // tickAmount: 10,
      // hideOverlappingLabels: true,
      labels: { style: { cssClass: "apexcharts-xaxis-label" } },
    },
    yaxis: {
      tickAmount: 6,
      // min: settings.graphYAxisMin,
      // max: settings.graphYAxisMax,
      decimalsInFloat: 0,
      labels: { style: { cssClass: "apexcharts-yaxis-label" } },
    },
    theme: {
      mode: "light",
    },
  };
  const chart = new ApexCharts(
    document.querySelector("#chart"),
    apexchartsOptions
    );
  chart.render();

  const shift = (graphPointer) => {
    let is = graphPointer;
    for (let i = 0; i < dataset.length; i++) {
      if (is < dataset.length) {
        datasetShifted[i] = dataset[is];
        is++;
      } else {
        datasetShifted[i] = dataset[is - dataset.length];
        is++;
      }
    }
  };

  const appendDates = (graphPointPeriod) => {
    const now = new Date();
    for (let i = 0; i < datasetShifted.length; i++) {
      datesTempArr[i] = [now.getTime() + 10800000 - (datasetShifted.length - i) * graphPointPeriod * 1000,
      datasetShifted[i]];
    }
  };

  const drawTemp = (response) => {
    const element = document.getElementById("temp_text");
    element.innerHTML = response;
    gauge.set(response);
  };

  const requestTemp = () => {
    const request = new XMLHttpRequest();
    request.open("GET", "/temperature", true);
    request.onload = function () {
      if (request.readyState == 4 && request.status == 200) {
        drawTemp(request.responseText);
      }
    };
    request.onerror = function() {
      drawTemp(tempStr);
    };
    request.send();
  };

  const drawGraph = (response) => {
    dataset = response.split(",").map(function (str) {
      return parseInt(str) / 10;
    });
    let graphWriteDivider = Number(dataset.pop()) * 10;
    let tempRefreshPeriod = Number(dataset.pop()) * 10;
    let graphPointer = Number(dataset.pop()) * 10;
    settings.tempRefresh = tempRefreshPeriod;
    settings.graphRefreshPeriod = tempRefreshPeriod * graphWriteDivider;
    shift(graphPointer);
    appendDates(graphWriteDivider * tempRefreshPeriod);
    chart.updateSeries([{ data: datesTempArr }]);
  }

  const requestGraph = () => {
    const request = new XMLHttpRequest();
    request.open("GET", "/graph", true);
    request.onload = function () {
      if (request.readyState == 4 && request.status == 200) {
        drawGraph(request.responseText);
      }
    };
    request.onerror = function() {
      drawGraph(graphStr);
    };
    request.send();
  };

  const refresh = () => {
    requestTemp();
    requestGraph();
  };

  document.addEventListener("DOMContentLoaded", refresh);

  setTimeout(function(){
    setInterval(requestTemp, settings.tempRefresh * 1000);
    setInterval(requestGraph, settings.graphRefreshPeriod * 1000);
  },10000);


  // ############################# темы здесь
  const storageKey = "dark-theme-choosed";
  let darkTheme = false;
  let themeBtn;
  let docBody;

  window.onload = () => {
    themeBtn = document.querySelector("#theme-toggle");
    themeBtn.addEventListener("click", themeToggle);
    docBody = document.querySelector("body");

    //чтение из  локального хранилища (оно сохранит данные если обновить вкладку)
    if (localStorage.getItem(storageKey)) {
      darkTheme = localStorage.getItem(storageKey);
      darkTheme = darkTheme === "true" ? true : false;
      console.log(darkTheme);
      console.log(opts);
      if (darkTheme) {
        docBody.classList.toggle("dark");

        //####################### изменение цветов шкалы
        opts.pointer.color = "#dadada";
        opts.staticLabels.color="#dadada";
        gauge.setOptions(opts);

        //####################### задание темы графика
        chart.updateOptions({
          theme: {
            mode: "dark",
          },
          chart: { background: "#101010" },
        });
      }
    }
  };

  const themeToggle = () => {
    // console.log(darkTheme);
    docBody.classList.toggle("dark");
    darkTheme = !darkTheme;
    saveStateToLocalStorage();

    if (docBody.classList.contains("dark")) {
      //####################### изменение цветов шкалы

      opts.pointer.color = "#dadada";
      opts.staticLabels.color="#dadada";
      gauge.setOptions(opts);

      //https://apexcharts.com/docs/methods/#updateOptions
      chart.updateOptions({
        theme: {
          mode: "dark",
        },
        chart: { background: "#101010" },
      });
    } else {
      //####################### изменение цветов шкалы

      opts.pointer.color = "#000";
      opts.staticLabels.color="#000";
      gauge.setOptions(opts);

      // apexchartsOptions.theme.mode = "light";
      // apexchartsOptions.chart.background = "#fff";
      chart.updateOptions({
        theme: {
          mode: "light",
        },
        chart: { background: "#fff" },
      });
    }
  };
  const saveStateToLocalStorage = () => {
    localStorage.setItem(storageKey, darkTheme);
  };
}.call(this));
