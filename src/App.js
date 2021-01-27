import React from 'react'
import './App.css'
import routeMap from './page/routeConfig'

import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'

function App() {
    const routes = routeMap.map((it, k) => {
        it.key = k

        return <Route {...it} key={k} />
    })

    return (
        <div className="App">
            <Router>
                <Switch>
                    {routes}
                    <Route render={() => <Redirect to="/404" />} />
                </Switch>
            </Router>
        </div>
    )
}

export default App
