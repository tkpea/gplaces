<template>
  <div>
    <no-ssr>
      <GmapMap
        :center="{
          lat: mapCenter.latitude,
          lng: mapCenter.longitude,
        }"
        :zoom="17"
        map-type-id="terrain"
        style="width: 100%; height: 300px"
        class="mb-4"
      >
        <GmapMarker
          :position="{
            lat: mapCenter.latitude,
            lng: mapCenter.longitude,
          }"
          :draggable="true"
          @dragend="updateCoordinates($event.latLng)"
        />
        <GmapMarker
          v-for="(item, index) in places"
          :key="index"
          :position="{
            lat: item.detail.geometry.location.lat,
            lng: item.detail.geometry.location.lng,
          }"
          :icon="{
            url: item.detail.icon,
            size: { width: 30, height: 30, f: 'px', b: 'px' },
            scaledSize: { width: 30, height: 30, f: 'px', b: 'px' },
          }"
          @click="onClickPlace(item)"
        />
      </GmapMap>
    </no-ssr>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    places: {
      type: Array,
      default: () => [],
    },
    mapCenter: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    updateCoordinates(e: any) {
      this.$emit('change-center', {
        latitude: e.lat(),
        longitude: e.lng(),
      })
    },
    onClickPlace(item: any) {
      this.$emit('change-center', {
        latitude: item.detail.geometry.location.lat,
        longitude: item.detail.geometry.location.lng,
      })
    },
  },
})
</script>
