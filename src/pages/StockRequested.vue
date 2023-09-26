<template>
  <q-page class="row items-center justify-evenly">
    stockrequested - {{ store.getCurrentWhsCode.whsName }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWhsStore } from '../stores/whs';
import axios from 'axios';

export default defineComponent({
  name: 'StockRequested',
  setup() {
    const store = useWhsStore();
    return {
      store,
    };
  },
  methods: {
    getList() {
      console.log('asf');
    },
  },
  mounted() {
    this.getList();
  },
});
</script>
