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
          <v-simple-table dense>
            <tbody>
              <tr>
                <th>価格帯</th>
                <td>{{ place.detail.price_level | placeLevelJa }}</td>
              </tr>
              <tr>
                <th>電話番号</th>
                <td>
                  {{ place.detail.formatted_phone_number }}
                </td>
              </tr>
              <tr>
                <th>住所</th>
                <td>
                  {{ place.detail.formatted_address }}
                </td>
              </tr>
              <tr>
                <th>評価</th>
                <td>
                  <v-rating
                    length="5"
                    size="14"
                    :value="place.detail.rating"
                  ></v-rating>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider />
          <v-expansion-panels accordion class="mt-4">
            <v-expansion-panel key="json">
              <v-expansion-panel-header>JSON</v-expansion-panel-header>
              <v-expansion-panel-content>
                <tree-view
                  :data="place.detail"
                  :options="{ maxDepth: 3 }"
                  style="min-height: 12em; background: #000; padding: 5px"
                ></tree-view>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
  filters: {
    placeLevelEng(val: number): string {
      const textEnglish = [
        'Free',
        'Inexpensive',
        'Moderate',
        'Expensive',
        'Very Expensive',
      ]
      return textEnglish[val]
    },
    placeLevelJa(val: number): string {
      const textEnglish = ['無料', '安い', '普通', '高級', '超高級']
      return textEnglish[val]
    },
  },
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
