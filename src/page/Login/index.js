import React, { useEffect, useState } from 'react'
import _style from './index.module.css'
import { Balloon, Button, Card, Dialog, Field, Form, Input, Select } from '@alifd/next'
import __storage from '../../utils/storage'
import { isLogin, jumpHref } from '../../utils/utils'

const { Option } = Select

const commonProps = {
    title: '欢迎登录',
    style: { width: 300 },
    extra: (
        <Balloon
            trigger={
                <Button text type="primary">
                    Link
                </Button>
            }
            triggerType="click"
        >
            <div>测试账号</div>
            <div>admin</div>
            <div>axe</div>
        </Balloon>
    ),
}

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}

const Login = function () {
    const field = Field.useField({
        onChange: function (name, value) {
            field.setValue(name, value)
        },
    })

    useEffect(() => {
        if (isLogin()) {
            Dialog.show({
                title: '已登录',
            })
            const t = setTimeout(() => {
                clearTimeout(t)
                jumpHref('/')
            }, 300)
        }
    }, [])

    const [userType, setUserType] = useState('login')

    const handleChangeType = (v) => {
        setUserType(v)
    }

    const handleClick = () => {
        field.validate((err, values) => {
            console.log(err, values)
            if (userType === 'login') {
                if (values.name === 'admin' && values.pwd === 'axe') {
                    __storage.set('_token', 'xxx')
                    Dialog.show({
                        title: '登录成功',
                        onOk: () => {
                            jumpHref('/')
                        },
                        onCancel: () => {
                            jumpHref('/')
                        },
                    })
                } else {
                    Dialog.show({
                        title: '密码错误',
                    })
                    field.setValues({
                        name: '',
                        pwd: '',
                    })
                }
            }
        })
    }

    return (
        <div className={_style.main}>
            <Card free className={_style.custom}>
                <Card.Header title="Simple Card" {...commonProps} />
                <Card.Divider />
                <Card.Content>
                    <Form {...formItemLayout} field={field}>
                        <Form.Item label="类型">
                            <Select
                                value={userType}
                                onChange={handleChangeType}
                                style={{ width: '100%' }}
                            >
                                <Option value="login">登录</Option>
                                <Option value="register">注册</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item required label="用户名:">
                            <Input placeholder="请输入用户名" name="name" />
                        </Form.Item>
                        <Form.Item required label="密码:">
                            <Input.Password placeholder="请输入密码" name="pwd" />
                        </Form.Item>
                    </Form>
                </Card.Content>
                <Card.Divider />
                <Card.Actions className={_style.customFoot}>
                    <Button type="primary" key="action1" text onClick={handleClick}>
                        {userType === 'login' ? '登录' : '注册'}
                    </Button>
                </Card.Actions>
            </Card>
        </div>
    )
}

export default Login
