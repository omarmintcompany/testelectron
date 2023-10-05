<template>
  <div class="q-pa-md q-a-md">
    <login :show-login="showlogin" @token="getToken"> </login>
    <div class="row">
      <div class="col q-pa-md mint-search" align="right">
        <q-icon name="groups" size="md" />
        <q-separator vertical />
        <b>PERMISOS</b>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="SList"
          :columns="RCol"
          row-key="itemCode"
          :rows-per-page-options="[0]"
          :filter="filter"
          virtual-scroll
          style="height: 75vh"
          no-data-label="No hay mapeos definidos"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWhsStore } from '../stores/whs';
import { WhsInfo } from '../interfaces/WhsInfo';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

export default {
  data() {
    return {
      WhsSelected: { whsCode: '', whsName: '', isDefault: false } as WhsInfo,
      WhsList: [] as WhsInfo[],
      store: useWhsStore(),
    };
  },
  mounted() {
    this.WhsSelected = this.store.getCurrentWhsCode;
    this.WhsList = this.store.getWhsList;
  },

  methods: {
    confirm() {
      this.store.setWhsCode(this.WhsSelected);

      this.$q.notify({
        message:
          'Se ha realizado el cambio a ' +
          this.WhsSelected.whsCode +
          ' - ' +
          this.WhsSelected.whsName,
        color: 'green',
      });
      this.$router.push({ path: '/' });
    },
  },
};
</script>
