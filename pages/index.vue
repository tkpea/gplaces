<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mb-4 pa-4" elevation="2">
          <v-layout>
            <Autocomplete
              class="mb-4 mr-2"
              style="flex: 1"
              @selectedPlace="selectedPlace"
            />
            <v-btn class="mx-2" fab dark small @click="setBrowserGeolocation">
              <v-icon dark> mdi-crosshairs-gps </v-icon>
            </v-btn>
          </v-layout>

          <template v-if="mapCenter">
            <Map
              :places="places"
              :map-center="mapCenter"
              @change-center="changeCenter"
            ></Map>
          </template>
          <template v-else>
            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
          </template>

          <v-slider
            v-model="placeRadius"
            label="距離(m)"
            max="3000"
            min="0"
            thumb-color="info"
            thumb-label="always"
          ></v-slider>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            block
            @click="getCurrentLocation"
            >Placeを更新</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="places && !loading">
      <v-col
        v-for="(place, index) in places"
        :key="index"
        cols="12"
        sm="4"
        lg="3"
      >
        <PlaceCard
          :place="place"
          @click="
            {
              mapCenter = {
                latitude: place.detail.geometry.location.lat,
                longitude: place.detail.geometry.location.lng,
              }
            }
          "
        />
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col
        v-for="index in [1, 2, 3, 4, 5, 6, 7, 8]"
        :key="index"
        cols="12"
        sm="4"
        lg="3"
      >
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosResponse } from 'axios'
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions'
import { Place } from '@googlemaps/google-maps-services-js/dist/common'
import { getGeolocationByBrowser } from '~/libs/Geolocation'
import { PlacesResponse } from '~/api/index'
import { arrayBufferToBase64 } from '~/libs/ImageUtil'
import PlaceCard from '~/components/PlaceCard.vue'
import Map from '~/components/Map.vue'
import Autocomplete from '~/components/Autocomplete.vue'
type GeoPosition = {
  latitude: number
  longitude: number
}
type PlaceItem = {
  detail: Place[]
  direction: DirectionsResponseData
  photo: string
}
type DataType = {
  browserGeoPosition?: GeoPosition | undefined
  loading: boolean
  places: PlaceItem[] | []
  mapCenter?: GeoPosition
  placeRadius: number
}

export default Vue.extend({
  components: {
    PlaceCard,
    Autocomplete,
    Map,
  },
  data(): DataType {
    return {
      browserGeoPosition: undefined,
      loading: false,
      places: [],
      mapCenter: undefined,
      placeRadius: 500,
    }
  },
  async mounted() {
    await this.setBrowserGeolocation()
  },
  methods: {
    async setBrowserGeolocation() {
      const location = await getGeolocationByBrowser().catch((error) => {
        console.warn('位置情報の所得を拒否しました')
        console.error(error)
      })

      if (!location) {
        this.loading = false
        return
      }
      this.browserGeoPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      this.changeCenter(this.browserGeoPosition)
    },
    async getCurrentLocation() {
      this.loading = true

      const params = {
        location: `${this.mapCenter?.latitude || 0}, ${
          this.mapCenter?.longitude || 0
        }`,
        radius: this.placeRadius,
      }
      console.log('getPlacesResponse')

      /**
       * FIXME:
       * TS2322: Type 'void | AxiosResponse<any>' is not assignable to type 'AxiosResponse<any>'.
       * Type 'void' is not assignable to type 'AxiosResponse<any>'.
       */
      // @ts-ignore
      const placesResponse: AxiosResponse<PlacesResponse> = await this.$axios
        .get('/api/places', {
          params,
        })
        .catch((error) => {
          console.error(error)
        })

      const places = placesResponse.data.places as any[]
      this.loading = false
      const directions = placesResponse.data.directions
      const photos = placesResponse.data.photos.map((item) => {
        if (!item) return undefined
        return arrayBufferToBase64(item.data)
      })

      this.places = places.map((v, i) => {
        const item: PlaceItem = {
          detail: v,
          direction: directions[i],
          photo: photos[i] || '',
        }
        return item
      })
      console.log(this.places)
    },

    selectedPlace(place: any) {
      this.mapCenter = {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      }
      this.getCurrentLocation()
    },
    changeCenter(location: any) {
      this.mapCenter = location
      this.getCurrentLocation()
    },
  },
})
</script>
