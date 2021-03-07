<template>
  <v-card>
    <v-img :src="place.photo" height="100" />
    <v-card-title>
      {{ place.detail.name }}
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="tab">
        <v-tab key="detail">詳細</v-tab>
        <v-tab key="photos">写真</v-tab>
        <v-tab ke="openHours">営業時間</v-tab>
        <v-tab ke="direction">経路</v-tab>
        <v-tab ke="reviews">レビュー</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="my-4">
        <v-tab-item key="detail">
          <tree-view
            :data="place.detail"
            :options="{ maxDepth: 3 }"
            style="min-height: 12em; background: #000; padding: 5px"
          ></tree-view>
        </v-tab-item>
        <v-tab-item key="photos">
          <tree-view
            :data="place.detail.photos"
            :options="{ maxDepth: 3 }"
            style="min-height: 12em; background: #000; padding: 5px"
          ></tree-view>
        </v-tab-item>
        <v-tab-item key="openHours">
          <tree-view
            :data="place.detail.opening_hours"
            :options="{ maxDepth: 3 }"
            style="min-height: 12em; background: #000; padding: 5px"
          ></tree-view>
        </v-tab-item>
        <v-tab-item key="direction">
          <tree-view
            :data="place.direction"
            :options="{ maxDepth: 3 }"
            style="min-height: 12em; background: #000; padding: 5px"
          ></tree-view>
        </v-tab-item>
        <v-tab-item key="reviews">
          <tree-view
            :data="place.detail.reviews"
            :options="{ maxDepth: 3 }"
            style="min-height: 12em; background: #000; padding: 5px"
          ></tree-view>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    place: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tab: null,
    }
  },
})
</script>
