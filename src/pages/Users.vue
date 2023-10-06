<template>
  <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
  </login>
  <div class="q-pa-md" v-if="showUser">
    <div class="row">
      <div class="col">
        <div class="row q-pa-md mint-search">
          <div class="col" align="right">
            <q-icon name="groups" size="md" />
            <q-separator vertical />
            <b>PERMISOS DE USUARIOS</b>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <q-table
          title="Usuarios"
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="salesreps"
          :columns="RCol"
          :filter="filter"
          row-key="code"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 75vh"
          no-data-label="No hay usuarios definidos"
        >
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscador"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="mint">
              <q-btn
                dense
                round
                flat
                color="black"
                icon="edit"
                title="Editar permisos"
                @click="viewSaleRep(props)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
      <q-separator inset />
      <div class="col">
        <q-table
          selection="multiple"
          v-model:selected="selected"
          :title="userSelected != '' ? userSelected : 'Seleccione un usuario'"
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="salesresources"
          :columns="RColResources"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 69vh"
          no-data-label="No hay permisos definidos"
        />
        <q-separator spaced />
        <q-btn
          class="mint-reverse full-width"
          :disable="userSelected == ''"
          title="Guardar Permisos"
          icon="save"
          @click="saveUserResources()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWhsStore } from '../stores/whs';
import Login from '../components/Login.vue';
import { WhsInfo } from '../interfaces/WhsInfo';
import { SalesRep, SalesRepResources } from '../interfaces/Transfers';
import { useQuasar } from 'quasar';
import axios from 'axios';

export default {
  name: 'Mapping',
  components: { Login },
  setup() {
    const store = useWhsStore();

    const RCol = [
      {
        name: 'code',
        align: 'center',
        label: 'Código',
        field: 'code',
        sortable: true,
      },
      {
        name: 'govId',
        align: 'center',
        label: 'NºDocumento',
        field: 'govId',
        sortable: true,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Nombre',
        field: 'name',
        sortable: true,
      },
      {
        name: 'actions',
        label: '',
        field: '',
        align: 'center',
      },
    ];

    const RColResources = [
      {
        name: 'description',
        align: 'left',
        label: 'Permiso',
        field: 'description',
        sortable: true,
      },
    ];
    const $q = useQuasar();
    return {
      store,
      RCol,
      RColResources,
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
      salesreps: [] as SalesRep[],
      salesresources: [] as SalesRepResources[],
      showlogin: false as boolean,
      userSelected: '' as string,
      govIdSelected: '' as string,
      selected: [] as boolean[],
      resourceid: 0 as number,
      showUser: false as boolean,
      filter: '' as string,
    };
  },
  methods: {
    getSalesRep() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/salesrep`)
        .then((x) => {
          this.salesreps = x.data;
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
        this.getSalesRep();
        this.showUser = true;
      }
      this.showlogin = false;
    },
    viewSaleRep(props) {
      this.userSelected = props.row.name;
      this.govIdSelected = props.row.govId;
      axios
        .get(
          `${this.store.options['ApiEndPoint']}/salesrep/resources/${props.row.govId}`
        )
        .then((x) => {
          this.salesresources = x.data;
          this.selected = this.salesresources.filter((e) => e.resourceEnable);
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Error al obtener los permisos',
          });
        });
    },
    saveUserResources() {
      console.log(this.selected.map((e) => e.id));

      axios
        .post(`${this.store.options['ApiEndPoint']}/salesrep/resources/save`, {
          govId: this.govIdSelected,
          resources: this.selected.map((e) => e.id),
        })
        .then((x) => {
          this.$q.notify({
            type: 'positive',
            message: 'Permisos guardados con éxito',
          });
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Error al grabar los permisos',
          });
        });
    },
  },
  mounted() {
    this.showlogin = true;
  },
};
</script>
