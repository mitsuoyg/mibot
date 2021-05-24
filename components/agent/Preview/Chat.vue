<template>
  <div class="chat">
    <div id="messages" class="messages">
      <div
        v-for="({ type, message }, idx) in messages"
        :key="idx"
        class="message my-2"
        :class="type == 'user' ? 'message--user' : 'message--bot'"
      >
        <div v-for="(block, b_idx) in message" :key="b_idx">
          <template v-if="block.type === 'text'">
            <div class="message__text">{{ block.value }}</div>
          </template>
          <img
            v-else-if="block.type === 'image'"
            :src="block.value"
            class="message__image"
          />
        </div>
      </div>
      <div v-if="loading" class="message message--bot my-2">
        <div class="message__loading">
          <div class="message__dot" style="--offset: 0s"></div>
          <div class="message__dot" style="--offset: 0.2s"></div>
          <div class="message__dot" style="--offset: 0.4s"></div>
        </div>
      </div>
      <div class="empty" v-if="messages.length <= 0">No hay mensajes</div>
    </div>
    <form class="input" @submit.prevent="getResponse()">
      <v-text-field
        v-model="user_message"
        dense
        hide-details
        placeholder="Escribe tu mensaje"
        autocomplete="off"
        filled
        rounded
      ></v-text-field>
      <div class="ml-2">
        <v-btn type="submit" color="primary" icon>
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    agent_id: String,
  },
  data: () => ({
    messages: [],
    user_message: "",
    loading: false,
  }),
  methods: {
    addMessage(type, message) {
      this.messages.push({
        type,
        message,
      });
      this.scroll();
    },
    async getResponse() {
      if (!this.user_message) return;
      let message = this.user_message;
      this.user_message = "";

      this.addMessage("user", [
        {
          type: "text",
          value: message,
        },
      ]);

      this.loading = true;
      try {
        let { answer } = await this.$api.agentResponse.create({
          agent: this.agent_id,
          message,
        });
        this.addMessage("bot", answer);
      } catch (error) {
        //
      }
      this.loading = false;
    },
    scroll() {
      setTimeout(() => {
        document.getElementById("messages").scrollTo({
          top: 20000,
          behavior: "smooth",
        });
      }, 50);
    },
  },
};
</script>

<style lang='scss' scoped>
.chat {
  display: flex;
  flex-direction: column;
}

.messages {
  overflow-y: auto;
  flex-grow: 1;
  padding: 10px;
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b3b3b3;
}

$message-border: 1px solid #dadada;

.message {
  max-width: 80%;
  width: max-content;
  overflow: hidden;
  border-radius: 10px;

  &--user {
    margin-left: auto;
    background: #0084ff;
    color: #fff;
  }
  &--bot {
    border: $message-border;
    background: #fff;
    color: #2c2c2c;
  }

  &__text {
    padding: 6px 12px;
    word-wrap: break-word;
    white-space: pre-line;
  }
  &__image {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
  //
  &__loading {
    padding: 18px 12px 10px;
    display: flex;
  }
  &__dot {
    width: 6px;
    height: 6px;
    margin: 0 2px;
    background: #949494;
    border-radius: 50%;
    animation: blink 1s linear infinite var(--offset);
  }
}

.input {
  padding: 12px;
  // border-top: 1px solid #ccc;

  display: flex;
  align-items: center;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>