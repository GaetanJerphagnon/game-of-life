export default {
  getEmptyGrid(columnNumber, rowNumber) {
    let grid = [];

    for (let x = 0; x < rowNumber; x++) {
      const row = [];
      for (let y = 0; y < columnNumber; y++) {
        row.push(0);
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
      gridData[y][x] !== 0
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y] !== "undefined" &&
      typeof gridData[y][x] !== "undefined" &&
      gridData[y][xx] !== 0
    ) {
      neighbors++;
    }
    if (
      typeof gridData[y] !== "undefined" &&
      typeof gridData[y][xxx] !== "undefined" &&
      gridData[y][xxx] !== 0
    ) {
      neighbors++;
    }
    // Left and Right
    if (typeof gridData[yy][x] !== "undefined" && gridData[yy][x] !== 0) {
      neighbors++;
    }
    if (typeof gridData[yy][xxx] !== "undefined" && gridData[yy][xxx] !== 0) {
      neighbors++;
    }
    //Beneath
    if (
      typeof gridData[yyy] !== "undefined" &&
      typeof gridData[yyy][x] !== "undefined" &&
      gridData[yyy][x] !== 0
    ) {
      neighbors++;
    }
    if (
      typeof gridData[yyy] !== "undefined" &&
      typeof gridData[yyy][xx] !== "undefined" &&
      gridData[yyy][xx] !== 0
    ) {
      neighbors++;
    }
    if (
      typeof gridData[yyy] !== "undefined" &&
      typeof gridData[yyy][xxx] !== "undefined" &&
      gridData[yyy][xxx] !== 0
    ) {
      neighbors++;
    }
    return neighbors;
  },

  isCellAlive(cell) {
    if (cell >= 1 && cell <= 5) {
      return true;
    } else {
      return false;
    }
  },
  nextCellState(cell) {
    if (cell > 1 && cell <= 5) {
      return cell - 1;
    } else if (cell == 1) {
      return cell;
    } else {
      return 0;
    }
  },
  getNextGridGeneration(gridData) {
    const nextGridState = [];

    for (let y = 0; y < gridData.length; y++) {
      nextGridState[y] = [];
      for (let x = 0; x < gridData[y].length; x++) {
        let nbNeighbors = this.getNeighbors(gridData, x, y);
        let currentCell = gridData[y][x];
        if (
          this.isCellAlive(currentCell) === true &&
          (nbNeighbors === 2 || nbNeighbors === 3)
        ) {
          nextGridState[y][x] = this.nextCellState(currentCell);
        } else if (
          this.isCellAlive(currentCell) === true &&
          (nbNeighbors < 2 || nbNeighbors > 3)
        ) {
          nextGridState[y][x] = 0;
        } else if (
          this.isCellAlive(currentCell) === false &&
          nbNeighbors === 3
        ) {
          nextGridState[y][x] = 5;
        } else {
          nextGridState[y][x] = this.nextCellState(currentCell);
        }
      }
    }

    return nextGridState;
  },
};
