<template>
  <h1>Conway's Game of life v1</h1>
  <GameOfLife/>
</template>

<script>
import GameOfLife from './components/GameOfLife.vue'

export default {
  name: 'App',
  components: {
    GameOfLife,
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1{
  align-self: center;
  color: royalblue;
}
</style>
