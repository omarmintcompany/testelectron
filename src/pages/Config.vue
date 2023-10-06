<template>
  <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
  </login>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-form @submit="confirm()">
          <div class="row q-pa-md mint-search">
            <q-select
              v-model="WhsSelected"
              :options="WhsList"
              option-label="whsName"
              option-value="whsCode"
              map-options
            />
            <q-separator inset />
            <q-btn type="submit" class="mint-reverse" icon="refresh" />
          </div>
        </q-form>
      </div>
      <div class="col q-pa-md mint-search">
        <div class="col" align="right">
          <q-icon name="home" size="md" />
          <q-separator vertical />
          <b>SELECCION DE TIENDA</b>
        </div>
      </div>
    </div>
  </div>
  <div class="column" style="height: 50px"></div>
  <div class="row items-start">
    <div class="col"></div>
    <div class="col">
      <div class="column" style="height: 10px"></div>
    </div>
    <div class="col"></div>
  </div>
</template>

<script lang="ts">
import { useWhsStore } from '../stores/whs';
import { WhsInfo } from '../interfaces/WhsInfo';
import Login from '../components/Login.vue';

import { useQuasar } from 'quasar';

export default {
  name: 'Config',
  components: { Login },
  setup() {
    const store = useWhsStore();
    const $q = useQuasar();
    return {
      store,
      showLoading() {
        $q.loading.show();
      },
      hideLoading() {
        $q.loading.hide();
      },
    };
  },
  data() {
    return {
      WhsSelected: { whsCode: '', whsName: '', isDefault: false } as WhsInfo,
      WhsList: [] as WhsInfo[],
      showlogin: false as boolean,
      token: '' as string,
      resourceid: 0 as number,
    };
  },
  mounted() {
    this.WhsSelected = this.store.getCurrentWhsCode;
    this.WhsList = this.store.getWhsList;
  },

  methods: {
    confirm() {
      this.resourceid = 8;
      this.showlogin = true;
    },
    getToken() {
      let token = this.store.getToken as string;

      if (token == '') {
        this.showlogin = false;
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        this.showLoading();
        this.store.setWhsCode(this.WhsSelected);
        this.token = '';
        this.showlogin = false;
        this.hideLoading();
        this.$q.notify({
          message:
            'Se ha realizado el cambio a ' +
            this.WhsSelected.whsCode +
            ' - ' +
            this.WhsSelected.whsName,
          color: 'green',
        });
        this.$router.push({ path: '/' });
      }
    },
  },
};
</script>
