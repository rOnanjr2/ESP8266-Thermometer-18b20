"use strict";

const graphStr = "71,71,71,71,71,70,70,70,70,69,70,69,70,69,70,69,70,70,70,70,70,69,68,68,68,68,69,68,68,68,68,68,68,68,68,68,68,68,67,68,68,68,68,67,66,66,66,66,67,66,66,66,66,66,66,66,65,65,64,64,65,64,64,63,63,63,63,63,63,63,63,62,62,61,61,60,60,60,61,60,60,59,60,60,58,58,57,57,56,57,58,58,58,58,58,57,58,57,57,57,58,57,57,56,57,56,56,56,56,56,56,55,56,56,56,55,55,54,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,54,55,55,54,55,54,55,54,54,54,55,54,54,54,54,53,55,55,55,55,55,54,54,55,55,55,54,54,55,54,55,55,54,53,53,53,53,53,53,53,53,53,53,54,53,53,53,53,53,52,53,53,54,54,54,54,54,55,55,55,55,55,55,55,55,55,55,56,56,56,56,56,55,55,55,55,55,55,55,54,55,55,54,54,54,53,53,54,54,53,53,53,53,52,52,51,51,51,51,51,51,51,51,51,51,51,51,50,50,50,50,50,49,49,50,48,48,48,48,48,47,48,48,48,48,48,49,48,48,49,49,50,49,49,50,49,48,49,49,50,50,50,50,51,49,49,49,50,50,50,50,49,49,49,48,49,48,48,48,49,49,49,49,49,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,47,46,47,46,46,46,48,47,47,48,48,48,48,48,48,48,48,48,48,48,48,47,47,48,47,47,48,48,46,46,46,46,46,46,46,46,46,46,46,45,45,45,46,45,45,45,45,45,44,45,45,44,45,44,44,44,44,44,44,44,43,44,45,44,43,43,43,43,43,43,42,43,44,44,44,44,45,45,45,45,45,45,44,43,43,43,41,41,41,41,41,41,41,41,41,41,41,41,40,40,40,40,38,38,38,40,39,39,39,39,40,40,40,40,40,40,40,40,40,40,40,40,39,40,40,40,40,40,39,39,38,39,39,38,39,38,38,38,39,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,37,37,37,37,36,36,36,36,36,36,36,36,36,35,35,35,35,35,35,35,34,35,35,34,33,33,33,33,33,33,33,33,33,33,33,33,32,33,32,32,32,31,32,31,31,31,31,32,31,31,31,30,30,30,30,30,30,30,29,29,28,28,28,30,29,29,30,29,30,31,31,31,31,31,30,31,31,31,31,31,30,31,31,30,30,30,30,30,30,31,31,31,31,31,31,31,31,32,32,31,31,32,31,32,32,32,33,33,33,33,33,33,33,33,33,33,33,33,34,34,35,35,36,36,35,35,35,35,36,36,37,38,38,38,38,38,38,38,38,39,40,40,39,40,40,40,41,41,42,42,42,43,43,43,43,43,45,45,45,46,46,46,46,47,47,48,49,49,50,49,50,50,51,51,51,53,52,52,53,54,54,54,55,55,55,56,56,56,56,57,57,58,58,58,59,59,60,60,60,60,61,61,63,63,63,63,64,64,65,65,66,66,66,66,67,67,67,68,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,686";
const tempStr = "22.50";

let datesTempArr = [[2]];

(function () {
  const settings = {
    graphRefreshPeriod: 60, //seconds
    tempRefresh: 10, //seconds
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

  // const popZeroes = () => {
  //   while (dataset[dataset.length - 1] == 200) {
  //     dataset.pop();
  //     // console.log(dataset);
  //   }
  // };

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
    request.send();
  };

  const drawGraph = (response) => {
    dataset = response.split(",").map(function (str) {
      return parseInt(str) / 10;
    });
    let graphWriteDivider = Number(dataset.pop()) * 10;
    let tempRefreshPeriod = Number(dataset.pop()) * 10;
    let graphPointer = Number(dataset.pop()) * 10;
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
    request.send();
  };

  const refresh = () => {
    requestTemp();
    requestGraph();
    // drawGraph(graphStr);
    // drawTemp(tempStr);
  };

  setInterval(requestTemp, settings.tempRefresh * 1000);
  setInterval(requestGraph, settings.graphRefreshPeriod * 1000);

  document.addEventListener("DOMContentLoaded", refresh);

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
