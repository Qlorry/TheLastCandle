<script lang="ts">
import { defineComponent } from 'vue'
import { PassageComponent } from "@/rendering/components/PassageComponent"
import { PassageType } from '@/rendering/components/models/PassageType';

export default defineComponent({
  props: {
    tilesUsed: Array<PassageComponent>,
    tilesCount: Number
  },
  data() {
    const discardedTilesMap = new Map<PassageType, number>();
    discardedTilesMap.set(PassageType.Corner, 0);
    discardedTilesMap.set(PassageType.FourWay, 0);

    return {
      discardedTilesMap,
    }
  },
  methods: {
    getNameForType(type: PassageType) {
      switch (type) {
        case PassageType.T: return "T";
        case PassageType.Straight: return "Straight";
        case PassageType.FourWay: return "Four Way";
        case PassageType.Corner: return "Corner";
      }
      return "";
    }
  },
  mounted() {

  },
  watch: {
    // whenever question changes, this function will run
    tilesUsed(newQuestion, oldQuestion) {
      for (let pair of this.discardedTilesMap) {
        pair[1] = 0;
      }

      this.tilesUsed?.forEach((val: PassageComponent) => {
        const counter = this.discardedTilesMap.get(val.type);
        if (counter) this.discardedTilesMap.set(val.type, counter + 1);
      })
    }
  },
  computed: {
    tilesLeft() {
      if (!this.tilesCount || !this.tilesUsed)
        return "0";
      return `${this.tilesCount - this.tilesUsed.length}`;
    },
    totalTiles() {
      if (!this.tilesCount)
        return "0";
      return `${this.tilesCount}`;
    },
  }
});
</script>

<template>
  <h2 class="text-light">Tiles Left:</h2>
  <div class="container">
    <h3 class="text-light">{{ tilesLeft }} / {{ totalTiles }}</h3>
  </div>

  <h2 class="text-light">Discarded Tiles:</h2>
  <ul class="list-group">
    <li v-for="item in discardedTilesMap" class="list-group-item">
      ({{ getNameForType(item[0]) }}) -- {{ item[1] }}
    </li>
  </ul>
</template>
