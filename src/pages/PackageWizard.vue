<template>
  <div class="q-pa-md q-a-md">
    <div class="row">
      <div class="col">
        <q-form @submit="onSubmit">
          <div class="row q-pa-md mint-search">
            <q-input
              v-model.number="idtransfer"
              type="number"
              dense
              label="NºTransferencia"
              label-color="black"
              color="black"
              style="max-width: 200px"
            />
            <q-input
              v-model="fromdate"
              type="date"
              dense
              label="Desde"
              required
              label-color="black"
              color="black"
            />
            <q-input
              v-model="todate"
              type="date"
              dense
              required
              label="Hasta"
              label-color="black"
              color="black"
            />

            <q-separator inset />
            <q-btn type="submit" class="mint-reverse" icon="search" />
            <q-separator inset />
            <q-btn
              class="mint-reverse"
              title="Guardar Permisos"
              icon="add"
              label="Crear bulto con las transferencias seleccionadas"
              @click="createPackage()"
            />

            <div class="col" align="right">
              <q-icon name="local_shipping" size="md" />
              <q-separator vertical />
              <b>GESTIÓN DE BULTOS</b>
            </div>
          </div>
        </q-form>

        <q-table
          selection="multiple"
          v-model:selected="selected"
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="TOList"
          :columns="RCol"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 75vh"
          no-data-label="No hay transferencias de entrada que cumplan los filtros"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              {{ getStatus(props.row.status) }}
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWhsStore } from '../stores/whs';
import { TransferList } from '.axios./ts/TransferInterfaces.ts';
import axios from 'axios';
import moment from 'moment';
import { date, useQuasar } from 'quasar';

export default defineComponent({
  name: 'PackageWizard',
  setup() {
    const store = useWhsStore();

    const RCol = [
      {
        name: 'status',
        align: 'left',
        label: 'Estado',
        field: 'status',
        sortable: true,
      },
      {
        name: 'id',
        align: 'left',
        label: 'NºTransferencia',
        field: 'id',
        sortable: true,
      },
      {
        name: 'typeName',
        align: 'left',
        label: 'Tipo',
        field: 'typeName',
        sortable: true,
      },
      {
        name: 'title',
        align: 'left',
        label: 'Título',
        field: 'title',
        sortable: true,
      },

      {
        name: 'whsFromName',
        align: 'left',
        label: 'Desde',
        field: 'whsFromName',
        sortable: true,
      },
      {
        name: 'whsToName',
        align: 'left',
        label: 'Hasta',
        field: 'whsToName',
        sortable: true,
      },
      {
        name: 'dateCreated',
        align: 'center',
        label: 'F.Creación',
        field: 'dateCreated',
        sortable: true,
        format: (val) => {
          return moment(String(val)).format('DD/MM/YYYY');
        },
      },
      {
        name: 'needDateTime',
        align: 'center',
        label: 'F.Límite',
        field: 'needDateTime',
        sortable: true,
        format: (val) => {
          return moment(String(val)).format('DD/MM/YYYY');
        },
      },

      { name: 'actions', label: '', field: '', align: 'center' },
    ];
    const $q = useQuasar();
    return {
      store,
      RCol,
      statuslist: [
        { label: 'Solicitado', value: 'SC' },
        //{ label: 'Listo sin bultos', value: 'SB' },
        //{ label: 'Listo con bultos', value: 'CB' },
        { label: 'En Tránsito', value: 'T' },
        //{ label: 'Entregada', value: 'EN' },
        { label: 'Recibida', value: 'CN' },
        { label: 'Anulada', value: 'A' },
      ],
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
      TOList: [] as TransferList[],
      fromdate: '' as string,
      todate: '' as string,
      idtransfer: '' as string,
      selected: [] as boolean[],
      idPackage: 0 as number,
    };
  },
  methods: {
    getTransfersList() {
      this.showLoading();
      const params = {
        WhsCode: this.store.getCurrentWhsCode.whsCode,
        status: 'T',
        Type: 1,
        IdPackage: 0,
      };

      if (this.fromdate != '')
        params.FromDate = date.formatDate(this.fromdate, 'YYYY-MM-DD');
      if (this.todate != '')
        params.ToDate = date.formatDate(this.todate, 'YYYY-MM-DD');

      axios
        .get(`${this.store.options['ApiEndPoint']}/transfers`, {
          params: params,
        })
        .then((x) => {
          this.TOList = x.data;
          this.hideLoading();
        })
        .catch(() => {
          this.hideLoading();
        });
    },
    onSubmit() {
      this.getTransfersList();
    },
    formatDate(value: string) {
      return date.formatDate(value, 'DD-MM-YYYY');
    },
    onEdit(props) {
      this.$router.push('/transfer/' + props.row.id);
    },
    getStatus(status: string) {
      return this.statuslist.filter((p) => p.value == status)[0]['label'];
    },
    createPackage() {
      console.log(this.selected.length);
      if (this.selected.length == 0) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe seleccionar al menos una transferencia',
        });
      }
    },
  },
  mounted() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 5);
    this.fromdate = moment(String(yesterday)).format('YYYY-MM-DD');
    this.todate = moment(String(today)).format('YYYY-MM-DD');

    this.getTransfersList();
  },
});
</script>
