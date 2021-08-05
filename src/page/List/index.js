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
