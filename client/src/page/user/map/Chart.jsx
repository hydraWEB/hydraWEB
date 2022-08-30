import styles from './Chart.module.scss'
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import React, { useEffect, useState, useRef } from 'react';
import { Toolbox } from "@nebula.gl/editor";
import DeckGL from "deck.gl";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as d3 from 'd3';
import * as savesvg from 'save-svg-as-png';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { saveAs } from 'file-saver';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles1 = makeStyles((theme) => ({
  root: {
    maxWidth: "100%"
  },
}));
//包含所有繪製圖表的函式
function LineChart({ chartData }) {

  const [info, setInfo] = useState(null)
  //每當chartData有變化時執行裡面的程式
  useEffect(() => {
    drawChart();
  }, [chartData]);

  //繪製圖表的函式，使用d3.js 繪製圖表
  function drawChart() {
    let d = chartData
    // set the dimensions and margins of the graph

    const list = []
    Object.entries(chartData).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && key != "prop1") {
        list.push(value)
      } else if (key == "prop1") {
        setInfo(value)
      }
    })
    title(list)
    岩類一(list)
  }
  //顯示圖表上面的標題字串
  function title(list) {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 500 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

    var svg = d3.select("#title")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    svg.append("text")
      .style("fill", "white")
      .attr('y', 20)
      .attr('x', 0)
      .text("深度(m)")

    svg.append("text")
      .style("fill", "white")
      .attr('y', 20)
      .attr('x', 105)
      .text("岩類一")

    svg.append("text")
      .style("fill", "white")
      .attr('y', 20)
      .attr('x', 215)
      .text("岩類二")
  }


  //顯示深度和岩類的圖表
  function 岩類一(list) {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 500 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    //選擇chart_container並給予屬性
    var svg = d3.select("#chart_container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
    

    let maxdept = list[list.length - 1].下限深度
    let mindept = list[0].上限深度
    let alldept = maxdept - mindept
    var calc = height / alldept

    var colorize3 = d3.scaleOrdinal().range(d3.schemePaired)

    //上限深度
    svg.selectAll("text.depth")
      .data(list).enter().append("text")
      .attr("class", "depth")
      .attr('y', (d) => {
        return ((d.上限深度) * calc) + 15
      })
      .attr('x', 0)
      .attr("fill", "white")
      .attr("width", 100)
      .text((d, i) => d.上限深度)

    //下限深度
    svg.append("text")
      .data([list[list.length - 1]])
      .style("fill", "white")
      .attr('y', height)
      .attr('x', 0)
      .text((d, i) => d.下限深度)


    //岩類1圖表
    svg.selectAll('rect.rock1')
      .data(list).enter().append("rect")
      .attr('y', (d) => {
        return d.上限深度 * calc
      })
      .attr('x', 100)
      .attr("height", (d) => {
        return (d.下限深度 - d.上限深度) * calc
      })
      .attr("width", 100)
      .attr('stroke', 'black')
      .attr('fill', (d, i) => colorize3(d.岩類一));

    //岩類1圖表內的字體
    svg.selectAll("text.rock1")
      .data(list)
      .enter()
      .append("text")
      .attr("class", "hour")
      .attr('y', (d) => {
        return d.上限深度 * calc + 20
      })
      .attr('x', 105)
      .attr("fill", "white")
      .text((d, i) => d.岩類一)
      .on('mouseout', function () { // on mouse out hide line, circles and text
        d3.select("line")
          .style("opacity", "0");
      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select("line")
          .style("opacity", "1");
      })

    //岩類2圖表
    svg.selectAll('rect.rock2')
      .data(list).enter().append("rect")
      .attr('y', (d) => {
        return d.上限深度 * calc
      })
      .attr('x', 210)
      .attr("height", (d) => {
        return (d.下限深度 - d.上限深度) * calc
      })
      .attr("width", 100)
      .attr('stroke', 'black')
      .attr('fill', (d, i) => colorize3(d.岩類二));

    //岩類1圖表內的字體
    svg.selectAll("text.rock2")
      .data(list)
      .enter()
      .append("text")
      .attr("class", "rock2")
      .attr('y', (d) => {
        return d.上限深度 * calc + 20
      })
      .attr('x', 215)
      .attr("fill", "white")
      .text((d, i) => d.岩類二)
    /* .attr("style", "font-family: arial; fill: white; writing-mode: tb") */

    var mouseG = svg.append("g")

    //answer
    mouseG.append("text")
      .attr("class", "rock_tooltip_answer_1")
      .style("fill", "white")
      .style("opacity", "0");

    mouseG.append("text")
      .attr("class", "rock_tooltip_answer_2")
      .style("fill", "white")
      .style("opacity", "0");
    mouseG.append("text")
      .attr("class", "rock_tooltip_answer_depth")
      .style("fill", "white")
      .style("opacity", "0");

    mouseG.append("line") // this is the white vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "white")
      .style("stroke-width", 1)
      .style("opacity", "0");

    mouseG.append('rect')
      .data(list)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.select(".rock_tooltip_answer_1")
          .style("opacity", "0");
        d3.select(".rock_tooltip_answer_2")
          .style("opacity", "0");
        d3.select(".rock_tooltip_answer_depth")
          .style("opacity", "0");
      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.select(".rock_tooltip_answer_1")
          .style("opacity", "1");
        d3.select(".rock_tooltip_answer_2")
          .style("opacity", "1");
        d3.select(".rock_tooltip_answer_depth")
          .style("opacity", "1");
      })
      .on('mousemove', e => { // mouse moving over canvas
        var mouse = d3.pointer(e);
        var r1, r2
        let depth = mouse[1] / calc
        var roundOffDepth = depth.toFixed(2)

        for (let i = 0; i < list.length; i++) {
          if (roundOffDepth >= list[i].上限深度 && roundOffDepth <= list[i].下限深度) {
            r1 = list[i].岩類一
            r2 = list[i].岩類二
          }
        }

        d3.select(".mouse-line")
          .attr("x1", 0)
          .attr("y1", mouse[1])
          .attr("x2", 10000)
          .attr("y2", mouse[1])
        if (mouse[1] < 900) {
          //answer 
          d3.select(".rock_tooltip_answer_1")
            .attr('y', mouse[1] + 20)
            .attr('x', 350)
            .text(`岩類一：${r1}`)
          d3.select(".rock_tooltip_answer_2")
            .attr('y', mouse[1] + 40)
            .attr('x', 350)
            .text(`岩類二：${r2}`)
          d3.select(".rock_tooltip_answer_depth")
            .attr('y', mouse[1] + 60)
            .attr('x', 350)
            .text(`深度：${depth.toFixed(3)}`)
        }
        else {
          d3.select(".rock_tooltip_answer_1")
            .attr('y', mouse[1] + 20 - 70)
            .attr('x', 350)
            .text(`岩類一：${r1}`)
          d3.select(".rock_tooltip_answer_2")
            .attr('y', mouse[1] + 40 - 70)
            .attr('x', 350)
            .text(`岩類二：${r2}`)
          d3.select(".rock_tooltip_answer_depth")
            .attr('y', mouse[1] + 60 - 70)
            .attr('x', 350)
            .text(`深度：${depth.toFixed(3)}`)
        }


      });
    //點擊下載的程式
    d3.select('#saveButtonChart').on('click', function () {
      var svgString2 = getSVGString(d3.select('#title > svg').node());
      var svgString = getSVGString(d3.select('#chart_container > svg').node());
      svgString2Image(svgString, svgString2, width, height, 'png', save); // passes Blob and filesize String to the callback

      function save(dataBlob, filesize) {
        saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
      }
    });

    // Below are the functions that handle actual exporting:
    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
    function getSVGString(svgNode) {
      svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
      var cssStyleText = getCSSStyles(svgNode);
      appendCSS(cssStyleText, svgNode);

      var serializer = new XMLSerializer();
      var svgString = serializer.serializeToString(svgNode);
      svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
      svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

      return svgString;

      function getCSSStyles(parentElement) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push('#' + parentElement.id);
        for (var c = 0; c < parentElement.classList.length; c++)
          if (!contains('.' + parentElement.classList[c], selectorTextArr))
            selectorTextArr.push('.' + parentElement.classList[c]);

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
          var id = nodes[i].id;
          if (!contains('#' + id, selectorTextArr))
            selectorTextArr.push('#' + id);

          var classes = nodes[i].classList;
          for (var c = 0; c < classes.length; c++)
            if (!contains('.' + classes[c], selectorTextArr))
              selectorTextArr.push('.' + classes[c]);
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
          var s = document.styleSheets[i];

          try {
            if (!s.cssRules) continue;
          } catch (e) {
            if (e.name !== 'SecurityError') throw e; // for Firefox
            continue;
          }

          var cssRules = s.cssRules;
          for (var r = 0; r < cssRules.length; r++) {
            if (contains(cssRules[r].selectorText, selectorTextArr))
              extractedCSSText += cssRules[r].cssText;
          }
        }


        return extractedCSSText;

        function contains(str, arr) {
          return arr.indexOf(str) === -1 ? false : true;
        }

      }

      function appendCSS(cssText, element) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
      }
    }
    
    function svgString2Image(svgString, svgString2, width, height, format, callback) {
      var format = format ? format : 'png';
      var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL
      var imgsrc2 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString2)));
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      var image = new Image();
      var image2 = new Image();

      image.onload = function () {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#000000"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 30, 70, width, height - 100);
        image2.src = imgsrc2
        image2.onload = function () {
          context.drawImage(image2, 30, 20, width, 50);
          canvas.toBlob(function (blob) {
            var filesize = Math.round(blob.size / 1024) + ' KB';
            if (callback) callback(blob, filesize);
          });
        };
      };
      image.src = imgsrc;
    }
  }

  return (
    <div className={styles.chart_container}>
      <div id="title" className={styles.chart_title} />
      <div id="chart_container" className={styles.chart_container} />
    </div>
  );
}

function OnClick() {

}

const styles_ = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle2 = withStyles(styles_)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
//顯示地質鑽探資料的圖表
export default function Chart({ showChart, setShowChart, chartData }) {

  const handleClickOpen = () => {
    setShowChart(true);
  };

  const handleClose = (value) => {
    setShowChart(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={showChart} 
      >
        <div className={styles.chart_title}>
          <DialogTitle2 onClose={handleClose} >地質鑽探資料</DialogTitle2>
        </div>
        <div className={styles.chart_print}>
          <Button
            id='saveButtonChart'
          >列印</Button>
        </div>

        <DialogContent dividers={true}>
          <LineChart chartData={chartData} />
        </DialogContent>

      </Dialog>
    </div>
  );
}


