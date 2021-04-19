<template>
  <div id="figure-toolbar">
    <div
      class="container d-flex justify-content-center align-items-center flex-column"
    >
      <Figure
        @stop-drag-figure="handleStopDrag"
        v-for="(fig, index) in figures"
        :key="index"
        @drag-figure="handleDrag(index)"
        :figure="fig"
        :row="parseInt(index.split('x')[0])"
        :col="parseInt(index.split('x')[1])"
        :isSelected="figureSelected == index && !unselectFigures"
      />
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
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#figure-toolbar {
  height: 100vh;
  min-width: 150px;
  background: $darkerMainColor;
  border-right: $oppositeColor 1px solid;
}
.container {
  height: 100%;
}
</style>
