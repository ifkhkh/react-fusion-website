import __storage from './storage'

const jumpHref = (url) => {
    // eslint-disable-next-line no-undef
    window.location.href = url
}

const isLogin = () => {
    const token = __storage.get('_token')
    return token !== null
}

const log = console.log.bind(this)

export { jumpHref, isLogin, log }
