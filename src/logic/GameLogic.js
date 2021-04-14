export default {
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

  getNeighbors(gridData, x, y) {
    let neighbors = 0;
    // Checking each single neighbor
    // Above
    if (
      typeof gridData[y - 1] !== "undefined" &&
      typeof gridData[y - 1][x - 1] !== "undefined" &&
      gridData[y - 1][x - 1]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y - 1] !== "undefined" &&
      typeof gridData[y - 1][x] !== "undefined" &&
      gridData[y - 1][x]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y - 1] !== "undefined" &&
      typeof gridData[y - 1][x + 1] !== "undefined" &&
      gridData[y - 1][x + 1]
    ) {
      neighbors++;
    }
    // Left and Right
    if (typeof gridData[y][x - 1] !== "undefined" && gridData[y][x - 1]) {
      neighbors++;
    }
    if (typeof gridData[y][x + 1] !== "undefined" && gridData[y][x + 1]) {
      neighbors++;
    }
    //Beneath
    if (
      typeof gridData[y + 1] !== "undefined" &&
      typeof gridData[y + 1][x - 1] !== "undefined" &&
      gridData[y + 1][x - 1]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y + 1] !== "undefined" &&
      typeof gridData[y + 1][x] !== "undefined" &&
      gridData[y + 1][x]
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y + 1] !== "undefined" &&
      typeof gridData[y + 1][x + 1] !== "undefined" &&
      gridData[y + 1][x + 1]
    ) {
      neighbors++;
    }
    return neighbors;
  },

  getNextGridGeneration(gridData) {
    const nextGridState = [];

    for (let y = 0; y < gridData.length; y++) {
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
    }

    return nextGridState;
  },
};
