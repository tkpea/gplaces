/**
 * getGeolocationByBrowser
 * ブラウザに位置情報取得の許可を求め
 * ブロックされた場合はエラーとなる
 */
export const getGeolocationByBrowser = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const successCallback = (res: any) => {
      resolve(res)
    }

    const errorCallback = (error: any) => {
      reject(error)
    }
    window.navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback
    )
  })
}
