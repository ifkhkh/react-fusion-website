import React, { Component } from 'react'
import Title from '../../component/Title'

const log = console.log.bind(console)

class Slider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentIndex: 0,
            select: 'male',
        }
    }
    render() {
        return (
            <div>
                <Title
                    title="列表页面1"
                    subTitle="这里现实的是一个列表页面"
                    borderColor="#ff0000"
                />
            </div>
        )
    }
}

export default Slider
