<template>
  <v-card v-if="knowledge">
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('save', knowledge)" color="primary" text small>
        <v-icon left dark> mdi-cloud-upload </v-icon> Guardar</v-btn
      >
    </v-card-actions>
    <v-card-text>
      <div>
        <h3>Preguntas</h3>
        <p class="mt-2">
          Cuando un usuario dice algo similar a una de las siguientes preguntas,
          Mibot lo detectará automáticamente. No es necesario crear una
          lista exhaustiva.
        </p>
        <div class="mt-3">
          <div
            v-for="(question, idx) in knowledge.questions"
            :key="idx"
            class="question mt-2"
          >
            <div class="question__body">
              <v-text-field
                v-model="knowledge.questions[idx]"
                rows="1"
                auto-grow
                dense
                hide-details
                filled
              ></v-text-field>
            </div>
            <div
              v-if="knowledge.questions.length > 1"
              class="question__actions ml-1"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="removeQuestion(idx)"
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </div>
          <div
            @click="addQuestion()"
            class="add mt-2"
            :style="{
              'margin-right': knowledge.questions.length > 1 ? '32px' : '0px',
            }"
          >
            <v-icon>mdi-plus</v-icon>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <h3>Respuestas</h3>
        <p class="mt-2">
          La respuesta es lo que el bot responderá al usuario final. Si hay más
          de una respuesta, Mibot seleccionará una de ellas de manera
          aleatoria.
        </p>
        <div>
          <div
            v-for="(answer, idx) in knowledge.answers"
            :key="idx"
            class="response mt-3"
          >
            <div class="response__body">
              <agent-response-editor :data="knowledge.answers[idx]" />
            </div>
            <div
              v-if="knowledge.answers.length > 1"
              class="response__actions ml-1"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="removeAnswer(idx)"
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </div>
          <div
            @click="addAnswer()"
            class="add mt-4"
            :style="{
              'margin-right': knowledge.answers.length > 1 ? '32px' : '0px',
            }"
          >
            <v-icon>mdi-plus</v-icon>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    data: Object,
  },
  data: () => ({
    knowledge: null,
  }),
  watch: {
    data() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.knowledge = JSON.parse(JSON.stringify(this.data));
    },
    addQuestion() {
      this.knowledge.questions.push("");
    },
    removeQuestion(idx) {
      this.knowledge.questions.splice(idx, 1);
    },
    addAnswer() {
      this.knowledge.answers.push([
        {
          type: "text",
          value: "",
        },
      ]);
    },
    removeAnswer(idx) {
      this.knowledge.answers.splice(idx, 1);
    },
  },
};
</script>

<style lang='scss' scoped>
$editor-background: #f0f0f0;
$border-radius: 6px;

.question {
  display: flex;
  align-items: center;

  &__body {
    flex-grow: 1;
  }
  &__actions {
    opacity: 0;
    pointer-events: none;

    .question:hover & {
      opacity: 1;
      pointer-events: all;
    }
  }
}

.response {
  display: flex;

  &__body {
    flex-grow: 1;
    padding: 10px;
    background: $editor-background;
    border-radius: $border-radius;
  }
  &__actions {
    opacity: 0;
    pointer-events: none;

    .response:hover & {
      opacity: 1;
      pointer-events: all;
    }
  }
}

.add {
  height: 42px;
  border: 1px dashed #ccc;
  border-radius: $border-radius;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #f5f5f5;
  }
}
</style>