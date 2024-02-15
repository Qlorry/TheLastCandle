<template>
  <div>
    <div ref="threeJsContainerRef" style="width: 100%; height: 100vh;"></div>
    <canvas ref="tileCanvasRef" width="256" height="256" v-show="false"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { GameBoard } from '../rendering/GameBoard';

  const threeJsContainerRef = ref(HTMLElement);
  const tileCanvasRef = ref(HTMLCanvasElement);

  onMounted(() => {
    if (threeJsContainerRef.value && tileCanvasRef.value) {
      new GameBoard(threeJsContainerRef.value, tileCanvasRef.value);
    }
  });
</script>