import React from 'react'
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { Base, Login } from './page'
import './App.css'
import { isLogin } from './utils/utils'

const Authorized = function (props) {
    const { component: Component, notLogin } = props
    return (
        <Route
            render={(props) => {
                return isLogin() ? <Component {...props} /> : <Redirect to={notLogin} />
            }}
        />
    )
}

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Authorized path="/" notLogin="/login" component={Base} />
                </Switch>
            </Router>
        </div>
    )
}

export default App
