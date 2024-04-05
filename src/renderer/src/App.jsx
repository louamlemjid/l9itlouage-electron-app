import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
    
      <Router>
        <Route path="/"></Route>
      <h1>dddddddddd</h1>
      </Router>
    </>
  )
}

export default App

