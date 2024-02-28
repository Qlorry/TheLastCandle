<template>
  <canvas ref="tileCanvasRef" width="256" height="256"></canvas>
</template>

<script lang="ts">
import { GameBoard } from '../rendering/GameBoard'

let game: GameBoard | null = null;

export default {
  name: 'BoardPage',
  mounted() {
    const tileCanvasRef = this.$refs.tileCanvasRef as HTMLCanvasElement;
    if (tileCanvasRef) {
      game = new GameBoard(tileCanvasRef);
    }
  },
};
</script>
