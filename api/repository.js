export default $axios => resource => ({
    index(params = '') {
        return $axios.$get(`/${resource}${params}`)
    },
    create(payload) {
        return $axios.$post(`/${resource}`, payload)
    },
    show(id) {
        return $axios.$get(`/${resource}/${id}`)
    },
    update(id, payload) {
        return $axios.$patch(`/${resource}/${id}`, payload)
    },
    destroy(id) {
        return $axios.$delete(`/${resource}/${id}`)
    }
})