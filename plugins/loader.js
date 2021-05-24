export default ({ store }, inject) => {
    const loader = {
        show: (text) => {
            store.commit('setLoader', true)
            store.commit('setLoaderText', text)
        },
        hide: () => {
            store.commit('setLoader', false)
        }
    }

    inject('loader', loader)
}