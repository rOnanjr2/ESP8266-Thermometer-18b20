"use strict";

(function () {
  // ********************************************
  //  offline demo section start
  // ********************************************
  const graphStr =
  "156,158,157,156,157,156,158,156,156,157,158,160,160,160,162,163,160,161,160,161,161,159,162,165,165,166,165,163,164,165,166,168,166,165,165,167,169,171,171,169,170,168,166,168,166,168,167,168,178,189,205,209,210,211,213,210,213,213,221,214,218,215,220,218,221,222,223,230,235,235,231,222,221,220,221,225,232,228,230,236,226,226,230,225,225,227,225,226,226,228,228,228,224,221,223,225,230,225,226,228,226,224,230,228,225,224,230,230,230,231,226,229,223,220,225,227,230,228,233,233,230,230,236,234,239,239,245,241,236,232,236,238,238,238,240,237,240,227,225,228,238,241,236,236,230,220,219,225,225,225,228,231,228,233,231,233,235,242,251,248,241,247,238,235,236,242,237,231,234,240,238,233,238,233,234,235,230,226,225,221,223,222,210,201,198,204,217,231,237,231,238,237,237,245,245,243,236,240,243,236,240,243,238,241,238,238,238,240,245,240,231,235,235,230,235,235,236,237,236,232,230,236,236,230,231,225,224,216,210,199,193,190,187,185,183,182,182,181,180,180,180,179,179,179,179,179,177,177,176,176,176,176,176,176,175,175,175,175,173,173,173,173,172,172,171,171,171,170,171,170,169,168,168,168,167,166,165,163,163,163,160,156,151,150,145,142,140,136,135,135,133,131,130,130,128,128,126,126,126,126,124,123,121,120,120,119,118,117,115,115,113,113,113,112,111,111,111,110,110,109,108,107,107,106,106,105,105,104,104,103,101,101,101,100,100,100,98,97,97,96,96,95,95,95,95,94,92,91,91,91,91,91,91,91,90,90,89,89,88,89,89,89,89,89,89,88,87,86,86,85,84,85,84,82,83,82,81,81,82,82,82,82,83,82,82,82,82,81,81,81,82,82,81,81,81,80,79,80,80,80,80,80,80,80,80,79,79,79,79,79,79,79,78,78,78,78,78,78,78,78,79,78,78,78,77,77,77,76,76,76,76,75,75,75,75,75,75,74,73,73,72,71,71,71,71,71,71,70,70,70,70,69,69,69,69,69,69,69,69,69,69,69,69,69,69,68,68,68,68,68,66,66,66,65,64,65,65,65,65,66,66,66,65,66,66,65,65,65,65,65,65,64,65,65,65,65,64,65,64,65,65,64,64,63,63,64,65,64,63,64,63,63,63,63,63,64,64,64,63,63,64,63,65,523,10,6";
  const tempStr = "22.53";
  let tempNum = parseFloat(tempStr);
  let gaugeMode = 1;

  // ********************************************
  //  offline demo section end
  // ********************************************

  let datesTempArr = [[2]];

  const settings = {
    graphRefreshPeriod: 5,      //seconds
    tempRefresh: 1,             //seconds
    graphYAxisMin: 0,           //degrees
    graphYAxisMax: 30,          //degrees
    graphYAxisDecimals: 0,      //digits
    intervalsSetted: false,
  };

  let dataset = [];
  const datasetShifted = [];

  const apexchartsOptions = {
    series: [
    {
      name: "Temperature",
      data: dataset,
    },
    ],
    chart: {
      width: "100%",
      height: "60%",
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
        format: "HH:mm",
      },
    },
    xaxis: {
      type: "datetime",
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
      datesTempArr[i] = [
      now.getTime() +
      10800000 -
      (datasetShifted.length - i) * graphPointPeriod * 1000,
      datasetShifted[i],
      ];
    }
  };


  // ********************************************
  //  online section start
  // ********************************************
  const requestTemp = () => {
    const request = new XMLHttpRequest();
    request.open("GET", "/temperature", true);
    request.onload = function () {
      if (request.readyState == 4 && request.status == 200) {
        tempNum = parseFloat(request.responseText);
        setGauge(tempNum, gaugeMode);
      }
    };
    request.onerror = function () {
      setGauge(tempNum, gaugeMode);
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
    setIntervals();
    shift(graphPointer);
    appendDates(graphWriteDivider * tempRefreshPeriod);
    chart.updateSeries([{ data: datesTempArr }]);
  };

  const requestGraph = () => {
    const request = new XMLHttpRequest();
    request.open("GET", "/graph", true);
    request.onload = function () {
      if (request.readyState == 4 && request.status == 200) {
        drawGraph(request.responseText);
      }
    };
    request.onerror = function () {
      drawGraph(graphStr);
    };
    request.send();
  };

  const refresh = () => {
    requestTemp();
    requestGraph();
  };

  document.addEventListener("DOMContentLoaded", refresh);

  // setTimeout(function(){

  // },10000);

  const setIntervals = () => {
    if (!settings.intervalsSetted) {
      setInterval(requestTemp, settings.tempRefresh * 1000);
      setInterval(requestGraph, settings.graphRefreshPeriod * 1000);
      settings.intervalsSetted = true;
    }
  };

  // ********************************************
  //  Themes are here
  // ********************************************

  const storageKey = "dark-theme-choosed";
  let darkTheme = false;
  let themeBtn;
  let docBody;

  window.onload = () => {
    themeBtn = document.querySelector("#theme-toggle");
    themeBtn.addEventListener("click", themeToggle);
    docBody = document.querySelector("body");

    //reading from local storage (it will save data if the page will refresh )
    if (localStorage.getItem(storageKey)) {
      darkTheme = localStorage.getItem(storageKey);
      darkTheme = darkTheme === "true" ? true : false;
      console.log("darkTheme",darkTheme);
      if (darkTheme) {
        docBody.classList.toggle("dark");

        //####################### changing colors of the OLD gauge
        // opts.pointer.color = "#dadada";
        // opts.staticLabels.color = "#dadada";
        // gauge.setOptions(opts);

        //####################### changing theme of the graph
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
      //####################### changing colors of the OLD gauge

      // opts.pointer.color = "#dadada";
      // opts.staticLabels.color = "#dadada";
      // gauge.setOptions(opts);

      //https://apexcharts.com/docs/methods/#updateOptions
      chart.updateOptions({
        theme: {
          mode: "dark",
        },
        chart: { background: "#101010" },
      });
    } else {
      //####################### changing colors of the OLD gauge

      // opts.pointer.color = "#000";
      // opts.staticLabels.color = "#000";
      // gauge.setOptions(opts);

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
  // ********************************************
  //  Themes end
  // ********************************************

  // ********************************************
  //  New gauge section start
  // ********************************************
  // const colorsArray = ["#07bbec", "#f6ffa3", "#e8ec07", "#ec8107", "#ec0707"];
  // для цвета: сделать массив значений, выборку делать делением текущего значения переменной на количество элементов нацело оператор (%)


  const setGaugeMode = (mode) => {
    // 1 for (-50 0 50)
    // 2 for (20 100)
    gaugeMode = mode;
    // // ************ automatic gaugeMode set start
    // if (temp >= 50) {
    //   gaugeMode = 2;
    // }
    // if (temp <= 20) {
    //   gaugeMode = 1;
    // }
    // ************ automatic gaugeMode set end
    const mFiftyToFifty = document.getElementById("numbers50-50");
    const twentyToHundred = document.getElementById("numbers20-100");
    if (mode === 2) {
      mFiftyToFifty.setAttribute("opacity", 0);
      twentyToHundred.setAttribute("opacity", 1);
    }
    if (mode === 1) {
      mFiftyToFifty.setAttribute("opacity", 1);
      twentyToHundred.setAttribute("opacity", 0);
    }
  };

  const setGaugeThemperatureNumber = (num) => {
    let maxChar;
    const gaugeThemperatureNumber =
    document.getElementById("temperature-digit");
    // ************** set output digits count
    if (num.toString().includes(".") && !num.toString().includes("-")) {
      maxChar = 4;
    } else {
      maxChar = 3;
    }
    gaugeThemperatureNumber.innerText = num.toString().substring(0, maxChar);
  };

  const setGaugeArrowAngle = (num) => {
    const gaugeArrow = document.getElementById("white-arrow");
    // range 0 - 240 deg
    if (gaugeMode === 2) {
      // ************** for 20 - 100 mode
      gaugeArrow.setAttribute(
        "transform",
        `rotate(${(240 / 80) * (num - 20)})`
        );
    }
    if (gaugeMode === 1) {
      // ************** for -50 - 50 mode
      gaugeArrow.setAttribute(
        "transform",
        `rotate(${(240 / 100) * (num + 50)})`
        );
    }
  };

  const setGaugeArcLine = (num) => {
    // the arc have 2 parts - one for line, and another for glow
    // 588.7 = 0%;  0 = 100%
    const gaugeArcLine = document.getElementById("progress-blue-circle");
    const gaugeParts = gaugeArcLine.querySelectorAll("circle");
    gaugeParts.forEach((elem) => {
      if (gaugeMode === 2) {
        // ************** for 20 - 100 mode
        elem.style.strokeDashoffset = `${588.7 - (588.7 / 80) * (num - 20)}`;
      }
      if (gaugeMode === 1) {
        // ************** for -50 - 50 mode
        elem.style.strokeDashoffset = `${
          588.7 - (588.7 / 100) * (num + 50)
        }`;
        // ************** gauge arc color set
        elem.style.stroke = `${"#00ff00"}`;

      }
    });
  };

  document.querySelector(".gauge-container").onclick = () => {
    gaugeMode === 2 ? setGauge(tempNum, 1) : setGauge(tempNum, 2);
  };

  const setGauge = (temp, mode) => {
    // ************ automatic gaugeMode set start
    if (temp >= 50) {
      setGaugeMode(2);
    } else if (temp <= 20) {
      setGaugeMode(1);
    } else {
      setGaugeMode(mode);
    }
    // setGaugeMode(mode);
    setGaugeThemperatureNumber(temp);
    setGaugeArrowAngle(temp);
    setGaugeArcLine(temp);
  };

  // setGauge(tempNum, 2); // set gauge value
  // ********************************************
  //  New gauge section end
  // ********************************************

  const saveStateToLocalStorage = () => {
    localStorage.setItem(storageKey, darkTheme);
  };


  const slider = document.getElementById('tempSlider');

  slider.oninput = function() {
    tempNum = parseFloat(this.value);
    setGauge(tempNum, gaugeMode);
    console.log(tempNum);
  }


}.call(this));
