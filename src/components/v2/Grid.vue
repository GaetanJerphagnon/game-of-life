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
      @mouseup="handleMouseUp"
      :class="{
        grid_running: isRunning,
        grid_editor_pause: isEditing,
        cursor_editor: isEditing,
      }"
      :width="columnNumber * cellSize"
      :height="rowNumber * cellSize"
    />
    <figure-tool-bar
      @drag-figure="handleDrag"
      @stop-drag-figure="handleStopDrag"
      :unselectFigures="dragPayload == null"
    />
  </div>
</template>

<script>
import ToolBar from './ToolBar.vue';
import FigureToolBar from './FigureToolBar.vue';
export default {
  components: { ToolBar, FigureToolBar },
  name: "Grid",
  data() {
    return {
      gridWidth: 1000, // Grid width in pixel
      cellBorder: 1, // Cell separation in pixel
      rowNumber: this.$store.getters.getRowNumber, // Row amount from store
      columnNumber: this.$store.getters.getColumnNumber, // Column amount from store
      isRunning: false, // Tells is the game is running
      isEditing: false, // Tells if the game is in editor mode
      dragPayload: null, // Tells if the user is currently dragging a figure and which figure
      wasRunning: false, // Tells if the game was pause during an editor mode
      context: null, // Context for canvas
      colors: [], // Got from main.js
      speedValue:{ // Time for each generation in ms
        1:160,
        2:120,
        3:80,
        4:40,
        5:5,
      },
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
  watch: {
    gridWidth: function (){
      this.context.clearRect(
            0,
            0,
            this.totalWidth,
            this.totalHeight);
      setTimeout(this.drawCells,10); // Doesn't work without Timeout
    }
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
    lightenColor(color, amount){
      let valsStr = color.substring(4);
      valsStr = valsStr.substring(0,valsStr.length-1);
      let vals = valsStr.split(',');
      for (let i =0; i < vals.length; i++){
        vals[i] = parseInt(vals[i]) + amount;
        if (parseInt(vals[i]) > 255){
          vals[i] = 255;
        }
      }
      return "rgb("+ vals[0] +","+ vals[1] +","+ vals[2] +")";
    },
    drawCells() {
      this.context.clearRect(0,0,this.totalWidth,this.totalHeight);
      for (let y = 0; y < this.rowNumber; y++) {
        for (let x = 0; x < this.columnNumber; x++) {
          let cellState = this.$store.getters["getCellState"](x, y);
          if (cellState <= 5 && cellState > 0) {
            if(this.colors["alive"+cellState]){
              this.context.fillStyle = this.colors["alive"+cellState];
            } else {
              this.context.fillStyle = this.colors.main;
            }
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
            if(this.colors["dead"+cellState]){
              this.context.fillStyle = this.colors["dead"+cellState];
            } else {
              this.context.fillStyle = this.colors.main;
            }
          } else {
            this.context.fillStyle = "rgb(240,240,240)";
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

          let cellState = this.$store.getters["getCellState"](x, y);

          if(cellState === 0){
            if(e.which == 1){ // Left Click, give birth
              this.$store.dispatch("setEditorCellAlive",[x,y]);
              this.drawEditorCells();
            }
          }
          if(cellState > 0 && cellState <= 5 ){
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
    getColors(){
      this.colors.main = getComputedStyle(document.querySelector('.main-btn')).borderColor;
      this.colors.opposite = getComputedStyle(document.querySelector('.speed')).borderColor;
      this.colors.alive1 = this.lightenColor(this.colors.main, -10);
      this.colors.alive2 = this.lightenColor(this.colors.main, 18);
      this.colors.alive3 = this.lightenColor(this.colors.alive2, 18);
      this.colors.alive4 = this.lightenColor(this.colors.alive3, 18);
      this.colors.alive5 = this.lightenColor(this.colors.alive4, 18);
      this.colors.dead1 = this.lightenColor(this.colors.opposite, -40);
      this.colors.dead2 = this.lightenColor(this.colors.opposite, 18);
      this.colors.dead3 = this.lightenColor(this.colors.dead2, 18);
      this.colors.dead4 = this.lightenColor(this.colors.dead3, 18);
      this.colors.dead5 = this.lightenColor(this.colors.dead4, 18);
    },
    // Not used anymore
    getRandAliveColor(){
      return "rgb("+ Math.floor(Math.random()*20+20) +", "+ Math.floor(Math.random()*60+100) +", "+ Math.floor(Math.random()*30+190) +")"
    },
    getRandDeadColor(){
      let num = Math.floor(Math.random()*10+235);
      return "rgb("+ num +", "+ num +", "+ num +")"
    },
    handleDrag(payload){
      this.dragPayload = payload;
    },
    handleStopDrag(){
      this.dragPayload = null;
    },
    handleMouseUp(event){
      this.isEditing = false;
      if(this.dragPayload != null){
        this.stopDrag(event);
      }
      if(this.wasRunning){
        this.startGame();
        this.wasRunning = false;
      }
      this.drawCells();
    },
    stopDrag(event){
      let x = Math.floor(event.offsetX / this.cellSize);
      let y = Math.floor(event.offsetY / this.cellSize);

      this.dragPayload.forEach(e => {
        this.$store.dispatch("setCellAlive",[x+e[0],y+e[1]]);
      });
      this.dragPayload = null;
      this.drawCells();
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
      if(this.dragPayload == null){
        this.editCell(e);
        this.drawEditorCells();
      }
      if (this.isRunning){
        this.stopGame();
        this.wasRunning = true;
      }
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
    },
    handleResize(){
      if(window.innerWidth < 1100){
        this.gridWidth = window.innerWidth*0.9;
      }
      if (window.innerWidth > 1100){
        this.gridWidth = 1000;
      }
      if (window.innerWidth > 1400){
        this.gridWidth = 1200;
      }
    },
  },
  mounted() {
    this.context = this.$refs.gameGrid.getContext("2d");
    this.$store.dispatch("initGrid");
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
    this.drawCells();
    this.getColors();
  },
  unmounted(){
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style lang="scss">
#gameGrid {
  border: 5px solid rgb(158, 158, 158);
  background-color: rgb(226, 226, 226);
  border-radius: 10px;
  box-shadow: 0 0 10px black;
  transition: 0.15s ease-in-out;
}
.cursor_editor {
  cursor: pointer;
}
.grid_editor_pause {
  border: 5px solid $oppositeColor !important;
}
.grid_running {
  border: 5px solid $darkerMainColor !important;
}
</style>
