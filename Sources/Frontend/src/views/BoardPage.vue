<template>
  <div>
    <div ref="threeJsContainerRef" style="width: 100%; height: 100vh;"></div>
    <canvas ref="tileCanvasRef" width="256" height="256" v-show="false"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { GameBoard } from '../rendering/GameBoard';

export default {
  name: 'BoardPage',
  mounted() {
    const threeJsContainerRef = this.$refs.threeJsContainerRef as HTMLElement;
    const tileCanvasRef = this.$refs.tileCanvasRef as HTMLCanvasElement;

    if (threeJsContainerRef && tileCanvasRef) {
      new GameBoard(threeJsContainerRef, tileCanvasRef);
    }
  },
};
</script>
