<template>
  <q-layout view="hHh lpR fFf" class="fondomint">
    <q-header elevated class="bg-primary text-white" height-hint="98">
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
              store.getCurrentWhsCode.whsName != ''
                ? ' - ' + store.getCurrentWhsCode.whsName
                : ''
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
                <q-item clickable v-close-popup>
                  <q-avatar icon="move_down" />
                  <q-item-section>Entradas</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-avatar icon="move_up" />
                  <q-item-section>Salidas</q-item-section>
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
                <q-item clickable v-close-popup to="stockwhs">
                  <q-avatar icon="list" />
                  <q-item-section>Stock</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-tab>
          <q-tab
            name="Configuracion"
            icon="home"
            :label="
              store.getCurrentWhsCode != ''
                ? store.getCurrentWhsCode.whsCode
                : 'Configuracion'
            "
            @click="$router.replace('/config')"
          />
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
import NotificationBadges from '../components/NotificationBadges.vue';
import { useWhsStore } from '../stores/whs';
import axios, { AxiosError } from 'axios';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MSMLayout',

  components: { NotificationBadges },

  setup() {
    const store = useWhsStore();
    const clientIp = '' as string;

    return {
      tab: ref('Disponibilidad'),
      store,
      clientIp,
    };
  },
  mounted() {
    this.store.setWhsList();
  },
});
</script>
