import React, { useState, useEffect } from 'react'
import { Table } from '@alifd/next'
import Request from '../../api/request'

const log = console.log.bind(console)

const List = function () {
    const [data, setData] = useState([])

    useEffect(() => {
        Request.getList().then((res) => {
            log(res)
            if (res.success) {
                setData(res.data)
                log('data', data)
            }
        })
    }, [])

    return (
        <div>
            <div style={{ border: '1px solid red', margin: '10px 0' }}>
                <h1>列表页面</h1>
                <div style={{ margin: '10px 0' }}>这里现实的是一个列表页面</div>
            </div>
            {/* <Title title="列表页面" subTitle="这里现实的是一个列表页面" borderColor="#ff0000" /> */}
            <Table.StickyLock dataSource={data}>
                <Table.Column title="Id" dataIndex="id" />
                <Table.Column title="Name" dataIndex="name" />
                <Table.Column title="Hair" dataIndex="hair.color" />
                <Table.Column title="Pigu" dataIndex="pigu" />
            </Table.StickyLock>
        </div>
    )
}

export default List
