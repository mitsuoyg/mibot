<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          v-show="!item.requiresAuth || auth.loggedIn"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" dark fixed flat app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <div v-if="$route.name === 'agent-id'" class="projects mx-sm-10">
        <v-select
          :items="projects"
          :value="$route.params['id']"
          @change="redirect"
          item-value="id"
          item-text="name"
          label="Proyecto"
          dense
          hide-details
          outlined
        ></v-select>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="auth.loggedIn" @click="userLogout()" text
        >Cerrar Sesión</v-btn
      >
      <v-btn v-else to="/login" text>Iniciar Sesión</v-btn>
    </v-app-bar>
    <v-main class="main">
      <nuxt />
    </v-main>

    <globals-loader v-model="loader" :text="loader_text" class="loader" />
    <globals-message
      v-model="message"
      :title="message_data.title"
      :text="message_data.text"
    />
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    drawer: false,
    items: [
      {
        icon: "mdi-home",
        title: "Inicio",
        to: "/",
      },
      {
        icon: "mdi-robot",
        title: "Proyectos",
        to: "/agent",
        requiresAuth: true,
      },
    ],
    title: "Mibot",
  }),
  computed: {
    ...mapState(["auth", "loader", "loader_text", "message_data", "agents"]),
    message: {
      get() {
        return this.$store.state.message;
      },
      set(value) {
        this.$store.commit("setMessage", value);
      },
    },
    projects() {
      return [
        {
          id: "all",
          name: "Ver todos los proyectos",
        },
        ...this.agents,
      ];
    },
  },
  methods: {
    async userLogout() {
      try {
        await this.$auth.logout();
        this.$router.push("/login");
      } catch (error) {
        //
      }
    },
    redirect(id) {
      if (id === "all") this.$router.push(`/agent`);
      else this.$router.push(`/agent/${id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: calc(100vh - 65px);
  overflow: auto;
}

.projects {
  width: 240px;
}

.loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
