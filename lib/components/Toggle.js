import React, {Component, PropTypes} from 'react'
export default class Spinner extends Component {
  
  render() {
    const { toggleMode } = this.props
    return <div className="switch">
      <label>
        Select One Position
        <input type="checkbox" onClick={toggleMode}/>
        <span className="lever"></span>
        Select Two Positions
      </label>
    </div>
  }
}