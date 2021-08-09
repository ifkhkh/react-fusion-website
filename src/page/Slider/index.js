import React, { Component } from 'react'
import _style from './index.module.css'

const log = console.log.bind(console)

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
    componentDidMount() {
        setTimeout(() => {
            const imgs = document.querySelectorAll('img')
            imgs.forEach((img) => {
                // 获取 img left 数值
                let l = img.style.left
                // 200px 处理成 数字 200
                l = Number(l.slice(0, -2))
                const w = img.offsetWidth
                img.style.left = `${l - w}px`
            })
        }, 1000)
    }
    handleTransitionEnd = (v) => {
        let img = v.target
        // 获取 img left 数值
        let l = img.style.left
        // 200px 处理成 数字 200
        l = Number(l.slice(0, -2))
        // 判断 img left 小于 0 时，清除动效，恢复到最右侧位置
        if (l < 0) {
            // 所有图片总长度
            const totalLens = img.offsetWidth * imgInfo.length
            img.style.transition = 'none'
            img.style.left = `${l + totalLens}px`
        }
        // 添加动效
        setTimeout(() => {
            img.style.transition = 'left 1s linear'
            // 其它 img 继续减去 图片宽度
            let l2 = img.style.left
            l2 = Number(l2.slice(0, -2))
            // 图片宽度
            const w = img.offsetWidth
            log('w', w)
            img.style.left = `${l2 - w}px`
        })
    }
    render() {
        return (
            <div>
                <div className={_style.visibleBox}>
                    <div className={_style.container} onTransitionEnd={this.handleTransitionEnd}>
                        {imgInfo.map((img, index) => {
                            return (
                                <img
                                    style={{ left: img.left }}
                                    className={img.className}
                                    src={img.src}
                                    alt={img.alt}
                                    key={img.alt}
                                ></img>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default Slider
