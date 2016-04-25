import React, {Component, PropTypes} from 'react'
export default class Spinner extends Component {
  
  render() {
    const { toggleMode, clearPositions } = this.props
    return <div className="row">
      <div className="col s6 center-align">
        <div className="switch">
          <label className="white-text">
            Select One Position
            <input type="checkbox" onClick={toggleMode}/>
            <span className="lever"></span>
            Select Two Positions
          </label>
        </div>
      </div>
      <div className="col s5 center-align">
        <a className="waves-effect waves-light btn blue" onClick={clearPositions}>Clear Positions</a>
      </div>
    </div>
  }
}