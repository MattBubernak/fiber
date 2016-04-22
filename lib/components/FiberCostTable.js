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
    var rowElements = {};
    if(this.props.isLoading){
      rowElements = <center id="tableCalc"><h5>Calculating Fiber Costs...</h5></center>
    }
    else{
      rowElements = _.map(fibers, (fiber, i) => {
        //console.log(fiber)
        if(fiber.cost){
          if(fiber.cost['Highway Hazard']) {
            hazards.highway = '<p>Highway Hazard: &nbsp;+&nbsp; $ ' + fiber.cost['Highway Hazard'].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
          }
          if(fiber.cost['Lake Hazard']) {
            hazards.lake = '<p>Lake Hazard: &nbsp;+&nbsp; $ ' + fiber.cost['Lake Hazard'].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
          }
          if(fiber.cost['Bridge Hazard']) {
            hazards.bridge = '<p>Bridge Hazard: &nbsp;+&nbsp; $ ' + fiber.cost['Bridge Hazard'].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
          }
          if(fiber.cost['School Hazard']) {
            hazards.school = '<p>School Hazard: &nbsp;+&nbsp; $ ' + fiber.cost['School Hazard'].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>'
          }
        }
        const headClassName = fiber.isSelected && this.state.showAllFibers ? 'collapsible-header orange darken-3 black-text' : 'collapsible-header grey darken-2'
        if (fiber.isSelected || this.state.showAllFibers) {
          return <li key={i}>
            <div className={headClassName}>
              <div className="row fiber" style={{marginBottom:0}}>
                <div className="col s2"> {i} </div>
                <div className="col s5"> $ {fiber.cost.Total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </div>
                <div className="col s5"> {fiber.distance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} m</div>
              </div>
            </div>
            <div className="collapsible-body grey darken-3">
              <p>Distance cost: &nbsp;$ {fiber.cost.distance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.highway}}/>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.lake}}/>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.bridge}}/>
              <div className="orange-text" dangerouslySetInnerHTML={{__html: hazards.school}}/>
              <p><b>Total: &nbsp;</b> $ {fiber.cost.Total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
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
