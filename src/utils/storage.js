class Storage {
    constructor() {
        // eslint-disable-next-line no-undef
        this.s = localStorage
    }

    get(key) {
        let v = this.s.getItem(key)
        let value = JSON.parse(v)
        return value
    }

    set(key, value) {
        let v = JSON.stringify(value)
        this.s.setItem(key, v)
    }

    clear() {
        this.s.clear()
    }
}

const __storage = new Storage()

export default __storage
