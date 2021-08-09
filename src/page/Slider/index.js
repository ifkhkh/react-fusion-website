import React, { Component } from 'react'
import Carousel from '../../component/Carousel'
import _style from './index.module.css'

// const log = console.log.bind(console)
const imgInfo = [
    {
        name: 'img1',
        className: _style.img,
        src: 'https://img01.scbao.com/180512/318763-1P512215T722.jpg',
        alt: '1',
        left: '0px',
    },
    {
        name: 'img2',
        className: _style.img,
        src: 'https://img01.scbao.com/180512/318763-1P51222020768.jpg',
        alt: '2',
        left: '200px',
    },
    {
        name: 'img3',
        className: _style.img,
        src: 'https://img01.scbao.com/180512/318763-1P512220T774.jpg',
        alt: '3',
        left: '400px',
    },
]

class Slider extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div>
                <Carousel dataSource={imgInfo} />
            </div>
        )
    }
}

export default Slider
