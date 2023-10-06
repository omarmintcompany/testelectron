<template>
  <div class="q-pa-md q-a-md">
    <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
    </login>
    <div class="row">
      <div class="col q-pa-md mint-search">
        <div class="col" align="right">
          <q-icon name="list_alt" size="md" />
          <q-separator vertical />
          <b>LISTADO DE PETICIONES DESDE SALA DE VENTA</b>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-table
          table-header-class="mint-reverse"
          flat
          dense
          :rows="stockRequested"
          :columns="RCol"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 75vh"
          class="my-sticky-header-table"
          ><template v-slot:body-cell-photo="props">
            <q-td :props="props" style="width: 80px">
              <q-img :src="props.row.urlPhoto" fit />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                dense
                round
                class="mint-reverse"
                icon="check"
                title="Confirmar"
                @click="confirm(props)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useWhsStore } from '../stores/whs';
import { StockRequested } from '../ts/Stock.ts';
import Login from '../components/Login.vue';
import moment from 'moment';
import axios from 'axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'StockRequested',
  components: { Login },
  setup() {
    const store = useWhsStore();
    const $q = useQuasar();
    const RCol = [
      { name: 'photo', label: '', field: '', align: 'center' },

      {
        name: 'createDate',
        align: 'center',
        label: 'Fecha Petición',
        field: 'createDate',
        sortable: false,
        format: (val, row) => {
          return moment(String(val)).format('DD/MM/YYYY');
        },
      },

      {
        name: 'createDate',
        align: 'center',
        label: 'Hora Petición',
        field: 'createDate',
        sortable: false,
        format: (val, row) => {
          return moment(String(val)).format('hh:mm');
        },
      },
      {
        name: 'itemCode',
        align: 'center',
        label: 'Código Producto',
        field: 'itemCode',
        sortable: false,
      },
      {
        name: 'season',
        align: 'center',
        label: 'Temporada',
        field: 'season',
        sortable: false,
      },
      {
        name: 'brand',
        align: 'celeftnter',
        label: 'Marca',
        field: 'brand',
        sortable: true,
      },
      {
        name: 'itemDescription',
        align: 'left',
        label: 'Descripción',
        field: 'itemDescription',
        sortable: false,
      },

      {
        name: 'section',
        align: 'left',
        label: 'Sección',
        field: 'section',
        sortable: true,
      },
      {
        name: 'quantity',
        align: 'center',
        label: 'Cantidad',
        field: 'quantity',
        sortable: false,
      },
      {
        name: 'actions',
        label: '',
        field: '',
        align: 'center',
      },
    ];
    return {
      store,
      RCol,
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
      stockRequested: [] as StockRequested[],
      showlogin: false as boolean,
      token: '' as string,
      id: 0 as number,
      resourceid: 0 as number,
    };
  },
  methods: {
    getList() {
      this.showLoading();
      axios
        .get(
          `${this.store.options['ApiEndPoint']}/Stock/Requested/list/${this.store.getCurrentWhsCode.whsCode}`
        )
        .then((x) => {
          this.stockRequested = x.data;
          this.hideLoading();
        })
        .catch((err) => {
          this.hideLoading();
        });
    },
    confirm(prop) {
      this.visible = true;
      this.id = prop.row.id;
      this.token = '';
      this.resourceid = 15;
      this.showlogin = true;
    },
    getToken(token: string) {
      if (token == '') {
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
        this.id = 0;
        this.token = '';
        this.showlogin = false;
      } else {
        this.showLoading();
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        return axios
          .put(
            `${this.store.options['ApiEndPoint']}/Stock/Requested/confirm/${this.id}`,
            {},
            config
          )
          .then((data) => {
            this.$q.notify({
              type: 'positive',
              message: 'Se ha solicitado con éxito',
            });
            this.id = 0;
            this.token = '';
            this.showlogin = false;
            this.getList();
            this.hideLoading();
          })
          .catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: 'Error al solicitar el envío',
            });
            this.id = 0;
            this.token = '';
            this.showlogin = false;
            this.hideLoading();
          });
      }
    },
  },
  mounted() {
    this.getList();
  },
});
</script>
