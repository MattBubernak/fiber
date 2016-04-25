import React, {Component, PropTypes} from 'react'

import FiberMap from './FiberMap'
import FiberCostTable from './FiberCostTable'
import Toggle from './Toggle'

export default class App extends Component {

  render(){
    const { fibers } = this.props    
    return <div className="row" id="app">
        <div className="col s4">
          <FiberCostTable {...this.props}/>
        </div>
        <div className="col s8">
          <div className="row">
            <div className="col s12">
              <Toggle {...this.props} />
            </div>
            <div className="col s12">
              <FiberMap {...this.props}/>
            </div>
          </div>
        </div>
      </div>
  }
}
