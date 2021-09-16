require("./site/index.html");
require("./site/style.css");

Sparkline = require("./site/sparkline");

Sparkline.options = {
  width: 400,
  lineColor: "blue",
  lineWidth: 1,
  startColor: "green",
  endColor: "red",
  maxColor: "transparent",
  minColor: "transparent",
  minValue: null,
  maxValue: null,
  dotRadius: 2.5,
  tooltip: null,
};

TableClass = require("./es6/Table");
global.DEBUG = false;

/* eslint-env es6 */
const client = Stomp.client("ws://localhost:8011/stomp");

client.debug = function (msg) {
  if (global.DEBUG) {
    console.info(msg);
  }
};

client.connect({}, connectCallback, function (error) {
  alert(error.headers.message);
});

const tableInstance = new TableClass();

function connectCallback(result) {
  client.subscribe("/fx/prices", function (message) {
    if (message.body) {
      console.log(message.body);
      const result = JSON.parse(message.body);

      const isalreadyPresent = tableInstance.checkIfAlreadyPresent(result.name);
      isalreadyPresent
        ? tableInstance.updateExistingRow(result)
        : tableInstance.createNewRow(result);
      tableInstance.sortTable();
    }
  });
}
