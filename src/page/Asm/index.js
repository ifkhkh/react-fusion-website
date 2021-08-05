import React, { useState } from 'react'
import { Button } from '@alifd/next'
import Title from '../../component/Title'

const Asm = function () {
    const [text, setText] = useState('asm code 页面, 点我!')

    const handleChange = () => setText('我变化了啦' + Date.now())

    return (
        <div>
            <Title title="asm title" subTitle="hhhhh" borderColor="blue" />

            <Button onClick={handleChange}>{text}</Button>
        </div>
    )
}

export default Asm
