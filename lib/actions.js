import store from './store'
import refresh from './refresh'
import _ from 'lodash'
import geolib from 'geolib'
import $ from 'jquery'
import { NEARBY_METERS } from './constants'

//
// Action functions
//

// Action to load fiber data asynchrnously
export function loadDataAsync(){

  $.ajax('data/boulder.json').done(function(json) {
    store.geometries = json

    let fibers = {}

    store.fibers = _.map(json, (d) => {

      // implement the correct logic to compute the center of the geometry
      // hint: use geolib.getCenter()      
      const center = geolib.getCenter(d.coordinates)

      return {
        geometry: d,
        center: center
      }
    })

    refresh()
  })
}


// [out:json][timeout:25];
// // gather results
// (
//   way["bridge"="yes"](40,-105.5,40.1,-105.2);// Bridge
//   way["highway"="primary"](40,-105.5,40.1,-105.2); // Highway
//   node["natural"="water"](40,-105.5,40.1,-105.2); // Body of water
//   way["amenity"~"school"](40,-105.5,40.1,-105.2); // schools
// );
// // print results
// out body;
// >;
// out skel qt;



export function loadGeoDataAsync(){
  console.log("Queueing up the geoDataLoad")
  var queryURL = 'https://www.overpass-api.de/api/interpreter?data=' + 
        '[out:json][timeout:60];' + 
        '('
        'way["bridge"="yes"](40,-105.5,40.1,-105.2);' +
        'way["highway"="primary"](40,-105.5,40.1,-105.2);' +
        'node["natural"="water"](40,-105.5,40.1,-105.2);' +
        'way["amenity"~"school"](40,-105.5,40.1,-105.2);' +
        ');' + 
        'out body;;';
  $.ajax({
    url: queryURL,
    dataType: 'json',
    type: 'GET',
    async: true,
    crossDomain: true
  }).done(function(result) {
    console.log( "second success",result );
    store.geoData = result;
    
  }).fail(function(error) {
    console.log(error);
    console.error( "Critical Error: Not able to load geo data", error );
  }).always(function() {
    console.log( "completed Geo Data Load" );
  });
}
  
// Action to set a position selected by the user
export function setSelectedPosition(latlng) {
  store.selectedPosition = latlng

  _.forEach(store.fibers, forEachFiberSetIsSelected)

  _.forEach(store.fibers, forEachFiberSetCost)

  refresh()
}

//
// private helper function
//

// helper to set each fiber's 'isSelected' flag based on whether this fiber is
// nearby with respect to the position selected by the user
function forEachFiberSetIsSelected(fiber){

   // implement the logic to set fiber.isSelected if the fiber's geometry center
   // is within a certain distance from the selected position 'NEARBY_METERS'
   // hint: use geolib.getDistance()
  
  
  fiber.isSelected = false
  if( geolib.getDistance(fiber.center, store.selectedPosition) <= NEARBY_METERS){
    fiber.isSelected = true
  }
}

// helper to set the cost of connecting this fiber to the selected position
function forEachFiberSetCost(fiber){

  // implement the logic to calcualte the cost of connecting from the selected
  // position to this fiber, and the distance between them.
  // Calculate the min distance from each of the points of the line
  fiber.distance = _.reduce(fiber.geometry.coordinates, function(min,coordinate) { 
    let dist = geolib.getDistance(store.selectedPosition,coordinate) 
    if (dist < min) return dist
    else return min 
  },Number.MAX_VALUE);
  
  var centerDist = geolib.getDistance(store.selectedPosition, fiber.center)
  
  if( fiber.distance > centerDist){
    fiber.distance = centerDist;
  }
  console.log("Trying to calculate cost")
  calculateCostBetween(store.selectedPosition, fiber)
}

// Cost Algorithm
function calculateCostBetween(start, fiber){

  fiber.cost = {"distance": 1000*fiber.distance, "Highway Hazard":6800, "Lake Hazard": 650, "Total": 1000*fiber.distance + 6800 + 650}
}