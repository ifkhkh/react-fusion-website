import React, { Component } from 'react'
import { Table, Field } from '@alifd/next'
import Request from '../../api/request'
import Title from '../../component/Title'
import EditDialog from '../../component/EditDialog'

export class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            activeData: {
                visible: false,
                record: {},
            },
        }
    }

    componentDidMount() {
        // 获取 data
        this.requestData()
    }

    editField = new Field(this)

    requestData = () => {
        Request.getList().then((res) => {
            if (res.success) {
                this.setState({ dataSource: res.data })
            }
        })
    }

    renderOper = (value, index, record) => {
        // console.log(value, index, record)
        return (
            <div>
                <span
                    onClick={() => {
                        console.log(value, index, record)
                        this.onOpen(record)
                    }}
                >
                    编辑
                </span>

                <span
                    onClick={() => {
                        this.handleRemove(record.id)
                    }}
                >
                    删除
                </span>
            </div>
        )
    }

    onOpen = (record) => {
        const d = {
            record: record,
            visible: true,
        }
        this.setState({ activeData: d })
    }

    handleClose = () => {
        const d = {
            record: {},
            visible: false,
        }
        this.setState({ activeData: d })
    }

    handleEditOk = (record) => {
        // console.log(data, 'in handle ok')
        let data = this.state.dataSource.slice()

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
            // setData(data.slice())
            this.setState({ dataSource: data })
        }
    }

    handleRemove = (id) => {
        let data = this.state.dataSource.slice()
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
            this.setState({ dataSource: data })
        }
    }

    render() {
        const { dataSource, activeData } = this.state
        return (
            <div>
                <Title
                    title="列表页面1"
                    subTitle="这里现实的是一个列表页面"
                    borderColor="#ff0000"
                />

                <Table.StickyLock dataSource={dataSource}>
                    <Table.Column title="Id" dataIndex="id" />
                    <Table.Column title="Name" dataIndex="name" />
                    <Table.Column title="Hair" dataIndex="hair.color" />
                    <Table.Column title="Pigu" dataIndex="pigu" />
                    <Table.Column title="操作" cell={this.renderOper} />
                </Table.StickyLock>

                <EditDialog
                    visible={activeData.visible}
                    record={activeData.record}
                    editField={this.editField}
                    onClose={this.handleClose}
                    onEditOk={this.handleEditOk}
                />
            </div>
        )
    }
}

export default List
