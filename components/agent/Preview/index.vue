<template>
  <div class="preview">
    <div class="preview__menu">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="$emit('exit')" v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Cerrar</span>
      </v-tooltip>
    </div>
    <agent-preview-chat :agent_id="agent_id" class="preview__body" />
  </div>
</template>

<script>
export default {
  props: {
    agent_id: String,
  },
};
</script>

<style lang='scss' scoped>
$border: 1px solid #e2e2e2;

.preview {
  display: flex;
  flex-direction: column;
  border-left: $border;

  &__menu {
    flex-shrink: 0;
    height: 48px;
    padding: 0 4px 0 12px;
    // border-bottom: $border;

    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &__title {
    margin: 0;
  }

  &__body {
    overflow-y: auto;
    flex-grow: 1;
  }
}
</style>