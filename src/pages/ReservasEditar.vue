<template>
  <div class="q-pa-md">
    <login :show-login="showlogin" @token="getToken"> </login>
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
                    title="Cancelar"
                    dense
                    icon="cancel"
                    @click="actions('cancel')"
                    v-if="
                      reservationId != '0' && reservationData.status == 'SC'
                    "
                  />&nbsp;
                  <q-btn
                    outline
                    round
                    title="Confirmar"
                    dense
                    icon="check"
                    @click="actions('confirm')"
                    v-if="
                      reservationId != '0' && reservationData.status == 'SC'
                    "
                  />&nbsp;
                  <q-btn
                    outline
                    round
                    title="Imprimir"
                    dense
                    icon="print"
                    v-if="reservationId != '0'"
                  />
                  &nbsp;
                  <q-btn
                    outline
                    round
                    title="Guardar"
                    dense
                    icon="save"
                    type="submit"
                    v-if="
                      reservationId == '0' || reservationData.status == 'SC'
                    "
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section dense>
              <q-input
                dense
                outlined
                label-color="black"
                label="Agregar producto"
                v-model="newItemCode"
                input-class="text-right"
                class="q-ml-md"
                ref="newItemCodeInput"
                :disable="reservationId != '0'"
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
                :disable="reservationId != '0'"
              />
              <q-input
                dense
                label-color="black"
                label="Fecha Recogida"
                v-model="reservationData.pickDate"
                mask="date"
                :rules="['date']"
                :disable="reservationId != '0'"
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
                :disable="reservationId != '0'"
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
              >
                <template v-slot:append> <q-icon name="phone" /> </template
              ></q-input>
              <q-input
                label="Email"
                label-color="black"
                v-model="reservationData.email"
                type="text"
                dense
                ><template v-slot:append> <q-icon name="email" /> </template
              ></q-input>
              <q-input
                label="Observaciones"
                label-color="black"
                v-model="reservationData.notes"
                type="textarea"
                dense
                autogrow
                ><template v-slot:append> <q-icon name="notes" /> </template
              ></q-input>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-10 q-pl-md">
          <q-card>
            <q-table
              table-header-class="mint-reverse"
              flat
              bordered
              :rows="reservationData.reservationLines"
              :columns="RCol"
              row-key="itemcode"
              :rows-per-page-options="[0]"
              virtual-scroll
              style="height: 80vh"
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
                    @click="deleteLine(props)"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-photo="props">
                <q-td :props="props" style="width: 100px">
                  <q-img
                    :src="geturl(props)"
                    style="height: 50px; max-width: 50px"
                  />
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
import { defineComponent, toValue } from 'vue';
import { useWhsStore } from '../stores/whs';
import { Reservation } from '../ts/Reservation.ts';
import { ReservationCategory } from '../interfaces/ReservationCategory.ts';
import Login from '../components/Login.vue';
import { date } from 'quasar';
import axios from 'axios';

export default defineComponent({
  name: 'ReservationForm',
  components: { Login },
  setup() {
    const store = useWhsStore();
    const RCol = [
      { name: 'actions', label: '', field: '', align: 'center' },
      { name: 'photo', label: '', field: '', align: 'center' },
      {
        name: 'itemCode',
        align: 'center',
        label: 'Artículo',
        field: 'itemCode',
        sortable: true,
        style: 'width: 100px',
      },
      {
        name: 'supplierReferenceNumber',
        align: 'center',
        label: 'Referencia',
        field: 'supplierReferenceNumber',
        sortable: false,
      },

      {
        name: 'modelDescription',
        align: 'center',
        label: 'Descripción',
        field: 'itemDescription',
        sortable: false,
      },
      {
        name: 'size',
        align: 'center',
        label: 'Talla',
        field: 'size',
        sortable: false,
      },
      {
        name: 'brand',
        align: 'center',
        label: 'Marca',
        field: 'brand',
        sortable: false,
      },
      {
        name: 'section',
        align: 'center',
        label: 'Seccion',
        field: 'section',
        sortable: false,
      },
      {
        name: 'family',
        align: 'center',
        label: 'Familia',
        field: 'family',
        sortable: false,
      },
      {
        name: 'quantity',
        align: 'center',
        label: 'Cantidad',
        field: 'quantity',
        sortable: false,
      },
    ];
    return {
      store,
      RCol,
    };
  },
  data() {
    return {
      action: '' as string,
      showlogin: false as boolean,
      token: '' as string,
      reservationData: new Reservation() as Reservation,
      newItemCode: '' as string,
      categorylist: [] as ReservationCategory[],
      statuslist: [
        { label: 'Abierta', value: 'SC' },
        { label: 'Cancelada', value: 'C' },
        { label: 'Confirmada', value: 'CN' },
      ],
    };
  },
  props: {
    reservationId: String,
  },
  watch: {
    reservationId() {
      this.reservationData = new Reservation(
        0,
        this.store.getCurrentWhsCode.whsCode
      );
    },
  },
  methods: {
    loadReservationData() {
      if (this.reservationId != 0) {
        axios
          .get(
            `${this.store.options['ApiEndPoint']}/Reservation/${this.reservationId}`
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
              (a) => (
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
              'YYYY-MM-DD'
            );
            this.reservationData.pickDate = date.formatDate(
              this.reservationData.pickDateTime,
              'YYYY-MM-DD'
            );
            this.reservationData.pickTime = date.formatDate(
              this.reservationData.pickDateTime,
              'hh:mm'
            );
          })
          .catch((err) => console.log('Axios err: ', err));
      } else {
        this.reservationData = new Reservation(
          0,
          this.store.getCurrentWhsCode.whsCode
        );
      }
    },
    geturl(prop) {
      return prop.row.urlPhoto;
    },
    getCategoryList() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/reservationcategory`)
        .then((x) => {
          this.categorylist = x.data;
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    addItem() {
      if (this.newItemCode != '')
        this.reservationData
          .addLine(
            this.newItemCode.toUpperCase(),
            this.store.options['ApiEndPoint']
          )
          .then((result) => {
            this.$q.notify({
              type: 'positive',
              message:
                'El código ' +
                this.newItemCode +
                ' se ha añadido correctamente',
            });
            this.newItemCode = '';
          })
          .catch((error) => {
            this.$q.notify({
              type: 'negative',
              message:
                'El código ' + this.newItemCode + ' no se ha podido añadir',
            });
          });
    },
    onEnter() {
      this.addItem();
      return false;
    },
    deleteLine(props) {
      let itemcode: string = props.row.itemCode;
      this.reservationData.delLine(itemcode).then((result) => {
        this.$q.notify({
          type: 'positive',
          message: 'El código ' + itemcode + ' se ha eliminado correctamente',
        });
      });
    },
    onSubmit() {
      this.action = 'save';
      this.showlogin = true;
    },
    save(token: string) {
      if (this.reservationData.reservationLines.length == 0) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe añadir productos a la reserva',
        });
      } else
        this.reservationData
          .createReservation(this.store.options['ApiEndPoint'], token)
          .then((result) => {
            this.$q.notify({
              type: 'positive',
              message: 'Reserva creada con éxito',
            });
            this.$router.push({ path: '/reservas' });
          })
          .catch((error) => {
            this.$q.notify({
              type: 'negative',
              message: 'No se ha podido crear la reserva, intentelo más tarde',
            });
          });
    },
    update(token: string) {
      this.reservationData
        .updateReservation(this.store.options['ApiEndPoint'], token)
        .then((result) => {
          this.$q.notify({
            type: 'positive',
            message: 'Reserva modificada con éxito',
          });
          this.$router.push({ path: '/reservas' });
        })
        .catch((error) => {
          this.$q.notify({
            type: 'negative',
            message:
              'No se ha podido modificar la reserva, intentelo más tarde',
          });
        });
    },
    cancel(token: string) {
      this.reservationData
        .cancelReservation(this.store.options['ApiEndPoint'], token)
        .then((result) => {
          this.$q.notify({
            type: 'positive',
            message: 'Reserva cancelada con éxito',
          });
          this.$router.push({ path: '/reservas' });
        })
        .catch((error) => {
          this.$q.notify({
            type: 'negative',
            message: 'No se ha podido cancelar la reserva, intentelo más tarde',
          });
        });
    },
    confirm(token: string) {
      this.reservationData
        .confirmReservation(this.store.options['ApiEndPoint'], token)
        .then((result) => {
          this.$q.notify({
            type: 'positive',
            message: 'Reserva confirmada con éxito',
          });
          this.$router.push({ path: '/reservas' });
        })
        .catch((error) => {
          this.$q.notify({
            type: 'negative',
            message:
              'No se ha podido confirmar la reserva, intentelo más tarde',
          });
        });
    },
    getToken(token: string) {
      if (token == '') {
        this.$q.notify({
          type: 'negative',
          message: 'Error en el usuario o la contraseña',
        });
      } else {
        switch (this.action) {
          case 'save':
            if (this.reservationData.id == 0) this.save(token);
            else if (this.reservationData.status == 'SC') this.update(token);
            break;
          case 'cancel':
            if (this.reservationData.status == 'SC') this.cancel(token);
            break;
          case 'confirm':
            if (this.reservationData.status == 'SC') this.confirm(token);
            break;
        }
      }

      this.showlogin = false;
      this.action = '';
    },
    actions(action: string) {
      this.action = action;
      this.showlogin = true;
    },
  },
  mounted() {
    this.getCategoryList();
    this.loadReservationData();
    this.$refs.newItemCodeInput.focus();
  },
});
</script>
