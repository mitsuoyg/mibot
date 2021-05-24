<template>
  <v-dialog :value="value && (title || text)" persistent width="360">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <span> {{ text }}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" type="submit" color="primary" text
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: String,
    text: String,
  },
};
</script>

<style>
</style>