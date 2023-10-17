<template>
  <div class="q-pa-md q-a-md">
    <div class="row">
      <div class="col-12">
        <q-form @submit="onSubmit">
          <div class="row q-pa-md mint-search">
            <q-input
              v-model.number="itemCode"
              type="text"
              dense
              label="Código artículo"
              label-color="black"
              color="black"
              style="max-width: 200px"
              lazy-rules
              ref="ItemCodeInput"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Debe definir un código de artículo',
              ]"
            />
            <q-separator inset />
            <q-btn type="submit" class="mint-reverse" icon="search" />
            <div class="col" align="right">
              <q-icon name="search" size="md" />
              <q-separator vertical />
              <b>DISPONIBILIDAD</b>
            </div>
          </div>
        </q-form>
        <div
          class="row mint-white q-pr-md q-pl-md q-pb-md"
          v-if="stockInfo != ''"
        >
          <div class="col-4 q-pt-md q-pr-md">
            <q-card bordered flat>
              <q-card-section class="mint-reverse q-pa-xs"
                >Datos del producto</q-card-section
              >
              <q-card-section>
                <refdataTableComponent :data="itemData"></refdataTableComponent>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-8 q-pt-md">
            <q-card bordered flat>
              <q-card-section class="mint-reverse q-pa-xs"
                >Stock del producto</q-card-section
              >
              <q-card-section>
                <stockTableComponent
                  :stock="stockTable"
                  :titles="WhsCodeStock"
                  :whsconfig="whsConfig"
                ></stockTableComponent>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <div class="row mint-white q-pr-md q-pl-md" v-if="stockInfo != ''">
      <div class="col">
        <reservationTableComponent
          :reservations="itemReservations"
          :whsconfig="whsConfig"
        ></reservationTableComponent>
      </div>
    </div>
    <div class="row mint-white q-pa-md" v-if="stockInfo != ''">
      <div class="col">
        <transitTableComponent :transit="itemTransit"></transitTableComponent>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWhsStore } from '../stores/whs';
import { useQuasar } from 'quasar';
import axios from 'axios';
import stockTableComponent from '../components/stockTable.vue';
import reservationTableComponent from '../components/reservationTable.vue';
import transitTableComponent from '../components/transitTable.vue';
import refdataTableComponent from '../components/refdataTable.vue';
import {
  stockInfo,
  whsconfig,
  refData,
  stockTable,
} from 'src/Interfaces/TransferInterfaces';
import {
  itemReservations,
  itemTransit,
} from 'src/Interfaces/DisponibilidadInterfaces';
import { ItemInfo } from 'src/Interfaces/ItemData';
export default defineComponent({
  name: 'Disponibilidad',
  components: {
    stockTableComponent,
    refdataTableComponent,
    reservationTableComponent,
    transitTableComponent,
  },
  setup() {
    const store = useWhsStore();
    const $q = useQuasar();

    return {
      store,
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
      itemCode: '' as string,
      whsConfig: [] as whsconfig[],
      stockInfo: [] as stockInfo[],
      itemData: {} as ItemInfo,
      itemTransit: [] as itemTransit[],
      itemReservations: [] as itemReservations[],
      loadRefdata: false as boolean,
      loadStock: false as boolean,
      loadConf: false as boolean,
      loadItemData: false as boolean,
      refData: {
        brand: '',
        modelCode: '',
        modelName: '',
        rprov: '',
        section: '',
        itemCodes: [],
      } as refData,
    };
  },
  computed: {
    WhsCodeStock(): string[] {
      let info = [...new Set(this.stockInfo.map((item) => item.whsCode))];
      if (
        info.findIndex((t) => t == this.store.getCurrentWhsCode.whsCode) == -1
      )
        info.push(this.store.getCurrentWhsCode.whsCode);
      return info;
    },
    stockTable(): stockTable[] {
      if (
        this.loadStock &&
        this.loadConf &&
        this.loadRefdata &&
        this.loadItemData
      ) {
        let table: stockTable[] = this.refData.itemCodes.map((i) => {
          const stocks = this.WhsCodeStock.map((w) => {
            const r = this.stockInfo.find(
              (x) => x.itemCode == i.itemCode && x.whsCode == w
            );
            if (r != undefined) return r;
            return { whsCode: w, itemCode: i.itemCode, onHand: 0 } as stockInfo;
          });

          return {
            itemCode: i.itemCode,
            size: i.size,
            stockInfo: stocks,
          } as stockTable;
        });
        return table;
      } else return [];
    },
  },
  mounted() {
    this.$refs.ItemCodeInput.focus();

    this.itemCode = this.$route.params.itemcode = !''
      ? this.$route.params.itemcode
      : '';
    if (this.itemCode != undefined) this.onSubmit();

    this.itemCode = 'A437145';
  },
  methods: {
    onSubmit() {
      this.$q.loading.show();
      this.loadConf = false;
      this.loadRefdata = false;
      this.loadStock = false;
      this.loadItemData = false;
      axios
        .get(`${this.store.options['ApiEndPoint']}/whs`)
        .then((x) => {
          this.whsConfig = x.data as whsconfig[];
          this.loadConf = true;
        })
        .catch(() => {
          this.$q.notify({
            message: 'Error al obtener informacion de tiendas',
            type: 'negative',
          });
        });

      axios
        .get(
          `${this.store.options['ApiEndPoint']}/disponibilidad/${this.itemCode}/refData`
        )
        .then((x) => {
          this.refData = x.data as refData;
          this.loadRefdata = true;
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({
            message: 'Error al obtener informacion de referencia',
            type: 'negative',
          });
        });

      axios
        .get(
          `${this.store.options['ApiEndPoint']}/disponibilidad/${this.itemCode}`
        )
        .then((x) => {
          this.stockInfo = x.data as stockInfo[];
          this.loadStock = true;

          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({
            message: 'Error al obtener informacion de stock',
            type: 'negative',
          });
          this.$q.loading.hide();
        });

      axios
        .get(
          `${this.store.options['ApiEndPoint']}/disponibilidad/${this.itemCode}/itemData`
        )
        .then((x) => {
          this.itemData = x.data as ItemInfo;
          this.loadItemData = true;

          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({
            message: 'Error al obtener informacion de stock',
            type: 'negative',
          });
          this.$q.loading.hide();
        });

      axios
        .get(
          `${this.store.options['ApiEndPoint']}/disponibilidad/${this.itemCode}/reservations`
        )
        .then((x) => {
          this.itemReservations = x.data as itemReservations;
          this.loadItemData = true;

          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({
            message: 'Error al obtener las reservas',
            type: 'negative',
          });
          this.$q.loading.hide();
        });

      axios
        .get(
          `${this.store.options['ApiEndPoint']}/disponibilidad/${this.itemCode}/transit`
        )
        .then((x) => {
          this.itemTransit = x.data as itemTransit;
          this.loadItemData = true;

          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({
            message: 'Error al obtener el tránsito',
            type: 'negative',
          });
          this.$q.loading.hide();
        });
    },
  },
});
</script>
