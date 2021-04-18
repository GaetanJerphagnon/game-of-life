<template>
  <div
    v-if="grid !== null"
    :class="{
      selected: isSelected,
    }"
    class="figure-container mx-2 p-1"
  >
    <div
      class="figure col-12 d-flex flex-column justify-content-center align-items-center"
      @mousedown="handleMouseDown"
    >
      <div
        v-for="r in row"
        :key="r"
        class="row d-flex flex-row justify-content-center"
      >
        <div
          v-for="c in col"
          :key="c"
          class="col"
          :class="{
            active: grid[r - 1][c - 1] == 1,
            first: grid[r - 1][c - 1] == 2,
          }"
          :style="
            'width: ' +
              cellSize +
              'px' +
              ';height: ' +
              cellSize +
              'px' +
              ';border: ' +
              cellBorder +
              'px solid rgb(180,180,180)'
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Figure",
  data() {
    return {
      firstDrawn: false,
      grid: null,
      colors: [],
      cellBorder: 1,
      gridWidth: 150,
      gridHeight: 0,
      context: null,
    };
  },
  computed: {
    rowNumber() {
      return this.figure.length;
    },
    columnNumber() {
      return this.figure[0].length;
    },
    cellSize() {
      let value = 0;
      if (this.gridHeight == 0) {
        value = this.gridWidth / this.col - this.cellBorder;
      } else {
        value = this.gridHeight / this.row - this.cellBorder;
      }
      if (value > 20) {
        return 20;
      }
      return value;
    },
    totalWidth() {
      return this.cellSize * this.col;
    },
    totalHeight() {
      return this.cellSize * this.row;
    },
  },
  props: {
    figure: {
      Required: true,
      Type: Array,
    },
    isSelected: {
      Required: false,
      Type: Boolean,
      default: false,
    },
    row: {
      Required: true,
      Type: Number,
    },
    col: {
      Required: true,
      Type: Number,
    },
  },
  methods: {
    drawCells() {
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid[0].length; x++) {
          let cellState = this.grid[y][x];
          if (cellState == 1) {
            this.context.fillStyle = this.colors.opposite;
          } else {
            this.context.fillStyle = "grey";
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
    getColors() {
      this.colors.main = getComputedStyle(
        document.querySelector(".main-btn")
      ).borderColor;
      this.colors.opposite = getComputedStyle(
        document.querySelector(".speed")
      ).borderColor;
    },
    getGrid(columnNumber, rowNumber) {
      let gridToReturn = [];

      for (let x = 0; x < rowNumber; x++) {
        const row = [];
        for (let y = 0; y < columnNumber; y++) {
          if (y + x == 0) {
            row.push(2);
          } else {
            row.push(0);
          }
        }
        gridToReturn.push(row);
      }

      this.figure.forEach((e) => {
        gridToReturn[e[1]][e[0]] = 1;
      });

      this.grid = gridToReturn;
    },
    handleMouseDown() {
      if (this.isSelected) {
        this.$emit("stop-drag-figure");
      } else if (!this.isSelected) {
        this.$emit("drag-figure");
      }
    },
    isTall() {
      if (this.row > this.col) {
        this.gridHeight = 150;
      }
    },
  },
  mounted() {
    this.getColors();
    this.getGrid(this.col, this.row);
    this.isTall();
    console.log(this.grid);
  },
};
</script>

<style lang="scss" scoped>
.figure-container {
  background-color: rgb(167, 167, 167);
  border: $oppositeColor 1px solid;
  transition: ease-in-out 0.15s;

  &:hover {
    box-shadow: $oppositeColor 0 0 15px;
  }
}
.selected {
  background-color: $mainColor !important;
  box-shadow: $oppositeColor 0 0 25px;
}
.figure {
  width: 140px;
  height: 140px;
}
.col {
  padding: 0;
  line-height: 10px;
  background-color: rgb(204, 202, 202);
}
.first {
  background-color: $oppositeColor;
}
.active {
  background-color: $darkerOppositeColor;
}
</style>
