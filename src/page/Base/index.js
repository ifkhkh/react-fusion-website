import React from 'react'
import { Route, Redirect, Switch, Link } from 'react-router-dom'
import { Dialog, Menu, Nav } from '@alifd/next'
import routeMap from '../routeConfig'
import _style from './index.module.css'
import __storage from '../../utils/storage'
import { jumpHref } from '../../utils/utils'

const menuList = [
    {
        path: '/',
        name: '主页',
    },
    {
        // path: '/',
        name: '子菜单',
        sub: [
            {
                path: '/asm',
                name: 'asm',
            },
            {
                path: '/list',
                name: 'List',
            },
            {
                path: '/list2',
                name: 'List2',
            },
        ],
    },
]

const Base = function () {
    const handleLogout = () => {
        __storage.set('_token', null)
        Dialog.show({
            title: '已退出',
        })
        const t = setTimeout(() => {
            clearTimeout(t)
            jumpHref('/login')
        }, 300)
    }

    const header = <span>react 学习 demo</span>
    const footer = <span onClick={handleLogout}>退出</span>
    const routes = routeMap.map((it, k) => {
        return <Route {...it} key={k} />
    })

    const handleHighlight = (t) => {
        const c = t === window.location.pathname ? _style.menu_item : ''
        // console.log('cc', c)
        return c
    }

    return (
        <div>
            <div>
                <Nav
                    className={_style.nav}
                    direction="hoz"
                    type="primary"
                    header={header}
                    footer={footer}
                    defaultSelectedKeys={['home']}
                    triggerType="hover"
                >
                    <Nav.Item key="home">
                        <Link to={'/'}>主页</Link>
                    </Nav.Item>
                    <Nav.SubNav label="Component">
                        <Nav.Item key="next">Next</Nav.Item>
                        <Nav.Item key="mext">Mext</Nav.Item>
                    </Nav.SubNav>
                    <Nav.Item key="document">Document</Nav.Item>
                </Nav>
            </div>
            <div className={_style.main}>
                <Menu className={_style.menu} defaultOpenKeys={['sub']}>
                    <Menu.Item key="1">
                        <Link to={'/'}>主页</Link>
                    </Menu.Item>
                    <Menu.SubMenu key="sub" label="子菜单">
                        <Menu.Item key="sub-1" className={handleHighlight('/asm_code')}>
                            <Link to={'/asm_code'}>asm_code</Link>
                        </Menu.Item>

                        <Menu.Item key="sub-2" className={handleHighlight('/list')}>
                            <Link to={'/list'}>List</Link>
                        </Menu.Item>

                        <Menu.Item key="sub-3" className={handleHighlight('/list2')}>
                            <Link to={'/list2'}>List2</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
                <div className={_style.content}>
                    <Switch>
                        {routes}
                        <Route render={() => <Redirect to="/404" />} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default Base
