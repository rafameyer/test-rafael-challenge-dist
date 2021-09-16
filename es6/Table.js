(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.Sparkline = factory();
  }
})(this, function () {
  function TableClass() {
    this.currencies = [];
    this.tableData = [];

    this.addCurrency = function (currency) {
      this.currencies.push({
        rowId: this.tableData.length,
        currency: currency,
      });
      return this.tableData.length;
    };

    this.createNewRow = function (currentRowData) {
      try {
        /* eslint-env es6 */
        let rowId = this.addCurrency(currentRowData.name);

        currentRowData.id = rowId;

        let newRow = new Row(
          currentRowData.id,
          currentRowData.name,
          currentRowData.bestBid,
          currentRowData.bestAsk,
          currentRowData.lastChangeAsk,
          currentRowData.lastChangeBid
        );
        newRow.createRow();
        this.tableData.push(newRow);

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    this.getRowId = function (key) {
      let rowId;
      this.currencies.forEach((ele) => {
        if (ele.currency === key) rowId = ele.rowId;
      });
      return rowId;
    };

    this.updateExistingRow = function (rowData) {
      try {
        let updated = false;
        let rowId = this.getRowId(rowData.name);

        this.tableData.forEach((ele) => {
          if (ele.id == rowId) {
            updated = ele.updateRow(rowData);
          }
        });
        return updated;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    this.checkIfAlreadyPresent = function (key) {
      try {
        let flag = false;
        this.currencies.forEach((ele) => {
          if (ele.currency === key) {
            flag = true;
          }
        });
        return flag;
      } catch (e) {
        console.log(e);
      }
    };

    this.sortTable = function () {
      try {
        this.tableData.sort((a, b) => {
          if (parseFloat(a.lastChangeBid) < parseFloat(b.lastChangeBid)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.rerenderTable();
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    this.rerenderTable = function () {
      try {
        let tBody = document.querySelector("table > tbody");
        while (tBody.firstChild) {
          tBody.removeChild(tBody.firstChild);
        }

        this.tableData.forEach((ele) => {
          tBody.appendChild(ele.element);
        });
      } catch (e) {
        console.log(e);
      }
    };
  }

  function Row(tableId, name, bestBid, bestAsk, lastChangeAsk, lastChangeBid) {
    this.id = tableId;
    this.name = name;
    this.bestBid = bestBid;
    this.bestAsk = bestAsk;
    this.lastChangeAsk = lastChangeAsk;
    this.lastChangeBid = lastChangeBid;
    this.rowOrder = [
      "name",
      "bestBid",
      "bestAsk",
      "lastChangeAsk",
      "lastChangeBid",
      "sparkline",
    ];

    this.counter = 0;
    this.element = {};
    this.midPriceArray = [];
    this.midPriceArrayTimestampMap = [];

    this.renderChart = function () {
      try {
        let tRow = document.querySelector(`tr[id='${this.id}']`);
        let exampleSparkline = tRow.getElementsByClassName("sparkline");
        Sparkline.draw(exampleSparkline[0], this.midPriceArray);
      } catch (e) {
        console.log(e);
      }
    };

    this.createRowItem = (id) => {
      try {
        let rowItem;
        rowItem = document.createElement("td");

        if (id === "sparkline") {
          rowItem.classList.add("sparkline");
          rowItem.dataset.currency = this.name;
        } else {
          rowItem.id = id;
          rowItem.innerText = this[id].toString();
        }
        return rowItem;
      } catch (e) {
        console.log(e);
      }
    };

    this.createRow = () => {
      try {
        let tBody = document.querySelector("table > tbody");
        var row = document.createElement("tr");
        row.id = this.id;

        this.rowOrder.forEach((rowName) => {
          row.appendChild(this.createRowItem(rowName));
        });

        this.element = row;
        tBody.appendChild(row);

        this.calculateMidPrice();

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    this.calculateMidPrice = function () {
      try {
        let calculatedMidPrice = (this.bestBid + this.bestAsk) / 2;

        this.midPriceArrayTimestampMap.push({
          value: calculatedMidPrice,
          time: new Date(),
        });

        let midPriceArrTemp = [];

        this.midPriceArrayTimestampMap = this.midPriceArrayTimestampMap.filter(
          (ele) => {
            let currentTime = new Date();
            if (currentTime.getTime() - ele.time.getTime() <= 30000) {
              midPriceArrTemp.push(ele.value);
              return true;
            } else {
              return false;
            }
          }
        );

        this.midPriceArray = midPriceArrTemp;

        if (this.name == "gbpjpy") {
          console.log(midPriceArrTemp);
        }
        setTimeout(() => {
          this.renderChart();
        }, 0);
      } catch (e) {
        console.log(e);
      }
    };

    this.updateRow = function ({
      name,
      bestBid,
      bestAsk,
      lastChangeAsk,
      lastChangeBid,
    }) {
      try {
        this.name = name;
        this.bestBid = bestBid;
        this.bestAsk = bestAsk;
        this.lastChangeAsk = lastChangeAsk;
        this.lastChangeBid = lastChangeBid;

        let tRow = document.querySelector(`tr[id='${this.id}']`);

        if (tRow) {
          this.updateRowItem(tRow.querySelector("#name"), this.name);
          this.updateRowItem(tRow.querySelector("#bestBid"), this.bestBid);
          this.updateRowItem(tRow.querySelector("#bestAsk"), this.bestAsk);
          this.updateRowItem(
            tRow.querySelector("#lastChangeAsk"),
            this.lastChangeAsk
          );
          this.updateRowItem(
            tRow.querySelector("#lastChangeBid"),
            this.lastChangeBid
          );
        }

        this.calculateMidPrice();

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    this.updateRowItem = function (rowItem, value) {
      rowItem.innerText = value;
    };
  }

  return TableClass;
});
