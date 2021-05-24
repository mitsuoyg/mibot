<template>
  <div class="loader" :class="{ 'loader--disabled': !value }">
    <v-progress-circular
      :size="100"
      :width="3"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <p v-if="text" class="loader__text mt-5">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    text: String,
  },
};
</script>

<style lang='scss' scoped>
.loader {
  background: rgba(255, 255, 255, 0.75);
  transition: 0.3s;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &--disabled {
    opacity: 0;
    pointer-events: none;
  }

  &__text {
    font-size: 1.2rem;
    color: #555555;
  }
}
</style>