<template>
  <div class="q-pa-md q-a-md">
    <login
      :show-login="showlogin"
      :resourceid="resourceid"
      @token="getToken"
    ></login>
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

            <div class="col">
              <q-input
                v-model.number="idPackage"
                type="number"
                dense
                label="NºBulto"
                label-color="black"
                color="black"
                style="max-width: 200px"
                hint="Si no indica nº de bulto se creará"
              >
                <template v-slot:append>
                  <q-btn
                    class="mint-reverse"
                    title="Guardar Permisos"
                    icon="add"
                    @click="precreatePackage()"
                    dense
                  />
                </template>
              </q-input>
            </div>
            <div class="col" align="right">
              <q-icon name="local_shipping" size="md" />
              <q-separator vertical />
              <b>ASIGNACIÓN DE BULTOS</b>
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
          style="height: 78vh"
          no-data-label="No hay transferencias de entrada que cumplan los filtros"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              {{ getStatus(props.row.status) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div v-for="x in props.row.packages" v-bind:key="x">
                <q-btn
                  icon="cancel"
                  class="mint-reverse font-xs"
                  :label="'Bulto Nº' + x.id"
                  :disable="x.status != 1"
                  @click="precancelPackage(props.row.id, x.id)"
                /><q-separator inset vertical />
              </div>
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
import Login from '../components/Login.vue';
import axios from 'axios';
import moment from 'moment';
import { date, useQuasar } from 'quasar';

export default defineComponent({
  name: 'PackageWizard',
  components: { Login },
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
      selected: [] as TransferList[],
      idPackage: 0 as number,
      idTransferToCancel: 0 as number,
      idPackageToCancel: 0 as number,
      resourceid: 0 as number,
      action: '' as string,
      showlogin: false as boolean,
    };
  },
  methods: {
    getTransfersList() {
      this.showLoading();
      const params = {
        WhsCode: this.store.getCurrentWhsCode.whsCode,
        status: 'T',
        Type: 1,
        IdPackage: true,
      };

      if (this.idtransfer != 0) params.id = this.idtransfer;
      if (this.fromdate != '')
        params.FromDate = date.formatDate(this.fromdate, 'YYYY-MM-DD');
      if (this.todate != '')
        params.ToDate = date.formatDate(this.todate, 'YYYY-MM-DD  23:59:59');

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
      const config = {
        headers: { Authorization: `Bearer ${this.store.getToken}` },
      };
      this.showLoading();

      axios
        .post(
          `${this.store.options['ApiEndPoint']}/packages/create`,
          {
            transfersIds: this.selected.map((e) => e.id),
            packageId:
              this.idPackage != 0 && this.idPackage != undefined
                ? this.idPackage
                : 0,
          },
          config
        )
        .then(() => {
          this.selected = [];
          this.idPackage = 0;
          this.getTransfersList();
          this.hideLoading();
          this.$q.notify({
            type: 'positive',
            message: 'Se ha creado el bulto con éxito',
          });
        })
        .catch((error) => {
          this.hideLoading();
          this.$q.notify({
            type: 'negative',
            message: error.response.data.messages,
          });
        });
    },
    precreatePackage() {
      if (this.selected.length == 0) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe seleccionar al menos una transferencia',
        });
      } else {
        this.action = 'save';
        this.resourceid = 17;
        this.showlogin = true;
      }
    },
    precancelPackage(idTransfer: number, idPackage: number) {
      this.idTransferToCancel = idTransfer;
      this.idPackageToCancel = idPackage;
      this.action = 'cancel';
      this.resourceid = 18;
      this.showlogin = true;
    },
    cancelPackage() {
      const config = {
        headers: { Authorization: `Bearer ${this.store.getToken}` },
      };
      this.showLoading();

      axios
        .put(
          `${this.store.options['ApiEndPoint']}/packages/delete`,
          {
            transferId: this.idTransferToCancel,
            packageId: this.idPackageToCancel,
          },
          config
        )
        .then(() => {
          this.getTransfersList();
          this.hideLoading();
          this.$q.notify({
            type: 'positive',
            message: 'Se ha desligado el bulto con éxito',
          });
        })
        .catch(() => {
          this.hideLoading();
          this.$q.notify({
            type: 'negative',
            message: 'No se ha podido desligar el bulto',
          });
        });
    },
    getToken() {
      let token = this.store.getToken as string;

      if (token == '') {
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        this.showLoading();
        switch (this.action) {
          case 'save':
            this.createPackage();
            break;
          case 'cancel':
            this.cancelPackage();
            break;
        }
        this.hideLoading();
      }

      this.showlogin = false;
      this.action = '';
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
