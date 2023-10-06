<template>
  <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
  </login>
  <div class="q-pa-md" v-if="showMapping">
    <div class="row">
      <div class="col">
        <q-form @submit="createMapping">
          <div class="row q-pa-md mint-search">
            <q-input
              v-model.text="ipAddress"
              type="text"
              dense
              label="Dirección IP"
              label-color="black"
              color="black"
              :rules="[
                (val, rules) =>
                  ipCheck(val) || 'Introduzca una dirección IP válida',
              ]"
            />
            <q-separator inset />
            <q-select
              v-model="whsCode"
              :options="whsList"
              label-color="black"
              dense
              color="black"
              option-label="whsName"
              option-value="whsCode"
              map-options
              label="Almacén/Tienda"
              emit-value
            />
            <q-separator inset />
            <q-checkbox
              v-model="isDefault"
              label="Principal"
              dense
              color="black"
            />

            <q-separator inset />
            <q-btn type="submit" class="mint-reverse" icon="add" />
            <div class="col" align="right">
              <q-icon name="lan" size="md" />
              <q-separator vertical />
              <b>MAPEO DE IPS Y TIENDAS</b>
            </div>
          </div>
        </q-form>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="Mapping"
          :columns="RCol"
          row-key="itemCode"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 75vh"
          no-data-label="No hay mapeos definidos"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="mint">
              <q-btn
                dense
                round
                flat
                color="black"
                icon="delete"
                title="Eliminar"
                @click="deleteMapping(props)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWhsStore } from '../stores/whs';
import Login from '../components/Login.vue';
import { WhsInfo } from '../interfaces/WhsInfo';
import { useQuasar } from 'quasar';
import axios from 'axios';

export default {
  name: 'Mapping',
  components: { Login },
  setup() {
    const store = useWhsStore();

    const RCol = [
      {
        name: 'ip',
        align: 'center',
        label: 'IP',
        field: 'ip',
        sortable: true,
      },
      {
        name: 'whsCode',
        align: 'left',
        label: 'Tienda/Almacén',
        field: 'whsCode',
        sortable: true,
        format: (val: string, row: WhsInfo) => {
          return val + ' - ' + row.whsName;
        },
      },
      {
        name: 'isDefault',
        align: 'center',
        label: '',
        field: 'isDefault',
        sortable: false,
        format: (val: string, row: WhsInfo) => {
          return row.isDefault ? 'Principal' : '';
        },
      },
      {
        name: 'actions',
        label: '',
        field: '',
        align: 'center',
      },
    ];
    const $q = useQuasar();
    return {
      store,
      RCol,
      statuslist: [
        { label: 'Abierta', value: 'SC' },
        { label: 'Cancelada', value: 'C' },
        { label: 'Confirmada', value: 'CN' },
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
      Mapping: [] as WhsInfo[],
      showlogin: false as boolean,
      whsList: [] as WhsInfo[],
      ipAddress: '' as string,
      whsCode: 'T101' as string,
      isDefault: false as boolean,
      resourceid: 0 as number,
      showMapping: false as boolean,
    };
  },
  methods: {
    getMapping() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/whsipmapping/list`)
        .then((x) => {
          this.Mapping = x.data;
        })
        .catch((err) => console.log('Axios err: ', err));
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

    getToken() {
      let token = this.store.getToken as string;

      if (token == '') {
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
        this.$router.push({ path: '/' });
      } else {
        this.getMapping();
        this.getWhs();
        this.showMapping = true;
      }
      this.showlogin = false;
    },
    ipCheck(val: string) {
      if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          val
        )
      ) {
        return true;
      } else return false;
    },
    deleteMapping(props) {
      if (props.row.id == 0 || props.row.id == undefined) {
      } else {
        this.showLoading();
        axios
          .get(
            `${this.store.options['ApiEndPoint']}/whsipmapping/delete/${props.row.id}`
          )
          .then((x) => {
            this.getMapping();
            this.hideLoading();
            this.$q.notify({
              type: 'positive',
              message: 'Se ha eliminado el mapeo con éxito',
            });
          })
          .catch((error) => {
            this.hideLoading();
            this.$q.notify({
              type: 'negative',
              message: 'No se ha podido eliminar el mapeo',
            });
          });
      }
    },
    createMapping() {
      this.showLoading();
      axios
        .put(`${this.store.options['ApiEndPoint']}/whsipmapping/create/`, {
          whsCode: this.whsCode,
          whsName: this.whsList.filter((e) => e.whsCode == this.whsCode)[0][
            'whsName'
          ],
          ip: this.ipAddress,
          isDefault: this.isDefault,
        })
        .then((x) => {
          this.getMapping();
          this.hideLoading();
          this.$q.notify({
            type: 'positive',
            message: 'Se ha creado el mapeo con éxito',
          });
        })
        .catch((error) => {
          this.hideLoading();
          this.$q.notify({
            type: 'negative',
            message: 'No se ha podido crear el mapeo',
          });
        });
    },
  },
  mounted() {
    this.resourceid = 1;
    this.showlogin = true;
  },
};
</script>
