import createRepository from '~/api/repository.js'

export default ({ $axios }, inject) => {
    const repositoryWithAxios = createRepository($axios)

    const repositories = {
        agent: repositoryWithAxios('agent'),
        agentResponse: repositoryWithAxios('agent-response'),
        knowledge: repositoryWithAxios('knowledge'),
    }

    inject('api', repositories)
}