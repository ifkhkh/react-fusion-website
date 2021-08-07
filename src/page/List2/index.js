import React, { useState, useEffect } from 'react'
import { Table, Field } from '@alifd/next'
import Request from '../../api/request'
import Title from '../../component/Title'
import EditDialog from '../../component/EditDialog'

const log = console.log.bind(console)

const List = function () {
    const [data, setData] = useState([])

    const [activeData, setActiveData] = useState({
        visible: false,
        record: {},
    })

    const requestData = function () {
        Request.getList().then((res) => {
            log(res)
            if (res.success) {
                setData(res.data)
                // log('data', data)
            }
        })
    }

    useEffect(requestData, [])

    const editField = Field.useField()

    const onRemove = (id) => {
        // log(id)
        let index = -1
        data.forEach((item, i) => {
            if (item.id === id) {
                index = i
            }
        })
        if (index !== -1) {
            // log(data)
            data.splice(index, 1)
            // ？ setData(data) data更新，页面不渲染
            setData(data.slice())
        }
    }

    const renderOper = (value, index, record) => {
        //
        // log(value, index, record)
        return (
            <div>
                <span
                    onClick={() => {
                        onOpen(record)
                    }}
                >
                    编辑
                </span>

                <span
                    onClick={() => {
                        onRemove(record.id)
                    }}
                >
                    删除
                </span>
            </div>
        )
    }

    const onOpen = (record) => {
        const d = {
            record: record,
            visible: true,
        }
        setActiveData(d)
    }

    const onClose = () => {
        const d = {
            record: {},
            visible: false,
        }
        setActiveData(d)
    }

    const handleEditOk = (record) => {
        // console.log(data, 'in handle ok')
        let index = -1
        data.forEach((element, i) => {
            if (record.id === element.id) {
                // log(element, i)
                index = i
            }
        })
        if (index !== -1) {
            // log(data)
            record.pigu = data[index].pigu
            data[index] = record
            setData(data.slice())
        }
    }

    return (
        <div>
            <Title title="列表页面1" subTitle="这里现实的是一个列表页面" borderColor="#ff0000" />

            <Table.StickyLock dataSource={data}>
                <Table.Column title="Id" dataIndex="id" />
                <Table.Column title="Name" dataIndex="name" />
                <Table.Column title="Hair" dataIndex="hair.color" />
                <Table.Column title="Pigu" dataIndex="pigu" />
                <Table.Column title="操作" cell={renderOper} />
            </Table.StickyLock>

            <EditDialog
                visible={activeData.visible}
                record={activeData.record}
                editField={editField}
                onClose={onClose}
                onEditOk={handleEditOk}
            />
        </div>
    )
}

export default List
