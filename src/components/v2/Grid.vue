<template>
  <div
    class="container-fluid"
    :style="'max-width:' + columnNumber * cellSize + ';'"
  >
    <div class="row container d-flex justify-content-center py-1 px-0 mx-auto">
      <div class="nav-control-left col-5"></div>

      <div class="nav-control-center col-2">
        <button v-if="!isRunning" class="btn btn-success" @click="startGame">
          Start
        </button>
        <button v-if="isRunning" class="btn btn-danger" @click="stopGame">
          Stop
        </button>
      </div>

      <div class="nav-control-right col-5">
        <button class="btn btn-warning" @click="clearGrid">
          Clear
        </button>
        <button v-if="!isRunning" class="btn btn-info" @click="tick">
          Tick
        </button>
        <div v-if="isRunning" class="btn btn-secondary" disbaled>
          Tick
        </div>
        <button class="btn btn-light" @click="putStarter">
          Starter
        </button>
      </div>
    </div>
    <canvas
      ref="gameGrid"
      id="gameGrid"
      @mousedown="startEdit"
      @mousemove="giveBirth"
      @mouseup="stopEdit"
      :width="columnNumber * cellSize"
      :height="rowNumber * cellSize"
    />
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
      gridWidth: 1200, // Grid width in pixel
      cellBorder: 1, // Cell separation in pixel
      rowNumber: this.$store.getters.getRowNumber, // Row amount from store
      columnNumber: this.$store.getters.getColumnNumber, // Column amount from store
      isRunning: false, // Tells is the game is running
      isEditing: false, // Tells if the game is in editor mode
      wasRunning: false, // Tells if the game was pause during an editor mode
      context: null, // Context for canvas
      starter: [ // Starter figure, for tests
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
    totalWidth() {
      return this.cellSize * this.columnNumber;
    },
    totalHeight() {
      return this.cellSize * this.rowNumber;
    },
  },
  methods: {
    clearGrid(){
        this.$store.dispatch("initGrid", {
        rowNumber: this.rowNumber,
        columnNumber: this.columnNumber,
      });
      this.drawCells();
      this.stopGame();
    },

    drawGridSquares() {
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
            this.context.fillStyle = this.getRandAliveColor();
          } else {
            this.context.fillStyle = this.getRandDeadColor();
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
    drawEditorCells() {
      for (let y = 0; y < this.rowNumber; y++) {
        for (let x = 0; x < this.columnNumber; x++) {
          let cellState = this.$store.getters["getEditorCellState"](x, y);
          if (cellState) {
            this.context.fillStyle = "turquoise";
          } else {
            this.context.fillStyle = "white";
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
    // Not used yet
    getAliveCellsPosition(){
      let livingCells = this.$store.getters["getAliveCellsPosition"];
      console.log(livingCells)
    },
    giveBirth(e){
      if (this.isEditing){
        let x = Math.floor(e.offsetX / this.cellSize);
        let y = Math.floor(e.offsetY / this.cellSize);
        if(this.$store.getters["getCellState"](x, y) !== true){
          this.$store.dispatch("setEditorCellAlive",[x,y]);
          this.drawEditorCells();
        }
      }
    },
    getRandAliveColor(){
      return "rgb("+ Math.floor(Math.random()*20+20) +", "+ Math.floor(Math.random()*60+100) +", "+ Math.floor(Math.random()*30+190) +")"
    },
    getRandDeadColor(){
      let num = Math.floor(Math.random()*10+235);
      return "rgb("+ num +", "+ num +", "+ num +")"
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
      this.drawCells();
    },
    startEdit(e){
      this.isEditing = true;
      this.giveBirth(e);
      if (this.isRunning){
        this.stopGame();
        this.wasRunning = true;
      }
    },
    stopEdit(){
      this.isEditing = false;
      if(this.wasRunning){
        this.startGame();
        this.wasRunning = false;
      }
      this.drawCells();
    },
    startGame() {
      this.isRunning = true;
      this.timer = setTimeout(
        function tick() {
          this.tick();
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
    tick(){
      this.nextGridState();
      this.drawCells();
    }
  },
  mounted() {
    this.context = this.$refs.gameGrid.getContext("2d");
    this.$store.dispatch("initGrid", {
      rowNumber: this.rowNumber,
      columnNumber: this.columnNumber,
    });
    //this.putStarter();
    this.drawCells();
  },
};
</script>

<style scoped>
.btn {
  width: 80px;
  margin: 5px 10px;
}
</style>
