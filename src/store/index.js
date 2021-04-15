import { createStore } from "vuex";
import GameLogic from "@/logic/GameLogic";

export default createStore({
  state: {
    rowNumber: 30,
    columnNumber: 50,
    gridData: [],
    editorGridData: [],
  },

  // Mutations are function that affect the State.
  mutations: {
    SET_CELLS_PER_ROW(state, int) {
      state.cellsPerRow = int;
    },
    SET_CELLS_PER_COLUMN(state, int) {
      state.cellsPerColumn = int;
    },
    SET_GRID_DATA(state, array) {
      state.gridData = array;
      state.editorGridData = array;
    },
    SET_CELL_ALIVE(state, coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      state.gridData[x][y] = true;
    },
    SET_EDITOR_CELL_ALIVE(state, coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      state.editorGridData[x][y] = true;
    },
    TOGGLE_CELL_STATE(state, coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      if (state.gridData[x][y] === true) {
        state.gridData[x][y] = false;
      } else {
        state.gridData[x][y] = true;
      }
    },
  },

  // Actions call mutations, and are called throughout the application.
  actions: {
    initGrid({ commit }) {
      const emptyGrid = GameLogic.getEmptyGrid(
        this.state.rowNumber,
        this.state.columnNumber
      );

      commit("SET_GRID_DATA", emptyGrid);
    },

    nextGridState({ commit, state }) {
      const nextGrid = GameLogic.getNextGridGeneration(state.gridData);

      commit("SET_GRID_DATA", nextGrid);
    },

    setGridData({ commit }, gridData) {
      commit("SET_GRID_DATA", gridData);
    },
    toggleCellState({ commit }, coordinates) {
      commit("TOGGLE_CELL_STATE", coordinates);
    },
    setCellAlive({ commit }, coordinates) {
      commit("SET_CELL_ALIVE", coordinates);
    },
    setEditorCellAlive({ commit }, coordinates) {
      commit("SET_CELL_ALIVE", coordinates);
    },
  },

  getters: {
    getGridData(state) {
      return state.gridData;
    },
    getCellState: (state) => (row, col) => {
      return state.gridData[row][col];
    },
    getEditorCellState: (state) => (row, col) => {
      return state.editorGridData[row][col];
    },
    getRowNumber: (state) => {
      return state.rowNumber;
    },
    getColumnNumber: (state) => {
      return state.columnNumber;
    },
    getAliveCellsPosition: (state) => {
      const cells = [];
      for (let x = 0; x < state.columnNumber; x++) {
        for (let y = 0; y < state.rowNumber; y++) {
          if (state.gridData[y][x] === true) {
            cells.push([y, x]);
          }
        }
      }
      return cells;
    },
  },

  // Modules are use to separate the state in different files.
  modules: {},
});
