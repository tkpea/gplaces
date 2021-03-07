import express from 'express'
import {
  Language,
  PlacePhotoResponse,
  PlacesNearbyRequest,
  TravelMode,
} from '@googlemaps/google-maps-services-js'
import { PlacesNearbyResponseData } from '@googlemaps/google-maps-services-js/dist/places/placesnearby'
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions'
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details'
import {
  getDirection,
  getPlaceDetail,
  getPlacePhoto,
  placesNearby,
  getAutocomplete,
} from './../libs/GMapClient'

const app: express.Express = express()
export type PlacesResponse = {
  next: string
  places: PlaceDetailsResponseData['result']
  directions: DirectionsResponseData[]
  photos: Array<PlacePhotoResponse['data'] | undefined>
}

app.get('/places', async function (req, res) {
  console.info('/placesを実行')
  const params: PlacesNearbyRequest['params'] = {
    location: (req.query.location as string) || '',
    radius: (Number(req.query.radius) as number) || 20,
    type: 'restaurant',
    key: process.env.GOOGLE_API_KEY,
  }
  if (req.query.pagetoken) {
    params.pagetoken = req.query.pagetoken as string
  }
  if (req.query.type) {
    params.pagetoken = req.query.type as string
  }

  console.info('placesNearbyを取得')
  const placesNerby = (await placesNearby(params).catch((error) => {
    console.log(error.response)
    return res.send(error.response)
  })) as PlacesNearbyResponseData

  const places = await Promise.all(
    placesNerby.results.map(async (item) => {
      if (!item.place_id) return
      return (await getPlaceDetail(item.place_id).catch((error) => {
        return res.send(error.response)
      })) as PlaceDetailsResponseData['result']
    })
  )
  if (!places) res.send(429)

  console.info('Directionを取得')
  const directions = await Promise.all(
    places.map(async (item) => {
      const dir = (await getDirection({
        origin: req.query.location as string,
        destination: `${item?.geometry?.location.lat} ${item?.geometry?.location.lng}`,
        language: Language.ja,
        key: process.env.GOOGLE_API_KEY,
        mode: TravelMode.walking,
      }).catch((error) => {
        return res.send(error.response)
      })) as DirectionsResponseData
      return dir
    })
  )

  console.info('Photoを取得')
  const photos = await Promise.all(
    places.map(async (item) => {
      if (!item?.photos || !item?.photos.length) return undefined
      const photo = await getPlacePhoto({
        photoreference: item?.photos[0].photo_reference,
        maxheight: 300,
        maxwidth: 300,
        key: process.env.GOOGLE_API_KEY,
      }).catch((error) => {
        return res.send(error.response)
      })
      return photo
    })
  )

  const response: PlacesResponse = {
    next: placesNerby.next_page_token as string,
    places: places as PlaceDetailsResponseData['result'],
    photos: photos as PlacePhotoResponse['data'],
    directions,
  }
  return res.send(response)
})

app.get('/places/autocomplete', async function (req, res) {
  const input = req.query.q as string
  if (!input) {
    res.send([])
  }
  const result = await getAutocomplete(input).catch((error) => {
    res.send(error.response)
  })

  return res.send(result)
})

app.get('/places/:place_id', async function (req, res) {
  const placeId = req.params.place_id as string
  const placeDetail = await getPlaceDetail(placeId).catch((error) => {
    res.send(error.response)
  })
  return res.send(placeDetail)
})

module.exports = {
  path: '/api/',
  handler: app,
}
