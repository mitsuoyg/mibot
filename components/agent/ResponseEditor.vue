<template>
  <div>
    <div v-for="(block, idx) in data" :key="idx" class="block">
      <template v-if="block.type === 'text'">
        <v-textarea
          v-model="block.value"
          rows="1"
          auto-grow
          dense
          hide-details
        ></v-textarea>
      </template>
      <template v-else-if="block.type === 'image'">
        <img :src="block.value" />
      </template>
      <div class="block__menu">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="add({ type: 'text', value: '' }, idx)"
              v-bind="attrs"
              v-on="on"
              fab
              x-small
            >
              <v-icon>mdi-format-text</v-icon>
            </v-btn>
          </template>
          <span>Añadir Texto</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="showAddImage(idx)"
              v-bind="attrs"
              v-on="on"
              fab
              x-small
              class="ml-1"
            >
              <v-icon>mdi-image</v-icon>
            </v-btn>
          </template>
          <span>Añadir Imagen</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="idx !== 0"
              @click="moveUp(data, idx)"
              v-bind="attrs"
              v-on="on"
              fab
              x-small
              class="ml-1"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
          </template>
          <span>Mover Arriba</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="idx !== data.length - 1"
              @click="moveDown(data, idx)"
              v-bind="attrs"
              v-on="on"
              fab
              x-small
              class="ml-1"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </template>
          <span>Mover Abajo</span>
        </v-tooltip>
        <v-tooltip v-if="data.length > 1" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="data.splice(idx, 1)"
              v-bind="attrs"
              v-on="on"
              fab
              x-small
              class="ml-1"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </div>
    </div>

    <!-- DIALOG -->
    <v-dialog v-model="dlg_add_image" max-width="360">
      <v-card>
        <form @submit.prevent="addImage()">
          <v-card-title>
            <div
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              Agregar Imagen
            </div>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="new_block.value"
              label="Enlace"
              dense
              hide-details
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="dlg_add_image = false"
              type="button"
              color="dark"
              text
            >
              Cancelar
            </v-btn>
            <v-btn type="submit" color="primary" text> Agregar </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
  },
  data: () => ({
    new_block_idx: -1,
    new_block: {},
    dlg_add_image: false,
  }),
  methods: {
    add(block, idx = -1) {
      this.data.splice(idx + 1, 0, block);
    },
    addImage() {
      this.add(this.new_block, this.new_block_idx);
      this.dlg_add_image = false;
    },
    showAddImage(idx) {
      this.new_block_idx = idx;
      this.new_block = {
        type: "image",
        value: "",
      };
      this.dlg_add_image = true;
    },
    moveUp(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        arr.splice();
      }
    },
    moveDown(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        arr.splice();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
$border-radius: 6px;

.block {
  position: relative;

  &:not(:first-child) {
    margin-top: 10px;
  }

  img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
    border-radius: $border-radius;
  }

  &__menu {
    padding: 2px;
    transition: 0.3s;
    opacity: 0;
    pointer-events: none;
    z-index: 1;

    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    justify-content: center;

    .block:hover & {
      opacity: 1;
      pointer-events: all;
    }
  }
}
</style>