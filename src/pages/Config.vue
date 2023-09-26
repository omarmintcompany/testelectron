<template>
  <div class="column" style="height: 50px"></div>
  <div class="row items-start">
    <div class="col"></div>
    <div class="col">
      <q-select
        bg-color="white"
        outlined
        v-model="WhsSelected"
        :options="WhsList"
        option-label="whsName"
        option-value="whsCode"
        map-options
      />
      <div class="column" style="height: 10px"></div>
      <q-btn class="full-width mint" @click="confirm()" dense>
        <q-icon left size="3em" name="check" />
        <div>Confirmar</div>
      </q-btn>
    </div>
    <div class="col"></div>
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
