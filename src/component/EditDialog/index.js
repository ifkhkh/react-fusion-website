import React from 'react'
import { Form, Input, Dialog } from '@alifd/next'
// const log = console.log.bind(console)

const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        fixedSpan: 8,
    },
    wrapperCol: {
        span: 14,
    },
}

const EditDialog = (props) => {
    const { visible, record, editField, onClose, onEditOk } = props
    const { init } = editField
    console.log('edit')
    return (
        <Dialog
            title="edit"
            visible={visible}
            onOk={() => {
                const v = editField.getValues()
                const c = v.hair
                v.hair = {}
                v.hair.color = c
                console.log('id values', v)
                onEditOk && onEditOk(v)
                onClose()
            }}
            onCancel={onClose}
            // onCancel={() => {
            //     onClose()
            // }}
            onClose={onClose}
        >
            <Form style={{ width: '60%' }} {...formItemLayout}>
                <FormItem label="Id">
                    <Input
                        disabled
                        {...init('id', {
                            initValue: record?.id,
                        })}
                    />
                </FormItem>
                <FormItem label="Name">
                    <Input {...init('name', { initValue: record?.name })} />
                </FormItem>
                <FormItem label="Hair">
                    <Input {...init('hair', { initValue: record?.hair?.color })} />
                </FormItem>
            </Form>
        </Dialog>
    )
}

export default EditDialog
