<template>
  <div class="q-pa-md">
    <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
    </login>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row">
        <div class="col-2">
          <q-card>
            <q-card-section dense class="mint-reverse">
              <div class="row">
                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    title="Imprimir"
                    dense
                    icon="print"
                    v-if="reservationIdLocal != 0"
                    @click="printReservation()"
                  />
                </div>

                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    title="Duplicar"
                    dense
                    icon="file_copy"
                    v-if="reservationIdLocal != 0"
                    @click="preduplicate()"
                  />
                </div>
                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    title="Confirmar"
                    dense
                    icon="check"
                    @click="actions('confirm')"
                    v-if="
                      reservationIdLocal != 0 && reservationData.status == 'SC'
                    "
                  />
                </div>
                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    title="Cancelar"
                    dense
                    icon="cancel"
                    color="red"
                    @click="actions('cancel')"
                    v-if="
                      reservationIdLocal != 0 && reservationData.status == 'SC'
                    "
                  />
                </div>
                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    title="Guardar"
                    dense
                    icon="save"
                    type="submit"
                    color="green"
                    v-if="
                      reservationIdLocal == 0 || reservationData.status == 'SC'
                    "
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section dense>
              <q-select
                v-model="printModelListSelected"
                :options="printModelList"
                label="Modelo de impresión"
                label-color="black"
                dense
                map-options
                emit-value
                color="black"
              />
            </q-card-section>
            <q-card-section>
              <q-input
                name="inputItem"
                color="black"
                dense
                outlined
                label-color="black"
                label="Agregar producto"
                v-model="newItemCode"
                input-class="text-right"
                class="q-ml-md"
                ref="newItemCodeInput"
                :disable="reservationIdLocal != 0"
                v-on:keydown.enter.prevent="onEnter"
              >
                <template v-slot:append>
                  <q-btn
                    outline
                    round
                    title="Añadir producto"
                    dense
                    icon="add"
                    @click="addItem()"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="mint-reverse">
              <div>Datos de la reserva</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Id"
                v-model="reservationData.id"
                type="text"
                dense
                disable
              />
              <q-select
                v-model="reservationData.status"
                :options="statuslist"
                label="Estado"
                label-color="black"
                map-options
                emit-value
                dense
                disable
              />
              <q-select
                v-model="reservationData.categoryId"
                :options="categorylist"
                label="Tipo"
                label-color="black"
                dense
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :disable="reservationIdLocal != 0"
                color="black"
              />
              <q-input
                dense
                label-color="black"
                label="Fecha Recogida"
                v-model="reservationData.pickDate"
                mask="date"
                :rules="['date']"
                :disable="reservationIdLocal != 0"
                readonly
                required
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="reservationData.pickDate" color="black">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            class="mint-reverse"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                v-model="reservationData.pickTime"
                mask="time"
                :rules="['time']"
                dense
                label-color="black"
                label="Hora Recogida"
                :disable="reservationIdLocal != 0"
                readonly
                required
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="reservationData.pickTime" color="black">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            class="mint-reverse"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon> </template
              ></q-input>
            </q-card-section>
          </q-card>
          <q-card>
            <q-card-section class="mint-reverse">
              <div>Datos del cliente</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Cliente"
                label-color="black"
                v-model="reservationData.cardName"
                type="text"
                dense
                required
                color="black"
              >
                <template v-slot:append>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                label="Telefono"
                label-color="black"
                v-model="reservationData.phone"
                type="text"
                dense
                color="black"
              >
                <template v-slot:append> <q-icon name="phone" /> </template
              ></q-input>
              <q-input
                label="Email"
                label-color="black"
                v-model="reservationData.email"
                type="text"
                dense
                color="black"
                ><template v-slot:append> <q-icon name="email" /> </template
              ></q-input>
              <q-input
                label="Observaciones"
                label-color="black"
                v-model="reservationData.notes"
                type="textarea"
                dense
                autogrow
                color="black"
                ><template v-slot:append> <q-icon name="notes" /> </template
              ></q-input>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-10 q-pl-md">
          <q-card>
            <q-table
              dense
              table-header-class="mint-reverse"
              flat
              :rows="reservationData.reservationLines"
              :columns="RCol"
              row-key="itemcode"
              :rows-per-page-options="[0]"
              virtual-scroll
              style="height: 85vh"
              class="my-sticky-header-table"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    round
                    flat
                    color="black"
                    icon="delete"
                    title="Eliminar linea"
                    @click="deleteLine(props.row.itemCode)"
                    :disable="reservationIdLocal != 0"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-photo="props">
                <q-td :props="props" style="width: 80px">
                  <q-img :src="props.row.urlPhoto">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center text-white">
                        <q-icon name="no_photography" size="md" />
                      </div>
                    </template>
                  </q-img>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useWhsStore } from "../stores/whs";
import { Reservation } from "../ts/Reservation.ts";
import { ReservationCategory } from "../interfaces/ReservationCategory.ts";
import Login from "../components/Login.vue";
import { date, useQuasar } from "quasar";
import axios from "axios";

export default defineComponent({
  name: "ReservationForm",
  components: { Login },
  setup() {
    const $q = useQuasar();
    const store = useWhsStore();
    const RCol = [
      { name: "actions", label: "", field: "", align: "center" },
      { name: "photo", label: "", field: "", align: "center" },
      {
        name: "itemCode",
        align: "center",
        label: "Artículo",
        field: "itemCode",
        sortable: true,
        style: "width: 100px",
      },
      {
        name: "supplierReferenceNumber",
        align: "center",
        label: "Referencia",
        field: "supplierReferenceNumber",
        sortable: false,
      },

      {
        name: "modelDescription",
        align: "center",
        label: "Descripción",
        field: "itemDescription",
        sortable: false,
      },
      {
        name: "size",
        align: "center",
        label: "Talla",
        field: "size",
        sortable: false,
      },
      {
        name: "brand",
        align: "center",
        label: "Marca",
        field: "brand",
        sortable: false,
      },
      {
        name: "section",
        align: "center",
        label: "Seccion",
        field: "section",
        sortable: false,
      },
      {
        name: "family",
        align: "center",
        label: "Familia",
        field: "family",
        sortable: false,
      },
      {
        name: "quantity",
        align: "center",
        label: "Cantidad",
        field: "quantity",
        sortable: false,
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
      resourceid: 0 as number,
      action: "" as string,
      showlogin: false as boolean,
      token: "" as string,
      reservationData: {} as Reservation,
      newItemCode: "" as string,
      categorylist: [] as ReservationCategory[],
      statuslist: [
        { label: "Abierta", value: "SC" },
        { label: "Cancelada", value: "C" },
        { label: "Confirmada", value: "CN" },
      ],
      printModelList: [
        { label: "Modelo Ticket", value: 'reservationTicket' },
        { label: "Modelo A4", value: 'reservationDefault' },
      ],
      printModelListSelected: "reservationTicket",
      reservationIdLocal: 0 as number,
    };
  },
  props: {
    reservationId: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    reservationId() {
      let x: Reservation = new Reservation(
        0,
        this.store.getCurrentWhsCode.whsCode
      );
      this.reservationData = x;
      this.reservationIdLocal = this.reservationId;
    },
  },
  methods: {
    loadReservationData() {
      this.showLoading();
      if (this.reservationIdLocal != 0) {
        axios
          .get(
            `${this.store.options["ApiEndPoint"]}/Reservation/${this.reservationIdLocal}`
          )
          .then((x) => {
            this.reservationData = new Reservation(
              0,
              this.store.getCurrentWhsCode.whsCode
            );
            this.reservationData.id = x.data.id;
            this.reservationData.dateCreated = x.data.dateCreated;
            this.reservationData.cardCode = x.data.cardCode;
            this.reservationData.cardName = x.data.cardName;
            this.reservationData.phone = x.data.phone;
            this.reservationData.email = x.data.email;
            this.reservationData.whsCode = x.data.whsCodeStore;
            this.reservationData.status = x.data.status;
            this.reservationData.notes = x.data.notes;
            this.reservationData.categoryId = x.data.categoryId;
            this.reservationData.categoryName = x.data.categoryName;
            this.reservationData.pickDateTime = x.data.pickDateTime;
            this.reservationData.reservationLines = x.data.reservationLines;

            x.data.reservationLines.map(
              (a: {
                itemCode: string;
                itemData: {
                  itemCode: string;
                  brand: string;
                  itemGroupCode: string;
                  modelCode: string;
                  modelDescription: string;
                  section: string;
                  size: string;
                  supplierColor: string;
                  supplierReferenceNumber: string;
                  season: string;
                  itemDescription: string;
                  family: string;
                  urlPhoto: string;
                };
                brand: string;
                itemGroupCode: string;
                modelCode: string;
                modelDescription: string;
                section: string;
                size: string;
                supplierColor: string;
                supplierReferenceNumber: string;
                season: string;
                itemDescription: string;
                family: string;
                urlPhoto: string;
                whsCode: string;
              }) => (
                (a.itemCode = a.itemData.itemCode),
                (a.brand = a.itemData.brand),
                (a.itemGroupCode = a.itemData.itemGroupCode),
                (a.modelCode = a.itemData.modelCode),
                (a.modelDescription = a.itemData.modelDescription),
                (a.section = a.itemData.section),
                (a.size = a.itemData.size),
                (a.supplierColor = a.itemData.supplierColor),
                (a.supplierReferenceNumber =
                  a.itemData.supplierReferenceNumber),
                (a.season = a.itemData.season),
                (a.itemDescription = a.itemData.itemDescription),
                (a.family = a.itemData.family),
                (a.urlPhoto = a.itemData.urlPhoto),
                (a.whsCode = this.store.getCurrentWhsCode.whsCode)
              )
            );

            this.reservationData.dateCreated = date.formatDate(
              this.reservationData.dateCreated,
              "YYYY-MM-DD"
            );
            this.reservationData.pickDate = date.formatDate(
              this.reservationData.pickDateTime,
              "YYYY-MM-DD"
            );
            this.reservationData.pickTime = date.formatDate(
              this.reservationData.pickDateTime,
              "hh:mm"
            );
            this.hideLoading();
          })
          .catch(() => {
            this.hideLoading();
          });
      } else {
        this.reservationData = new Reservation(
          0,
          this.store.getCurrentWhsCode.whsCode
        );
        this.hideLoading();
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
    addItem() {
      if (this.newItemCode != "")
        this.reservationData
          .addLine(this.newItemCode.toUpperCase())
          .then(() => {
            this.$q.notify({
              type: "positive",
              message:
                "El código " +
                this.newItemCode +
                " se ha añadido correctamente",
            });
            this.newItemCode = "";
            document.getElementsByName("inputItem")[0].focus();
          })
          .catch(() => {
            this.$q.notify({
              type: "negative",
              message:
                "El código " + this.newItemCode + " no se ha podido añadir",
            });
            document.getElementsByName("inputItem")[0].focus();
          });
    },
    onEnter() {
      this.addItem();
      return false;
    },
    deleteLine(itemcode: string) {
      this.reservationData.delLine(itemcode).then(() => {
        this.$q.notify({
          type: "positive",
          message: "El código " + itemcode + " se ha eliminado correctamente",
        });
      });
    },
    onSubmit() {
      this.action = "save";
      this.resourceid = this.reservationData.status == "SC" ? 7 : 4;
      this.showlogin = true;
    },
    save() {
      if (this.reservationData.reservationLines.length == 0) {
        this.$q.notify({
          type: "negative",
          message: "Debe añadir productos a la reserva",
        });
      } else
        this.reservationData
          .createReservation()
          .then(() => {
            this.$q.notify({
              type: "positive",
              message: "Reserva creada con éxito",
            });
            this.$router.push({ path: "/reservas" });
          })
          .catch(() => {
            this.$q.notify({
              type: "negative",
              message: "No se ha podido crear la reserva, intentelo más tarde",
            });
          });
    },
    printReservation(){
      let ticketSize : boolean = this.printModelListSelected == 'reservationDefault' ? false : true;

      window.open(
          `${this.store.options["ApiEndPoint"]}/pdf/generate?typeDocument=reservation&templateName=`+ this.printModelListSelected + `&ticketSize=` + ticketSize +`&idDocument=` +
          this.reservationIdLocal +
          "&WhsCode=" + this.store.getCurrentWhsCode.whsCode
      );
    },
    preduplicate() {
      this.action = "duplicate";
      this.resourceid = 21;
      this.showlogin = true;
    },
    duplicate() {
      this.reservationData
        .cancelReservation()
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Reserva cancelada con éxito",
          });
          this.reservationData.id = 0;
          this.reservationIdLocal = 0;
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: "No se ha podido cancelar la reserva, intentelo más tarde",
          });
        });
    },
    update() {
      this.reservationData
        .updateReservation()
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Reserva modificada con éxito",
          });
          this.$router.push({ path: "/reservas" });
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message:
              "No se ha podido modificar la reserva, intentelo más tarde",
          });
        });
    },
    cancel() {
      this.reservationData
        .cancelReservation()
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Reserva cancelada con éxito",
          });
          this.$router.push({ path: "/reservas" });
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: "No se ha podido cancelar la reserva, intentelo más tarde",
          });
        });
    },
    confirm() {
      this.reservationData
        .confirmReservation()
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Reserva confirmada con éxito",
          });
          this.$router.push({ path: "/reservas" });
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message:
              "No se ha podido confirmar la reserva, intentelo más tarde",
          });
        });
    },
    getToken() {
      let token = this.store.getToken as string;

      if (token == "") {
        this.$q.notify({
          type: "negative",
          message: this.store.getLastError,
        });
      } else {
        this.showLoading();
        switch (this.action) {
          case "save":
            if (this.reservationData.id == 0) this.save();
            else if (this.reservationData.status == "SC") this.update();
            break;
          case "cancel":
            if (this.reservationData.status == "SC") this.cancel();
            break;
          case "confirm":
            if (this.reservationData.status == "SC") this.confirm();
            break;
          case "duplicate":
            if (this.reservationData.id != 0) this.duplicate();
            break;
        }
        this.hideLoading();
      }

      this.showlogin = false;
      this.action = "";
    },
    actions(action: string) {
      this.resourceid = action == "cancel" ? 6 : 5;
      this.action = action;
      this.showlogin = true;
    },
  },
  mounted() {
    this.reservationIdLocal = this.reservationId;
    this.getCategoryList();
    this.loadReservationData();
    document.getElementsByName("inputItem")[0].focus();
  },
});
</script>
