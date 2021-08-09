import React from 'react'
import Asm from './Asm'
import List from './List'
import List2 from './List2'
import Process from './Process'
import Slider from './Slider'

const Error = function () {
    return <div>404</div>
}

const Index = function () {
    return <div>首页</div>
}

// const List = function() {
//     return <div>list</div>
// }

const routeMap = [
    {
        path: '/',
        component: Index,
        exact: true,
    },
    {
        path: '/asm_code',
        component: Asm,
        exact: true,
    },
    {
        path: '/list',
        component: List,
        exact: true,
    },
    {
        path: '/list2',
        component: List2,
        exact: true,
    },
    {
        path: '/process',
        component: Process,
        exact: true,
    },
    {
        path: '/slider',
        component: Slider,
        exact: true,
    },
    {
        path: '/404',
        component: Error,
        exact: true,
    },
]

export default routeMap
