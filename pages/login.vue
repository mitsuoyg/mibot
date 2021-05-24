<template>
  <v-container>
    <form @submit.prevent="userLogin()">
      <v-card class="login" max-width="500">
        <v-card-title>
          <h1 class="login__title">Iniciar Sesión</h1>
        </v-card-title>
        <v-card-text>
          <v-alert :value="!!error" type="error" text>
            {{ error }}
          </v-alert>
          <v-text-field v-model="login.username" label="Usuario" required />
          <v-text-field
            v-model="login.password"
            label="Contraseña"
            required
            type="password"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" :loading="ldg_btn" color="primary" text
            >Ingresar</v-btn
          >
        </v-card-actions>
      </v-card>
    </form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    login: {
      username: "",
      password: "",
    },
    error: "",
    ldg_btn: false,
  }),
  methods: {
    async userLogin() {
      this.ldg_btn = true;
      try {
        await this.$auth.loginWith("local", {
          data: this.login,
        });
        this.$router.push("/agent");
      } catch (error) {
        this.error = error.response?.data?.msg;
      }
      this.ldg_btn = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.login {
  margin: 0 auto;

  &__title {
    font-size: 1.4rem;
  }
}
</style>