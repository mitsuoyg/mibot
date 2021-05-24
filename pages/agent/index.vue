<template>
  <v-container class="agents">
    <h1 class="title mt-2">Mis Proyectos</h1>
    <v-row align="center" class="my-2">
      <v-col v-for="(agent, idx) in agents" :key="idx" cols="12" sm="6" md="4">
        <div class="agent" @click="redirect(agent.id)">
          <h2 class="agent__name">{{ agent.name }}</h2>
          <p class="agent__id mt-1">{{ agent.id }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: "auth",
  data: () => ({
    agents: [],
  }),
  async asyncData({ $api }) {
    const agents = await $api.agent.index();
    return { agents };
  },
  methods: {
    redirect(id) {
      this.$router.push(`/agent/${id}`);
    },
  },
};
</script>

<style lang='scss' scoped>
.agents {
  max-width: 800px;
  margin: 0 auto;
}

.agent {
  padding: 20px;
  height: 160px;
  box-shadow: 0 4px 10px 2px rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }

  &__name {
    font-size: 1rem;
  }
  &__id {
    font-size: 0.75rem;
    color: #a1a1a1;
  }
}
</style>