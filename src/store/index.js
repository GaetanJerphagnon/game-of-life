import { createStore } from "vuex";
import GameLogic from "@/logic/GameLogic";

export default createStore({
  state: {
    rowNumber: 50,
    columnNumber: 80,
    gridData: [],
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
  },

  getters: {
    getGridData(state) {
      return state.gridData;
    },
    getCellState: (state) => (row, col) => {
      return state.gridData[row][col];
    },
    getRowNumber: (state) => {
      return state.rowNumber;
    },
    getColumnNumber: (state) => {
      return state.columnNumber;
    },
  },

  // Modules are use to separate the state in different files.
  modules: {},
});
