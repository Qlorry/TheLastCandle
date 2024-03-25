<script lang="ts">
import { defineComponent } from 'vue'
import { PassageComponent } from "@/rendering/components/PassageComponent"
import { PassageType } from '@/rendering/components/models/PassageType';
import { PlayerComponent } from '@/rendering/components/PlayerComponent';

export default defineComponent({
  props: {
    player: PlayerComponent,
  },
  data() {
    return {
      lights_on: true, // add to player
      has_tocken: false
    };
  },
  methods: {

  },
  computed: {

  }
});
</script>

<template>
  <div class="container d-flex text-light">
    <img src="/textures/candle.png" class="rounded float-start" style="width: 100px; height: 100px;" alt="...">
    <h3>{{ player?.name }}</h3>
  </div>
  <hr class="border border-1 w-100">
  <div class="container text-light">
    <div class="container d-flex">

      <h3> Status: </h3>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle"
        viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path
          d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
      </svg>
    </div>

    <div v-if="lights_on" class="container d-flex">
      <img src="/textures/lights_on.png" class="rounded float-start" style="width: 50px; height: 50px;" alt="...">
      <h4>LIGHTS ON</h4>
    </div>
    <div v-else class="container d-flex">
      <img src="/textures/lights_out.png" class="rounded float-start" style="width: 50px; height: 50px;" alt="...">
      <h3>LIGHTS OUT</h3>
    </div>

  </div>
  <hr class="border border-1 w-100">
  <div class="container text-light">
    <div class="container d-flex">

      <h3> Available tokens: </h3>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle"
        viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path
          d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
      </svg>
    </div>

    <div class="d-flex justify-content-evenly">
      <div class="d-flex flex-column text-center">
        <img src="/textures/nerve_tocken.png" 
        :class="{ 'opacity-50': !has_tocken }"
        class="rounded float-start" style="width: 50px; height: 50px;" alt="...">
        Nerve
      </div>
      <div class="d-flex flex-column text-center">
        <img src="/textures/key_tocken.png" 
        :class="{ 'opacity-50': !has_tocken }"
        class="rounded float-start" style="width: 50px; height: 50px;" alt="...">
        Key
      </div>
    </div>
  </div>
  <hr class="border border-1 w-100">

</template>
