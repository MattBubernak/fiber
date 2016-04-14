// create a store with initial values
let store = {
  center: [40.01, -105.25], // Boulder
  selectedPosition: null,
  fibers: [],
  geoData: null
}

// make it a global variable (easy for debugging in the developer's console)
global.store = store

// export it
export default store
