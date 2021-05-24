export default ({ store }, inject) => {
    const message = {
        show: (title, text) => {
            store.commit('setMessage', true)
            store.commit('setMessageData', {
                title,
                text,
            })
        },
        hide: () => {
            store.commit('setMessage', false)
        }
    }

    inject('message', message)
}