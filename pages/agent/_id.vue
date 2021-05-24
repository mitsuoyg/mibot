<template>
  <div class="wrapper">
    <!-- SIDENAV -->
    <div class="sidenav">
      <v-list dense shaped>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Conocimiento</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="createKnowledge()"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  small
                >
                  <v-icon color="grey lighten-1">mdi-plus</v-icon>
                </v-btn>
              </template>
              <span style="font-size: 0.75rem">Añadir Conocimiento</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item-group
          v-model="knowledge_id_to_show"
          mandatory
          no-action
          color="primary"
        >
          <v-list-item v-for="(k, idx) in knowledge" :key="idx" :value="k.id">
            <v-list-item-content>
              <v-list-item-title>{{ k.questions[0] }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item-group>
                    <v-list-item @click="showRemoveKnowledge(k)">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <p v-if="loading" class="text-center">Cargando...</p>
      <p v-else-if="knowledge.length <= 0" class="text-center">
        No hay conocimiento
      </p>
    </div>
    <!-- MAIN -->
    <div v-if="knowledge.length > 0" class="main">
      <div class="main__menu">
        <v-btn @click="show_agent = true" color="primary" text>
          <v-icon left dark> mdi-robot </v-icon>
          Probar Agente
        </v-btn>
      </div>
      <div class="main__body">
        <div class="knowledge pa-4">
          <div class="knowledge__body">
            <agent-knowledge-editor
              v-if="knowledge_to_show"
              :data="knowledge_to_show"
              @save="updateKnowledge"
            />
          </div>
        </div>
        <agent-preview
          v-if="show_agent"
          :agent_id="agent.id"
          @exit="show_agent = false"
          class="preview"
        />
      </div>
    </div>
    <!-- DIALOG -->
    <v-dialog v-if="knowledge_to_remove" v-model="dlg_destroy" max-width="360">
      <v-card>
        <v-card-title>
          <div
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ knowledge_to_remove.questions["0"] }}
          </div>
        </v-card-title>
        <v-card-text
          >¿Está seguro de que desea eliminar este elemento?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="
              dlg_destroy = false;
              destroyKnowledge();
            "
            color="primary"
            text
          >
            Eliminar
          </v-btn>
          <v-btn @click="dlg_destroy = false" color="dark" text>
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data: () => ({
    agent: {},
    knowledge: [],
    knowledge_id_to_show: "",
    knowledge_to_remove: "",
    loading: false,
    dlg_destroy: false,
    show_agent: false,
  }),
  computed: {
    knowledge_to_show() {
      let knowledge = this.knowledge.find(
        (k) => k.id === this.knowledge_id_to_show
      );
      return knowledge;
    },
  },
  // watch: {
  //   async knowledge_to_show() {
  //     this.$loader.show("Cargando");
  //     let knowledge = null;
  //     try {
  //       knowledge = await this.$api.knowledge.show(this.knowledge_id_to_show);
  //     } catch (error) {
  //       if (error.response?.status == 401)
  //         this.error = error.response.data["msg"];
  //     }
  //     this.knowledge_selected = knowledge;
  //     this.$loader.hide();
  //   },
  // },
  async asyncData({ params, $api, store }) {
    const agents = await $api.agent.index();
    store.commit("setAgents", agents);
    const agent = await $api.agent.show(params.id);
    return { agent };
  },
  async fetch() {
    this.loading = true;
    try {
      this.knowledge = await this.$api.knowledge.index(
        `?agent=${this.agent.id}`
      );
      if (this.knowledge.length >= 1)
        this.knowledge_id_to_show = this.knowledge[0].id;
    } catch (error) {
      //
    }
    this.loading = false;
  },
  methods: {
    async createKnowledge() {
      this.$loader.show("Creando");
      try {
        let knowledge = {
          agent: this.agent.id,
          questions: ["Pregunta"],
          answers: [[{ type: "text", value: "Respuesta" }]],
        };
        let { id } = await this.$api.knowledge.create(knowledge);
        knowledge["id"] = id;
        this.knowledge.push(knowledge);
        this.knowledge_id_to_show = id;
      } catch (error) {
        this.$message.show("", error.response?.data?.msg);
      }
      this.$loader.hide();
    },
    async updateKnowledge(knowledge) {
      this.$loader.show("Guardando");
      try {
        await this.$api.knowledge.update(knowledge.id, knowledge);
        let idx = this.knowledge.findIndex((k) => k.id === knowledge.id);
        this.knowledge[idx] = {
          ...this.knowledge[idx],
          questions: knowledge.questions,
          answers: knowledge.answers,
        };
        this.knowledge.splice();
      } catch (error) {
        this.$message.show("", error.response?.data?.msg);
      }
      this.$loader.hide();
    },
    async destroyKnowledge() {
      this.$loader.show("Eliminando");
      let knowledge_id = this.knowledge_to_remove.id;
      try {
        await this.$api.knowledge.destroy(knowledge_id);
        this.knowledge = this.knowledge.filter((k) => k.id !== knowledge_id);
      } catch (error) {
        this.$message.show("", error.response?.data?.msg);
      }
      this.$loader.hide();
    },
    showRemoveKnowledge(knowledge) {
      this.knowledge_to_remove = knowledge;
      this.dlg_destroy = true;
    },
  },
};
</script>

<style lang='scss' scoped>
$border: 1px solid #e2e2e2;

.wrapper {
  height: 100%;
  display: flex;
}
.sidenav {
  overflow: auto;
  max-width: 256px;
  min-width: 256px;
  border-right: $border;
}
.main {
  overflow: auto;
  flex-grow: 1;

  display: flex;
  flex-direction: column;

  &__menu {
    flex-shrink: 0;
    height: 48px;
    padding: 0 24px;
    border-bottom: $border;

    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  &__body {
    flex-grow: 1;
    overflow: auto;
    display: flex;
    justify-content: space-between;
  }
}
.knowledge {
  flex-grow: 1;
  flex-basis: 0;
  overflow: auto;
  &__body {
    max-width: 750px;
    margin: 0 auto;
  }
}

.preview {
  flex-grow: 1;
  flex-basis: 0;
  overflow: auto;
}
</style>