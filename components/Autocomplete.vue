<template>
  <div>
    <v-autocomplete
      v-model="model"
      :items="items"
      :search-input.sync="search"
      hide-details
      hide-selected
      outlined
      dense
      :loading="isLoading"
      item-text="description"
      item-value="API"
      label="場所を探す"
      placeholder="キーワードを入力してEnterを押してください"
      data-element="autocomplete-element"
    >
      <template #no-data>
        <v-list-item>
          <v-list-item-title>
            キーワードを入力してEnterを押してください
          </v-list-item-title>
        </v-list-item>
      </template>
      <template #item="{ item }">
        <v-list-item-content @click="selectedItem(item)">
          <v-list-item-title>
            {{ item.structured_formatting.main_text }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-text="item.description"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosResponse } from 'axios'
export default Vue.extend({
  data() {
    return {
      model: null,
      search: null,
      isLoading: false,
      response: {},
    }
  },
  computed: {
    items() {
      /**
       * FIXME:
       * TS2339:
       * Property 'predictions' does not exist on type '{}'.
       */
      // @ts-ignore
      if (!this.response || !this.response?.predictions) return []

      /**
       * FIXME:
       * TS2339:
       * Property 'response' does not exist on type 'CombinedVueInstance<Vue, unknown, unknown, unknown, Readonly<Record<never, any>>>'.
       */
      // @ts-ignore
      return this.response.predictions.map((item: any) => {
        return item
      })
    },
  },
  watch: {
    search(val) {
      this.response = []
      if (!val) {
        this.model = null
      }
    },
  },
  /** LifeCycles **/
  mounted() {
    window.addEventListener('keyup', this.keyboardEvent)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyboardEvent)
  },
  methods: {
    async keyboardEvent(e: KeyboardEvent) {
      const focused = document.activeElement
      console.log(e.key)
      if (!focused) return
      if (
        e &&
        (e.keyCode === 13 || e.key === 'Enter') &&
        focused.getAttribute('data-element') === 'autocomplete-element'
      ) {
        // キーワード文字列が空の場合と検索結果取得済みの場合は実行しない
        if (this.items.length > 0 || !this.search) return
        this.isLoading = true
        const autocompleteResponse: AxiosResponse<any> = await this.$axios.get(
          '/api/places/autocomplete',
          {
            params: {
              q: this.search,
            },
          }
        )
        this.isLoading = false
        if (autocompleteResponse) {
          this.response = autocompleteResponse.data
          console.log(this.response)
        }
      }
    },
    async selectedItem(item: any) {
      const placeDetailResponse = await this.$axios
        .get(`/api/places/${item.place_id}`)
        .catch((error) => {
          console.error(error)
        })
      if (!placeDetailResponse) return
      this.$emit('selectedPlace', placeDetailResponse.data)
    },
  },
})
</script>
