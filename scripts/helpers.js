const ACTIONS = {
  OPTIONS_SAVED: 'optionsSaved',
  EXTENSION_ENABLED: 'extensionEnabled',
  EXTENSION_DISABLED: 'extensionDisabled',
  DELETE_ALL: 'deleteAll',
}

/**
 * @param {string} action
 * @param {Object} msg
 */
const setAction = (action, msg = {}) => ({
  action,
  ...msg,
})

const extensionStorage = {
  /**
   * @param {string | string[] | Object | null} prop
   * @returns {Promise}
   */
  get(prop) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(prop, (storage) => {
        if (typeof storage !== 'undefined') {
          console.log('helpers get', storage, prop)
          if (typeof prop === 'string') resolve(storage[prop])
          if (typeof prop === 'object') resolve(storage)
        } else {
          reject(`${prop} is not defined in chrome.storage.local`)
        }
      })
    })
  },

  /**
   * @param {string} prop
   * @param {any} value
   *  @param {() => void} [callback]
   */
  set(prop, value, callback) {
    console.log('helpers set', prop, value)
    chrome.storage.local.set({ [prop]: value }, callback)
  },

  /**
   * @param {string | string[]} keys
   * @param {() => void} [callback]
   */
  remove(keys, callback) {
    chrome.storage.local.remove(keys, callback)
  },

  /**
   * @param {() => void} [callback]
   */
  clear(callback) {
    chrome.storage.local.clear(callback)
  },
}

const extensionTabs = {
  /**
   * @param {string} domain
   * @returns {Promise<Array<number>>}
   */
  getIdsForDomain(domain) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({}, (tabs) => {
        const domainTabs = tabs
          .filter((tab) => tab.url.includes(domain))
          .map((tab) => tab.id)

        if (domainTabs.length > 0) {
          resolve(domainTabs)
        } else {
          reject(`No open tabs for ${domain}`)
        }
      })
    })
  },
}

const extensionMessenger = {
  /**
   * @param {chrome.tabs} sender
   * @param {number} id
   * @param {any} msg
   * @param {(response) => void} [responseCallback] Optional.
   */
  send(sender, id, msg, responseCallback) {
    sender.sendMessage(id, msg, responseCallback)
  },
}

/**
 * @param {"rocket" | "bulb" | "gingerBread" | "plane" | "cookie" | "paw" | "location" | "star" | "battery" | "branch" | "terminal" | "popcorn" | "cup"} icon
 * @param {string} color
 * @returns {string}
 */
const getIcon = (icon = 'popcorn', color = 'black') => {
  const icons = {
    rocket: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 478.1 478.1"><path fill="${color}" d="M458.2 452.5H425.9c0-0.5 0.5-1 0.5-1.5 -0.5-33.3-27.1-59.9-60.4-59.4 -24.1 0-45.6 14.8-54.8 36.9 -15.9 2-30.7 10.8-39.9 24.1H221.1c-8.2-14.8-23.6-23.6-39.9-23.6h-0.5c-9.2-26.6-38.4-41-65-31.2 -8.7 3.1-16.9 8.7-23 15.9l-9.7-1c-24.1 0-45.6 16.4-51.7 39.9H19.9c-7.2 0-12.8 5.6-12.8 12.8 0 7.2 5.6 12.8 12.8 12.8h438.3c7.2 0 12.8-5.6 12.8-12.8C471 458.1 465.3 452.5 458.2 452.5z"/><path fill="${color}" d="M355.8 190.3c-8.7-8.7-19.5-15.4-31.2-19.5 -1.5-40.4-13.3-79.9-34.8-114.7 -1.5-3.6-28.2-39.4-41.5-52.7 -5.1-4.6-13.3-4.6-18.4 0 -48.1 48.6-74.2 105.5-76.3 167.4 -11.8 4.1-22.5 10.8-31.2 19.5 -32.3 29.7-34.8 79.9-5.1 112.6 2 2.6 5.1 4.1 8.7 4.1h0.5c3.1 0 6.7-1 8.7-3.6l34.8-31.7c7.2 18.4 15.9 36.4 27.1 52.7 10.2 15.4 36.4 16.9 44 16.9h0.5c10.8 0 29.2-2 37.9-14.3 11.8-16.9 21.5-35.8 28.7-55.3l34.8 31.7c2 2.6 5.6 3.6 8.7 3.6h0.5c3.6 0 6.7-1.5 8.7-4.1C390.6 270.2 388 220 355.8 190.3zM239 198c-24.1-0.5-43.5-20-43.5-44s19.5-43.5 43.5-43.5 43.5 19.5 43.5 43.5S263.1 197.5 239 198z"/><rect fill="${color}" x="226.2" y="359.8" width="25.6" height="59.9"/><rect fill="${color}" x="268.2" y="350.1" width="25.6" height="54.8"/><rect fill="${color}" x="184.3" y="350.1" width="25.6" height="50.2"/></svg>`,
    bulb: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 512.003 512.003" style="enable-background:new 0 0 512.003 512.003;" xml:space="preserve"><g><path fill="${color}" d="M151.001,390.003v15c0,19.998,13.2,36.791,31.278,42.634c6.05,35.327,36.696,64.366,73.722,64.366s67.672-29.039,73.722-64.366c18.078-5.843,31.278-22.635,31.278-42.634v-15H151.001z"/></g><g><path fill="${color}" d="M217.344,4.045C149.639,18.181,94.502,73.142,80.146,140.818c-12.202,57.583,2.857,115.386,41.294,158.599c15.54,17.487,25.02,38.593,28.129,60.586h212.915c3.215-21.889,12.973-43.33,28.956-61.568c28.74-32.769,45.561-74.839,45.561-118.433C437.001,65.821,331.274-19.94,217.344,4.045z M361.001,195.003c-8.291,0-15-6.709-15-15c0-49.629-40.386-90-90.015-90c-8.291,0-15-6.709-15-15c0-8.291,6.709-15,15-15c66.182,0,120.015,53.833,120.015,120C376.001,188.294,369.292,195.003,361.001,195.003z"/></g></svg>`,
    gingerBread: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 470.438 470.438" style="enable-background:new 0 0 470.438 470.438" xml:space="preserve"><path fill="white" d="M112.15,121.209c-23.41-11.289-52.844-3.878-65.344,18.908c-13.328,24.305-3.45,54.498,21.203,66.386l12.898,6.222l41.938-86.357L112.15,121.209z"/><path fill="white" d="M93.573,382.569l-8.798,13.401c-14.617,22.117-8.535,51.894,13.582,66.509c22.117,14.615,51.894,8.534,66.512-13.585l7.11-8.382L93.573,382.569z"/><path fill="white" d="M385.136,395.97l-8.587-13.079l-78.324,57.968l6.817,8.035c14.617,22.118,44.394,28.2,66.512,13.585C393.67,447.864,399.753,418.087,385.136,395.97z"/><path fill="${color}" d="M330.955,294.304v-43.285c0-6.142,3.516-11.743,9.05-14.411l34.782-16.773l-41.89-86.38l-36.215,17.465c18.102-17.687,28.625-43.084,26.168-70.912c-0.344-3.873-0.922-7.799-1.782-11.752C313.9,35.361,287.193,8.89,254.24,1.993C197.33-9.919,147.221,33.187,147.221,87.999c0,24.672,10.18,46.942,26.539,62.921l-36.504-17.603l-41.934,86.356l35.114,16.934c5.535,2.668,9.05,8.269,9.05,14.411v42.478c0,12.481-3.649,24.689-10.5,35.121l-26.621,40.557l79.981,59.115l40.406-47.629c6.39-7.532,18.016-7.532,24.406,0l40.699,47.975l79.898-59.14l-26.306-40.071C334.603,318.992,330.955,306.784,330.955,294.304zM267.221,51.999c6.625,0,12,5.372,12,12c0,6.627-5.375,12-12,12c-6.629,0-12-5.373-12-12C255.221,57.371,260.592,51.999,267.221,51.999z M262.893,104.084c2.218-3.828,7.141-5.102,10.938-2.875c3.813,2.226,5.11,7.125,2.875,10.938c-8.578,14.711-24.484,23.851-41.484,23.851c-17.125,0-33.078-9.234-41.641-24.094c-2.203-3.828-0.875-8.718,2.953-10.93c3.766-2.187,8.687-0.883,10.922,2.946c5.703,9.922,16.344,16.078,27.766,16.078C246.565,119.999,257.158,113.897,262.893,104.084z M203.221,51.999c6.625,0,12,5.372,12,12c0,6.627-5.375,12-12,12c-6.629,0-12-5.373-12-12C191.221,57.371,196.592,51.999,203.221,51.999z M235.221,319.999c-8.836,0-16-7.164-16-16c0-8.837,7.164-16,16-16s16,7.163,16,16C251.221,312.835,244.057,319.999,235.221,319.999z M235.221,255.999c-8.836,0-16-7.164-16-16c0-8.837,7.164-16,16-16s16,7.163,16,16C251.221,248.835,244.057,255.999,235.221,255.999zM282.955,198.041c0,5.908-6.183,9.778-11.496,7.195l-25.883-9.274c-2.805,2.43-6.355,4.042-10.355,4.042c-4.086,0-7.715-1.649-10.543-4.166l-26.226,9.398c-5.313,2.582-11.496-1.287-11.496-7.195v-28.076c0-5.907,6.183-9.778,11.496-7.195l26.125,9.469c2.84-2.566,6.516-4.234,10.645-4.234c4.047,0,7.641,1.633,10.457,4.11l25.782-9.344c5.313-2.582,11.496,1.288,11.496,7.195V198.041z"/><path fill="white" d="M419.862,134.254c-13.84-18.636-39.828-23.532-60.738-13.448l-11.82,5.701l41.89,86.38l13.238-6.384
    C429.103,193.638,438.49,159.332,419.862,134.254z"/></svg>`,
    plane: `<svg class="icon" enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="m8.75 17.612v4.638c0 .324.208.611.516.713.077.025.156.037.234.037.234 0 .46-.11.604-.306l2.713-3.692z"/><path fill="${color}" d="m23.685.139c-.23-.163-.532-.185-.782-.054l-22.5 11.75c-.266.139-.423.423-.401.722.023.3.222.556.505.653l6.255 2.138 13.321-11.39-10.308 12.419 10.483 3.583c.078.026.16.04.242.04.136 0 .271-.037.39-.109.19-.116.319-.311.352-.53l2.75-18.5c.041-.28-.077-.558-.307-.722z"/></svg>`,
    cookie: `<svg class="icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002" xml:space="preserve"><path fill="${color}" d="M501.791,236.285c-32.933-11.827-53.189-45.342-50.644-71.807c0-4.351-2.607-8.394-5.903-11.25c-3.296-2.842-8.408-4.072-12.686-3.384c-50.186,7.363-96.14-29.352-100.693-80.962c-0.41-4.658-2.959-8.848-6.914-11.353c-3.94-2.49-8.848-3.032-13.198-1.406C271.074,71.02,232.637,44.084,217.3,8.986c-2.871-6.563-9.99-10.181-17.007-8.628C84.82,26.125,0.001,137.657,0.001,256.002c0,140.61,115.39,256,256,256s256-115.39,256-256C511.584,247.068,511.522,239.771,501.791,236.285z M105.251,272.131c-8.284,0-15-6.716-15-15c0-8.286,6.716-15,15-15s15,6.714,15,15C120.251,265.415,113.534,272.131,105.251,272.131z M166.001,391.002c-24.814,0-45-20.186-45-45c0-24.814,20.186-45,45-45c24.814,0,45,20.186,45,45C211.001,370.816,190.816,391.002,166.001,391.002z M181.001,211.002c-16.538,0-30-13.462-30-30c0-16.538,13.462-30,30-30c16.538,0,30,13.462,30,30C211.001,197.54,197.539,211.002,181.001,211.002zM301.001,421.002c-16.538,0-30-13.462-30-30c0-16.538,13.462-30,30-30c16.538,0,30,13.462,30,30C331.001,407.54,317.539,421.002,301.001,421.002z M316.001,301.002c-24.814,0-45-20.186-45-45c0-24.814,20.186-45,45-45c24.814,0,45,20.186,45,45C361.001,280.816,340.816,301.002,316.001,301.002z M405.251,332.131c-8.284,0-15-6.716-15-15c0-8.286,6.716-15,15-15s15,6.714,15,15C420.251,325.415,413.534,332.131,405.251,332.131z"/></svg>`,
    paw: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="390.126px" height="390.125px" viewBox="0 0 390.126 390.125" style="enable-background:new 0 0 390.126 390.125" xml:space="preserve"><path fill="${color}" d="M132.64,177.859c31.162,0,56.508-34.014,56.508-75.834c0-41.817-25.347-75.841-56.508-75.841c-31.153,0-56.502,34.023-56.502,75.841C76.138,143.845,101.487,177.859,132.64,177.859z"/><path fill="${color}" d="M300.246,251.628c-1.159-1.579-2.27-3.068-2.864-4.348c-12.635-27.046-47.27-58.931-103.382-59.724l-2.159-0.012
    c-55.25,0-89.627,30.197-103.381,58.469c-0.475,0.967-1.52,2.222-2.627,3.549c-1.31,1.555-2.606,3.146-3.714,4.875c-11.619,18.075-17.543,38.426-16.669,57.299c0.916,20.037,9.305,36.131,23.581,45.312c5.768,3.705,11.992,5.572,18.522,5.572c13.465,0,25.793-7.584,40.079-16.368c9.083-5.598,18.465-11.374,28.886-15.697c1.168-0.385,5.954-0.973,13.781-0.973
    c9.307,0,15.991,0.828,17.419,1.321c10.173,4.491,19.107,10.382,27.748,16.068c13.247,8.731,25.755,16.97,39.326,16.97c5.824,0,11.469-1.537,16.795-4.563c29.382-16.693,34.979-62.492,12.484-102.088C302.942,255.303,301.597,253.448,300.246,251.628z"/><path fill="${color}" d="M252.796,177.859c31.147,0,56.499-34.014,56.499-75.834c0-41.817-25.352-75.841-56.499-75.841
    c-31.165,0-56.511,34.023-56.511,75.841C196.285,143.845,221.631,177.859,252.796,177.859z"/><path fill="${color}" d="M345.595,138.918c-24.975,0-44.521,25.901-44.521,58.967c0,33.051,19.558,58.955,44.521,58.955
    c24.961,0,44.531-25.904,44.531-58.955C390.126,164.82,370.568,138.918,345.595,138.918z"/><path fill="${color}" d="M89.048,197.885c0-33.065-19.558-58.967-44.522-58.967C19.561,138.918,0,164.82,0,197.885
    c0,33.051,19.561,58.955,44.526,58.955C69.491,256.84,89.048,230.936,89.048,197.885z"/></svg>`,
    location: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 54.757 54.757" style="enable-background:new 0 0 54.757 54.757" xml:space="preserve"><path fill="${color}" d="M40.94,5.617C37.318,1.995,32.502,0,27.38,0c-5.123,0-9.938,1.995-13.56,5.617c-6.703,6.702-7.536,19.312-1.804,26.952L27.38,54.757L42.721,32.6C48.476,24.929,47.643,12.319,40.94,5.617z M27.557,26c-3.859,0-7-3.141-7-7s3.141-7,7-7s7,3.141,7,7
    S31.416,26,27.557,26z"/></svg>`,
    star: `<svg class="icon" height="512pt" viewBox="0 -11 512.00047 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="m510.644531 185.011719c-3.878906-11.933594-15.425781-20.132813-31.683593-22.496094l-132.511719-19.257813-59.265625-120.074218c-7.269532-14.730469-18.636719-23.183594-31.183594-23.183594s-23.914062 8.453125-31.183594 23.1875l-59.257812 120.070312-132.515625 19.257813c-16.261719 2.363281-27.8125 10.5625-31.6875 22.496094-3.875 11.933593.648437 25.355469 12.414062 36.820312l95.890625 93.464844-22.640625 131.980469c-2.894531 16.878906 2.039063 26.992187 6.6875 32.507812 5.453125 6.46875 13.40625 10.03125 22.394531 10.03125 6.761719 0 13.953126-1.980468 21.378907-5.882812l118.519531-62.308594 118.527344 62.3125c7.421875 3.902344 14.613281 5.878906 21.375 5.878906h.003906c8.984375 0 16.941406-3.5625 22.394531-10.03125 4.644531-5.511718 9.582031-15.628906 6.683594-32.507812l-22.636719-131.980469 95.886719-93.464844c11.761719-11.464843 16.285156-24.886719 12.410156-36.820312zm0 0"/></svg>`,
    battery: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"><path fill="${color}" d="M384,64h-42.667V10.68c0-5.903-4.063-10.68-9.958-10.68H181.333c-5.896,0-10.667,4.777-10.667,10.68V64H128c-23.531,0-42.667,18.62-42.667,42.18v363.103C85.333,492.842,104.469,512,128,512h256c23.531,0,42.667-19.158,42.667-42.718V106.18C426.667,82.62,407.531,64,384,64z M339.75,272.26l-85.333,138.667c-1.979,3.208-5.448,5.073-9.083,5.073c-0.969,0-1.938-0.135-2.906-0.406c-4.594-1.292-7.76-5.49-7.76-10.26V320h-53.333c-3.865,0-7.427-2.094-9.313-5.458c-1.885-3.375-1.802-7.51,0.229-10.802l85.333-138.667c2.5-4.063,7.406-5.927,11.99-4.667c4.594,1.292,7.76,5.49,7.76,10.26V256h53.333c3.865,0,7.427,2.094,9.313,5.458C341.865,264.833,341.781,268.969,339.75,272.26z"/></svg>`,
    branch: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="438.529px" height="438.529px" viewBox="0 0 438.529 438.529" style="enable-background:new 0 0 438.529 438.529" xml:space="preserve"><path fill="${color}" d="M349.459,52.534c-10.663-10.657-23.605-15.987-38.834-15.987c-15.222,0-28.165,5.327-38.825,15.987c-10.656,10.657-15.984,23.598-15.984,38.828c0,9.897,2.467,19.081,7.416,27.55c4.948,8.47,11.604,15.086,19.985,19.842c0,9.897-0.805,18.608-2.42,26.125c-1.622,7.517-4.284,14.128-7.994,19.842c-3.72,5.711-7.566,10.561-11.566,14.56c-4.001,3.999-9.616,7.755-16.848,11.278c-7.231,3.521-13.945,6.468-20.129,8.851c-6.184,2.375-14.514,5.182-24.982,8.419c-19.036,5.903-33.689,11.323-43.968,16.275V102.206c8.375-4.755,15.037-11.37,19.985-19.84c4.947-8.47,7.421-17.655,7.421-27.552c0-15.225-5.327-28.169-15.987-38.826C156.073,5.332,143.132,0,127.903,0c-15.23,0-28.171,5.328-38.831,15.988C78.416,26.645,73.085,39.589,73.085,54.814c0,9.897,2.474,19.082,7.421,27.552c4.948,8.47,11.609,15.085,19.985,19.84v234.117c-8.376,4.753-15.037,11.375-19.985,19.842c-4.947,8.473-7.421,17.658-7.421,27.552c0,15.225,5.327,28.168,15.987,38.824s23.604,15.988,38.831,15.988c15.226,0,28.17-5.332,38.826-15.988c10.657-10.656,15.987-23.6,15.987-38.824c0-9.894-2.474-19.079-7.421-27.552c-4.949-8.467-11.61-15.089-19.985-19.842V328.9c0-13.131,3.949-22.645,11.847-28.544c7.898-5.907,24.029-12.662,48.395-20.273c25.699-8.186,45.021-15.899,57.963-23.134c42.633-24.167,64.142-63.568,64.521-118.196c8.381-4.755,15.037-11.372,19.985-19.842c4.945-8.47,7.423-17.653,7.423-27.55C365.447,76.135,360.116,63.194,349.459,52.534zM147.321,403.138c-5.332,5.331-11.803,7.994-19.414,7.994c-7.616,0-14.087-2.663-19.417-7.994c-5.327-5.325-7.994-11.8-7.994-19.411c0-7.617,2.664-14.085,7.994-19.417c5.33-5.328,11.801-7.994,19.417-7.994c7.611,0,14.083,2.669,19.414,7.994c5.33,5.332,7.993,11.8,7.993,19.417C155.313,391.338,152.651,397.812,147.321,403.138zM147.321,74.232c-5.332,5.33-11.803,7.994-19.414,7.994c-7.616,0-14.087-2.664-19.417-7.994c-5.327-5.33-7.994-11.798-7.994-19.414c0-7.614,2.664-14.087,7.994-19.412c5.33-5.329,11.801-7.994,19.417-7.994c7.611,0,14.083,2.666,19.414,7.994c5.33,5.325,7.993,11.798,7.993,19.412C155.313,62.434,152.651,68.905,147.321,74.232zM330.042,110.779c-5.328,5.327-11.796,7.993-19.41,7.993c-7.618,0-14.09-2.666-19.414-7.993c-5.328-5.327-7.994-11.799-7.994-19.414c0-7.614,2.666-14.083,7.994-19.414s11.796-7.993,19.414-7.993c7.614,0,14.082,2.663,19.41,7.993c5.328,5.326,7.994,11.799,7.994,19.414C338.036,98.979,335.374,105.452,330.042,110.779z"/></svg>`,
    terminal: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 27.269 27.269" style="enable-background:new 0 0 27.269 27.269" xml:space="preserve"><path fill="${color}" d="M25.322,1.947H1.949C0.869,1.947,0,2.818,0,3.898v19.477c0,1.074,0.869,1.947,1.949,1.947h23.373c1.07,0,1.947-0.873,1.947-1.947V3.898C27.27,2.818,26.393,1.947,25.322,1.947z M9.312,3.41c0.537,0,0.973,0.436,0.973,0.975c0,0.537-0.436,0.973-0.973,0.973c-0.539,0-0.975-0.436-0.975-0.973C8.338,3.845,8.773,3.41,9.312,3.41z M6.33,3.41c0.537,0,0.975,0.436,0.975,0.975c0,0.537-0.438,0.973-0.975,0.973c-0.539,0-0.975-0.436-0.975-0.973C5.355,3.845,5.791,3.41,6.33,3.41z M3.406,3.41c0.541,0,0.975,0.436,0.975,0.975c0,0.537-0.434,0.973-0.975,0.973c-0.535,0-0.971-0.436-0.971-0.973C2.436,3.845,2.871,3.41,3.406,3.41z M25.322,23.375H1.949V6.838h23.373C25.322,6.838,25.322,23.375,25.322,23.375z"/><path fill="${color}" d="M14.797,15.566L5.844,20.16v-1.332l7.602-3.781v-0.039l-7.602-3.782V9.894l8.953,4.572V15.566z"/><path fill="${color}" d="M21.422,14.334v1.232h-4.764v-1.232H21.422z"/></svg>`,
    popcorn: `<svg class="icon" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path fill="${color}" d="m512 392c0-33.084-26.916-60-60-60s-60 26.916-60 60c-33.084 0-60 26.916-60 60s26.916 60 60 60c10.573 0 20.898-2.854 30-8.184 9.102 5.33 19.427 8.184 30 8.184 33.084 0 60-26.916 60-60 0-10.574-2.854-20.898-8.185-30 5.331-9.102 8.185-19.426 8.185-30z"/><path fill="${color}" d="m345 180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-15c0-21.867-12.028-41.634-30.537-52.081.357-2.624.537-5.266.537-7.919 0-33.084-26.916-60-60-60-2.652 0-5.295.18-7.919.537-10.447-18.508-30.214-30.537-52.081-30.537s-41.634 12.029-52.081 30.537c-2.624-.357-5.267-.537-7.919-.537-33.084 0-60 26.916-60 60 0 2.653.18 5.295.537 7.919-18.509 10.446-30.537 30.214-30.537 52.081h-15c-8.284 0-15 6.716-15 15s6.716 15 15 15zm-196.82-91.82c8.5-8.499 19.8-13.18 31.82-13.18s23.32 4.681 31.82 13.18c5.858 5.858 5.858 15.355 0 21.213-2.929 2.929-6.768 4.394-10.607 4.394s-7.677-1.464-10.606-4.393c-2.834-2.834-6.601-4.394-10.607-4.394s-7.773 1.56-10.607 4.394c-5.858 5.858-15.355 5.857-21.213-.001s-5.858-15.356 0-21.213z"/><path fill="${color}" d="m34.005 210 26.056 288.35c.698 7.73 7.178 13.65 14.939 13.65h23.162l-13.644-302z"/><path fill="${color}" d="m128.193 512h36.807v-302h-50.451z"/><path fill="${color}" d="m195 512h36.807l13.644-302h-50.451z"/><path fill="${color}" d="m261.838 512h23.162c7.761 0 14.24-5.92 14.939-13.65l26.056-288.35h-50.513z"/></g></svg>`,
    cup: `<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.009 512.009" style="enable-background:new 0 0 512.009 512.009" xml:space="preserve"><path fill="${color}" d="M370.634,395.38l4.715-0.917c5.547-1.067,136.661-26.773,136.661-95.808c0-21.461-6.933-36.8-20.651-45.611c-19.797-12.757-47.531-7.168-64.683-1.707v-16.683c0-17.643-14.357-32-32-32H96.009c-17.643,0-32,14.357-32,32v21.333c0,63.637,29.675,122.027,78.827,160H10.676c-4.309,0-8.213,2.603-9.856,6.592c-1.664,3.989-0.747,8.576,2.304,11.627l23.915,23.915c14.123,14.101,32.875,21.867,52.8,21.867h330.987c19.648,0,38.891-7.979,52.8-21.867l23.915-23.915c3.051-3.051,3.968-7.637,2.304-11.627c-1.664-3.989-5.547-6.592-9.856-6.592H347.807C356.02,409.673,363.593,402.783,370.634,395.38z M425.418,274.313c13.483-5.12,40.405-12.373,54.4-3.307c7.317,4.672,10.859,13.739,10.859,27.648c0,35.477-59.307,59.221-98.496,69.931C410.783,340.809,422.324,308.596,425.418,274.313z"/><path fill="${color}" d="M328.415,113.332c17.344-21.675,17.344-55.616,0-77.291c-3.733-4.608-10.432-5.312-14.997-1.664c-4.608,3.669-5.333,10.389-1.664,14.997c11.008,13.717,11.008,36.907-0.043,50.667c-17.365,21.653-17.365,55.616-0.021,77.291c2.133,2.645,5.205,4.011,8.341,4.011c2.347,0,4.715-0.768,6.677-2.347c4.608-3.669,5.333-10.389,1.664-14.997C317.364,150.281,317.364,127.092,328.415,113.332z"/><path fill="${color}" d="M264.308,113.332c17.365-21.675,17.365-55.616,0-77.291c-3.669-4.587-10.368-5.333-14.997-1.664c-4.608,3.669-5.333,10.389-1.664,14.997c10.987,13.717,10.987,36.907-0.021,50.667c-17.365,21.653-17.365,55.616,0,77.291c2.112,2.645,5.205,4.011,8.341,4.011c2.325,0,4.693-0.768,6.656-2.347c4.587-3.669,5.333-10.389,1.664-14.997C253.3,150.281,253.3,127.092,264.308,113.332z"/><path fill="${color}" d="M200.394,113.311c17.344-21.675,17.344-55.616,0-77.291c-3.669-4.587-10.389-5.355-14.997-1.643c-4.587,3.669-5.333,10.389-1.643,14.976c10.987,13.717,10.987,36.907-0.021,50.667c-17.387,21.675-17.387,55.637-0.021,77.312c2.112,2.624,5.205,3.989,8.341,3.989c2.325,0,4.693-0.768,6.656-2.347c4.608-3.669,5.333-10.389,1.664-14.997C189.385,150.26,189.385,127.071,200.394,113.311z"/></svg>`,
  }

  return icons[icon]
}

/**
 * @typedef {Object} SvgData
 * @property {string} icon - new favicon
 * @property {string} env - environment
 */

/**
 * @typedef
 * @param {SvgData} faviconData
 * @returns {string}
 */
function svgToDataUri({ icon = 'rocket', env = 'prod' }) {
  const colors = {
    prod: '#4dffa6',
    stag: '#ffff4d',
    localhost: '#ff4d4d',
  }

  return `data:image/svg+xml,${encodeURIComponent(getIcon(icon, colors[env]))}`
}

/**
 * @typedef {Object} Options
 * @property {string} prod - prod url
 * @property {string} stag - stag url
 * @property {string} localhost - localhost url
 */

/**
 * @typedef {Object} ValidatedOptions
 * @property {string} env - env
 * @property {string} host - value url
 */

/**
 *
 * @param {Options} envOptions
 * @returns {Array<ValidatedOptions>}
 */
function envOptionsValidator({ prod, stag, localhost }) {
  const hasProd = prod && prod.length > 1
  const hasStag = stag && stag.length > 1
  const hasLocalhost = localhost && localhost.length > 1
  const result = (env, host) => ({
    env,
    host,
  })

  return [
    hasProd ? result('prod', prod) : undefined,
    hasStag ? result('stag', stag) : undefined,
    hasLocalhost ? result('localhost', localhost) : undefined,
  ].filter(Boolean)
}

const logger = () => {
  const types = {
    error: console.error,
    info: console.info,
    warn: console.warn,
  }

  /**
   * @param {"error" | "info" | "warn"} type
   * @param {string} message
   */
  function log(type, message) {
    types[type](`TabEnvLogger ${message}`)
  }

  return {
    log,
  }
}

const tabEnvLogger = logger()
