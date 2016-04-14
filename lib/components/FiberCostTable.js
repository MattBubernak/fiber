import React, {Component, PropTypes} from 'react'

import _ from 'lodash'

// React component for visualizing fiber locations on a map
export default class FiberCostTable extends Component {
  
  constructor(props) {
    super(props);
    this.state = {showAllFibers: false};
  }
  
  toggleState() {
    this.setState({
      showAllFibers: !this.state.showAllFibers
    })
  }

  render(){
    const { fibers } = this.props
    
    const tableHeader = <div className="row">
        <div className="col s12 center-align"> Available Fibers </div>
    </div>
    
    const showAllSwitch = <div className="switch">
      <label>
        Off
        <input type="checkbox" defaultChecked onClick={this.toggleState.bind(this)}/>
        <span className="lever"></span>
        On
      </label>
    </div>
    
    const showAll = <div className = "row">
      <div className = "col s5">{showAllSwitch}</div>
      <div className = "col s7">Only show fibers in range</div>
    </div>

    const rowHeaders = <div className= 'row grey' style={{marginBottom:0}}>
        <div className="col s2"> Id </div>
        <div className="col s5"> Cost ($) </div>
        <div className="col s5"> Distance (m) </div>
      </div>

    const rowElements = _.map(fibers, (fiber, i) => {
      console.log(fiber)
      const className = fiber.isSelected && this.state.showAllFibers ? 'row yellow fiber' : 'row fiber'
      if (fiber.isSelected || this.state.showAllFibers) {
        return <li key={i}>
          <div className="collapsible-header">
            <div className={className} style={{marginBottom:0}}>
              <div className="col s2"> {i} </div>
              <div className="col s5"> {fiber.cost.Total.toFixed(0)} </div>
              <div className="col s5"> {fiber.distance} </div>
            </div>
          </div>
          <div className="collapsible-body">
            <p>Highway Hazard: ${fiber.cost['Highway Hazard'].toFixed(0)}</p>
            <p>Lake Hazard: ${fiber.cost['Lake Hazard'].toFixed(0)}</p>
            <p>Total: ${fiber.cost.Total.toFixed(0)}</p>
          </div>
        </li>
      }
    })

    return <div>
      { tableHeader }
      { showAll }
      { rowHeaders }
      <ul className="collapsible popout" data-collapsible="accordion">
        { rowElements }
      </ul>
    </div>
  }
  
  componentDidMount() {
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  }

}
