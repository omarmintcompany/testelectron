<template>
  <q-layout view="hHh lpR fFf" class="fondomint">
    <q-header elevated class="mint-reverse text-white" height-hint="98">
      <q-bar class="q-electron-drag" v-if="1 == 1">
        <q-icon name="laptop_chromebook" />
        <div>Mint Store Manager 2023 - V3</div>
        <q-space />
        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
      <q-toolbar class="mint">
        <q-toolbar-title>
          <q-img
            src="~assets/mint.png"
            width="40px"
            @click="$router.replace('/')"
          />
          MSM - Mint Store Manager
          <b>
            {{
              store.getCurrentWhsCode.whsName != ""
                ? " - " + store.getCurrentWhsCode.whsName
                : ""
            }}
          </b>
        </q-toolbar-title>
        <div v-if="store.getCurrentWhsCode.whsName == ''">
          <q-icon name="error" size="lg" />
          No conectado al servidor
        </div>
        <q-tabs
          v-model="tab"
          class="mint"
          v-if="store.getCurrentWhsCode.whsCode != ''"
        >
          <q-tab
            name="Disponibilidad"
            icon="search"
            label="Disponibilidad"
            @click="$router.replace('/disponibilidad')"
          />
          <q-tab
            name="Transferencias"
            icon="transfer_within_a_station"
            label="Transferencias"
          >
            <q-menu class="mint">
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/transfer/0')"
                >
                  <q-avatar icon="create_new_folder" />
                  <q-item-section>Nueva transferencia</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/transfersin')"
                >
                  <q-avatar icon="move_down" />
                  <q-item-section>Entradas</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/transfersout')"
                >
                  <q-avatar icon="move_up" />
                  <q-item-section>Salidas</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/package')"
                >
                  <q-avatar icon="fact_check" />
                  <q-item-section>Gestor de bultos</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/packagewizard')"
                >
                  <q-avatar icon="local_shipping" />
                  <q-item-section>Asignación de bultos</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-tab>

          <q-tab name="Reservas" icon="alarm" label="Reservas">
            <q-menu class="mint">
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/reservas')"
                >
                  <q-avatar icon="content_paste_search" />
                  <q-item-section>Buscador</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/reservas/0')"
                >
                  <q-avatar icon="note_add" />
                  <q-item-section>Nueva reserva</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-tab>
          <q-tab name="Stock" icon="inventory" label="Stock de Tienda">
            <q-menu class="mint">
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/stockrequested')"
                >
                  <q-avatar icon="list_alt" />
                  <q-item-section>Peticiones</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/stockwhs')"
                >
                  <q-avatar icon="list" />
                  <q-item-section>Stock</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-tab>
          <q-tab
            name="Configuracion"
            icon="settings"
            :label="
              store.getCurrentWhsCode != ''
                ? store.getCurrentWhsCode.whsCode
                : 'Configuracion'
            "
          >
            <q-menu class="mint">
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/config')"
                >
                  <q-avatar icon="home" />
                  <q-item-section>Selección de tienda</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/mapping')"
                >
                  <q-avatar icon="lan" />
                  <q-item-section>Mapeo de Tiendas</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/users')"
                >
                  <q-avatar icon="groups" />
                  <q-item-section>Permisos de Usuarios</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.replace('/profiles')"
                >
                  <q-avatar icon="manage_accounts" />
                  <q-item-section>Perfiles de usuarios</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-tab>
        </q-tabs>

        <notification-badges
          v-if="store.getCurrentWhsCode.whsCode != ''"
        ></notification-badges>
      </q-toolbar>
    </q-header>

    <q-page-container background-image="~assets/fondo.jpg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import NotificationBadges from "../components/NotificationBadges.vue";
import { useWhsStore } from "../stores/whs";

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MSMLayout",

  components: { NotificationBadges },

  setup() {
    const store = useWhsStore();
    const clientIp = "" as string;

    function minimize() {
      window.myWindowAPI?.minimize();
    }

    function toggleMaximize() {
      window.myWindowAPI?.toggleMaximize();
    }

    function closeApp() {
      window.myWindowAPI?.close();
    }
    return {
      tab: ref("Disponibilidad"),
      store,
      clientIp,
      minimize,
      toggleMaximize,
      closeApp,
      showLoading() {
        $q.loading.show();
      },
      hideLoading() {
        $q.loading.hide();
      },
    };
  },
  mounted() {
    window.myWindowAPI?.toggleMaximize();
    this.store.setWhsList();
  },
});
</script>
