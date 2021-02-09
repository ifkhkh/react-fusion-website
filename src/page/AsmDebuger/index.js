import React from 'react'
import { Balloon, Button, Grid, Input, Table } from '@alifd/next'
import _style from './index.module.css'
import axePU from './x16asm'
import axeVM from './x16vm'

const log = console.log.bind(console)

const code = `
jump @1024
.memory 1024
set2 f1 3
jump @__main
@__main
.var2 a3 1
set2 a1 3
set2 a2 2
halt
`

function AsmDebuger() {
    const ref = React.useRef(null)
    const [memory, setMemory] = React.useState([])
    const [asm_code, setAsm_code] = React.useState(code)
    const [asm, setAsm] = React.useState({})
    const [vm, setVm] = React.useState({})
    const [compiled, setCompiled] = React.useState(false)
    const [regs, setRegs] = React.useState({ pa: 0, a1: 0, a2: 0, a3: 0, c1: 0, f1: 0 })
    const [selection, setSelection] = React.useState({ start: 0, end: 0 })
    const [running, setRunning] = React.useState(true)

    const handleAsmCode = (v) => {
        setAsm_code(v)
    }

    const handleAxeCompile = () => {
        let code = asm_code.trim()
        let cpu = axePU.new(code)
        let done = cpu.run()
        if (!done) {
            alert('asm_code 错误指令')
            return
        }

        let m = cpu.memory
        if (cpu.memory.slice(-1)[0] !== 255) {
            m.push(255)
        }
        // setMemory([...m, ...Array(100 - m.length).fill(0)])
        setMemory([...m])
        setAsm_code(cpu.formattedCode)
        setAsm(cpu)

        let vm = axeVM.new(m)
        setVm(vm)
        setCompiled(true)
    }

    const textAreaFocus = () => {
        let node = ref.current.getInputNode()
        let index = regs.pa
        node.selectionStart = selection.start
        node.selectionEnd = selection.end

        if (asm.selection[index] !== undefined) {
            node.selectionStart = asm.selection[index].start
            node.selectionEnd = asm.selection[index].end
            setSelection({
                start: asm.selection[index].start,
                end: asm.selection[index].end,
            })
            // node.focus()
        }
        //log(node.selectionStart, node.selectionEnd)
        node.focus()
    }

    const handleAxeRun = () => {
        let done = vm.run()
        if (done) {
            setRunning(false)
        }
        setMemory([...vm.memory.slice(0, memory.length)])
        setRegs({ ...vm.regs })
        textAreaFocus()
    }

    const handleClear = () => {
        setAsm_code('')
        setCompiled(false)
        setRunning(true)
    }

    return (
        <>
            <Grid.Row>
                <Grid.Col>
                    <Input.TextArea
                        rows={50}
                        // autoHeight={true}
                        ref={ref}
                        placeholder={'input'}
                        value={asm_code}
                        onChange={handleAsmCode}
                    />
                    <div style={{ marginTop: 10 }}>
                        {compiled ? (
                            <>
                                <Button
                                    disabled={!running}
                                    onClick={handleAxeRun}
                                    style={{ marginRight: 5 }}
                                >
                                    next
                                </Button>
                                <Button onClick={handleClear}>clear</Button>
                            </>
                        ) : (
                            <Button onClick={handleAxeCompile}>compile</Button>
                        )}
                    </div>
                </Grid.Col>
                <Grid.Col>
                    {compiled && (
                        <Table dataSource={[regs]}>
                            <Table.Column title="pa" dataIndex="pa" />
                            <Table.Column title="a1" dataIndex="a1" />
                            <Table.Column title="a2" dataIndex="a2" />
                            <Table.Column title="a3" dataIndex="a3" />
                            <Table.Column title="c1" dataIndex="c1" />
                            <Table.Column title="f1" dataIndex="f1" />
                        </Table>
                    )}

                    {compiled && (
                        <>
                            <div className={_style.box}>
                                {memory.map((m, i) => {
                                    return (
                                        <div
                                            className={
                                                regs.pa === i
                                                    ? `${_style.cell} ${_style.paHighLight}`
                                                    : _style.cell
                                            }
                                            key={i}
                                        >
                                            <Balloon
                                                trigger={<span>{m}</span>}
                                                closable={false}
                                                triggerType="hover"
                                            >
                                                memory[{i}]
                                            </Balloon>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </Grid.Col>
            </Grid.Row>
        </>
    )
}

export default AsmDebuger
