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
        '(' +
        'way["bridge"="yes"](40,-105.5,40.1,-105.2);' +
        'way["highway"="primary"](40,-105.5,40.1,-105.2);' +
        'way["natural"="water"](40,-105.5,40.1,-105.2);' +
        'way["amenity"~"school"](40,-105.5,40.1,-105.2);' +
        ');' + 
        'out center;';
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
  
  // Initialize the minObj. This contains a min distance, and the coordinate. 
  var minObj = {dist:Number.MAX_VALUE, coord:null}
  
  // Calculate the minObj. 
  minObj =  _.reduce(fiber.geometry.coordinates, function(min,coordinate) { 
    let dist = geolib.getDistance(store.selectedPosition,coordinate) 
    if (dist < min.dist) {
      min.dist = dist
      min.coord = coordinate
      return min
    }
    else return min 
  },minObj);
  
  // Set this as the distance for the fiber. 
  fiber.distance = minObj.dist;
  
  // Also calculate the distance from the center. 
  var centerDist = geolib.getDistance(store.selectedPosition, fiber.center)
  
  // If this distance is smaller, use the center point. 
  if( fiber.distance > centerDist){
    fiber.distance = centerDist;
  }
  

  // Hazards array. 
  var hazards = []  

  // Costs for the hazards
  var waterCost = 5000;
  var schoolCost = 1000;
  var bridgeCost = 4000;
  var highwayCost = 3000;
  
  // Loop through every 'element' in the qery we got back. 
  for( var x in store.geoData.elements){    

    // Assign the current hazard to 'hazard'
    var hazard = store.geoData.elements[x]
    
    // Only do something with it if it's actually close enough to our selected position.
    // TODO: 500 is arbitrary distance atm.      
    if( isCloseHazard(store.selectedPosition, hazard.center,500)){
      if( isWater(hazard)){
        hazards.push([hazard.id,"Water", waterCost]);
      }
      else if(isBridge(hazard)){
        hazards.push([hazard.id,"Bridge", bridgeCost]);
      }
      else if(isHighway(hazard)){
        hazards.push([hazard.id,"Highway", highwayCost]);
      }else if(isSchool(hazard)){
        hazards.push([hazard.id,"School", schoolCost]);
      }
    }
  }
  console.log(hazards);

  // Create the final cost. 
  calculateCostBetween(store.selectedPosition, fiber, hazards)
  
}

// Cost Algorithm
function calculateCostBetween(start, fiber,hazards){
  var highwayCost = 0; 
  var waterCost = 0;
  var schoolCost = 0; 
  var bridgeCost = 0; 

  for (var x in hazards)
  {
    if (hazards[x][1] == "Highway") { highwayCost += hazards[x][2]}
    if (hazards[x][1] == "Water") { waterCost += hazards[x][2]}
    if (hazards[x][1] == "Bridge") { bridgeCost += hazards[x][2]}
    if (hazards[x][1] == "School") { schoolCost += hazards[x][2]}
  }

  fiber.cost = {
    "distance": 1000*fiber.distance, 
    "Highway Hazard":highwayCost, 
    "Lake Hazard": waterCost, 
    "Bridge Hazard": bridgeCost, 
    "School Hazard":schoolCost, 
    "Total": 1000*fiber.distance + bridgeCost + highwayCost + schoolCost + waterCost
  }
  //console.log(fiber.cost);
}

function isCloseHazard(selectedPos, hazardPos, range){
  if (geolib.getDistance(selectedPos,hazardPos) < range) {
    console.log('close hazard found!');
    return true
  }
    else return false
}
function isWater(hazard) {
  if (hazard.tags.hasOwnProperty('natural') && hazard.tags['natural'] == 'water') {
    return true; 
  }
 return false
}
function isBridge(hazard) {
 if (hazard.tags.hasOwnProperty('bridge') && hazard.tags['bridge'] == 'yes') {
    return true; 
  }
 return false
}

function isHighway(hazard) {
 if (hazard.tags.hasOwnProperty('highway') && hazard.tags['highway'] == 'primary') {
    return true; 
  }
 return false
}

function isSchool(hazard) {
 if (hazard.tags.hasOwnProperty('amenity') && hazard.tags['amenity'] == 'school') {
    return true; 
  }
 return false

}

//function calculateCostBetween(selectedPos, hazardPos){
  
//}