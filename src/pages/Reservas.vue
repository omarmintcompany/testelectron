<template>
  <div class="q-pa-md q-a-md">
    <div class="row">
      <div class="col">
        <q-form @submit="onSubmit">
          <div class="row q-pa-md mint-search">
            <q-input
              v-model.number="idreservation"
              type="number"
              dense
              label="Id Reserva"
              label-color="black"
              color="black"
              style="max-width: 200px"
            />
            <q-input
              v-model="fromdate"
              type="date"
              dense
              label="Desde"
              label-color="black"
              color="black"
            />
            <q-input
              v-model="todate"
              type="date"
              dense
              label="Hasta"
              label-color="black"
              color="black"
            />
            <q-input
              v-model.number="itemcode"
              type="text"
              dense
              label="Código Producto"
              label-color="black"
              color="black"
            />
            <q-select
              v-model="status"
              :options="statuslist"
              label="Estado"
              label-color="black"
              dense
              color="black"
            />
            <q-select
              v-model="category"
              :options="categorylist"
              label="Tipo"
              label-color="black"
              dense
              option-value="id"
              option-label="name"
              map-options
              color="black"
            />
            <q-separator inset />
            <q-btn type="submit" class="mint-reverse" icon="search" />
            <div class="col" align="right">
              <q-icon name="alarm" size="md" />
              <q-separator vertical />
              <b>LISTADO DE RESERVAS</b>
            </div>
          </div>
        </q-form>

        <q-table
          dense
          table-header-class="mint-reverse"
          flat
          bordered
          :rows="RList"
          :columns="RCol"
          row-key="id"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="height: 75vh"
          no-data-label="No hay reservas que cumplan los filtros"
        >
          <template v-slot:body="props">
            <q-tr :props="props" :class="isTimeOut(props) ? 'mint-urgent' : ''">
              <q-td key="timeout" :props="props">
                <div>
                  <q-icon
                    name="warning"
                    size="xs"
                    v-if="isTimeOut(props)"
                    title="Reserva caducada"
                  />
                </div>
              </q-td>
              <q-td key="id" :props="props">
                <div>
                  {{ props.row.id }}
                </div>
              </q-td>
              <q-td key="categoryName" :props="props">
                <div>
                  {{ props.row.categoryName }}
                </div>
              </q-td>
              <q-td key="status" :props="props">
                <div>
                  {{ getStatus(props.row.status) }}
                </div>
              </q-td>
              <q-td key="dateCreated" :props="props">
                <div>
                  {{ formatDate(props.row.dateCreated) }}
                </div>
              </q-td>
              <q-td key="pickDateTime" :props="props">
                <div>
                  {{ formatDate(props.row.pickDateTime) }}
                </div>
              </q-td>
              <q-td key="cardName" :props="props">
                <div>
                  {{ props.row.cardName }}
                </div>
              </q-td>
              <q-td key="notes" :props="props">
                <div>
                  {{ props.row.notes }}
                </div>
              </q-td>
              <q-td key="actions" :props="props">
                <div>
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="edit_document"
                    title="Editar"
                    @click="onEdit(props)"
                  ></q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useWhsStore } from "../stores/whs";
import { IReservation } from "../ts/Reservation.ts";
import { ReservationCategory } from "../interfaces/ReservationCategory.ts";
import axios from "axios";
import moment from "moment";
import { date, useQuasar } from "quasar";

export type ReservationList = IReservation[];

export default defineComponent({
  name: "Reservations",
  setup() {
    const store = useWhsStore();

    const RCol = [
      { name: "timeout", label: "", field: "", align: "center" },
      {
        name: "id",
        align: "center",
        label: "NºReserva",
        field: "id",
        sortable: true,
      },
      {
        name: "categoryName",
        align: "center",
        label: "Tipo",
        field: "categoryName",
        sortable: false,
      },
      {
        name: "status",
        align: "center",
        label: "Estado",
        field: "status",
        sortable: true,
      },
      {
        name: "dateCreated",
        align: "center",
        label: "Fecha Creación",
        field: "dateCreated",
        sortable: true,
      },
      {
        name: "pickDateTime",
        align: "center",
        label: "Fecha Recogida",
        field: "pickDateTime",
        sortable: true,
      },
      {
        name: "cardName",
        align: "left",
        label: "Cliente",
        field: "cardName",
        sortable: true,
      },
      {
        name: "notes",
        align: "left",
        label: "Observaciones",
        field: "notes",
        sortable: false,
      },
      { name: "actions", label: "", field: "", align: "center" },
    ];
    const $q = useQuasar();
    return {
      store,
      RCol,
      statuslist: [
        { label: "Abierta", value: "SC" },
        { label: "Cancelada", value: "C" },
        { label: "Confirmada", value: "CN" },
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
      RList: [] as ReservationList[],
      fromdate: "" as string,
      todate: "" as string,
      idreservation: "" as string,
      itemcode: "" as string,
      status: "Abierta",
      categorylist: [] as ReservationCategory[],
      category: "Reserva Normal",
    };
  },
  methods: {
    isTimeOut(props) {
      const today = new Date();
      const date = new Date(props.row.pickDateTime);

      return date < today ? 1 : 0;
    },
    formatDate(value: string) {
      return moment(String(value)).format("DD/MM/YYYY");
    },
    getStatus(value: string) {
      switch (value) {
        case "SC":
          return "Abierta";
          break;
        case "CN":
          return "Completada";
          break;
        case "C":
          return "Cancelada";
          break;
      }
    },
    getCategoryList() {
      axios
        .get(`${this.store.options["ApiEndPoint"]}/Reservation/category`)
        .then((x) => {
          this.categorylist = x.data;
        })
        .catch((err) => console.log("Axios err: ", err));
    },
    getReservationList() {
      this.showLoading();
      const params = {
        WhsCode: this.store.getCurrentWhsCode.whsCode,
        status: this.status.value != undefined ? this.status.value : "SC",
        category: this.category.id != undefined ? this.category.id : "1",
      };

      if (this.idreservation != "") params.id = this.idreservation;
      if (this.fromdate != "")
        params.FromDate = date.formatDate(this.fromdate, "YYYY-MM-DD");
      if (this.todate != "")
        params.ToDate = date.formatDate(this.todate, "YYYY-MM-DD 23:59:59");
      if (this.itemcode != "") params.ItemCode = this.itemcode;

      axios
        .get(`${this.store.options["ApiEndPoint"]}/Reservation/list/`, {
          params: params,
        })
        .then((x) => {
          this.RList = x.data;
          this.hideLoading();
        })
        .catch(() => {
          this.hideLoading();
        });
    },
    onSubmit() {
      this.getReservationList();
    },
    onEdit(props) {
      this.$router.push("/reservas/" + props.row.id);
    },
  },
  mounted() {
    this.getCategoryList();
    this.getReservationList();
  },
});
</script>
