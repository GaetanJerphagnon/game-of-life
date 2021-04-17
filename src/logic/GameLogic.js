export default {
  getAliveCellsPosition(gridData) {
    let grid = [];

    for (let y = 0; y < gridData.length; y++) {
      for (let x = 0; x < gridData[y].length; x++) {
        if (gridData[y][x]) {
          grid.push([y, x]);
        }
      }
    }

    return grid;
  },
  getEmptyGrid(columnNumber, rowNumber) {
    let grid = [];

    for (let x = 0; x < rowNumber; x++) {
      const row = [];
      for (let y = 0; y < columnNumber; y++) {
        row.push(false);
      }
      grid.push(row);
    }

    return grid;
  },

  getNeighbors(gridData, xx, yy) {
    let neighbors = 0;

    // Making the grid a wrap-around
    let x = xx - 1;
    let y = yy - 1;
    let xxx = xx + 1;
    let yyy = yy + 1;

    if (x == -1) {
      x = gridData[yy].length - 1;
    }
    if (y == -1) {
      y = gridData.length - 1;
    }
    if (xxx > gridData[yy].length - 1) {
      xxx = 0;
    }
    if (yyy > gridData.length - 1) {
      yyy = 0;
    }

    // Checking each single neighbor
    // Above
    if (
      typeof gridData[y] !== "undefined" &&
      typeof gridData[y][x] !== "undefined" &&
      gridData[y][x]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y] !== "undefined" &&
      typeof gridData[y][x] !== "undefined" &&
      gridData[y][xx]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y] !== "undefined" &&
      typeof gridData[y][xxx] !== "undefined" &&
      gridData[y][xxx]
    ) {
      neighbors++;
    }
    // Left and Right
    if (typeof gridData[yy][x] !== "undefined" && gridData[yy][x]) {
      neighbors++;
    }
    if (typeof gridData[yy][xxx] !== "undefined" && gridData[yy][xxx]) {
      neighbors++;
    }
    //Beneath
    if (
      typeof gridData[yyy] !== "undefined" &&
      typeof gridData[yyy][x] !== "undefined" &&
      gridData[yyy][x]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[yyy] !== "undefined" &&
      typeof gridData[yyy][xx] !== "undefined" &&
      gridData[yyy][xx]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[yyy] !== "undefined" &&
      typeof gridData[yyy][xxx] !== "undefined" &&
      gridData[yyy][xxx]
    ) {
      neighbors++;
    }
    return neighbors;
  },

  getNextGridGeneration(gridData) {
    const nextGridState = this.getEmptyGrid(
      gridData[0].length,
      gridData.length
    );
    console.log(nextGridState);

    const livingCells = this.getAliveCellsPosition(gridData);
    const cellsToCompute = this.getCellsToCompute(gridData, livingCells);

    cellsToCompute.forEach((cell) => {
      let x = cell[0];
      let y = cell[1];
      if (!(y in nextGridState)) {
        nextGridState[y] = [];
      }
      let nbNeighbors = this.getNeighbors(gridData, x, y);
      let currentCell = gridData[y][x];
      if (currentCell === true && (nbNeighbors === 2 || nbNeighbors === 3)) {
        nextGridState[y][x] = true;
      } else if (currentCell === true && (nbNeighbors < 2 || nbNeighbors > 3)) {
        nextGridState[y][x] = false;
      } else if (currentCell === false && nbNeighbors === 3) {
        nextGridState[y][x] = true;
      } else {
        nextGridState[y][x] = false;
      }
    });

    /*     for (let y = 0; y < gridData.length; y++) {
      nextGridState[y] = [];
      for (let x = 0; x < gridData[y].length; x++) {
        let nbNeighbors = this.getNeighbors(gridData, x, y);
        let currentCell = gridData[y][x];
        if (currentCell === true && (nbNeighbors === 2 || nbNeighbors === 3)) {
          nextGridState[y][x] = true;
        } else if (
          currentCell === true &&
          (nbNeighbors < 2 || nbNeighbors > 3)
        ) {
          nextGridState[y][x] = false;
        } else if (currentCell === false && nbNeighbors === 3) {
          nextGridState[y][x] = true;
        } else {
          nextGridState[y][x] = false;
        }
      }
    } */

    return nextGridState;
  },

  getCellsToCompute(gridData, liveCellsPosition) {
    let cellsPosString = "";

    liveCellsPosition.forEach((pos) => {
      // Making the grid a wrap-around
      let xx = pos[1];
      let yy = pos[0];
      let x = xx - 1;
      let y = yy - 1;
      let xxx = xx + 1;
      let yyy = yy + 1;

      if (x == -1) {
        x = gridData[yy].length - 1;
      }
      if (y == -1) {
        y = gridData.length - 1;
      }
      if (xxx > gridData[yy].length - 1) {
        xxx = 0;
      }
      if (yyy > gridData.length - 1) {
        yyy = 0;
      }

      if (!cellsPosString.includes("[" + yy + "," + x + "]")) {
        cellsPosString += "[" + yy + "," + x + "]|";
      }
      if (!cellsPosString.includes("[" + yy + "," + xx + "]")) {
        cellsPosString += "[" + yy + "," + xx + "]|";
      }
      if (!cellsPosString.includes("[" + yy + "," + xxx + "]")) {
        cellsPosString += "[" + yy + "," + xxx + "]|";
      }
      if (!cellsPosString.includes("[" + y + "," + x + "]")) {
        cellsPosString += "[" + y + "," + x + "]|";
      }
      if (!cellsPosString.includes("[" + y + "," + xx + "]")) {
        cellsPosString += "[" + y + "," + xx + "]|";
      }
      if (!cellsPosString.includes("[" + y + "," + xxx + "]")) {
        cellsPosString += "[" + y + "," + xxx + "]|";
      }
      if (!cellsPosString.includes("[" + yyy + "," + x + "]")) {
        cellsPosString += "[" + yyy + "," + x + "]|";
      }
      if (!cellsPosString.includes("[" + yyy + "," + xx + "]")) {
        cellsPosString += "[" + yyy + "," + xx + "]|";
      }
      if (!cellsPosString.includes("[" + yyy + "," + xxx + "]")) {
        cellsPosString += "[" + yyy + "," + xxx + "]|";
      }
    });
    cellsPosString = cellsPosString.slice(0, -1);
    let cellsToComputeString = cellsPosString.split("|");
    let cellsToCompute = [];
    cellsToComputeString.forEach((e) => {
      cellsToCompute.push(JSON.parse(e));
    });

    return cellsToCompute;
  },
};
