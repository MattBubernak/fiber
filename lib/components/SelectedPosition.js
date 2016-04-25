import React, {Component, PropTypes} from 'react'
import { Map, Marker, Popup, TileLayer, Polyline, LayerGroup, Path, Circle, CircleMarker } from 'react-leaflet'
import { NEARBY_METERS } from '../constants'

export default class SelectedPosition extends Component {

  render(){
    const { map, selectedPosition, firstSelectedPosition, secondSelectedPosition, selectOnlyOne } = this.props
    console.log('select only one', selectOnlyOne)
    console.log('first position', firstSelectedPosition)
    if (selectedPosition && selectOnlyOne){

      const nearbyCircle = <Circle center={selectedPosition} map={map} radius={NEARBY_METERS}/>

      const marker = <CircleMarker center={selectedPosition} map={map} radius={10}/>

      // Q: What's the difference beteween CircleMarker and Circle

      return <div>
        { nearbyCircle }
        { marker }
      </div>
    }
    else if (firstSelectedPosition && !selectOnlyOne && !secondSelectedPosition) {
      const nearbyCircle = <Circle center={firstSelectedPosition} map={map} radius={NEARBY_METERS}/>

      const marker = <CircleMarker center={firstSelectedPosition} map={map} radius={10}/>

      // Q: What's the difference beteween CircleMarker and Circle

      return <div>
        { nearbyCircle }
        { marker }
      </div>
    }
    else if (firstSelectedPosition && secondSelectedPosition && !selectOnlyOne) {
      const nearbyCircle1 = <Circle center={firstSelectedPosition} map={map} radius={NEARBY_METERS}/>

      const marker1 = <CircleMarker center={firstSelectedPosition} map={map} radius={10}/>
      
      const nearbyCircle2 = <Circle center={secondSelectedPosition} map={map} radius={NEARBY_METERS}/>

      const marker2 = <CircleMarker center={secondSelectedPosition} map={map} radius={10}/>

      // Q: What's the difference beteween CircleMarker and Circle

      return <div>
        { nearbyCircle1 }
        { marker1 }
        { nearbyCircle2 }
        { marker2 }
      </div>
    }
    else {
      return null
    }
  }
}
