<template>
  <div class="container w-100" style="height: 100vh;">
    <div class="row h-100">
      <div class="col-2">
        
      </div>
      <div class="col-8 d-flex h-100">
        <canvas ref="tileCanvasRef" width="256" height="256"></canvas>
      </div>
      <div class="col-2">

      </div>
    </div>
  </div>
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
