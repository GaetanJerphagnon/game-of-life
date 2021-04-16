<template>
  <div
    id="grid"
    class="container-fluid px-0"
    :style="'max-width:' + columnNumber * cellSize + ';'"
  >
    <tool-bar
      :isRunning="isRunning"
      :speed="speed"
      @clear-grid="clearGrid"
      @put-starter="putStarter"
      @slow-down="slowDown"
      @speed-up="speedUp"
      @start-game="startGame"
      @stop-game="stopGame"
      @tick="tick"
    />
    <canvas
      ref="gameGrid"
      id="gameGrid"
      @mousedown="startEdit"
      @mousemove="editCell"
      @mouseup="stopEdit"
      :class="{ grid_running: isRunning, grid_editor_pause: isEditing }"
      :width="columnNumber * cellSize"
      :height="rowNumber * cellSize"
    />
  </div>
</template>

<script>
import ToolBar from './ToolBar.vue';
export default {
  components: { ToolBar },
  name: "Grid",
  /*   components: {
    Cell,
  }, */
  data() {
    return {
      gridWidth: 1000, // Grid width in pixel
      cellBorder: 1, // Cell separation in pixel
      rowNumber: this.$store.getters.getRowNumber, // Row amount from store
      columnNumber: this.$store.getters.getColumnNumber, // Column amount from store
      isRunning: false, // Tells is the game is running
      isEditing: false, // Tells if the game is in editor mode
      wasRunning: false, // Tells if the game was pause during an editor mode
      context: null, // Context for canvas
      speedValue:{
        1:160,
        2:120,
        3:80,
        4:40,
        5:5,
      },
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
    speed() {
      return this.$store.getters.getSpeed;
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
    drawCells() {
      for (let y = 0; y < this.rowNumber; y++) {
        for (let x = 0; x < this.columnNumber; x++) {
          let cellState = this.$store.getters["getCellState"](x, y);
          if (cellState) {
            this.context.fillStyle = "#0b2f72";
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
            this.context.fillStyle = "rgb(212, 23, 156)";
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
    editCell(e){
      if (this.isEditing){
        let x = Math.floor(e.offsetX / this.cellSize);
        let y = Math.floor(e.offsetY / this.cellSize);
        if(x >= 0 && x<this.columnNumber && y>=0 && y<this.rowNumber){

          if(this.$store.getters["getCellState"](x, y) !== true){
            if(e.which == 1){ // Left Click, give birth
              this.$store.dispatch("setEditorCellAlive",[x,y]);
              this.drawEditorCells();
            }
          }
          if(this.$store.getters["getCellState"](x, y) == true){
            if (e.which == 2) {// Wheel Click, kill
              this.$store.dispatch("setEditorCellDead",[x,y]);
              this.drawEditorCells();
            }
          }
        }
      }
    },
    // Not used yet
    getAliveCellsPosition(){
      let livingCells = this.$store.getters["getAliveCellsPosition"];
      console.log(livingCells)
    },
    // Not used anymore
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
    slowDown(){
      this.$store.dispatch("slowDown");
    },
    speedUp(){
      this.$store.dispatch("speedUp");
    },
    startEdit(e){
      this.isEditing = true;

      this.editCell(e);
      this.drawEditorCells();
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
            this.speedValue[this.speed]
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
    this.drawCells();
    //this.putStarter();
  },
  unmounted(){
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style scoped>
#gameGrid {
  border: 10px solid rgb(117, 117, 117);
  background-color: rgb(71, 71, 71);
  border-radius: 10px;
  box-shadow: 0 0 10px black;
}
.grid_editor_pause {
  border: 10px solid rgb(84, 0, 95) !important;
}
.grid_running {
  border: 10px solid rgb(0, 33, 95) !important;
}
</style>
