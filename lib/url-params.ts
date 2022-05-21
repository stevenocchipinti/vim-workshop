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

  // New compressed URL parameter
  const codeString = urlParams.get(paramKey) || ""
  if (codeString) {
    const data = lzString.decompressFromEncodedURIComponent(codeString)
    return data ? JSON.parse(data) : {}
  } else {
    // Legacy uncompressed separate URL parameters
    const name = urlParams.get("name") || ""
    const description = urlParams.get("description") || ""
    const start = urlParams.get("start") || ""
    const end = urlParams.get("end") || ""
    const target = urlParams.get("target") || ""
    const filetype = urlParams.get("filetype") || ""
    return { start, end, name, description, filetype, target }
  }
}
