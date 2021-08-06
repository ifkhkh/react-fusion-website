import React from 'react'
// const log = console.log.bind(console)

const Title = function (props) {
    // log('p', p)
    let styleBorder = { border: `1px solid ${props.borderColor}`, margin: '10px 0' }
    return (
        <div>
            <div style={styleBorder}>
                <h1>{props.title}</h1>
                <div style={{ margin: '10px 0' }}>{props.subTitle}</div>
            </div>
            {/* <Title title="列表页面" subTitle="这里现实的是一个列表页面" borderColor="#ff0000" /> */}
        </div>
    )
}

export default Title
