<template>
  <div>
    <q-dialog v-model="show" persistent>
      <q-card>
        <q-card-section class="mint-reverse q-pa-xs">
          <q-avatar icon="people" />
          <b>MSM</b>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="username"
            label-color="black"
            type="text"
            label="Usuario"
            dense
            outlined
            ref="username"
          />
          <q-separator vertical inset></q-separator>
          <q-input
            v-model="password"
            label-color="black"
            type="password"
            label="contraseña"
            dense
            outlined
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="Aceptar"
            class="mint-reverse full-width"
            @click="accept"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { useWhsStore } from '../stores/whs';
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Login',

  setup() {
    const store = useWhsStore();
    return {
      store,
    };
  },
  data() {
    return {
      show: false as boolean,
      username: '' as string,
      password: '' as string,
    };
  },
  props: {
    showLogin: Boolean,
  },
  watch: {
    showLogin() {
      this.show = this.showLogin;
      this.username = '44322255j';
      this.password = 'Temporal2';
    },
  },
  methods: {
    accept() {
      axios
        .post(`${this.store.options['ApiEndPoint']}/login`, {
          username: this.username,
          password: this.password,
        })
        .then((x) => {
          console.log(x.data.token);
          this.store.setToken(x.data.token);
          this.show = false;
          this.$emit('token', x.data.token);
        })
        .catch((err) => {
          console.log(err);
          this.store.setToken('');
          this.show = false;
          this.$emit('token', '');
        });
    },
  },
});
</script>
