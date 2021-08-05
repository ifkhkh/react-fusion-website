import React from 'react'
import Asm from './Asm'
// import AsmCode from './Asmcode'

const Error = function () {
    return <div>404</div>
}

const Index = function () {
    return <div>首页</div>
}

const List = function() {
    return <div>list</div>
}

const routeMap = [
    {
        path: '/',
        component: Index,
        exact: true,
    },
    {
        path: '/asm_code',
        component: Asm,
        // component: List,
        exact: true,
    },
    {
        path: '/list',
        component: List,
        exact: true,
    },
    {
        path: '/404',
        component: Error,
        exact: true,
    },
]

export default routeMap
