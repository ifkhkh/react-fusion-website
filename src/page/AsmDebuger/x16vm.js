const log = console.log.bind(console)

export default class AxePUVM {
    constructor(memory) {
        this.memory = [...memory]
        this.regs = {
            pa: 0,
            a1: 0,
            a2: 0,
            a3: 0,
            c1: 0,
            f1: 0,
        }
        this.initMemory()
    }

    static new(memory) {
        // 用 this.变量名 来创造一个只有类的实例才能访问的变量
        // 定义实例变量的时候必须用 var 或 const 来修饰
        let cls = this
        let n = new cls(memory)
        return n
    }

    initMemory() {
        let m = []
        let len = 65536 - this.memory.length
        for (let i = 0; i < len; i += 1) {
            m.push(0)
        }
        this.memory.push(...m)
    }

    sumValue(low, high) {
        return low + high * 256
    }

    parseValue(n) {
        let high = n >> 8
        let low = n & 255
        return [low, high]
    }

    set_pa(value) {
        this.regs['pa'] = value
    }

    // 通过数字反查寄存器

    set_register(reg, val) {
        if (reg === 0) {
            this.regs['pa'] = val
        } else if (reg === 16) {
            this.regs['a1'] = val
        } else if (reg === 32) {
            this.regs['a2'] = val
        } else if (reg === 48) {
            this.regs['a3'] = val
        } else if (reg === 64) {
            this.regs['c1'] = val
        } else if (reg === 80) {
            this.regs['f1'] = val
        }
    }

    register(reg) {
        if (reg === 0) {
            return this.regs['pa']
        } else if (reg === 16) {
            return this.regs['a1']
        } else if (reg === 32) {
            return this.regs['a2']
        } else if (reg === 48) {
            return this.regs['a3']
        } else if (reg === 64) {
            return this.regs['c1']
        } else if (reg === 80) {
            return this.regs['f1']
        }
    }

    pa_plus(step) {
        this.regs['pa'] += step
    }

    run() {
        let pa = this.regs['pa']
        let op = this.memory[pa]
        // log('pa op', pa, op)
        if (op === 255) {
            this.pa_plus(1)
            log('halt', this.regs)
            return true
        } else if (op === 0) {
            // set a1 1
            let reg = this.memory[pa + 1]
            let val = this.memory[pa + 2]
            this.pa_plus(3)
            this.set_register(reg, val)
        } else if (op === 1) {
            // load @100 a1
            let reg = this.memory[pa + 2]
            let val = this.memory[pa + 1]
            this.pa_plus(3)
            this.set_register(reg, this.memory[val])
        } else if (op === 2 || op === 10) {
            // add   add2   a1 a2 a3
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            let r3 = this.memory[pa + 3]
            this.pa_plus(4)
            let val = this.register(r1) + this.register(r2)
            this.set_register(r3, val)
        } else if (op === 3) {
            // save a1 @100
            let reg = this.memory[pa + 1]
            let val = this.memory[pa + 2]
            this.pa_plus(3)
            this.memory[val] = this.register(reg)
        } else if (op === 4) {
            // compare a1 a2
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            let v1 = this.register(r1)
            let v2 = this.register(r2)
            this.pa_plus(3)
            if (v1 === v2) {
                this.regs['c1'] = 1
            } else if (v1 > v2) {
                this.regs['c1'] = 2
            } else {
                this.regs['c1'] = 0
            }
        } else if (op === 5) {
            // jump_if_less @label

            if (this.regs['c1'] === 0) {
                let value = this.sumValue(this.memory[pa + 1], this.memory[pa + 2])
                this.set_pa(value)
            } else {
                this.pa_plus(3)
            }
        } else if (op === 6) {
            // jump @label
            let value = this.sumValue(this.memory[pa + 1], this.memory[pa + 2])
            this.set_pa(value)
        } else if (op === 7) {
            // save_from_register a1 a2 把 a1 的值 a2 表示的内存
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            this.pa_plus(3)
            let v = this.register(r1)
            let index = this.register(r2)
            this.memory[index] = v
        } else if (op === 8) {
            // set2 a1 3
            let reg = this.memory[pa + 1]
            let v1 = this.memory[pa + 2]
            let v2 = this.memory[pa + 3]
            let val = this.sumValue(v1, v2)
            this.pa_plus(4)
            this.set_register(reg, val)
        } else if (op === 9) {
            // load2 @100 a1
            this.pa_plus(4)
            let v1 = this.memory[pa + 1]
            let v2 = this.memory[pa + 2]
            let reg = this.memory[pa + 3]
            let index = this.sumValue(v1, v2)
            let value = this.sumValue(this.memory[index], this.memory[index + 1])
            this.set_register(reg, value)
        } else if (op === 11) {
            // save2 a1 @100
            this.pa_plus(4)
            let reg = this.memory[pa + 1]
            let value = this.register(reg)
            value = this.parseValue(value)

            let address1 = this.memory[pa + 2]
            let address2 = this.memory[pa + 3]
            let index = this.sumValue(address1, address2)

            this.memory[index] = value[0]
            this.memory[index + 1] = value[1]
        } else if (op === 12) {
            // subtract2
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            let r3 = this.memory[pa + 3]
            this.pa_plus(4)
            let val = this.register(r1) - this.register(r2)
            this.set_register(r3, val)
        } else if (op === 13) {
            // load_from_register
            this.pa_plus(3)
            let r1 = this.memory[pa + 1]
            let address = this.register(r1)
            let v1 = this.memory[address]
            let v2 = this.memory[address + 1]
            let val = this.sumValue(v1, v2)

            let r2 = this.memory[pa + 2]
            this.set_register(r2, val)
        } else if (op === 14) {
            // load_from_register2
            this.pa_plus(3)
            let r1 = this.memory[pa + 1]
            let address = this.register(r1)
            let val = this.sumValue(this.memory[address], this.memory[address + 1])

            let r2 = this.memory[pa + 2]
            this.set_register(r2, val)
        } else if (op === 15) {
            // save_from_register2 a1 a2
            this.pa_plus(3)
            let r1 = this.memory[pa + 1]
            let v = this.register(r1)
            v = this.parseValue(v)

            let r2 = this.memory[pa + 2]
            let index = this.register(r2)
            this.memory[index] = v[0]
            this.memory[index + 1] = v[1]
        } else if (op === 16) {
            // jump_from_register2 a1
            let r = this.memory[pa + 1]
            let index = this.register(r)
            this.set_pa(index)
        } else if (op === 17) {
            // shift_right a1 a2 a3
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            let r3 = this.memory[pa + 3]
            this.pa_plus(4)
            let val = this.register(r1) >> this.register(r2)
            this.set_register(r3, val)
        } else if (op === 19) {
            // and a1 a2 a3
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            let r3 = this.memory[pa + 3]
            this.pa_plus(4)
            let val = this.register(r1)
            this.register(r2)
            this.set_register(r3, val)
        } else if (op === 20) {
            // subtract2
            let r1 = this.memory[pa + 1]
            let r2 = this.memory[pa + 2]
            let r3 = this.memory[pa + 3]
            this.pa_plus(4)
            let val = this.register(r1) * this.register(r2)
            this.set_register(r3, val)
        } else {
            log('xxx error', op)
            return true
        }
    }

    //
    // drawPxList(pxList) {
    //     let w = 800
    //     let h = 800
    //     GuaCanvas.init(w, h)
    //     let points = pointsFromPxList(pxList, w, h)
    //     while (GuaCanvas.running()) {
    //         GuaCanvas.updateEvents()
    //
    //         GuaCanvas.clear()
    //
    //         // 画出所有点
    //         for (let i = 0; i < points.length(); i += 1) {
    //             let p = points[i]
    //             drawPoint(p)
    //         }
    //
    //         GuaCanvas.show()
    //     }
    // }
    //
    //
    // pointsFromPxList(pxList, screenWidth, screenHeight) {
    //     let result = []
    //     const w = 8
    //     const h = 8
    //     for (let i = 0; i < pxList.length(); i += 1) {
    //         const p = pxList[i]
    //         const c = i % 100
    //         const d = int(i / 100)
    //         let x = c * w
    //         let y = d * h
    //         let r = (p >> 6) * 255 / 3
    //         let g = ((p & 0b00110000) >> 4) * 255 / 3
    //         let b = ((p & 0b00001100) >> 2) * 255 / 3
    //         let a = int((p & 0b00000011) * 255 / 3)
    //         result.add([x, y, w, h, r, g, b, a])
    //     }
    //     return result
    // }
    //
    //
    // drawPoint(point) {
    //     let p = point
    //     let x = p[0]
    //     let y = p[1]
    //     let w = p[2]
    //     let h = p[3]
    //
    //     let r = p[4]
    //     let g = p[5]
    //     let b = p[6]
    //     let a = p[7]
    //
    //     if (a > 0) {
    //         GuaCanvas.rect(x, y, w, h, r, g, b, a)
    //     }
    // }

    // _run(memory) {
    //     const vm = AxePUVM.new(memory)
    //     vm.run()
    //     return {memory: vm.memory, regs: vm.regs}
    // }
}

// const run = function(memory) {
//     const vm = AxePUVM.new(memory)
//     vm.run()
//     return {memory: vm.memory, regs: vm.regs}
// }
