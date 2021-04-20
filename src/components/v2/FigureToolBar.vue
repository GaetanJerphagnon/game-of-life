<template>
  <div
    id="figure-toolbar"
    class="d-flex align-items-center flex-row"
    v-if="isDisplayed"
  >
    <div class="button" @click="toggleDisplay">
      <i class="fa fa-arrow-left"></i>
    </div>
    <div class="container d-flex justify-content-center align-items-center">
      <Figure
        @stop-drag-figure="handleStopDrag"
        v-for="(fig, index) in figures"
        :key="index"
        @drag-figure="handleDrag(index)"
        :figure="fig"
        :description="index"
        :row="parseInt(fig[0].split('x')[0])"
        :col="parseInt(fig[0].split('x')[1])"
        :isSelected="figureSelected == index && !unselectFigures"
      />
    </div>
  </div>
  <div
    id="figure-toolbar-hidden"
    class="d-flex justify-content-center align-items-center"
    @click="toggleDisplay"
    v-if="!isDisplayed"
  >
    <div class="button">
      <i class="fas fa-shapes"></i><i class="fa fa-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import Figure from "@/components/v2/Figure";

export default {
  components: {
    Figure,
  },
  data() {
    return {
      isDisplayed: false,
      figureSelected: null,
      figures: this.$store.getters.getFigures,
      figureVal: [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
    };
  },
  props: {
    unselectFigures: {
      Required: true,
      Type: Boolean,
      default: true,
    },
  },
  methods: {
    handleDrag(id) {
      this.figureSelected = id;
      this.$emit("drag-figure", this.figures[id]);
    },
    handleStopDrag() {
      this.$emit("stop-drag-figure");
      this.figureSelected = null;
    },
    toggleDisplay() {
      this.isDisplayed = !this.isDisplayed;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#figure-toolbar {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 8em;
  width: 100%;
  background: $darkerMainColor;
  box-shadow: $mainColor 0 0 10px;
  margin-top: 15px;
}
#figure-toolbar-hidden {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 8em;
  background: $darkerMainColor;
  box-shadow: $mainColor 0 0 10px;
  margin-top: 15px;
}
i {
  color: $oppositeColor;
  font-size: 1em;
  margin: 5px;
  transition: ease-in-out 0.15s;
}
.button {
  padding: 0;
  height: 100%;
  width: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $mainColor;
}
.button:hover i {
  filter: drop-shadow($lighterOppositeColor 0 0 10px);
}
.container {
  height: 100%;
}
</style>
