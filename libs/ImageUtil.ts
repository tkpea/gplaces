/**
 * ArrayBufferからBase64文字列を作成
 * @param base64
 * @param name
 */
export const arrayBufferToBase64 = (ab: ArrayBuffer): string => {
  const bytes = new Uint8Array(ab)
  let binaryData = ''
  for (let i = 0, len = bytes.byteLength; i < len; i++) {
    binaryData += String.fromCharCode(bytes[i])
  }
  return 'data:image/jpeg;base64,' + window.btoa(binaryData)
}
