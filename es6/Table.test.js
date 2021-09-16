TableClass = require("./myEs6code");

/* eslint-env es6 */
let tableInstance = new TableClass();

let newRowTestData = {
  name: "usdjpy",
  bestBid: 1.6835519607130455,
  bestAsk: 1.4221799827349528,
  openBid: 1.415696209091991,
  openAsk: 1.427103790908009,
  lastChangeAsk: -0.06652775551321355,
  lastChangeBid: -0.09559575422149225,
};
let updateRowTestData = {
  name: "usdjpy",
  bestBid: 1.5643355196,
  bestAsk: 1.4321799827349528,
  openBid: 1.455696209091991,
  openAsk: 1.317103790908009,
  lastChangeAsk: -0.1652775551321355,
  lastChangeBid: -0.5559575422149225,
};

describe("Table Test Cases", () => {
  test("Check if new currency isn't present", () => {
    expect(tableInstance.checkIfAlreadyPresent(newRowTestData.name)).toBe(
      false
    );
  });
  test("Check if new row is added", () => {
    expect(tableInstance.createNewRow(newRowTestData)).toBe(true);
  });
  test("Check if currency already present", () => {
    expect(tableInstance.checkIfAlreadyPresent(newRowTestData.name)).toBe(true);
  });
  test("Check if the existing row updated", () => {
    expect(tableInstance.updateExistingRow(updateRowTestData)).toBe(true);
  });
  test("Check if the Table Sorted", () => {
    expect(tableInstance.sortTable()).toBe(true);
  });
});
