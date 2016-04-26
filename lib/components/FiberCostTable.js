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
        <div className="col s12 center-align"><h4>Available Fibers</h4><hr/> </div>
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
      <div className="col s4" style={{marginLeft:20}}>{showAllSwitch}</div>
      <div className="col s7">Only show fibers in range</div>
    </div>

    const rowHeaders = <div className="row" style={{marginBottom:0}}>
        <div className="col s2 center"><b>ID</b></div>
        <div className="col s4" style={{marginLeft:18}}><b>Cost</b></div>
        <div className="col s4" style={{marginLeft:16}}><b>Distance</b></div>
        <div className="col s12 center"><hr/></div>
      </div>

    var hazards = {};
    var discount = {};
    var rowElements = {};
    if(this.props.isLoading){
      rowElements = <center id="tableCalc"><h5>Calculating Fiber Costs...</h5></center>
    }
    else if(fiber.costs){
      rowElements = _.map(fibers, (fiber, i) => {
        if(fiber.cost && fiber.costs){
          console.log("hazard names: ", fiber.hazards)
          if(fiber.costs.highway) {
            hazards.highway = '<p>Highway Hazard: &nbsp;+&nbsp; $ ' + fiber.costs.highway.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
            hazards.highwayDetail = fiber.hazards.highway.map(function(name, i) {
              return <li key={i}> - {name} </li>
            })
          }
          if(fiber.costs.water) {
            hazards.lake = '<p>Water Hazard: &nbsp;+&nbsp; $ ' + fiber.costs.water.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
            hazards.waterDetail = fiber.hazards.water.map(function(name, i) {
              return <li key={i}> - {name} </li>
            })
          }
          if(fiber.costs.bridge) {
            hazards.bridge = '<p>Bridge Hazard: &nbsp;+&nbsp; $ ' + fiber.costs.bridge.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
            hazards.bridgeDetail = fiber.hazards.bridge.map(function(name, i) {
              return <li key={i}> - {name} </li>
            })
          }
          if(fiber.costs.school) {
            hazards.school = '<p>School Hazard: &nbsp;+&nbsp; $ ' + fiber.costs.school.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
            hazards.schoolDetail = fiber.hazards.school.map(function(name, i) {
              return <li key={i}> - {name} </li>
            })
          }
          if(fiber.discount && fiber.discountCount) {
            discount.cost = '<p>Existing Fiber Discount: ' + fiber.disount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
            dicount.detail = '<p>Number of connecting fibers' + fiber.discountCount.toFixed(0) + '</p>'
          }
        }
        const headClassName = fiber.isSelected && this.state.showAllFibers ? 'collapsible-header orange darken-3 black-text' : 'collapsible-header grey darken-2'
        if (fiber.isSelected || this.state.showAllFibers) {
          return <li key={i}>
            <div className={headClassName}>
              <div className="row fiber" style={{marginBottom:0}}>
                <div className="col s2"> {i} </div>
                <div className="col s5"> $ {fiber.costs.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </div>
                <div className="col s5"> {fiber.distance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} m</div>
              </div>
            </div>
            <div className="collapsible-body grey darken-3">
              <p>Distance cost: &nbsp;$ {fiber.costs.distance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.highway}}/>
              <ul id="hazard-detail">{hazards.highwayDetail}</ul>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.lake}}/>
              <ul id="hazard-detail">{hazards.waterDetail}</ul>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.bridge}}/>
              <ul id="hazard-detail">{hazards.bridgeDetail}</ul>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.school}}/>
              <ul id="hazard-detail">{hazards.schoolDetail}</ul>
              <div className="green-text" dangerouslySetInnerHTML={{__html: discount.cost}}/>
              <div className="green-text" dangerouslySetInnerHTML={{__html: discount.detail}}/>
              <p><b>Total: &nbsp;</b> $ {fiber.costs.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
          </li>
        }
      })
    }  
    return <div className="white-text tableTrans" id="tableContainer">
      { tableHeader }
      { showAll }
      { rowHeaders }
      <ul className="collapsible popout" data-collapsible="accordion" id="tableFibers">
        { rowElements }
      </ul>
    <p id="instructions">Click on Fiber Line for Details!</p>
    </div>
  }
  
  componentDidMount() {
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  }

}
