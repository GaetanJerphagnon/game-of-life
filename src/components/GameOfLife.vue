<template>
  <div class="toolbar d-flex flex-column justify-content-between">
    <div
      class="navbar navbar-light container bg-secondary justify-content-start"
    >
      <h2>Conway's Game of life v1</h2>
      | Infos:
      <span v-if="isRunning">
        <i class="fa fa-sync-alt"></i> Game's running
      </span>
    </div>
    <nav
      class="navbar navbar-light container bg-secondary justify-content-start"
    >
      <button
        v-if="!isRunning"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Start the game and watch how cells develop!"
        class="btn btn-success mx-2 my-2 my-sm-0"
        type="submit"
        @click="startGame()"
      >
        <i class="fa fa-play"></i>
      </button>
      <button
        v-else
        data-toggle="tooltip"
        data-placement="bottom"
        title="Stop cells from developing"
        class="btn btn-danger mx-2 my-2 my-sm-0"
        type="submit"
        @click="stopGame()"
      >
        <i class="fa fa-stop"></i>
      </button>
      <button
        data-toggle="tooltip"
        data-placement="bottom"
        title="Compute and render only the next generation of life"
        class="btn btn-info mx-2 my-2 my-sm-0"
        type="submit"
        @click="nextTick()"
      >
        Tick <i class="fa fa-stopwatch"></i>
      </button>
      <button
        data-toggle="tooltip"
        data-placement="bottom"
        title="Reset all cells to dead state"
        class="btn btn-warning mx-2 my-2 my-sm-0"
        type="submit"
        @click="setGrid()"
      >
        Clear <i class="fa fa-eraser"></i>
      </button>
      <button
        data-toggle="tooltip"
        data-placement="bottom"
        title="Put starter figure in center of the grid"
        class="btn btn-primary mx-2 my-2 my-sm-0"
        type="submit"
        @click="setStarter()"
      >
        Starter <i class="fa fa-shapes"></i>
      </button>

      <div
        class="navbar navbar-light container bg-secondary justify-content-start"
      >
        <span class="text-light">
          Left click :
          <span class="font-weight-bold text-danger">
            Life <i class="fa fa-heart"></i></span
          ><br />
          Mousewheel click :
          <span class="font-weight-bold text-dark">
            Death <i class="fa fa-skull-crossbones"></i
          ></span>
        </span>
      </div>
    </nav>
  </div>
  <div class="game"></div>
</template>

<script>
export default {
  name: "Game",
  data() {
    return {
      columnsAmount: 70,
      rowsAmount: 40,
      cellSize: 10,
      grid: [],
      isRunning: false,
      interval: null,
      starter: [
        [31, 19],
        [31, 20],
        [31, 21],
        [32, 18],
        [32, 22],
        [33, 17],
        [34, 17],
        [33, 23],
        [34, 23],
        [35, 20],
        [36, 18],
        [36, 22],
        [37, 19],
        [37, 20],
        [37, 21],
        [38, 20],
      ],
    };
  },
  methods: {
    setGrid() {
      this.calculateCells();
      let e = document.querySelector(".game");
      e.innerHTML = "";
      for (let rowNum = 0; rowNum < this.grid.length; rowNum++) {
        var row = document.createElement("div");
        row.className = "row";
        for (let colNum = 0; colNum < this.grid[rowNum].length; colNum++) {
          var cell = document.createElement("div");
          cell.className = "cell";
          cell.classList.add("cell--dead");
          cell.setAttribute("data-coordinates", colNum + "-" + rowNum);
          cell.setAttribute("data-x", colNum);
          cell.setAttribute("data-y", rowNum);
          cell.setAttribute("data-live", false);
          cell.setAttribute("data-tocompute", false);
          row.appendChild(cell);
        }
        e.appendChild(row);
      }
    },

    setStarter() {
      this.setGrid;
      this.starter.forEach((item) => {
        let x = item[0];
        let y = item[1];
        this.grid[y][x] = true;
        this.getCell(x, y).classList.remove("cell--dead");
        this.getCell(x, y).classList.add("cell--alive");
      });
    },

    onMouseDown(e) {
      let cell = e.target;
      if (e.target.classList.contains("cell")) {
        if (e.which == 2) {
          this.killCell(e);
          document
            .querySelector(".game")
            .addEventListener("mouseup", this.stopMouseDown);
          document.querySelectorAll(".cell").forEach((item) => {
            item.addEventListener("mouseenter", this.killCell);
          });
        } else if (e.which == 1) {
          cell.classList.add("cell--prepare");
          document
            .querySelector(".game")
            .addEventListener("mouseup", this.stopMouseDown);
          document.querySelectorAll(".cell").forEach((item) => {
            item.addEventListener("mouseenter", this.prepareToggleLife);
          });
        }
      }
    },

    stopMouseDown() {
      document
        .querySelector(".game")
        .removeEventListener("mouseup", this.stopMouseDown);
      document.querySelectorAll(".cell").forEach((item) => {
        item.removeEventListener("mouseenter", this.prepareToggleLife);
        item.removeEventListener("mouseenter", this.killCell);
      });
      document.querySelectorAll(".cell--prepare").forEach((item) => {
        let x = item.dataset.x;
        let y = item.dataset.y;
        this.grid[y][x] = !this.grid[y][x];
        item.classList.remove("cell--prepare");
        item.classList.add("cell--alive");
      });
    },

    prepareToggleLife(e) {
      let cell = e.target;
      cell.classList.add("cell--prepare");
    },

    toggleLife(e) {
      let cell = e.target;
      let x = cell.dataset.x;
      let y = cell.dataset.y;
      this.grid[y][x] = !this.grid[y][x];
      cell.classList.toggle("cell--dead");
      cell.classList.toggle("cell--alive");
    },

    killCell(e) {
      let cell = e.target;
      let x = cell.dataset.x;
      let y = cell.dataset.y;
      this.grid[y][x] = false;
      cell.classList.add("cell--dead");
      cell.classList.remove("cell--alive");
    },

    calculateCells() {
      let grid = [];
      for (let rowIndex = 0; rowIndex < this.rowsAmount; rowIndex++) {
        grid[rowIndex] = [];
        for (
          let columnIndex = 0;
          columnIndex < this.columnsAmount;
          columnIndex++
        ) {
          grid[rowIndex][columnIndex] = false;
        }
      }
      this.grid = grid;
    },

    startGame() {
      this.isRunning = true;
      this.interval = setInterval(this.nextTick, 70);
    },

    stopGame() {
      this.isRunning = false;
      clearInterval(this.interval);
    },

    nextTick() {
      this.selectAliveCells();
      this.renderNextState();
    },

    selectAliveCells() {
      let aliveCells = document.querySelectorAll(".cell--alive");
      aliveCells.forEach((cell) => {
        cell.setAttribute("data-tocompute", true);
        this.setNeighbors(cell);
      });
      let toComputeCells = document.querySelectorAll("[data-tocompute=true]");
      toComputeCells.forEach((cell) => {
        this.nextStateCell(cell);
      });
    },

    setNeighbors(cell) {
      let x = parseInt(cell.dataset.x);
      let y = parseInt(cell.dataset.y);

      for (let yy = y - 1; yy <= y + 1; yy++) {
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (
            !(xx == x && yy == y) &&
            xx >= 0 &&
            yy >= 0 &&
            xx <= this.columnsAmount &&
            yy <= this.rowsAmount
          ) {
            var neighbor = document.querySelector(
              '[data-coordinates="' + xx + "-" + yy + '"]'
            );
            if (
              neighbor.classList.contains("cell--alive") != true &&
              neighbor.dataset.tocompute != true
            ) {
              neighbor.setAttribute("data-tocompute", true);
            }
          }
        }
      }
    },

    getCell(x, y) {
      let cell = document.querySelector(
        '[data-coordinates="' + x + "-" + y + '"]'
      );
      return cell;
    },

    nextStateCell(cell) {
      let x = parseInt(cell.dataset.x);
      let y = parseInt(cell.dataset.y);
      let cpt = 0;
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y - 1][x - 1]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y - 1][x]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y - 1][x + 1]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y][x - 1]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y][x + 1]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y + 1][x - 1]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y + 1][x]
      ) {
        cpt++;
      }
      if (
        x > 0 &&
        y > 0 &&
        x < this.columnsAmount - 1 &&
        y < this.rowsAmount - 1 &&
        this.grid[y + 1][x + 1]
      ) {
        cpt++;
      }

      if (this.grid[y][x]) {
        if (cpt === 2 || cpt === 3) {
          cell.setAttribute("data-live", true);
        } else {
          cell.setAttribute("data-live", false);
        }
      } else {
        if (cpt === 3) {
          cell.setAttribute("data-live", true);
        } else {
          cell.setAttribute("data-live", false);
        }
      }
    },

    renderNextState() {
      document.querySelectorAll("[data-live=true]").forEach((cell) => {
        cell.classList.remove("cell--dead");
        cell.classList.add("cell--alive");
        let x = parseInt(cell.dataset.x);
        let y = parseInt(cell.dataset.y);
        this.grid[y][x] = true;
      });
      document.querySelectorAll("[data-live=false]").forEach((cell) => {
        cell.classList.add("cell--dead");
        cell.classList.remove("cell--alive");
        let x = parseInt(cell.dataset.x);
        let y = parseInt(cell.dataset.y);
        this.grid[y][x] = false;
      });
    },
  },

  mounted() {
    this.setGrid();
    document
      .querySelector(".game")
      .addEventListener("mousedown", this.onMouseDown);
  },
  /* props: {
    msg: String
  } */
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  display: flex;
  height: 95vh;
  background-color: rgb(13, 16, 19);
  flex-direction: column;
  justify-content: center;
}
.game {
  display: flex;
  flex-direction: column;
  background-color: rgb(41, 41, 41);
  width: 780px;
  padding: 1%;
  margin: auto;
}
.row {
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.cell {
  box-sizing: border-box;
  margin-right: 1px;
  /* border-right: 0.5px lightgray solid; */
  margin-bottom: 1px;
  width: 10px;
  height: 10px;
}
.cell--dead {
  background-color: rgb(110, 110, 110);
}

.cell--alive {
  background-color: rgb(94, 186, 247);
}

.cell--prepare {
  box-shadow: inset rgba(255, 136, 0, 0.35) 0px 0px 50px;
}

.cell--hidden {
  background-color: greenyellow;
}

h2 {
  color: wheat;
  font-weight: bold;
}
</style>
