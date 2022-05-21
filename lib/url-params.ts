import lzString from "lz-string"

// This uses the convention of having a JSON object encoded into the code
// param, which contains the start, end, target, etc. keys

interface EncodedParams {
  name?: string
  description?: string
  start?: string
  end?: string
  target?: string
  filetype?: string
}

// This function takes a JS object and encodes it as a string that can go into
// the code parameter on the URL
export const createEncodedString = (codeObject: EncodedParams) =>
  lzString.compressToEncodedURIComponent(JSON.stringify(codeObject))

// This function takes the encoded value of the code parameter from the URL and
// returns a JS object
export const parseEncodedParam = (paramKey = "code"): EncodedParams => {
  const urlParams = new URLSearchParams(window.location.search)
  const codeString = urlParams.get(paramKey) || ""
  const data = lzString.decompressFromEncodedURIComponent(codeString)
  return data ? JSON.parse(data) : {}
}
