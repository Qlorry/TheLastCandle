<template>
  <div class="black-background container-fluid d-flex flex-column flex-grow-1 w-100 vh-100">
    <div class="green-container">
      <div class="row">
        <div class="col"></div>
        <div class="col-8">
          <h1>Control</h1>
        </div>
        <div class="col"></div>
      </div>
    </div>
    <div class="flex-grow-1">
      <div class="row container-custom-inner h-100">
        <div class="col-2"></div>
        <div class="col-8" style="position: relative;">
          <canvas ref="tileCanvasRef" width="256" height="256" style="position: absolute; top: 0px; left: 0px;"></canvas>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
    <div class="green-container">
      <div class="row">
        <div class="col"></div>
        <div class="col-8">
          <h1>Control</h1>
        </div>
        <div class="col"></div>
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

<style>
.black-background {
  background-color: black;
}

/* Temp */
.green-container {
  background-color: green;
}
</style>
