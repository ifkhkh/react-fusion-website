import React from 'react'
import { Balloon, Box, Button, Input, List, Table } from '@alifd/next'
import _style from './index.module.css'
import axePU from './x16asm'
import axeVM from './x16vm'

const log = console.log.bind(console)

function AsmDebuger() {
    const [memory, setMemory] = React.useState(() => {
        let cpu = axePU.new('set2 a1 1')
        cpu.run()
        let m = [...cpu.memory]
        if (m.slice(-1)[0] !== 255) {
            m.push(255)
        }

        let length = 100 - m.length
        for (let i = 0; i < length; i++) {
            m.push(0)
        }

        return m
    })
    const code = `
    .var2 a1
    set2 a1 1
    `
    const ref = React.useRef(null)
    const [asm_code, setAsm_code] = React.useState(code)
    const [asm, setAsm] = React.useState({})
    const [vm, setVm] = React.useState({})
    const [compiled, setCompiled] = React.useState(false)
    const [regs, setRegs] = React.useState({ pa: 0, a1: 0, a2: 0, a3: 0, c1: 0, f1: 0 })

    const handleAsmCode = (v) => {
        setAsm_code(v)
    }

    const handleAxeCompile = () => {
        let cpu = axePU.new(asm_code)
        let done = cpu.run()
        if (!done) {
            alert('asm_code 错误指令')
            return
        }

        let m = cpu.memory
        if (cpu.memory.slice(-1)[0] !== 255) {
            m.push(255)
        }
        setMemory([...m, ...Array(100 - m.length).fill(0)])
        setAsm(cpu)
        // log(cpu.selection)
        let vm = axeVM.new(m)
        setVm(vm)
        setCompiled(true)
    }

    const textAreaFocus = () => {
        let node = ref.current.getInputNode()
        node.selectionStart = asm.selection[0].start
        node.selectionEnd = asm.selection[0].end
        node.focus()
    }

    const handleAxeRun = () => {
        vm.run()
        setRegs(vm.regs)
    }

    return (
        <Box>
            <Input.TextArea
                ref={ref}
                placeholder={'input'}
                value={asm_code}
                onChange={handleAsmCode}
            />
            <div>
                <Button onClick={handleAxeCompile}>提交</Button>
                {compiled && <Button onClick={handleAxeRun}>next</Button>}
            </div>
            {compiled && (
                <>
                    <div className={_style.box}>
                        {memory.map((m, i) => {
                            return (
                                <div className={_style.cell} key={i}>
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
                    <Table dataSource={[regs]}>
                        <Table.Column title="pa" dataIndex="pa" />
                        <Table.Column title="a1" dataIndex="a1" />
                        <Table.Column title="a2" dataIndex="a2" />
                        <Table.Column title="a3" dataIndex="a3" />
                        <Table.Column title="c1" dataIndex="c1" />
                        <Table.Column title="f1" dataIndex="f1" />
                    </Table>
                </>
            )}
        </Box>
    )
}

export default AsmDebuger
