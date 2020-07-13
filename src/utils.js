export function removeDecimal(decimalString) {
  if(isNaN(decimalString)) return ""
  if(decimalString === "") return ""
  decimalString = decimalString.toString()
  if(!decimalString.includes('.')) return decimalString
  return decimalString.substring(0,decimalString.indexOf('.'))
}
