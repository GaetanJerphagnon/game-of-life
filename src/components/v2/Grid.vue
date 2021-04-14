<template>
  <div
    class="container-fluid"
    :style="'max-width:' + columnNumber * cellSize + ';'"
  >
    <div class="row container">
      <button v-if="!isRunning" class="btn btn-success" @click="startGame">
        Start
      </button>
      <button v-if="isRunning" class="btn btn-danger" @click="stopGame">
        Stop
      </button>
    </div>
    <canvas
      ref="gameGrid"
      id="gameGrid"
      :width="columnNumber * cellSize"
      :height="rowNumber * cellSize"
    />
    <!-- <div class="grid d-flex flex-column align-items-center">
      <div v-for="(y, rowIndex) in rowNumber" :key="rowIndex" class="row">
        <div
          v-for="(x, columnIndex) in columnNumber"
          :key="columnIndex"
          class="column"
        >
          <Cell :xPos="x" :yPos="y" :isAlive="giveBirth()" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "Grid",
  /*   components: {
    Cell,
  }, */
  data() {
    return {
      gridWidth: 1200,
      cellBorder: 1,
      rowNumber: this.$store.getters.getRowNumber,
      columnNumber: this.$store.getters.getColumnNumber,
      isRunning: false,
      context: null,
      time: null,
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
  computed: {
    cellSize() {
      return this.gridWidth / this.columnNumber + this.cellBorder;
    },
  },
  methods: {
    drawGridSquares() {
      console.log("drawing squares");
      // Design canvas Xs
      for (let n = 1; n < this.columnNumber; n++) {
        this.context.strokeStyle = "grey";
        this.context.beginPath();
        this.context.lineWidth = 0.5;
        this.context.lineCap = "square";
        this.context.moveTo(n * this.cellSize, 0);
        this.context.lineTo(n * this.cellSize, this.rowNumber * this.cellSize);
        this.context.stroke();
        this.context.closePath();
      }

      // Design canvas Ys
      for (let n = 1; n < this.rowNumber; n++) {
        this.context.strokeStyle = "grey";
        this.context.beginPath();
        this.context.lineWidth = 0.5;
        this.context.lineCap = "square";
        this.context.moveTo(0, n * this.cellSize);
        this.context.lineTo(
          this.columnNumber * this.cellSize,
          n * this.cellSize
        );
        this.context.stroke();
        this.context.closePath();
      }
    },
    drawCells() {
      for (let y = 0; y < this.rowNumber; y++) {
        for (let x = 0; x < this.columnNumber; x++) {
          let cellState = this.$store.getters["getCellState"](x, y);
          if (cellState) {
            this.context.fillStyle = "#1350aa";
          } else {
            this.context.fillStyle = "lightgrey";
          }
          this.context.fillRect(
            x * this.cellSize + this.cellBorder,
            y * this.cellSize + this.cellBorder,
            this.cellSize - this.cellBorder,
            this.cellSize - this.cellBorder
          );
        }
      }
    },
    nextGridState() {
      this.$store.dispatch('nextGridState')
    },
    putStarter() {
      let gridData = this.$store.getters.["getGridData"];
      for (let i = 0; i < this.starter.length; i++) {
        let x = this.starter[i][0];
        let y = this.starter[i][1];
        gridData[x][y] = true;
      }
      this.$store.dispatch("setGridData", gridData);
    },
    startGame() {
      this.isRunning = true;
      this.timer = setTimeout(
        function tick() {
          console.log('tick');
          this.nextGridState();
          this.drawCells();
          this.timer = setTimeout(
            tick.bind(this),
            10
          )
        }.bind(this),
        10
      )
    },
    stopGame() {
      this.isRunning = false;
      clearTimeout(this.timer)
    },
  },
  mounted() {
    this.context = this.$refs.gameGrid.getContext("2d");
    this.$store.dispatch("initGrid", {
      rowNumber: this.rowNumber,
      columnNumber: this.columnNumber,
    });
    this.putStarter();
    this.drawCells();
    this.$store.dispatch("toggleCellState", [1, 1]);
  },
};
</script>

<style scoped>
.container-fluid {
  margin: 2% auto;
  background-color: tan;
  height: 100vh;
}

#gameGrid {
  background-color: #999999;
  margin: 2% auto;
}
</style>
