<!-- TODO: create better callback page -->
<template>
  <PageLayout v-if="error">
    <div class="content-layout">
      <h1 id="page-title" class="content__title">Error</h1>
      <div class="content__body">
        <p id="page-description">
          <span>{{ error.message }}</span>
        </p>
      </div>
    </div>
  </PageLayout>
  <div v-else>
    <h1>Success</h1>
  </div>
</template>
  
<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

const { error } = useAuth0();
</script>