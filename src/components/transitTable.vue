<template>
  <div class="row">
    <div class="col">
      <q-table
        dense
        table-header-class="mint-reverse"
        flat
        bordered
        :rows="transit"
        :columns="RCol"
        row-key="id"
        :rows-per-page-options="[0]"
        virtual-scroll
        title="Tránsito"
        no-data-label="No hay tránsito para esta referencia"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { itemTransit } from 'src/Interfaces/DisponibilidadInterfaces';
import moment from 'moment';

export default defineComponent({
  name: 'transitTableComponent',

  setup() {
    const RCol = [
      {
        name: 'itemCode',
        align: 'center',
        label: 'Itemcode',
        field: 'itemCode',
        sortable: true,
      },
      {
        name: 'whsCode1',
        align: 'left',
        label: 'Desde',
        field: (row) => row.whsCode1 + ' - ' + row.whsNameFrom,
        sortable: true,
      },

      {
        name: 'whsCode2',
        align: 'left',
        label: 'Hasta',
        field: (row) => row.whsCode2 + ' - ' + row.whsNameTo,
        sortable: true,
      },

      {
        name: 'ponumber',
        align: 'center',
        label: 'Nº Transferencia',
        field: 'ponumber',
        sortable: true,
      },
      {
        name: 'qtyToSend',
        align: 'right',
        label: 'Cantidad a Enviar',
        field: 'qtyToSend',
        sortable: false,
      },
      {
        name: 'sentTime',
        align: 'center',
        label: 'Fencha Envio',
        field: 'sentTime',
        sortable: false,
        format: (val) => {
          return moment(String(val)).format('DD/MM/YYYY');
        },
      },
      {
        name: 'qtySent',
        align: 'right',
        label: 'Cantidad Enviada',
        field: 'qtySent',
        sortable: false,
      },
      {
        name: 'requestTime',
        align: 'center',
        label: 'Fecha Recepción',
        field: 'requestTime',
        sortable: false,
        format: (val) => {
          return moment(String(val)).format('DD/MM/YYYY');
        },
      },
      {
        name: 'qtyRcv',
        align: 'right',
        label: 'Cantidad Recibida',
        field: 'qtyRcv',
        sortable: false,
      },
    ];

    return {
      RCol,
    };
  },

  props: {
    transit: {
      type: Array as PropType<itemTransit[]>,
      default: () => [],
    },
  },
});
</script>
