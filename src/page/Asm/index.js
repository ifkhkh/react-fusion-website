import React, { useState } from 'react'
import { Button } from '@alifd/next'

const Asm = function () {
    const [text, setText] = useState('asm code 页面, 点我!')

    const handleChange = () => setText('我变化了啦' + Date.now())

    return (
        <div>
            <Button onClick={handleChange}>{text}</Button>
        </div>
    )
}

export default Asm
