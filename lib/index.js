import refresh from './refresh'
import { loadDataAsync } from './actions'
import {loadGeoDataAsync} from './actions'
  
loadGeoDataAsync()
loadDataAsync()
refresh()
