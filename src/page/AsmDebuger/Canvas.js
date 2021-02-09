import React from 'react'

function Canvas({ memory = [], start = false }) {
    const canvas = React.useRef(null)

    React.useEffect(() => {
        let c = canvas.current.getContext('2d')
        drawPxList(memory, c)
    }, [canvas.current, start])

    // let context = canvas.current.getContext('2d')

    const getPoint = function (p, index) {
        // var index = index % 100
        let w = 5
        let h = 5
        let x = (index % 100) * w
        let y = Math.floor(index / 100) * h
        // log('x y', x, y)

        let r = ((p >> 6) * 255) / 3
        let g = (((p & 0b00110000) >> 4) * 255) / 3
        let b = (((p & 0b00001100) >> 2) * 255) / 3
        let a = Math.floor(((p & 0b00000011) * 255) / 3)

        return [x, y, w, h, r, g, b, a]
    }

    const drawPoint = function (point, GuaCanvas) {
        let p = point
        let x = p[0]
        let y = p[1]
        let w = p[2]
        let h = p[3]

        let r = p[4]
        let g = p[5]
        let b = p[6]
        let a = p[7]

        if (a > 0) {
            GuaCanvas.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
            GuaCanvas.fillRect(x, y, w, h)
        }
    }

    const drawPxList = function (pxList, GuaCanvas) {
        let w = 400
        let h = 400
        GuaCanvas.width = w
        GuaCanvas.height = h
        //  一次性处理完

        let points = []
        for (let i = 0; i < pxList.length; i++) {
            let pixel = getPoint(pxList[i], i)
            points.push(pixel)
        }

        for (let i = 0; i < points.length; i++) {
            const e = points[i]
            // if (e[4] !== 255) {
            drawPoint(e, GuaCanvas)
            // }
        }
    }

    return (
        <canvas style={{ border: '1px solid lightblue' }} ref={canvas} width={400} height={400} />
    )
}

export default Canvas
