<template v-if="place">
  <v-card @click.self="dialog = true">
    <v-img
      v-if="place.photo"
      :src="place.photo"
      height="200px"
      class="white--text align-end"
    >
      <v-card-title>
        <span
          v-if="
            place.detail.opening_hours && place.detail.opening_hours.open_now
          "
          :style="{ backgroundColor: '#000' }"
          class="px-2"
        >
          OPEN
        </span>
      </v-card-title>
    </v-img>
    <v-card-text>
      <p class="display-1 text--primary">{{ place.detail.name }}</p>
      <p>{{ place.detail.formatted_phone_number }}</p>
      <p>{{ place.detail.formatted_address }}</p>
      <div v-if="place.direction" class="text--primary">
        <span class="mr-2">
          距離：{{ place.direction.routes[0].legs[0].distance.text }}
        </span>
        <span>
          徒歩：{{ place.direction.routes[0].legs[0].duration.text }}
        </span>
      </div>
      <div>
        <span class="mr-2">
          経緯：{{ place.detail.geometry.location.lat }} </span
        ><br />
        <span> 緯度：{{ place.detail.geometry.location.lng }} </span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="place.detail.website"
        :href="place.detail.website"
        target="_blank"
        >website</v-btn
      >
      <v-btn :href="place.detail.url" target="_blank">map</v-btn>
    </v-card-actions>
    <v-dialog v-model="dialog" width="600">
      <PlaceDetail :place="place" />
    </v-dialog>
  </v-card>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions'
import { Place } from '@googlemaps/google-maps-services-js/dist/common'
import PlaceDetail from '@/components/PlaceDetail.vue'
export type TPlaceItem = {
  detail: Place[]
  direction: DirectionsResponseData
  photo: string
}
export default Vue.extend({
  components: {
    PlaceDetail,
  },
  props: {
    place: {
      type: Object as PropType<TPlaceItem>,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
})
</script>
