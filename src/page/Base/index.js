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
        label: '主页',
        key: 'home',
    },
    {
        // path: '/',
        label: '子菜单',
        key: 'menu1',
        sub: [
            {
                path: '/asm_code',
                label: 'asm',
                key: 'asm',
            },
            {
                path: '/list',
                label: 'List',
                key: 'list',
            },
            {
                path: '/list2',
                label: 'List2',
                key: 'list2',
            },
        ],
    },
    {
        label: '测试',
        key: 'test',
        sub: [
            {
                path: '/404',
                label: 'error',
                key: '404',
            },
        ],
    },
]
const headerList = [
    {
        path: '/',
        label: '主页',
        key: 'home',
    },
    {
        // path: '/',
        label: '子菜单',
        key: 'menu1',
        sub: [
            {
                path: '/asm_code',
                label: 'asm',
                key: 'asm',
            },
            {
                path: '/list',
                label: 'List',
                key: 'list',
            },
            {
                path: '/list2',
                label: 'List2',
                key: 'list2',
            },
        ],
    },
    {
        label: '测试',
        key: 'test',
        sub: [
            {
                path: '/404',
                label: 'error',
                key: '404',
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

    const renderMenu = () => {
        return (
            <Menu className={_style.menu} defaultOpenKeys={['sub']}>
                {menuList.map((it) => {
                    // console.log(it)
                    const { path, label, sub, key } = it
                    if (sub && sub.length > 0) {
                        // 有 sub 说明有子选项, 就要处理成带子选项的

                        // 根据 sub 渲染子菜单
                        const subList = sub.map((subIt) => {
                            // 这里解构语法跟上层的解构语法冲突了
                            // path:subPath 就是类似
                            // const subPath = subIt.path
                            const { path: subPath, key: subKey, label: subLabel } = subIt
                            return (
                                <Menu.Item key={subKey} className={handleHighlight(subPath)}>
                                    {subPath !== undefined ? (
                                        <Link to={subPath}>{subLabel}</Link>
                                    ) : (
                                        subLabel
                                    )}
                                </Menu.Item>
                            )
                        })
                        return (
                            <Menu.SubMenu key={key} label={label}>
                                {subList}
                            </Menu.SubMenu>
                        )
                    } else {
                        // 没有子选项就选染成一级菜单
                        return (
                            <Menu.Item key={key} className={handleHighlight(path)}>
                                {/* 判断一下是否有 path, 有 path 的才需要写成 Link */}
                                {path !== undefined ? <Link to={path}>{label}</Link> : label}
                            </Menu.Item>
                        )
                    }
                })}
            </Menu>
        )
    }
    const renderHeader = () => {
        return (
            <Nav
                className={_style.nav}
                direction="hoz"
                type="primary"
                header={header}
                footer={footer}
                defaultSelectedKeys={['home']}
                triggerType="hover"
            >
                {headerList.map((it) => {
                    // console.log(it)
                    const { path, label, sub, key } = it
                    if (sub && sub.length > 0) {
                        // 有 sub 说明有子选项, 就要处理成带子选项的

                        // 根据 sub 渲染子菜单
                        const subList = sub.map((subIt) => {
                            // 这里解构语法跟上层的解构语法冲突了
                            // path:subPath 就是类似
                            // const subPath = subIt.path
                            const { path: subPath, key: subKey, label: subLabel } = subIt
                            return (
                                <Nav.Item key={subKey}>
                                    {subPath !== undefined ? (
                                        <Link to={subPath}>{subLabel}</Link>
                                    ) : (
                                        subLabel
                                    )}
                                </Nav.Item>
                            )
                        })
                        return (
                            <Nav.SubNav key={key} label={label}>
                                {subList}
                            </Nav.SubNav>
                        )
                    } else {
                        // 没有子选项就选染成一级菜单
                        return (
                            <Nav.Item key={key}>
                                {/* 判断一下是否有 path, 有 path 的才需要写成 Link */}
                                {path !== undefined ? <Link to={path}>{label}</Link> : label}
                            </Nav.Item>
                        )
                    }
                })}
            </Nav>
        )
    }
    return (
        <div>
            <div>{renderHeader()}</div>

            <div className={_style.main}>
                {renderMenu()}
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
