<template>
  <div class="container py-4 px-3 mx-auto">
    <button class="btn btn-primary" @click="call()">Call</button>
  </div>
  This is message from signalR: {{ message }}
</template>

<script  lang="ts">
import * as signalR from '@microsoft/signalr'
import { defineComponent } from 'vue'

export default defineComponent({

  data() {
    return {
      message: "",
      connection: new signalR.HubConnectionBuilder()
        .withUrl("api/test")
        .configureLogging(signalR.LogLevel.Debug)
        .build()
    }
  },
  methods: {
    async call() {
      try {
        await this.connection.invoke("Aaaaa");
      } catch (err) {
        console.error(err);
      }
    }
  },
  mounted() {
    this.connection.start();
    this.connection.on("SendMessage", msg => {
      this.message = msg
    })

  }
})

</script>