<template>
  <div class="app">
    <game-snake></game-snake>
  </div>
</template>

<script>
import GameSnake from '@/components/GameSnake.vue'
export default {
  name: 'App',
  components: {
    GameSnake
  }
}
</script>

<style>
@import '../public/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(45deg, #EECFBA, #C5DDE8);
}
</style>
