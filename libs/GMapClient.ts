import {
  Client,
  DirectionsRequest,
  Language,
  PlacePhotoRequest,
  PlacePhotoResponse,
  PlaceQueryAutocompleteResponse,
  PlacesNearbyRequest,
} from '@googlemaps/google-maps-services-js'
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions'
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details'
import { PlacesNearbyResponseData } from '@googlemaps/google-maps-services-js/dist/places/placesnearby'
const gmaps = new Client({})
/**
 * 現在地に近いプレイスを取得する
 * @param placeId
 */
export const placesNearby = (
  params: PlacesNearbyRequest['params']
): Promise<PlacesNearbyResponseData> => {
  return new Promise((resolve, reject) => {
    gmaps
      .placesNearby({ params })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
/**
 * PlaceIDからプレイス詳細を取得する
 * @param placeId
 */
export const getPlaceDetail = (
  placeId: string
): Promise<PlaceDetailsResponseData['result']> => {
  return new Promise((resolve, reject) => {
    gmaps
      .placeDetails({
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_API_KEY,
          language: Language.ja,
        },
      })
      .then((res) => {
        resolve(res.data.result)
      })
      .catch((error) => {
        reject(error.response)
      })
  })
}
/**
 * 経路を取得する
 * @param params
 */
export const getDirection = (
  params: DirectionsRequest['params']
): Promise<DirectionsResponseData> => {
  return new Promise((resolve, reject) => {
    gmaps
      .directions({ params })
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error.response)
      })
  })
}
/**
 * PhotoIDから写真のArrayBufferを取得する
 * @param params
 */
export const getPlacePhoto = (
  params: PlacePhotoRequest['params']
): Promise<PlacePhotoResponse> => {
  return new Promise((resolve, reject) => {
    gmaps
      .placePhoto({
        params,
        responseType: 'arraybuffer',
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error.response)
      })
  })
}
/**
 * 場所の名称からプレイス詳細を取得する
 * @param input
 */
export const getAutocomplete = (
  input: string
): Promise<PlaceQueryAutocompleteResponse['data']> => {
  return new Promise((resolve, reject) => {
    gmaps
      .placeQueryAutocomplete({
        params: {
          input,
          language: Language.ja,
          key: process.env.GOOGLE_API_KEY,
        },
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
