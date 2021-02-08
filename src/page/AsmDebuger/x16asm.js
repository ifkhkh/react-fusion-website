const log = console.log.bind(console)

// noinspection DuplicatedCode,UnnecessaryLocalVariableJS
export default class AxePU {
    constructor(asm) {
        this.asm = asm
        this.formattedCode = asm
        this.memory = []
        this.registers = {
            pa: 0,
            a1: 16,
            a2: 32,
            a3: 48,
            c1: 64,
            f1: 80,
        }
        this.selection = {}
        this.preSelected = {}
        this.label_address = {}
        this.varMap = {}
        this.localOffset = 0
        this.current = null
    }

    static new(asm) {
        let cls = this
        let cpu = new cls(asm)
        return cpu
    }

    extendMemory = (value) => {
        let length = value - this.memory.length
        let l = []
        for (let i = 0; i < length; i += 1) {
            l.push(0)
        }
        this.memory.push(...l)
    }

    memory_address(memory) {
        let m = memory.slice(1)
        if (!isNaN(m)) {
            m = Number(m)
        }
        return m
    }

    parseValue(value) {
        if (value[0] === '@') {
            value = value.slice(1)
        }

        if (!isNaN(value)) {
            let n = Number(value)
            let high = n >> 8
            let low = n & 255
            return [low, high]
        } else {
            log('error')
            log(value)
            // error('wrong')
        }
    }

    parseLabel(label) {
        let n = label.slice(1)
        if (!isNaN(n)) {
            n = Number(n)
            let high = n >> 8
            let low = n & 255
            return [low, high]
        } else {
            return [n, 0]
        }
    }

    cleanCode(code) {
        let r = []
        let lines = code.split('\n')
        for (let line of lines) {
            let index = line.indexOf(';')
            if (index > -1) {
                line = line.slice(0, index)
            }
            let l = line.trim()
            if (l !== '') {
                r.push(l)
            }
        }
        return r.join('\n')
    }

    fake_instruction_call(code) {
        let function_name = code[1]
        let variables = code.slice(2)
        // log('variables', variables)
        // 起始位置是 f1 + 2
        // 如果是数字就直接设置内存
        // 如果是 a 就要找到 offset
        let list = []
        for (let i = 0; i < variables.length; i++) {
            let e = variables[i]

            if (!isNaN(e)) {
                let t = [`set2 a1 ${e}`]
                list.push(...t)
            } else {
                let o = 0
                if (this.current == null) {
                    o = this.varMap[e]
                } else {
                    o = this.varMap[this.current][e]
                }
                let offset = this.localOffset - o
                let t = [`set2 a3 ${offset}`, `subtract2 f1 a3 a3`, `load_from_register2 a3 a1`]
                list.push(...t)
            }

            let m = [`set2 a3 ${(i + 1) * 2}`, `add2 f1 a3 a3`, `save_from_register2 a1 a3`]
            list.push(...m)
        }

        let t = [
            `set2 a3 14`,
            `add2 pa a3 a3`,
            `save_from_register2 a3 f1`,
            `set2 a3 2`,
            `add2 f1 a3 f1`,
            `jump ${function_name}`,
        ]

        list.push(...t)
        return list
    }

    fake_instruction_return(code) {
        let list = []
        let n = this.localOffset + 2
        if (code.length > 1) {
            let v = code[1]
            let offset = this.localOffset - this.varMap[this.current][v]
            let t = [`set2 a3 ${offset}`, `subtract2 f1 a3 a3`, `load_from_register2 a3 a1`]
            list.push(...t)
        }

        let t = [
            `set2 a3 ${n}`,
            `subtract2 f1 a3 f1`,
            `load_from_register2 f1 a2`,
            `jump_from_register a2`,
        ]
        list.push(...t)
        return list
    }

    fake_instruction_var(code) {
        const n = code[1]

        if (this.current !== null) {
            this.varMap[this.current][n] = this.localOffset
        } else {
            this.varMap[n] = this.localOffset
        }

        let result = []
        if (code.length > 2) {
            const val = code[2]
            let t = [`set2 a1 ${val}`, `save_from_register2 a1 f1`]
            result.push(...t)
        }

        let l = [`set2 a3 2`, `add2 f1 a3 f1`]
        result.push(...l)
        this.localOffset += 2
        return result
    }

    fake_instruction_add(code) {
        let v1 = code[1]
        let v2 = code[2]
        let v3 = code[3]
        let o = this.localOffset

        if (this.current !== null) {
            v1 = this.varMap[this.current][v1]
            v2 = this.varMap[this.current][v2]
            v3 = this.varMap[this.current][v3]
        } else {
            v1 = this.varMap[v1]
            v2 = this.varMap[v2]
            v3 = this.varMap[v3]
        }

        let o1 = o - v1
        let o2 = o - v2
        let o3 = o - v3
        let t = [
            `set2 a3 ${o1}`,
            `subtract2 f1 a3 a3`,
            `load_from_register2 a3 a1`,

            `set2 a3 ${o2}`,
            `subtract2 f1 a3 a3`,
            `load_from_register2 a3 a2`,

            `add2 a1 a2 a1`,

            `set2 a3 ${o3}`,
            `subtract2 f1 a3 a3`,
            `save_from_register2 a1 a3`,
        ]
        return t
    }

    fake_instruction_subtract2(code) {
        let v1 = code[1]
        let v2 = code[2]
        let v3 = code[3]
        let o = this.localOffset

        if (this.current != null) {
            v1 = this.varMap[this.current][v1]
            v2 = this.varMap[this.current][v2]
            v3 = this.varMap[this.current][v3]
        } else {
            v1 = this.varMap[v1]
            v2 = this.varMap[v2]
            v3 = this.varMap[v3]
        }

        let o1 = o - v1
        let o2 = o - v2
        let o3 = o - v3
        let t = [
            `set2 a3 ${o1}`,
            `subtract2 f1 a3 a3`,
            `load_from_register2 a3 a1`,

            `set2 a3 ${o2}`,
            `subtract2 f1 a3 a3`,
            `load_from_register2 a3 a2`,

            `subtract2 a1 a2 a1`,

            `set2 a3 ${o3}`,
            `subtract2 f1 a3 a3`,
            `save_from_register2 a1 a3`,
        ]
        return t
    }

    fake_instruction_multiply2(code) {
        let v1 = code[1]
        let v2 = code[2]
        let v3 = code[3]
        let o = this.localOffset

        if (this.current != null) {
            v1 = this.varMap[this.current][v1]
            v2 = this.varMap[this.current][v2]
            v3 = this.varMap[this.current][v3]
        } else {
            v1 = this.varMap[v1]
            v2 = this.varMap[v2]
            v3 = this.varMap[v3]
        }

        let o1 = o - v1
        let o2 = o - v2
        let o3 = o - v3
        let t = [
            `set2 a3 ${o1}`,
            `subtract2 f1 a3 a3`,
            `load_from_register2 a3 a1`,

            `set2 a3 ${o2}`,
            `subtract2 f1 a3 a3`,
            `load_from_register2 a3 a2`,

            `multiply2 a1 a2 a1`,

            `set2 a3 ${o3}`,
            `subtract2 f1 a3 a3`,
            `save_from_register2 a1 a3`,
        ]
        return t
    }

    process_function_offset(name) {
        if (name.endsWith('end')) {
            this.current = null
            // this.varMap = {}
        } else {
            this.localOffset = 0
            this.current = name
            this.varMap[this.current] = {}
        }
    }

    process_fake_instruction(asm) {
        let result = []
        let mapper = {
            '.call': this.fake_instruction_call.bind(this),
            '.return': this.fake_instruction_return.bind(this),
            '.var2': this.fake_instruction_var.bind(this),
            '.add2': this.fake_instruction_add.bind(this),
            '.subtract2': this.fake_instruction_subtract2.bind(this),
            '.multiply2': this.fake_instruction_multiply2.bind(this),
        }
        let lines = asm.split('\n')

        let offset = 0

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            let code = line.split(' ')
            let op = code[0]
            if (op.startsWith('@function')) {
                this.process_function_offset(op)
            }

            if (op[0] === '.' && mapper[op] !== undefined) {
                let newLine = mapper[op](code)
                result.push(...newLine)

                // offset 是处理之后的行号, line 是处理之前的行号
                this.preSelected[offset] = {
                    line: i,
                    length: line.length,
                }
                offset += newLine.length
            } else {
                result.push(line)

                this.preSelected[offset] = {
                    line: i,
                    length: line.length,
                }
                offset += 1
            }
            // log(line, this.localOffset, this.varMap, this.current,)
        }
        return result.join('\n')
    }

    preprocess(code) {
        code = this.cleanCode(code)
        this.formattedCode = code
        code = this.process_fake_instruction(code)
        return code
    }

    asmOffsetMapper(index, offset, lineStart) {
        if (this.preSelected[index] !== undefined) {
            const { length } = this.preSelected[index]
            this.selection[offset] = {
                start: lineStart,
                end: lineStart + length,
            }
            lineStart += length + 1
        }
        return lineStart
    }

    run() {
        let asm = this.asm
        let lines = this.preprocess(asm)

        lines = lines.split('\n')
        let regs = this.registers
        let offset = 0

        let lineStart = 0
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            line = line.trim()
            if (line === '') {
                continue
            }
            let code = line.split(' ')
            let op = code[0]

            // 记录 pa 和 line 的映射
            lineStart = this.asmOffsetMapper(i, offset, lineStart)

            if (op[0] === '@') {
                // 处理 label
                this.label_address[op.slice(1)] = offset
            } else if (op === '.memory') {
                let l = Number(code[1])
                this.extendMemory(l)
                offset = l
            } else if (op === 'set') {
                offset += 3
                let reg = code[1]
                reg = regs[reg]
                let value = Number(code[2])
                this.memory.push(0)
                this.memory.push(reg)
                this.memory.push(value)
            } else if (op === 'save') {
                offset += 3
                let reg = code[1]
                reg = regs[reg]
                let mem = this.memory_address(code[2])
                this.memory.push(3)
                this.memory.push(reg)
                this.memory.push(mem)
            } else if (op === 'load') {
                offset += 3
                let mem = this.memory_address(code[1])
                let reg = code[2]
                reg = regs[reg]
                this.memory.push(1)
                this.memory.push(mem)
                this.memory.push(reg)
            } else if (op === 'add') {
                offset += 4
                let r1 = code[1]
                let r2 = code[2]
                let r3 = code[3]

                r1 = regs[r1]
                r2 = regs[r2]
                r3 = regs[r3]

                this.memory.push(2)
                this.memory.push(r1)
                this.memory.push(r2)
                this.memory.push(r3)
            } else if (op === 'compare') {
                offset += 3
                let r1 = code[1]
                let r2 = code[2]
                r1 = regs[r1]
                r2 = regs[r2]
                this.memory.push(4)
                this.memory.push(r1)
                this.memory.push(r2)
            } else if (op === 'jump_if_less') {
                offset += 3
                let mem = this.parseLabel(code[1])
                this.memory.push(5)
                this.memory.push(mem[0])
                this.memory.push(mem[1])
            } else if (op === 'jump') {
                offset += 3
                let mem = this.parseLabel(code[1])
                this.memory.push(6)
                this.memory.push(mem[0])
                this.memory.push(mem[1])
            } else if (op === 'save_from_register') {
                offset += 3
                let r1 = code[1]
                let r2 = code[2]
                r1 = regs[r1]
                r2 = regs[r2]
                this.memory.push(7)
                this.memory.push(r1)
                this.memory.push(r2)
            } else if (op === 'set2') {
                offset += 4
                let reg = code[1]
                reg = regs[reg]
                let value = this.parseValue(code[2])
                this.memory.push(8)
                this.memory.push(reg)
                this.memory.push(value[0])
                this.memory.push(value[1])
            } else if (op === 'load2') {
                offset += 4
                let mem = this.parseValue(code[1])
                let reg = code[2]
                reg = regs[reg]
                this.memory.push(9)
                this.memory.push(mem[0])
                this.memory.push(mem[1])
                this.memory.push(reg)
            } else if (op === 'add2') {
                offset += 4
                let r1 = code[1]
                let r2 = code[2]
                let r3 = code[3]

                r1 = regs[r1]
                r2 = regs[r2]
                r3 = regs[r3]

                this.memory.push(10)
                this.memory.push(r1)
                this.memory.push(r2)
                this.memory.push(r3)
            } else if (op === 'save2') {
                offset += 4
                let reg = code[1]
                reg = regs[reg]
                let mem = this.parseValue(code[2])
                this.memory.push(11)
                this.memory.push(reg)
                this.memory.push(mem[0])
                this.memory.push(mem[1])
            } else if (op === 'subtract2') {
                offset += 4
                let r1 = code[1]
                let r2 = code[2]
                let r3 = code[3]

                r1 = regs[r1]
                r2 = regs[r2]
                r3 = regs[r3]

                this.memory.push(12)
                this.memory.push(r1)
                this.memory.push(r2)
                this.memory.push(r3)
            } else if (op === 'load_from_register') {
                offset += 3
                let r1 = code[1]
                let r2 = code[2]
                r1 = regs[r1]
                r2 = regs[r2]
                this.memory.push(13)
                this.memory.push(r1)
                this.memory.push(r2)
            } else if (op === 'load_from_register2') {
                offset += 3
                let r1 = code[1]
                let r2 = code[2]
                r1 = regs[r1]
                r2 = regs[r2]
                this.memory.push(14)
                this.memory.push(r1)
                this.memory.push(r2)
            } else if (op === 'save_from_register2') {
                offset += 3
                let r1 = code[1]
                let r2 = code[2]
                r1 = regs[r1]
                r2 = regs[r2]
                this.memory.push(15)
                this.memory.push(r1)
                this.memory.push(r2)
            } else if (op === 'jump_from_register') {
                offset += 2
                let r = code[1]
                r = regs[r]
                this.memory.push(16)
                this.memory.push(r)
            } else if (op === 'halt') {
                offset += 1
                this.memory.push(255)
            } else if (op === 'shift_right') {
                offset += 4
                let r1 = code[1]
                let r2 = code[2]
                let r3 = code[3]

                r1 = regs[r1]
                r2 = regs[r2]
                r3 = regs[r3]

                this.memory.push(17)
                this.memory.push(r1)
                this.memory.push(r2)
                this.memory.push(r3)
            } else if (op === 'and') {
                offset += 4
                let r1 = code[1]
                let r2 = code[2]
                let r3 = code[3]

                r1 = regs[r1]
                r2 = regs[r2]
                r3 = regs[r3]

                this.memory.push(19)
                this.memory.push(r1)
                this.memory.push(r2)
                this.memory.push(r3)
            } else if (op === 'multiply2') {
                offset += 4
                let r1 = code[1]
                let r2 = code[2]
                let r3 = code[3]

                r1 = regs[r1]
                r2 = regs[r2]
                r3 = regs[r3]

                this.memory.push(20)
                this.memory.push(r1)
                this.memory.push(r2)
                this.memory.push(r3)
            } else {
                return false
            }
        }

        for (let i = 0; i < this.memory.length; i++) {
            let e = this.memory[i]
            if (typeof e === 'string') {
                let v = this.label_address[e]
                let high = v >> 8
                let low = v & 255
                this.memory[i] = low
                this.memory[i + 1] = high
            }
        }

        log('varMap', this.varMap)
        return this.memory
    }
}

//
// const machine_code = function(asm) {
//     let cpu = AxePU.new(asm)
//     let mem = cpu.run()
//     return mem
// }
