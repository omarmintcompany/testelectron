<template>
  <div class="q-pa-md">
    <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
    </login>
    <q-dialog
      v-model="showreasonsform"
      transition-show="scale"
      transition-hide="scale"
      style="min-width: 600px"
    >
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="mint-reverse">
          <div class="text-h6">Producto solicitado y no enviado</div>
          <div class="font-xs">
            Debe especificar un motivo para cada producto
          </div>
        </q-card-section>

        <q-card-section>
          <q-table
            dense
            table-header-class="mint-reverse"
            flat
            :rows="transferData.transferLines.filter((e) => e.quantity == 0)"
            :columns="RColReason"
            row-key="itemcode"
            :rows-per-page-options="[0]"
            virtual-scroll
            class="my-sticky-header-table"
            style="height: 50vh"
          >
            <template v-slot:body-cell-photo="props">
              <q-td :props="props">
                <q-img :src="geturl(props)" fit style="min-width: 80px">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center text-white">
                      <q-icon name="no_photography" size="xs" />
                    </div>
                  </template>
                </q-img>
              </q-td>
            </template>
            <template v-slot:body-cell-reason="props">
              <q-td :props="props">
                <q-select
                  v-model="props.row.reasonId"
                  :options="reasons"
                  label="Motivo"
                  label-color="black"
                  dense
                  option-label="description"
                  option-value="id"
                  map-options
                  emit-value
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            class="mint-reverse"
            label="Aceptar"
            @click="onSubmitReasons()"
          />
          <q-btn class="mint-reverse" label="Cancelar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
                    v-if="transferData.id != 0"
                    @click="printTransfer()"
                  />
                </div>
                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    title="Imprimir Etiquetas"
                    dense
                    icon="bookmarks"
                    @click="printLabels()"
                    v-if="checkVisibility('printLabels')"
                  />
                </div>
                <div class="col" align="center">
                  <q-btn
                    outline
                    round
                    :title="titleSetAll()"
                    dense
                    icon="checklist"
                    @click="setAll()"
                    v-if="checkVisibility('setAll')"
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
                    @click="cancelTransfer()"
                    v-if="
                      transferData.id != 0 &&
                      transferData.status == 'SC' &&
                      transferData.whsTo == store.getCurrentWhsCode.whsCode
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
                    v-if="checkSaveStatus()"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section dense>
              <q-input
                name="inputItem"
                autofocus
                color="black"
                dense
                outlined
                label-color="black"
                :label="labelItem()"
                v-model="newItemCode"
                input-class="text-right"
                class="q-ml-md"
                ref="newItemCodeInput"
                :disable="
                  transferData.status == 'A' || transferData.status == 'CN'
                "
                v-on:keydown.enter.prevent="onEnter"
              >
                <template v-slot:append>
                  <q-btn outline round dense icon="add" @click="addItem()" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="mint-reverse">
              <div>Datos de la transferencia</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Id"
                v-model="transferData.id"
                type="text"
                dense
                disable
                color="black"
              />
              <q-select
                v-model="transferData.urgent"
                :options="urgentList"
                label="Urgente"
                label-color="black"
                :disable="transferId != '0'"
                dense
                map-options
                emit-value
                color="black"
              />
              <q-select
                v-model="transferData.status"
                :options="statuslist"
                label="Estado"
                label-color="black"
                map-options
                emit-value
                dense
                disable
                color="black"
              />
              <q-input
                label="Titulo"
                v-model="transferData.title"
                type="text"
                dense
                :disable="transferId != '0'"
                color="black"
              />
              <q-select
                v-model="transferData.type"
                :options="types"
                label="Tipo"
                label-color="black"
                dense
                disable
                map-options
                emit-value
                option-value="id"
                option-label="description"
                color="black"
              />
              <q-select
                v-model="transferData.whsFrom"
                :options="whsList"
                label="Desde"
                label-color="black"
                dense
                map-options
                emit-value
                disable
                option-value="whsCode"
                option-label="whsName"
                color="black"
              />
              <q-select
                v-model="transferData.whsTo"
                :options="whsList"
                label="Hasta"
                label-color="black"
                dense
                map-options
                emit-value
                :disable="transferId != '0'"
                option-value="whsCode"
                option-label="whsName"
                color="black"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-10 q-pl-md">
          <q-card>
            <q-table
              dense
              table-header-class="mint-reverse"
              flat
              :rows="transferData.transferLines"
              :columns="RCol"
              row-key="itemcode"
              :rows-per-page-options="[0]"
              virtual-scroll
              style="height: 73vh"
              class="my-sticky-header-table"
              :title="typeTransfer()"
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
                    v-if="transferId == '0'"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                  <q-img :src="geturl(props)" fit style="min-width: 80px">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center text-white">
                        <q-icon name="no_photography" size="xs" />
                      </div>
                    </template>
                  </q-img>
                </q-td>
              </template>
              <template v-slot:body-cell-quantity="props">
                <q-td :props="props" style="width: 120px">
                  <q-input
                    type="number"
                    v-model="props.row.quantity"
                    dense
                    outlined
                    label="uds"
                    min="0"
                    color="black"
                    :class="
                      transferData.whsFrom == store.getCurrentWhsCode.whsCode &&
                      props.row.quantity == 0
                        ? 'mint-zero'
                        : (props.row.quantity != props.row.sendQty &&
                            transferData.whsTo ==
                              store.getCurrentWhsCode.whsCode) ||
                          (transferData.whsFrom ==
                            store.getCurrentWhsCode.whsCode &&
                            (props.row.quantity > props.row.stock ||
                              props.row.quantity > props.row.orderQty))
                        ? 'mint-ecom'
                        : 'mint-valid'
                    "
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-reason="props">
                <q-td :props="props" style="width: 120px">
                  {{ getReadonDescription(props.row.reasonId) }}
                </q-td>
              </template>
            </q-table>
          </q-card>
          <q-separator vertical inset />
          <q-card>
            <div class="row q-pl-md q-pr-md q-pb-md">
              <div class="col" style="max-width: 120px">
                <q-input
                  label="Fecha Petición"
                  v-model="transferData.dateCreated"
                  type="text"
                  dense
                  disable
                />
              </div>
              <div class="col">
                <q-select
                  v-model="transferData.salesRepCreate"
                  :options="salesreps"
                  label="Usuario Petición"
                  label-color="black"
                  dense
                  disabled
                  readonly
                  option-label="name"
                  option-value="code"
                  map-options
                />
              </div>
              <div class="col" style="max-width: 120px">
                <q-input
                  label="Fecha Envío"
                  v-model="transferData.dateSend"
                  type="text"
                  dense
                  disable
                />
              </div>
              <div class="col">
                <q-select
                  v-model="transferData.salesRepSent"
                  :options="salesreps"
                  label="Usuario Envío"
                  label-color="black"
                  dense
                  disabled
                  readonly
                  option-label="name"
                  option-value="code"
                  map-options
                />
              </div>
              <div class="col" style="max-width: 120px">
                <q-input
                  label="Fecha Recepción"
                  v-model="transferData.dateRec"
                  type="text"
                  dense
                  disable
                />
              </div>
              <div class="col">
                <q-select
                  v-model="transferData.salesRepReceived"
                  :options="salesreps"
                  label="Usuario Recibe"
                  label-color="black"
                  dense
                  disabled
                  readonly
                  option-label="name"
                  option-value="code"
                  map-options
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWhsStore } from '../stores/whs';
import { Transfer } from '../ts/Transfer.ts';
import { WhsInfo } from '../interfaces/WhsInfo';
import Login from '../components/Login.vue';
import { date, useQuasar } from 'quasar';
import axios from 'axios';
import { SalesRep, Reason } from '../interfaces/Transfers';

export default defineComponent({
  name: 'TransferForm',
  components: { Login },

  setup() {
    const $q = useQuasar();
    const store = useWhsStore();
    const RColReason = [
      { name: 'photo', label: '', field: '', align: 'center' },
      {
        name: 'brand',
        align: 'left',
        label: 'Marca',
        field: 'brand',
        sortable: true,
      },
      {
        name: 'section',
        align: 'left',
        label: 'Sección',
        field: 'section',
        sortable: true,
      },
      {
        name: 'itemCode',
        align: 'center',
        label: 'Artículo',
        field: 'itemCode',
        sortable: true,
        style: 'width: 100px',
      },
      {
        name: 'size',
        align: 'left',
        label: 'Talla',
        field: 'size',
      },
      {
        name: 'reason',
        label: '',
        field: '',
        align: 'center',
        style: 'min-width:200px',
      },
    ];
    const RCol = [
      { name: 'actions', label: '', field: '', align: 'center' },
      { name: 'photo', label: '', field: '', align: 'center' },
      {
        name: 'brand',
        align: 'left',
        label: 'Marca',
        field: 'brand',
        sortable: true,
      },
      {
        name: 'section',
        align: 'left',
        label: 'Sección',
        field: 'section',
        sortable: true,
      },
      {
        name: 'family',
        align: 'left',
        label: 'Familia',
        field: 'family',
        sortable: true,
      },
      {
        name: 'supplierReferenceNumber',
        align: 'center',
        label: 'Referencia',
        field: 'supplierReferenceNumber',
        sortable: true,
        style: 'width: 100px',
      },
      {
        name: 'itemCode',
        align: 'center',
        label: 'Artículo',
        field: 'itemCode',
        sortable: true,
        style: 'width: 100px',
      },
      {
        name: 'color',
        align: 'left',
        label: 'Color',
        field: 'color',
      },
      {
        name: 'size',
        align: 'left',
        label: 'Talla',
        field: 'size',
      },
      {
        name: 'season',
        align: 'left',
        label: 'Temporada',
        field: 'season',
      },
      {
        name: 'stock',
        align: 'right',
        label: 'Stock',
        field: 'stock',
      },
      {
        name: 'orderQty',
        align: 'right',
        label: 'A Enviar',
        field: 'orderQty',
      },
      {
        name: 'sendQty',
        align: 'right',
        label: 'Enviado',
        field: 'sendQty',
      },

      {
        name: 'recvQty',
        align: 'right',
        label: 'Recibido',
        field: 'recvQty',
      },
      { name: 'reason', label: '', field: '', align: 'left' },
      { name: 'quantity', label: '', field: '', align: 'right' },
    ];

    return {
      store,
      RCol,
      RColReason,
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
      action: '' as string,
      showlogin: false as boolean,
      showreasonsform: false as boolean,
      token: '' as string,
      transferData: new Transfer(0) as Transfer,
      newItemCode: '' as string,
      statuslist: [
        { label: 'En espera', value: 'SC' },
        { label: 'Listo sin bultos', value: 'SB' },
        { label: 'Listo con bultos', value: 'CB' },
        { label: 'En Tránsito', value: 'T' },
        { label: 'Entregada', value: 'EN' },
        { label: 'Recibida', value: 'CN' },
        { label: 'Anulada', value: 'A' },
      ],
      urgentList: [
        { label: 'No', value: false },
        { label: 'Si', value: true },
      ],
      whsList: [] as WhsInfo[],
      types: [] as TransferType[],
      salesreps: [] as SalesRep[],
      reasons: [] as Reason[],
    };
  },
  props: {
    transferId: String,
  },
  watch: {
    transferId() {
      this.transferData = new Transfer(0);
    },
  },

  mounted() {
    this.getReasons();
    this.getSalesRep();
    this.getTypes();
    this.getWhs();
    this.loadTransferData();
    document.getElementsByName('inputItem')[0].focus();
  },
  methods: {
    printTransfer() {
      window.open(
        'http://192.168.1.25/PrintTransferencia?PONumber=' +
          this.transferData.id
      );
    },
    printLabels() {
      window.open(
        'http://192.168.1.130/intranet_macys/utilities/labels2/Step_02_WS.php?WS_ID=' +
          this.transferData.id +
          '&ForStoreID=' +
          (
            Number(this.store.getCurrentWhsCode.whsCode.replace('T', '')) - 100
          ).toString()
      );
    },
    getToken() {
      let token = this.store.getToken as string;

      if (token == '') {
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        if (this.action == 'Cancel') {
          this.showLoading();
          this.transferData
            .cancelTransfer()
            .then((x) => {
              this.hideLoading();
              if (x) {
                this.$q.notify({
                  type: 'positive',
                  message: 'Transferencia anulada con éxito',
                });
                this.$router.push({ path: '/transfersout' });
              } else {
                this.$q.notify({
                  type: 'negative',
                  message: 'No se ha podido anular la transferencia',
                });
              }
            })
            .catch((error) => {
              this.hideLoading();
              this.$q.notify({
                type: 'negative',
                message: error.response.data.messages,
              });
            });
        }
        if (this.action != 'Cancel') {
          if (this.transferData.id == 0 || this.transferData.id == undefined) {
            this.showLoading();
            this.transferData
              .createTransfer()
              .then(() => {
                this.hideLoading();
                this.$q.notify({
                  type: 'positive',
                  message: 'Transferencia creada con éxito',
                });
                this.$router.push({ path: '/' });
              })
              .catch((e) => {
                this.hideLoading();
                this.$q.notify({
                  type: 'negative',
                  message: e.message,
                });
              });
          } else if (
            this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode
          ) {
            this.showLoading();
            this.transferData
              .sendTransfer()
              .then((x) => {
                this.hideLoading();
                if (x) {
                  this.$q.notify({
                    type: 'positive',
                    message: 'Transferencia enviada con éxito',
                  });
                  this.$router.push({ path: '/transfersout' });
                } else
                  this.$q.notify({
                    type: 'negative',
                    message:
                      'Las unidades enviadas superan a las unidades propuestas',
                  });
              })
              .catch((error) => {
                console.log(error);
                this.hideLoading();
                this.$q.notify({
                  type: 'negative',
                  message: error,
                });
              });
          } else {
            this.showLoading();
            this.transferData
              .recTransfer()
              .then((x) => {
                this.hideLoading();
                if (x) {
                  this.$q.notify({
                    type: 'positive',
                    message: 'Transferencia recibida con éxito',
                  });
                  this.$router.push({ path: '/transfersin' });
                } else
                  this.$q.notify({
                    type: 'negative',
                    message:
                      'Las unidades recibidas son diferentes a las enviadas',
                  });
              })
              .catch((error) => {
                this.hideLoading();
                this.$q.notify({
                  type: 'negative',
                  message: error,
                });
              });
          }
        }
      }

      this.showlogin = false;
      this.action = '';
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
    getTypes() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/transfers/types`)
        .then((x) => {
          Object.values(x.data).forEach((val) => {
            let item = {
              id: val.id,
              description: val.description,
            } as TransferType;
            this.types.push(item);
          });
          this.types.sort((a, b) => {
            if (a['description'] < b['description']) {
              return -1;
            }
            if (a['description'] > b['description']) {
              return 1;
            }
            return 0;
          });
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    getSalesRep() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/salesrep`)
        .then((x) => {
          this.salesreps = x.data;
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    getReasons() {
      axios
        .get(`${this.store.options['ApiEndPoint']}/transfers/reasons`)
        .then((x) => {
          this.reasons = x.data;
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    geturl(prop) {
      return prop.row.urlPhoto;
    },
    loadTransferData() {
      this.showLoading();
      if (this.transferId != '0') {
        axios
          .get(
            `${this.store.options['ApiEndPoint']}/transfers/${this.transferId}/${this.store.getCurrentWhsCode.whsCode}`
          )
          .then((x) => {
            this.transferData = new Transfer(x.data.id);

            this.transferData.title = x.data.title;
            this.transferData.whsFrom = x.data.whsFrom;
            this.transferData.whsTo = x.data.whsTo;
            this.transferData.status = x.data.status;
            this.transferData.salesPerson = x.data.salesPerson;
            this.transferData.urgent = x.data.urgent;
            this.transferData.salesRepCreate = x.data.salesRepCreate;
            this.transferData.salesRepSent = x.data.salesRepSent;
            this.transferData.salesRepReceived = x.data.salesRepReceived;
            this.transferData.deliveryMan = x.data.deliveryMan;
            this.transferData.needDateTime = x.data.needDateTime;
            this.transferData.type = Number(x.data.type);
            this.transferData.transferLines = x.data.transferLines;

            this.transferData.dateCreated = date.formatDate(
              x.data.dateCreated,
              'YYYY-MM-DD hh:mm'
            );
            this.transferData.dateSend = date.formatDate(
              x.data.dateSend,
              'YYYY-MM-DD hh:mm'
            );

            this.transferData.dateRec = date.formatDate(
              x.data.dateRec,
              'YYYY-MM-DD hh:mm'
            );

            this.transferData.transferLines.map((x) => (x.quantity = 0));

            this.hideLoading();
          })
          .catch(() => {
            this.hideLoading();
          });
      } else {
        this.transferData = new Transfer(
          0,
          this.store.getCurrentWhsCode.whsCode
        );
        this.hideLoading();
      }
    },
    deleteLine(props) {
      let itemcode: string = props.row.itemCode;
      this.transferData.delLine(itemcode).then(() => {
        this.$q.notify({
          type: 'positive',
          message: 'El código ' + itemcode + ' se ha eliminado correctamente',
        });
      });
    },
    titleSetAll() {
      return this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode
        ? 'Enviar todo'
        : 'Recibir todo';
    },
    setAll() {
      if (this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode)
        this.transferData.transferLines.map(
          (e) => (e.quantity = e.orderQty <= e.stock ? e.orderQty : e.stock)
        );
      else this.transferData.transferLines.map((e) => (e.quantity = e.sendQty));
    },
    typeTransfer() {
      return this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode
        ? 'Transferencia de Salida'
        : 'Transferencia de Entrada';
    },
    labelItem() {
      return this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode
        ? 'Artículo a enviar'
        : 'Artículo a recibir';
    },
    checkVisibility(action: string) {
      switch (action) {
        case 'setAll':
          if (
            this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode
          ) {
            // Enviar todo
            return (this.transferData.status == 'SC' ||
              this.transferData.status == 'SB' ||
              this.transferData.status == 'CB') &&
              this.transferData.transferLines.length > 0 &&
              this.transferData.id != 0
              ? true
              : false;
          } else {
            return this.transferData.status == 'T' ||
              this.transferData.status == 'EN'
              ? true
              : false;
          }
          break;
        default:
          return this.transferData.transferLines.length > 0 ? true : false;
          break;
      }
    },
    addItem() {
      if (this.transferData.id == 0) this.addItemToLine();
      else if (
        this.transferData.status != 'A' &&
        this.transferData.status != 'CN'
      ) {
        if (this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode) {
          this.transferData
            .sentItem(this.newItemCode.toUpperCase())
            .then((x) => {
              if (x) {
                this.$q.notify({
                  type: 'positive',
                  message:
                    'El código ' +
                    this.newItemCode +
                    ' se ha procesado correctamente',
                });
              } else {
                this.$q.notify({
                  type: 'negative',
                  message:
                    'El código ' +
                    this.newItemCode +
                    ' no existe en la transferencia',
                });
              }
              this.newItemCode = '';
              document.getElementsByName('inputItem')[0].focus();
            })
            .catch((e) => {
              this.$q.notify({
                type: 'negative',
                message: e.message,
              });
              this.newItemCode = '';
              document.getElementsByName('inputItem')[0].focus();
            });
        } else {
          this.transferData
            .recItem(this.newItemCode.toUpperCase())
            .then((x) => {
              if (x) {
                this.$q.notify({
                  type: 'positive',
                  message:
                    'El código ' +
                    this.newItemCode +
                    ' se ha procesado correctamente',
                });
              } else {
                this.$q.notify({
                  type: 'negative',
                  message:
                    'El código ' +
                    this.newItemCode +
                    ' no existe en la transferencia',
                });
              }
              this.newItemCode = '';
              document.getElementsByName('inputItem')[0].focus();
            })
            .catch((e) => {
              this.$q.notify({
                type: 'negative',
                message: e.message,
              });
              this.newItemCode = '';
              document.getElementsByName('inputItem')[0].focus();
            });
        }
      }
    },
    addItemToLine() {
      if (this.newItemCode != '') {
        this.transferData
          .addLine(this.newItemCode.toUpperCase())
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message:
                'El código ' +
                this.newItemCode +
                ' se ha añadido correctamente',
            });
            this.newItemCode = '';
          })
          .catch((e) => {
            this.$q.notify({
              type: 'negative',
              message: e.message,
            });
          });
      }
    },
    onEnter() {
      this.addItem();
      return false;
    },
    onSubmit() {
      if (this.transferData.id == 0 || this.transferData == undefined) {
        this.resourceid = 11;
        if (this.transferData.transferLines.length <= 0) {
          this.resourceid = 0;
          this.$q.notify({
            type: 'negative',
            message: 'Debe añadir productos a la transferencia',
          });
        }
        if (
          this.transferData.title == '' ||
          this.transferData.title == undefined
        ) {
          this.resourceid = 0;
          this.$q.notify({
            type: 'negative',
            message: 'Debe especificar un título',
          });
        }
        if (
          this.transferData.whsTo == '' ||
          this.transferData.whsTo == undefined
        ) {
          this.resourceid = 0;
          this.$q.notify({
            type: 'negative',
            message: 'Debe definir un destino',
          });
        }
      } else if (
        this.transferData.status != 'A' &&
        this.transferData.status != 'CN'
      ) {
        if (this.transferData.whsFrom == this.store.getCurrentWhsCode.whsCode) {
          this.resourceid =
            this.transferData.transferLines.filter((e) => e.quantity == 0)
              .length > 0
              ? 16
              : 12;
        } else this.resourceid = 13;
      }

      if (
        this.resourceid == 16 &&
        this.transferData.transferLines.filter((e) => e.quantity == 0).length >
          0
      ) {
        this.transferData.transferLines
          .filter((e) => e.quantity == 0)
          .map((e) => (e.reasonId = 1));
        this.showreasonsform = true;
      } else if (this.resourceid != 0) this.showlogin = true;
    },
    onSubmitReasons() {
      this.showreasonsform = false;
      this.showlogin = true;
    },
    cancelTransfer() {
      this.action = 'Cancel';
      this.resourceid = 14;
      this.showlogin = true;
    },
    getReadonDescription(id: number) {
      return this.reasons.filter((e) => e.id == id).length > 0
        ? this.reasons.filter((e) => e.id == id)[0]['description']
        : '';
    },
    checkSaveStatus() {
      return (this.transferData.whsFrom ==
        this.store.getCurrentWhsCode.whsCode &&
        this.transferData.status == 'SC') ||
        (this.transferData.whsTo == this.store.getCurrentWhsCode.whsCode &&
          this.transferData.status == 'T')
        ? true
        : false;
    },
  },
});
</script>
