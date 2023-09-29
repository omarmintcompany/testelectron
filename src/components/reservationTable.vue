<template>
  <div class="row">
    <div class="col">
      <q-table
        dense
        table-header-class="mint-reverse"
        flat
        bordered
        :rows="reservations"
        :columns="RCol"
        row-key="id"
        :rows-per-page-options="[0]"
        virtual-scroll
        title="Reservas"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import moment from 'moment';
import {
  itemReservations,
  whsconfig,
} from 'src/Interfaces/DisponibilidadInterfaces';

export default defineComponent({
  name: 'reservationTableComponent',

  setup() {
    const RCol = [
      {
        name: 'docNum',
        align: 'center',
        label: 'NºReserva',
        field: 'docNum',
        sortable: true,
      },
      {
        name: 'dateRec',
        align: 'center',
        label: 'Fecha Recogida',
        field: 'dateRec',
        sortable: true,
        format: (val, row) => {
          return moment(String(val)).format('DD/MM/YYYY');
        },
      },
      {
        name: 'daysRec',
        align: 'center',
        label: 'Días Reservado',
        field: 'daysRec',
        sortable: true,
      },
      {
        name: 'whsName',
        align: 'center',
        label: 'Tienda',
        field: (row) => row.whsCode + ' - ' + row.whsName,
        sortable: true,
      },
      {
        name: 'itemCode',
        align: 'center',
        label: 'Itemcode',
        field: 'itemCode',
        sortable: true,
      },
      {
        name: 'quantity',
        align: 'center',
        label: 'Cantidad',
        field: 'quantity',
        sortable: false,
      },
    ];

    return {
      RCol,
    };
  },

  props: {
    reservations: {
      type: Array as PropType<itemReservations[]>,
      default: () => [],
    },
    whsconfig: {
      type: Array as PropType<WhsConfig[]>,
      default: () => [],
    },
  },
});
</script>
