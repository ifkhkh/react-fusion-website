import React, { Component } from 'react'
import { Select, Field, Step, Button, Form, Input } from '@alifd/next'
import { log } from '../../utils/utils'
import _style from './index.module.css'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        fixedSpan: 8,
    },
    wrapperCol: {
        span: 14,
    },
}

const steps = [['学校信息'], ['个人信息'], ['工作信息']].map((item, index) => (
    <Step.Item
        aria-current={index === 1 ? 'step' : null}
        key={index}
        title={item[0]}
        content={item[1]}
    />
))
const Option = Select.Option

const sexInfo = {
    male: ['m1', 'm2'],
    female: ['f1', 'f2'],
}

class Process extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentIndex: 0,
            select: 'male',
        }
    }
    formField = [new Field(this), new Field(this), new Field(this)]

    onChange = (value) => {
        const select = value
        this.setState({
            select,
        })
    }

    handleLeft = () => {
        const num = -1
        // num 1 or -1
        // 1 下一表单
        // -1 上一表单
        // start end 表单不能再切换

        let { currentIndex } = this.state
        // log('num, currentIndex', num, currentIndex)

        currentIndex = currentIndex + num
        this.setState({
            currentIndex,
        })
    }

    handleRight = () => {
        const num = 1
        // num 1 or -1
        // 1 下一表单
        // -1 上一表单
        // start end 表单不能再切换

        let { currentIndex } = this.state
        // log('num, currentIndex', num, currentIndex)

        this.formField[currentIndex].validate((errors, values) => {
            // console.log('validate', errors, values)
            // errors 为 null 时，表单均填写
            if (errors === null) {
                currentIndex = currentIndex + num
                this.setState({
                    currentIndex,
                })
            }
        })
    }

    handleSubmit = () => {
        // log(this.formField[0].getValues())
        // log(this.formField[0].getValue('schoolname'))
        const f1 = this.formField[0].getValues()
        const f2 = this.formField[1].getValues()
        const f3 = this.formField[2].getValues()

        let { currentIndex } = this.state

        this.formField[currentIndex].validate((errors, values) => {
            console.log('validate', errors, values)
            // errors 为 null 时，表单均填写
            if (errors === null) {
                // 合并 3 表单为 1 个表单
                let d = { ...f1, ...f2, ...f3 }
                log('submit', d)
            }
        })
    }

    render() {
        const { currentIndex, select } = this.state
        const sexList = sexInfo[select]
        const v = sexList[0]
        log('select', select)
        return (
            <div>
                <h3>Circle</h3>
                <Step current={currentIndex} stretch shape="circle">
                    {steps}
                </Step>
                <div className={_style.btns}>
                    {currentIndex === 0 ? null : (
                        <Button
                            style={{ marginRight: '10px' }}
                            className="basic-button"
                            onClick={this.handleLeft}
                        >
                            left
                        </Button>
                    )}

                    {currentIndex === steps.length - 1 ? null : (
                        <Button
                            style={{ marginRight: '10px' }}
                            className="basic-button"
                            onClick={this.handleRight}
                        >
                            right
                        </Button>
                    )}

                    {currentIndex === steps.length - 1 ? (
                        <Button className="basic-button" onClick={this.handleSubmit}>
                            submit
                        </Button>
                    ) : null}
                </div>

                {/* 第1个表单 */}

                <Form
                    style={{ width: '60%', display: currentIndex === 0 ? 'block' : 'none' }}
                    {...formItemLayout}
                    field={this.formField[0]}
                    colon
                >
                    <FormItem label="Schoolname" required>
                        <Input name="schoolname" />
                    </FormItem>

                    <FormItem label="Location" required>
                        <Input name="location" />
                    </FormItem>
                    <FormItem label="Select:">
                        <Select
                            name="sex"
                            onChange={this.onChange}
                            defaultValue={select}
                            style={{ marginRight: 8 }}
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="Select:">
                        <Select name="sexValue" value={v} style={{ marginRight: 8 }}>
                            {sexList.map((item, index) => {
                                return (
                                    <Option key={index} value={item}>
                                        {item}
                                    </Option>
                                )
                            })}
                        </Select>
                    </FormItem>
                </Form>

                {/* 第2个表单 */}
                <Form
                    style={{ width: '60%', display: currentIndex === 1 ? 'block' : 'none' }}
                    {...formItemLayout}
                    field={this.formField[1]}
                    colon
                >
                    <FormItem label="Username" required>
                        <Input name="baseUser" />
                    </FormItem>

                    <FormItem label="Age" required>
                        <Input name="age" />
                    </FormItem>
                </Form>

                {/* 第3个表单 */}
                <Form
                    style={{ width: '60%', display: currentIndex === 2 ? 'block' : 'none' }}
                    {...formItemLayout}
                    field={this.formField[2]}
                    colon
                >
                    <FormItem label="CompanyName" required>
                        <Input name="companyName" />
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Process
