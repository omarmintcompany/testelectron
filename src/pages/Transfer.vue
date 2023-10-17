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
                    :title="Cancelar"
                    dense
                    icon="checklist"
                    @click="setAll()"
                    v-if="transferData.id != 0"
                  />&nbsp;
                  <q-btn
                    outline
                    round
                    title="Cancelar"
                    dense
                    icon="cancel"
                    @click="actions('cancel')"
                    v-if="transferData.id != 0 && transferData.status == 'SC'"
                  />&nbsp;
                  <q-btn
                    outline
                    round
                    title="Imprimir"
                    dense
                    icon="print"
                    v-if="transferData.id != 0"
                  />
                  &nbsp;
                  <q-btn
                    outline
                    round
                    title="Guardar"
                    dense
                    icon="save"
                    type="submit"
                    v-if="transferData.id == 0"
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
                :disable="transferData.id != 0"
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
              <div>Datos de la transferencia</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Id"
                v-model="transferData.id"
                type="text"
                dense
                disable
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
              />
              <q-input
                label="Titulo"
                v-model="transferData.title"
                type="text"
                dense
                :disable="transferId != '0'"
              />
              <q-select
                v-model="transferData.type"
                :options="types"
                label="Tipo"
                label-color="black"
                dense
                :disable="transferId != '0'"
                map-options
                emit-value
                option-value="id"
                option-label="description"
              />
              <q-select
                v-model="transferData.whsFrom"
                :options="whsList"
                label="Desde"
                label-color="black"
                dense
                map-options
                emit-value
                :disable="transferId != '0'"
                option-value="whsCode"
                option-label="whsName"
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
              />
            </q-card-section>
          </q-card>
          <q-card>
            <q-card-section class="mint-reverse">
              <div>Fechas de la transferencia</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Fecha Creación"
                v-model="transferData.dateCreated"
                type="text"
                dense
                disable
              />
              <q-input
                label="Fecha Envío"
                v-model="transferData.dateSend"
                type="text"
                dense
                disable
              />
              <q-input
                label="Fecha Recepción"
                v-model="transferData.dateRec"
                type="text"
                dense
                disable
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
                    @click="deleteLine(props)"
                    v-if="transferId == '0'"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-photo="props">
                <q-td :props="props" style="width: 80px">
                  <q-img :src="geturl(props)" fit />
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
                  ></q-input>
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
import { defineComponent } from 'vue';
import { useWhsStore } from '../stores/whs';
import { Transfer } from '../ts/Transfer.ts';
import { TransferType } from '../ts/TransferInterfaces.ts';
import { WhsInfo } from '../interfaces/WhsInfo';
import Login from '../components/Login.vue';
import { date, useQuasar } from 'quasar';
import axios from 'axios';

export default defineComponent({
  name: 'TransferForm',
  components: { Login },

  setup() {
    const $q = useQuasar();
    const store = useWhsStore();
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
        name: 'itemCode',
        align: 'center',
        label: 'Artículo',
        field: 'itemCode',
        sortable: true,
        style: 'width: 100px',
      },
      {
        name: 'itemDescription',
        align: 'left',
        label: 'Descripción',
        field: 'itemDescription',
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
      { name: 'quantity', label: '', field: '', align: 'right' },
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
      action: '' as string,
      showlogin: false as boolean,
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
    this.getTypes();
    this.getWhs();
    this.loadTransferData();
    //this.$refs.newItemCodeInput.focus();
  },
  methods: {
    getToken() {
      let token = this.store.getToken as string;

      if (token == '') {
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        this.showLoading();
        /*switch (this.action) {
        case 'save':
          if (this.transferData.id == 0) this.save(token);
          else if (this.transferData.status == 'SC') this.update(token);
          break;
        case 'cancel':
          if (this.transferData.status == 'SC') this.cancel(token);
          break;
        case 'confirm':
          if (this.transferData.status == 'SC') this.confirm(token);
          break;
      }*/
        this.hideLoading();
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
            this.transferData = x.data;
            this.transferData.type = Number(x.data.type);
            this.transferData.dateCreated = date.formatDate(
              this.transferData.dateCreated,
              'YYYY-MM-DD hh:mm'
            );
            this.transferData.dateSend = date.formatDate(
              this.transferData.dateSend,
              'YYYY-MM-DD hh:mm'
            );

            this.transferData.dateRec = date.formatDate(
              this.transferData.dateRec,
              'YYYY-MM-DD hh:mm'
            );
            this.hideLoading();
          })
          .catch(() => {
            this.hideLoading();
          });
      } else {
        this.transferData = new Transfer(0);
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
    onSubmit() {
      console.log('a');
    },
  },
});
</script>
