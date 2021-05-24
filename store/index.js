export const state = () => ({
    loader: false,
    loader_text: '',
    message: false,
    message_data: {
        title: '',
        text: ''
    },
    agents: []
})

export const mutations = {
    setLoader(state, loader) {
        state.loader = loader
    },
    setLoaderText(state, text) {
        state.loader_text = text
    },
    setMessage(state, message) {
        state.message = message
    },
    setMessageData(state, data) {
        state.message_data = data
    },
    setAgents(state, agents) {
        state.agents = agents
    },
}