import React, { useState } from 'react'
import _style from './index.module.css'
import { Button } from '@alifd/next'

const Index = function () {
    const [text, setText] = useState('asm code 页面, 点我')

    const handleChange = () => setText('我变化了啦' + Date.now())

    return (
        <div className={_style.page}>
            <Button onClick={handleChange}>{text}</Button>
        </div>
    )
}

export default Index
