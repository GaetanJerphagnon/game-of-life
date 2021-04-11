<template>
  <div class="toolbar">
    <nav class="navbar navbar-light container bg-secondary justify-content-start">
        <button class="btn btn-success mx-2 my-2 my-sm-0" type="submit" @click="startGame()">Start</button>
        <button class="btn btn-danger mx-2my-2 my-sm-0" type="submit" @click="clearGrid()">Clear</button>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'ToolBar',
  methods: {
      startGame(){
          this.$emit('start-game');
      },
      clearGrid(){
          this.$emit('clear-grid');
      }
  }
}
</script>
