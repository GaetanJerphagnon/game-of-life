<template>
  <div
    class="cell"
    style=""
    :title="'(x: ' + xPos + ', y: ' + yPos + ')'"
    @mousedown="toggleState()"
  ></div>
</template>

<script>
export default {
  name: "Cell",
  props: {
    xPos: {
      type: Number,
      required: true,
    },
    yPos: {
      type: Number,
      Required: true,
    },
    isAlive: {
      type: Boolean,
      Required: true,
    },
  },
  computed: {},
};
</script>

<style scoped></style>
