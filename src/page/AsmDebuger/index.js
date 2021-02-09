import React from 'react'
import { Balloon, Button, Grid, Input, Table } from '@alifd/next'
import _style from './index.module.css'
import axePU from './x16asm'
import axeVM from './x16vm'
import Canvas from './Canvas'

const log = console.log.bind(console)

const code = `
jump @1024
.memory 1024
set2 f1 3
jump @__main
@__main
.var2 x
.var2 y
.var2 n 100
.var2 s 30000
.multiply2 n y y
.add2 x y x
.add2 x s s
set2 a3 195
save_from_register a3 a1
halt
`

const code1 = `
jump @1024
.memory 1024
set2 f1 3
jump @__main



@__main
    .call @function_1
    halt

@function_1
    .call @function_draw_point 2 1 
    .call @function_draw_point 3 0 
    .call @function_draw_point 3 1 
    .call @function_draw_point 3 2 
    .call @function_draw_point 3 3 
    .call @function_draw_point 3 4 
    .call @function_draw_point 3 5
    .call @function_draw_point 3 6 
    .call @function_draw_point 3 7 
    .call @function_draw_point 1 7 
    .call @function_draw_point 2 7 
    .call @function_draw_point 3 7 
    .call @function_draw_point 4 7 
    .call @function_draw_point 5 7 
    .return 
@function_1_end
@function_draw_point
    ; x , y
    .var2 x
    .var2 y
    .var2 n 100
    .var2 s 30000
    .multiply2 n y y
    .add2 x y x
    .add2 x s s
    set2 a3 195
    save_from_register a3 a1
    .return

`

function AsmDebuger() {
    const ref = React.useRef(null)
    const [memory, setMemory] = React.useState([])
    const [screen, setScreen] = React.useState([])
    const [asm_code, setAsm_code] = React.useState(code1)
    const [asm, setAsm] = React.useState({})
    const [vm, setVm] = React.useState({})
    const [compiled, setCompiled] = React.useState(false)
    const [regs, setRegs] = React.useState({ pa: 0, a1: 0, a2: 0, a3: 0, c1: 0, f1: 0 })
    const [selection, setSelection] = React.useState({ start: 0, end: 0 })
    const [running, setRunning] = React.useState(true)
    const [canDraw, setCanDraw] = React.useState(false)

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

    let id = null

    const handleAxeRun = () => {
        let done = vm.run()
        if (done) {
            setRunning(false)
            clearInterval(id)
        }
        // handleSetMemory(vm.memory, memory.length)
        setMemory([...vm.memory.slice(0, memory.length)])
        setScreen([...vm.memory.slice(30000, 30100)])
        setRegs({ ...vm.regs })
        textAreaFocus()
    }

    const handleAutoRun = () => {
        if (running) {
            id = setInterval(() => {
                handleAxeRun()
            }, 100)
        } else {
            clearInterval(id)
        }
    }

    const handleDraw = () => {
        let done = vm.run()
        while (done === undefined) {
            done = vm.run()
        }
        setMemory([...vm.memory.slice(0, 1024)])
        setScreen([...vm.memory.slice(30000, 40000)])
        setRegs({ ...vm.regs })
        setCanDraw(true)
    }

    const handleClear = () => {
        setAsm_code('')
        setCompiled(false)
        setRunning(false)
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
                                <Button
                                    disabled={!running}
                                    onClick={handleAutoRun}
                                    style={{ marginRight: 5 }}
                                >
                                    auto
                                </Button>
                                <Button
                                    disabled={!running}
                                    onClick={handleDraw}
                                    style={{ marginRight: 5 }}
                                >
                                    run to draw
                                </Button>
                                <Button
                                    disabled={running}
                                    onClick={() => setCanDraw(true)}
                                    style={{ marginRight: 5 }}
                                >
                                    draw
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
            <Grid.Row justify={'center'} style={{ marginTop: 10 }}>
                <Canvas memory={screen} start={canDraw} />
            </Grid.Row>
        </>
    )
}

export default AsmDebuger
