<template>
  <div
    id="navbar"
    class="row container-fluid d-flex justify-content-center align-items-center py-1 px-0 mx-auto"
  >
    <div
      class="nav-control-left col-5  d-flex flex-row justify-content-end align-items-center"
    >
      <div
        class="btn speed d-flex flex-row justify-content-center align-items-center m-0 p-0"
      >
        <div
          class="m-2 d-flex flex-column justify-content-center align-items-center"
        >
          <i class="fa fa-tachometer"></i>
          <div
            class="d-flex flex-row justify-content-center align-items-center"
          >
            <div
              class="indicator"
              :class="{ indicator_active: speed > 0 }"
            ></div>
            <div
              class="indicator"
              :class="{ indicator_active: speed > 1 }"
            ></div>
            <div
              class="indicator"
              :class="{ indicator_active: speed > 2 }"
            ></div>
            <div
              class="indicator"
              :class="{ indicator_active: speed > 3 }"
            ></div>
            <div
              class="indicator"
              :class="{ indicator_active: speed > 4 }"
            ></div>
          </div>
        </div>

        <div class="d-flex flex-column justify-content-center align-items-end">
          <button class="btn tiny-btn text-white" @click="speedUp">
            <i class="fa fa-arrow-up"></i>
          </button>
          <button class="btn tiny-btn text-white" @click="slowDown">
            <i class="fa fa-arrow-down"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="nav-control-center col-2">
      <button
        v-if="!isRunning"
        class="btn main-btn bg-main-color"
        @click="startGame"
      >
        <i class="fa fa-play"></i>
      </button>
      <button v-if="isRunning" class="btn main-btn bg-purple" @click="stopGame">
        <i class="fa fa-pause"></i>
      </button>
    </div>

    <div
      class="nav-control-right col-5 d-flex flex-row justify-content-start align-items-center"
    >
      <button class="btn btn-light bg-eraser " @click="clearGrid">
        <i class="far fa-eraser"></i>
      </button>
      <button v-if="!isRunning" class="btn btn-info" @click="tick">
        <i class="fa fa-stopwatch"></i>
      </button>
      <div v-if="isRunning" class="btn btn-secondary " disbaled>
        <i class="fa fa-stopwatch"></i>
      </div>
      <button class="btn btn-light " @click="putStarter">
        <i class="fas fa-shapes"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  props: {
    isRunning: {
      Required: true,
      Type: Boolean,
    },
    speed: {
      Required: true,
      Type: Number,
    },
  },
  methods: {
    clearGrid() {
      this.$emit("clear-grid");
    },
    putStarter() {
      this.$emit("put-starter");
    },
    slowDown() {
      this.$emit("slow-down");
    },
    speedUp() {
      this.$emit("speed-up");
    },
    startGame() {
      this.$emit("start-game");
    },
    stopGame() {
      this.$emit("stop-game");
    },
    tick() {
      this.$emit("tick");
    },
  },
};
</script>

<style lang="scss" scoped>
#navbar {
  background: $darkerMainColor;
  box-shadow: $mainColor 0 0 10px;
  margin-bottom: 15px;
}
.indicator {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin: 0 1px;
  background-color: rgb(129, 129, 129);
}
.indicator_active {
  background-color: $oppositeColor;
}
.btn {
  font-size: 1.4em;
  width: 60px;
  margin: 5px 10px;
  padding: 10px 0;
  border-radius: 0;
}
.tiny-btn {
  background-color: rgb(75, 75, 75);
  font-size: 0.8em;
  width: 20px;
  height: 25px;
  margin: 1px;
  padding: 0;
}
.speed {
  color: white;
  width: 100px;
  background-color: rgb(41, 41, 41);
  border: 1px $darkerOppositeColor solid;
}
.bg-eraser {
  border: 0px;
  background: linear-gradient(0.12turn, #e97bc4 50%, #2ca0ff 50%);
}
.bg-main-color {
  border: $mainColor 1px solid;
  background-color: $lighterMainColor;
  color: white;
}
.bg-purple {
  border: $oppositeColor 1px solid;
  background-color: $lighterOppositeColor;
  color: white;
}
.bg-purple:hover {
  background-color: $lighterOppositeColor;
}
</style>
