<template>
  <div class="q-pa-md q-a-md">
    <div class="row">
      <div class="col q-pa-md mint-search">
        <div class="col" align="right">
          <q-icon name="list" size="md" />
          <q-separator vertical />
          <b>STOCK DE TIENDA</b>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="SList"
          :columns="RCol"
          row-key="itemCode"
          :rows-per-page-options="[0]"
          :filter="filter"
          virtual-scroll
          style="height: 75vh"
          no-data-label="No hay datos de stock"
        >
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
          <template v-slot:body-cell-photo="props">
            <q-td :props="props" style="width: 80px">
              <q-img :src="props.row.urlPhoto" fit />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="mint">
              <q-btn
                dense
                round
                flat
                color="black"
                icon="visibility"
                title="Ver disponibilidad"
                @click="
                  $router.replace(`/disponibilidad/${props.row.itemCode}`)
                "
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useWhsStore } from "../stores/whs";
import { Stock } from "../ts/Stock.ts";
import { useQuasar } from "quasar";
import axios from "axios";

export default defineComponent({
  name: "Stock",
  setup() {
    const store = useWhsStore();

    const RCol = [
      { name: "photo", label: "", field: "", align: "center" },
      {
        name: "fullSeason",
        align: "left",
        label: "Temporada",
        field: "fullSeason",
        sortable: true,
      },
      {
        name: "brand",
        align: "left",
        label: "Marca",
        field: "brand",
        sortable: true,
      },
      {
        name: "section",
        align: "left",
        label: "Sección",
        field: "section",
        sortable: true,
      },
      {
        name: "family",
        align: "left",
        label: "Familia",
        field: "family",
        sortable: true,
      },
      {
        name: "gamma",
        align: "left",
        label: "Gama",
        field: "gamma",
        sortable: true,
      },
      {
        name: "supplierReferenceNumber",
        align: "left",
        label: "Referencia",
        field: "supplierReferenceNumber",
        sortable: true,
      },
      {
        name: "itemCode",
        align: "left",
        label: "ItemCode",
        field: "itemCode",
        sortable: true,
      },
      {
        name: "itemDescription",
        align: "left",
        label: "Descripción",
        field: "itemDescription",
        sortable: true,
      },
      {
        name: "size",
        align: "left",
        label: "Talla",
        field: "size",
        sortable: true,
      },
      {
        name: "booking",
        align: "right",
        label: "Reservado",
        field: "booking",
        sortable: true,
      },
      {
        name: "stock",
        align: "right",
        label: "Stock físico",
        field: "stock",
        sortable: true,
      },

      { name: "actions", label: "", field: "", align: "center" },
    ];
    const $q = useQuasar();
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
      SList: [] as Stock[],
      filter: "" as string,
    };
  },
  methods: {
    loadStock() {
      this.showLoading();
      axios
        .get(
          `${this.store.options["ApiEndPoint"]}/Stock/${this.store.getCurrentWhsCode.whsCode}`,
          {}
        )
        .then((x) => {
          this.SList = x.data;
          this.hideLoading();
        })
        .catch(() => {
          this.hideLoading();
        });
    },
  },
  mounted() {
    this.loadStock();
  },
});
</script>
