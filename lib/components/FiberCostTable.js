import React, {Component, PropTypes} from 'react'

import _ from 'lodash'

// React component for visualizing fiber locations on a map
export default class FiberCostTable extends Component {

  render(){
    const { fibers } = this.props

    const rowHeaders = <div className= 'row grey' style={{marginBottom:0}}>
        <div className="col s2"> id </div>
        <div className="col s5"> cost ($) </div>
        <div className="col s5"> distance(m) </div>
      </div>

    const rowElements = _.map(fibers, (fiber, i) => {

      const className = !fiber.isSelected ? 'row' : 'row yellow'

      return <div key={i} className={className} style={{marginBottom:0}}>
        <div className="col s2"> {i} </div>
        <div className="col s5"> {fiber.cost.toFixed(0)} </div>
        <div className="col s5"> {fiber.distance} </div>
      </div>

    })

    return <div>
      { rowHeaders }
      { rowElements }
    </div>

  }

}
