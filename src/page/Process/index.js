import React, { Component } from 'react'
import { Step, Button } from '@alifd/next'
import { log } from '../../utils/utils'

const steps = [['Step 1'], ['Step 2'], ['Step 3']].map((item, index) => (
    <Step.Item
        aria-current={index === 1 ? 'step' : null}
        key={index}
        title={item[0]}
        content={item[1]}
    />
))

class Process extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentIndex: 0,
        }
    }

    handleLeftOrRight = (num) => {
        // num 1 or -1
        // 1 下一表单
        // -1 上一表单
        // start end 表单不能再切换

        let { currentIndex } = this.state
        // console.log('num, currentIndex', num, currentIndex)
        const notLeft = currentIndex === 0 && num === -1
        const notRight = currentIndex === steps.length - 1 && num === 1
        const toggleOk = !(notLeft || notRight)

        if (toggleOk) {
            log(11)
            currentIndex = currentIndex + num
            this.setState({
                currentIndex,
            })
        }
    }

    render() {
        const { currentIndex } = this.state
        return (
            <div>
                <h3>Circle</h3>
                <Step current={currentIndex} stretch shape="circle">
                    {steps}
                </Step>
                <Button
                    className="basic-button"
                    onClick={() => {
                        this.handleLeftOrRight(-1)
                    }}
                >
                    left
                </Button>
                <Button
                    className="basic-button"
                    onClick={() => {
                        this.handleLeftOrRight(1)
                    }}
                >
                    right
                </Button>
            </div>
        )
    }
}

export default Process
