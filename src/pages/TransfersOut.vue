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
            <q-input
              v-model.number="itemcode"
              type="text"
              dense
              label="Código Producto"
              label-color="black"
              color="black"
            />
            <q-select
              v-model="status"
              :options="statuslist"
              label="Estado"
              label-color="black"
              dense
              color="black"
            />

            <q-separator inset />
            <q-btn type="submit" class="mint-reverse" icon="search" />
            <div class="col" align="right">
              <q-icon name="move_up" size="md" />
              <q-separator vertical />
              <b>LISTADO DE TRANSFERENCIAS DE SALIDA</b>
            </div>
          </div>
        </q-form>

        <q-table
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
          no-data-label="No hay transferencias de salida que cumplan los filtros"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="
                props.row.whsTo == 'T108' || props.row.whsTo == 'T137'
                  ? 'mint-ecom'
                  : props.row.urgent
                  ? 'mint-urgent'
                  : ''
              "
            >
              <q-td key="urgent" :props="props">
                <div>
                  <q-icon name="warning" size="xs" v-if="props.row.urgent" />
                </div>
              </q-td>
              <q-td key="status" :props="props">
                <div>
                  {{ getStatus(props) }}
                </div>
              </q-td>
              <q-td key="id" :props="props">
                <div>
                  {{ props.row.id }}
                </div>
              </q-td>
              <q-td key="typeName" :props="props">
                <div>
                  {{ props.row.typeName }}
                </div>
              </q-td>
              <q-td key="title" :props="props">
                <div>
                  {{ props.row.title }}
                </div>
              </q-td>
              <q-td key="whsFromName" :props="props">
                <div>
                  {{ props.row.whsFromName }}
                </div>
              </q-td>
              <q-td key="whsToName" :props="props">
                <div>
                  {{ props.row.whsToName }}
                </div>
              </q-td>
              <q-td key="dateCreated" :props="props">
                <div>
                  {{ formatDate(props.row.dateCreated) }}
                </div>
              </q-td>
              <q-td key="needDateTime" :props="props">
                <div>
                  {{ formatDate(props.row.needDateTime) }}
                </div>
              </q-td>
              <q-td key="actions" :props="props">
                <div>
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="edit_document"
                    title="Editar"
                    @click="onEdit(props)"
                  ></q-btn>
                </div>
              </q-td>
            </q-tr>
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
  name: 'TransfersOut',
  setup() {
    const store = useWhsStore();

    const RCol = [
      {
        name: 'urgent',
        align: 'center',
        label: '',
        field: 'urgent',
        sortable: true,
        style: 'width:10px',
      },
      {
        name: 'status',
        align: 'center',
        label: 'Estado',
        field: 'status',
        sortable: true,
      },
      {
        name: 'id',
        align: 'center',
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
      status: 'En espera',
      itemcode: '' as string,
    };
  },
  methods: {
    getTransfersList() {
      this.showLoading();
      const params = {
        WhsCode: this.store.getCurrentWhsCode.whsCode,
        status: this.status.value != undefined ? this.status.value : 'SC',
        Type: 1,
      };

      if (this.fromdate != '')
        params.FromDate = date.formatDate(this.fromdate, 'YYYY-MM-DD');
      if (this.todate != '')
        params.ToDate = date.formatDate(this.todate, 'YYYY-MM-DD 23:59:59');
      if (this.idtransfer != '') params.id = this.idtransfer;
      if (this.itemcode != '') params.itemcode = this.itemcode;

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
    getStatus(props) {
      return this.statuslist.filter((p) => p.value == props.row.status)[0][
        'label'
      ];
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
