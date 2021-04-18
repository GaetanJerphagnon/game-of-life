import { createStore } from "vuex";
import GameLogic from "@/logic/GameLogic";
import Figures from "@/figures/figures";

export default createStore({
  state: {
    rowNumber: 25,
    columnNumber: 50,
    speed: 3,
    gridData: [],
    editorGridData: [],
    figures: Figures,
  },

  // Mutations are function that affect the State.
  mutations: {
    SET_CELL_ALIVE(state, coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      state.gridData[x][y] = 5;
    },
    SET_ROW_NUMBER(state, int) {
      state.rowNumber = int;
    },
    SET_COLUMN_NUMBER(state, int) {
      state.columnNumber = int;
    },
    SET_EDITOR_CELL_ALIVE(state, coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      state.editorGridData[x][y] = 5;
    },
    SET_EDITOR_CELL_DEAD(state, coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      state.editorGridData[x][y] = 0;
    },
    SET_GRID_DATA(state, array) {
      state.gridData = array;
      state.editorGridData = array;
    },
    SLOW_DOWN(state) {
      if (state.speed > 1) {
        state.speed--;
      }
    },
    SPEED_UP(state) {
      if (state.speed < 5) {
        state.speed++;
      }
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
    setRowsAndCols({ commit }, data) {
      commit("SET_ROW_NUMBER", data[0]);
      commit("SET_COLUMN_NUMBER", data[1]);
    },
    setEditorCellAlive({ commit }, coordinates) {
      commit("SET_EDITOR_CELL_ALIVE", coordinates);
    },
    setEditorCellDead({ commit }, coordinates) {
      commit("SET_EDITOR_CELL_DEAD", coordinates);
    },
    slowDown({ commit }) {
      commit("SLOW_DOWN");
    },
    speedUp({ commit }) {
      commit("SPEED_UP");
    },
  },

  getters: {
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
    getCellState: (state) => (row, col) => {
      return state.gridData[row][col];
    },
    getColumnNumber: (state) => {
      return state.columnNumber;
    },
    getEditorCellState: (state) => (row, col) => {
      return state.editorGridData[row][col];
    },
    getFigures: (state) => {
      return state.figures;
    },
    getGridData(state) {
      return state.gridData;
    },
    getRowNumber: (state) => {
      return state.rowNumber;
    },
    getSpeed: (state) => {
      return state.speed;
    },
  },

  // Modules are use to separate the state in different files.
  modules: {},
});
