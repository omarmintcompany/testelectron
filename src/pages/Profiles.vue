<template>
  <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
  </login>
  <div class="q-pa-md" v-if="showUser">
    <div class="row">
      <div class="col">
        <div class="row q-pa-md mint-search">
          <div class="col" align="right">
            <q-icon name="manage_accounts" size="md" />
            <q-separator vertical />
            <b>PERFILES DE DE USUARIOS</b>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="profiles"
          :columns="RCol"
          :filter="filter"
          row-key="code"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 70vh"
          no-data-label="No hay perfiles definidos"
        >
          <template v-slot:top-left>
            <q-input
              label="Nombre del perfil"
              dense
              bg-color="white"
              color="black"
              v-model="newProfile"
              required
            >
              <template v-slot:append>
                <q-btn
                  class="mint-reverse full-width"
                  title="Guardar Permisos"
                  icon="add"
                  dense
                  @click="newProfileResources()"
              /></template>
            </q-input>
          </template>
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filter"
              color="black"
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
                @click="viewProfile(props)"
              ></q-btn>
              <q-btn
                dense
                round
                flat
                color="black"
                icon="delete"
                title="Eliminar perfil"
                @click="deleteProfile(props)"
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
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="profileResources"
          :columns="RColResources"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 70vh"
          no-data-label="No hay permisos definidos"
        >
          <template v-slot:top>
            <q-input
              label="Nombre del perfil"
              dense
              bg-color="white"
              color="black"
              v-model="profileNameSelected"
            >
              <template v-slot:append>
                <q-btn
                  class="mint-reverse full-width"
                  :disable="profileIdSelected == ''"
                  title="Guardar Permisos"
                  icon="save"
                  dense
                  @click="saveProfileResources()"
                />
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWhsStore } from '../stores/whs';
import Login from '../components/Login.vue';

import { Profiles, ProfileResources } from '../interfaces/Resources';
import { useQuasar } from 'quasar';
import axios from 'axios';

export default {
  name: 'Profiles',
  components: { Login },
  setup() {
    const store = useWhsStore();

    const RCol = [
      {
        name: 'name',
        align: 'left',
        label: 'Descripción',
        field: 'name',
        sortable: true,
      },
      {
        name: 'actions',
        label: '',
        field: '',
        align: 'right',
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
      profiles: [] as Profiles[],
      profileResources: [] as ProfileResources[],
      profileNameSelected: '' as string,
      profileIdSelected: 0 as number,
      showlogin: false as boolean,
      userSelected: '' as string,
      govIdSelected: '' as string,
      selected: [] as boolean[],
      resourceid: 0 as number,
      showUser: false as boolean,
      filter: '' as string,
      newProfile: '' as string,
    };
  },
  methods: {
    getProfiles() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/resources/profiles`)
        .then((x) => {
          this.profiles = x.data;
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
        this.getProfiles();
        this.showUser = true;
      }
      this.showlogin = false;
    },
    viewProfile(props) {
      this.profileNameSelected = props.row.name;
      this.profileIdSelected = props.row.id;
      axios
        .get(
          `${this.store.options['ApiEndPoint']}/resources/profiles/${props.row.id}`
        )
        .then((x) => {
          this.profileResources = x.data;
          this.selected = this.profileResources.filter((e) => e.resourceEnable);
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Error al obtener los permisos',
          });
        });
    },
    deleteProfile(props) {
      axios
        .get(
          `${this.store.options['ApiEndPoint']}/resources/profiles/delete/${props.row.id}`
        )
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Perfil eliminado con éxito',
          });
          this.getProfiles();
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Error al intentar eliminar el perfil',
          });
        });
    },
    saveProfileResources() {
      axios
        .post(`${this.store.options['ApiEndPoint']}/resources/profiles/save`, {
          Id: this.profileIdSelected,
          resources: this.selected.map((e) => e.id),
          name: this.profileNameSelected,
        })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Permisos guardados con éxito',
          });
          this.getProfiles();
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Error al grabar los permisos',
          });
        });
    },
    newProfileResources() {
      if (this.newProfile == '' || this.newProfile == undefined)
        this.$q.notify({
          type: 'negative',
          message: 'Debe especificar un nombre para el perfil',
        });
      else
        axios
          .post(`${this.store.options['ApiEndPoint']}/resources/profiles/new`, {
            Id: 0,
            resources: [],
            name: this.newProfile,
          })
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: 'Perfil creado con éxito',
            });
            this.getProfiles();
          })
          .catch(() => {
            this.$q.notify({
              type: 'negative',
              message: 'Error al intentar crear el perfil',
            });
          });
    },
  },
  mounted() {
    this.showlogin = true;
  },
};
</script>
