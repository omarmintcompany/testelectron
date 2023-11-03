<template>
  <div class="q-pa-md q-a-md">
    <login
      :show-login="showlogin"
      :resourceid="resourceid"
      @token="getToken"
    ></login>
    <div class="row">
      <div class="col">
        <q-form @submit="getPackagesList">
          <div class="row q-pa-md mint-search">
            <q-input
              v-model.number="idPackage"
              type="number"
              dense
              label="NºBulto"
              label-color="black"
              color="black"
              style="max-width: 200px"
            />
            <q-input
              v-model.number="idTransfer"
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
            <div class="col" align="right">
              <q-icon name="fact_check" size="md" />
              <q-separator vertical />
              <b>GESTOR DE BULTOS</b>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <div class="row">
      <div class="col-7">
        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="packagesList"
          :columns="RCol"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 78vh"
          no-data-label="No hay bultos de entrada que cumplan los filtros"
          title="Bultos"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="
                props.row.status == 2
                  ? 'mint-urgent'
                  : props.row.status == 3
                  ? 'mint-valid'
                  : ''
              "
            >
              <q-td key="status" :props="props">
                <div>
                  {{ getStatus(props.row.status) }}
                </div>
              </q-td>

              <q-td key="id" :props="props">
                <div>
                  {{ props.row.id }}
                </div>
              </q-td>
              <q-td key="dateCreated" :props="props">
                <div>
                  {{ formatDate(props.row.dateCreated) }}
                </div>
              </q-td>
              <q-td key="dateSent" :props="props">
                <div>
                  {{ formatDate(props.row.dateSent) }}
                </div>
              </q-td>
              <q-td key="dateReceived" :props="props">
                <div>
                  {{ formatDate(props.row.dateReceived) }}
                </div>
              </q-td>
              <q-td key="whsFrom" :props="props">
                <div>
                  {{ getWhsName(props.row.whsFrom) }}
                </div>
              </q-td>
              <q-td key="whsTo" :props="props">
                <div>
                  {{ getWhsName(props.row.whsTo) }}
                </div>
              </q-td>
              <q-td key="ntransfers" :props="props">
                <div>
                  {{ props.row.transfers.length }}
                </div>
              </q-td>
              <q-td key="actions" :props="props">
                <div>
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="logout"
                    title="Enviar Bulto"
                    @click="preSendPackage(props.row.id)"
                    v-if="
                      props.row.status == 1 &&
                      props.row.whsFrom == store.getCurrentWhsCode.whsCode
                    "
                  ></q-btn>
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="login"
                    title="Recibir Bulto"
                    @click="preReceivePackage(props.row.id)"
                    v-if="
                      props.row.status == 2 &&
                      props.row.whsTo == store.getCurrentWhsCode.whsCode
                    "
                  ></q-btn>
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="visibility"
                    title="Ver transferencias"
                    @click="viewTransfers(props.row.id)"
                  ></q-btn>
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="print"
                    title="Imprimir etiqueta del bulto"
                    @click="printLabel(props)"
                  ></q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:top-right>
            <q-icon name="local_mall" size="md" />
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="mint">
              <q-btn
                dense
                round
                flat
                color="black"
                icon="logout"
                title="Enviar Bulto"
                @click="preSendPackage(props.row.id)"
                v-if="
                  props.row.status == 1 &&
                  props.row.whsFrom == store.getCurrentWhsCode.whsCode
                "
              ></q-btn>
              <q-btn
                dense
                round
                flat
                color="black"
                icon="login"
                title="Recibir Bulto"
                @click="preReceivePackage(props.row.id)"
                v-if="
                  props.row.status == 2 &&
                  props.row.whsTo == store.getCurrentWhsCode.whsCode
                "
              ></q-btn>

              <q-btn
                dense
                round
                flat
                color="black"
                icon="visibility"
                title="Ver transferencias"
                @click="viewTransfers(props.row.id)"
              ></q-btn>
              <q-btn
                dense
                round
                flat
                color="black"
                icon="print"
                title="Imprimir etiqueta"
                @click="printLabel(props)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
      <q-separator inset />
      <div class="col">
        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="transfersList"
          :columns="RColT"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 78vh"
          no-data-label="No hay transferencias"
          :title="
            packageSelected != 0 && packageSelected != undefined
              ? 'Transferencias del bulto nº ' + packageSelected
              : 'Seleccione un bulto'
          "
        >
          <template v-slot:top-right>
            <q-icon name="description" size="md" />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="mint">
              <q-btn
                dense
                round
                flat
                color="black"
                icon="visibility"
                title="Ver"
                @click="onEdit(props)"
              ></q-btn>
              <q-btn
                icon="cancel"
                round
                dense
                flat
                title="Quitar transferencia del bulto"
                :disable="avaliableUnlinkTransfer()"
                @click="precancelPackage(props.row.id, packageSelected)"
              />
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
import { Packages } from '../interfaces/Packages.ts';
import { WhsInfo } from '../interfaces/WhsInfo';
import Login from '../components/Login.vue';
import axios from 'axios';
import moment from 'moment';
import { date, useQuasar } from 'quasar';
import { TransferList } from 'src/Interfaces/TransferInterfaces';

export default defineComponent({
  name: 'Packages',
  components: { Login },
  setup() {
    const store = useWhsStore();
    const $q = useQuasar();

    const RColT = [
      {
        name: 'id',
        align: 'left',
        label: 'NºTransferencia',
        field: 'id',
        sortable: true,
      },
      {
        name: 'title',
        align: 'left',
        label: 'Título',
        field: 'title',
        sortable: true,
      },
      { name: 'actions', label: '', field: '', align: 'right' },
    ];
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
        align: 'center',
        label: 'NºBulto',
        field: 'id',
        sortable: true,
      },
      {
        name: 'dateCreated',
        align: 'center',
        label: 'F.Creación',
        field: 'dateCreated',
        sortable: true,
        format: (val) => {
          return val != null ? moment(String(val)).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'dateSent',
        align: 'center',
        label: 'F.Envío',
        field: 'dateSent',
        sortable: true,
        format: (val) => {
          return val != null ? moment(String(val)).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'dateReceived',
        align: 'center',
        label: 'F.Recepción',
        field: 'dateReceived',
        sortable: true,
        format: (val) => {
          return val != null ? moment(String(val)).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'whsFrom',
        align: 'left',
        label: 'Desde',
        field: 'whsFrom',
        sortable: true,
      },
      {
        name: 'whsTo',
        align: 'left',
        label: 'Hasta',
        field: 'whsTo',
        sortable: true,
      },
      {
        name: 'ntransfers',
        align: 'center',
        label: 'Nº de Transferencias',
        field: 'ntransfers',
      },
      { name: 'actions', label: '', field: '', align: 'right' },
    ];

    return {
      store,
      RCol,
      RColT,
      statuslist: [
        { label: 'En preparación', value: 1 },
        { label: 'Enviado', value: 2 },
        { label: 'Recibido', value: 3 },
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
      packagesList: [] as Packages[],
      fromdate: '' as string,
      todate: '' as string,
      idtransfer: '' as string,
      selected: [] as Packages[],
      idPackage: 0 as number,
      idTransferToCancel: 0 as number,
      idPackageToCancel: 0 as number,
      resourceid: 0 as number,
      action: '' as string,
      showlogin: false as boolean,
      whsList: [] as WhsInfo[],
      packageSelected: 0 as number,
      transfersList: [] as TransferList[],
      status: 'En Preparación',
      idTransfer: 0 as number,
    };
  },
  methods: {
    getPackagesList() {
      this.packageSelected = 0;
      this.transfersList = [];
      this.showLoading();

      this.packageSelected = 0;
      const params = {
        WhsFrom: this.store.getCurrentWhsCode.whsCode,
        idTransfer: 0,
      };

      if (this.idPackage != 0) params.id = this.idPackage;
      if (this.idTransfer != 0) params.idTransfer = this.idTransfer;
      if (this.fromdate != '')
        params.FromDate = date.formatDate(this.fromdate, 'YYYY-MM-DD');
      if (this.todate != '')
        params.ToDate = date.formatDate(this.todate, 'YYYY-MM-DD 23:59:59');

      axios
        .get(`${this.store.options['ApiEndPoint']}/packages/list`, {
          params: params,
        })
        .then((x) => {
          this.packagesList = x.data;
          this.hideLoading();
        })
        .catch(() => {
          this.hideLoading();
        });
    },
    getStatus(status: number) {
      return this.statuslist.filter((p) => p.value == status)[0]['label'];
    },
    getWhs() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/whs`)
        .then((x) => {
          Object.values(x.data).forEach((val) => {
            Object.values(val.whsCodes).forEach((valx) => {
              let x = {
                id: 0,
                whsCode: valx['whsCode'],
                whsName: valx['whsName'],
                isDefault: false,
              } as WhsInfo;

              this.whsList.push(x);
            });
          });
          this.whsList.sort((a, b) => {
            if (a['whsName'] < b['whsName']) {
              return -1;
            }
            if (a['whsName'] > b['whsName']) {
              return 1;
            }
            return 0;
          });
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    getWhsName(whscode: string) {
      if (whscode != '')
        return (
          whscode +
          ' - ' +
          this.whsList.filter((e) => e.whsCode == whscode)[0].whsName
        );
    },
    viewTransfers(packageId: number) {
      this.packageSelected = packageId;
      if (this.packageSelected != undefined && this.packageSelected != 0)
        this.transfersList = this.packagesList.filter(
          (e) => e.id == this.packageSelected
        )[0].transfers;
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
          case 'cancel':
            this.cancelPackage();
            break;
          case 'send':
            this.sendPackage();
            break;
          case 'receive':
            this.receivePackage();
            break;
        }
        this.hideLoading();
      }

      this.showlogin = false;
      this.action = '';
    },
    onEdit(props) {
      this.$router.push('/transfer/' + props.row.id);
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
          this.transfersList = [];
          this.packageSelected = 0;
          this.getPackagesList();
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
    avaliableUnlinkTransfer() {
      return this.packagesList.filter((e) => e.id == this.packageSelected)[0]
        .status == 1
        ? false
        : true;
    },
    preSendPackage(idPackage: number) {
      this.idPackageToCancel = idPackage;
      this.action = 'send';
      this.resourceid = 19;
      this.showlogin = true;
    },
    sendPackage() {
      const config = {
        headers: { Authorization: `Bearer ${this.store.getToken}` },
      };
      this.showLoading();

      axios
        .put(
          `${this.store.options['ApiEndPoint']}/packages/send/${this.idPackageToCancel}`,
          {},
          config
        )
        .then(() => {
          this.transfersList = [];
          this.packageSelected = 0;
          this.getPackagesList();
          this.hideLoading();
          this.$q.notify({
            type: 'positive',
            message: 'Se ha enviado el bulto con éxito',
          });
        })
        .catch(() => {
          this.hideLoading();
          this.$q.notify({
            type: 'negative',
            message: 'No se ha podido enviar el bulto',
          });
        });
    },
    preReceivePackage(idPackage: number) {
      this.idPackageToCancel = idPackage;
      this.action = 'receive';
      this.resourceid = 20;
      this.showlogin = true;
    },
    receivePackage() {
      const config = {
        headers: { Authorization: `Bearer ${this.store.getToken}` },
      };
      this.showLoading();

      axios
        .put(
          `${this.store.options['ApiEndPoint']}/packages/receive/${this.idPackageToCancel}`,
          {},
          config
        )
        .then(() => {
          this.transfersList = [];
          this.packageSelected = 0;
          this.getPackagesList();
          this.hideLoading();
          this.$q.notify({
            type: 'positive',
            message: 'Se ha enviado el bulto con éxito',
          });
        })
        .catch(() => {
          this.hideLoading();
          this.$q.notify({
            type: 'negative',
            message: 'No se ha podido enviar el bulto',
          });
        });
    },
    formatDate(val) {
      return val != null ? moment(String(val)).format('DD/MM/YYYY') : '';
    },
    printLabel(props) {
      console.log(props);
    },
  },
  mounted() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 5);
    this.fromdate = moment(String(yesterday)).format('YYYY-MM-DD');
    this.todate = moment(String(today)).format('YYYY-MM-DD');

    this.getWhs();
    this.getPackagesList();
  },
});
</script>
