<template>
  <login :show-login="showlogin" :resourceid="resourceid" @token="getToken">
  </login>
  <table style="width: 100%">
    <thead>
      <tr>
        <th></th>
        <th v-for="t in sortedTitles" :key="t" class="mint font-xs">
          {{ getWhsName(t) }}
        </th>
      </tr>
      <tr>
        <th></th>
        <th v-for="t in sortedTitles" :key="t" class="mint-reverse font-xs">
          {{ t }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in stock" :key="index">
        <td class="mint-reverse font-xs" nowrap>
          {{ item.itemCode }} {{ item.size }}
        </td>
        <td
          :class="{
            'text-right table-border mint-cell':
              wItem.whsCode != currentStore && !isWarehouse(wItem.whsCode),
            'text-right table-border store-cell mint-cell':
              wItem.whsCode == currentStore,
            'text-right table-border mint-green': isWarehouse(wItem.whsCode),
          }"
          v-for="(wItem, index) in item.stockInfo"
          :key="item.itemCode + '-' + index"
        >
          <template v-if="wItem.onHand != 0">
            <div v-if="wItem.whsCode == currentStore">
              <div class="row">
                <div class="col-1">
                  <q-btn
                    title="Solicitar a almacen de tienda"
                    icon="warehouse"
                    class="mint"
                    dense
                    @click="requestStock(wItem.itemCode)"
                  ></q-btn>
                </div>
                <div class="col">
                  {{ wItem.onHand }}
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="availableWhs(wItem.whsCode)">
                <q-radio
                  v-model="stockSelected"
                  :val="wItem.itemCode + '-' + wItem.whsCode"
                  :label="wItem.onHand.toString()"
                  dense
                  color="black"
                  size="xs"
                  v-if="wItem.onHand > 0"
                />
              </div>
              <div v-else>{{ wItem.onHand }}</div>
            </div>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="row">
    <div class="col-right">
      <q-checkbox v-model="urgent" label="Urgente" color="red" />
      <q-checkbox v-model="deliveryMan" label="Repartidor" color="black" />
    </div>
    <q-separator inset></q-separator>
    <div class="col-left">
      <q-input
        v-model="needDateTime"
        mask="time"
        :rules="['time']"
        dense
        label-color="black"
        label="Hora Recogida"
        readonly
        required
        v-if="deliveryMan"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="needDateTime" color="black">
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
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col text-right">
      <q-btn
        icon="local_shipping"
        label="Solicitar"
        class="mint-reverse"
        @click="requestTransfer()"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { stockTable, whsconfig } from 'src/Interfaces/TransferInterfaces';
import { useWhsStore } from '../stores/whs';
import { defineComponent, PropType } from 'vue';
import Login from '../components/Login.vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { Transfer } from 'src/ts/Transfer';

export default defineComponent({
  name: 'stockTableComponent',
  components: { Login },
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
      scrollPosition: 0 as number,
      currentStore: '' as string,
      sortedTitles: [] as string[],
      showlogin: false as boolean,
      resourceid: 0 as number,
      token: '' as string,
      stockSelected: '' as string,
      urgent: true as boolean,
      deliveryMan: false as boolean,
      itemcode: '' as string,
      action: '' as string,
      whsFrom: '' as string,
      whsTo: '' as string,
      needDateTime: '09:00' as string,
    };
  },

  props: {
    stock: {
      type: Array as PropType<stockTable[]>,
      default: () => [],
    },
    titles: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    whsconfig: {
      type: Array as PropType<whsconfig[]>,
      default: () => [],
    },
  },
  watch: {
    titles() {
      this.sortTitles();
    },
  },
  mounted() {
    this.currentStore = this.store.getCurrentWhsCode.whsCode as string;
    this.sortTitles();
    window.addEventListener(
      'scroll',
      () => (this.scrollPosition = window.scrollY)
    );
  },
  methods: {
    getWhsName(whscode: string) {
      if (whscode != '') {
        let filteredArray = this.whsconfig
          .filter((element) =>
            element.whsCodes.some((subElement) => subElement.whsCode == whscode)
          )
          .map((element) => {
            return element.whsCodes.filter((x) => x.whsCode == whscode);
          });

        return filteredArray[0][0]['whsName'] != undefined
          ? filteredArray[0][0]['whsName']
          : '';
      }
    },
    availableWhs(whscode: string) {
      if (whscode != '') {
        let filteredArray = this.whsconfig
          .filter((e) => e.businessUnitId != 5)
          .filter((element) =>
            element.whsCodes.some((subElement) => subElement.whsCode == whscode)
          )
          .map((element) => {
            return element.whsCodes.filter((x) => x.whsCode == whscode);
          });

        if (filteredArray.length > 0) {
          if (filteredArray[0][0]['type'] != 'A') {
            return 1;
          }
        }

        return 0;
      }
    },
    isWarehouse(whscode: string) {
      if (whscode != '') {
        let filteredArray = this.whsconfig
          .filter((e) => e.businessUnitId != 5)
          .filter((element) =>
            element.whsCodes.some((subElement) => subElement.whsCode == whscode)
          )
          .map((element) => {
            return element.whsCodes.filter((x) => x.whsCode == whscode);
          });

        if (filteredArray.length > 0) {
          if (filteredArray[0][0]['type'] == 'A') {
            return 1;
          }
        }

        return 0;
      }
    },
    showWhs(whscode: string) {
      if (whscode != '') {
        let filteredArray = this.whsconfig
          .filter((e) => e.businessUnitId != 5)
          .filter((element) =>
            element.whsCodes.some((subElement) => subElement.whsCode == whscode)
          )
          .map((element) => {
            return element.whsCodes.filter((x) => x.whsCode == whscode);
          });

        if (filteredArray.length > 0) return 1;

        return 0;
      }
    },
    sortTitles() {
      this.sortedTitles = this.titles;
      this.sortedTitles = this.sortedTitles.sort((a, b) => {
        if (a == this.currentStore) return -1;
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    },
    requestStock(itemcode: string) {
      this.action = 'requestStock';
      this.itemcode = itemcode;
      this.resourceid = 3;
      this.showlogin = true;
    },
    requestTransfer() {
      if ((this.stockSelected == '') | (this.stockSelected == undefined)) {
        this.showlogin = false;
        this.$q.notify({
          type: 'negative',
          message: 'Debe seleccionar un artículo',
        });
      } else {
        this.action = 'requestTransfer';
        this.itemcode = this.stockSelected.split('-')[0];
        this.whsFrom = this.stockSelected.split('-')[1];
        this.whsTo = this.store.getCurrentWhsCode.whsCode;
        this.resourceid = 2;
        this.showlogin = true;
      }
    },
    getToken() {
      let token = this.store.getToken as string;

      if (token == '') {
        this.showlogin = false;
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        switch (this.action) {
          case 'requestStock':
            this.createRequest();
            break;
          case 'requestTransfer':
            this.createTransfer();
            break;
        }
      }
    },

    createRequest() {
      this.showLoading();
      let token = this.store.getToken as string;
      if (token == '') {
        this.showlogin = false;
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        return axios

          .put(
            `${this.store.options['ApiEndPoint']}/Stock/Requested/create`,
            {
              WhsCode: this.store.getCurrentWhsCode.whsCode,
              ItemCode: this.itemcode,
            },
            config
          )
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: 'Se ha confirmado con éxito',
            });
            this.itemcode = '';
            this.token = '';
            this.showlogin = false;
            this.hideLoading();
          })
          .catch(() => {
            this.$q.notify({
              type: 'negative',
              message: 'Error al confirmar el envío',
            });
            this.itemcode = '';
            this.token = '';
            this.showlogin = false;
            this.hideLoading();
          });
      }
    },
    createTransfer() {
      let token = this.store.getToken as string;
      if (token == '') {
        this.showlogin = false;
        this.$q.notify({
          type: 'negative',
          message: this.store.getLastError,
        });
      } else {
        let TransferData = new Transfer(0);

        TransferData.title = this.urgent ? 'Interstore Urgente' : 'Interstore';
        TransferData.whsFrom = this.whsFrom;
        TransferData.whsTo = this.whsTo;
        TransferData.salesPerson = '';
        TransferData.status = 'SC';
        TransferData.type = this.urgent ? 3 : 4;
        TransferData.dateCreated = '';
        TransferData.dateSend = '';
        TransferData.dateRec = '';
        TransferData.urgent = this.urgent;
        TransferData.salesRepCreate = '';
        TransferData.salesRepSent = '';
        TransferData.salesRepReceived = '';
        TransferData.deliveryMan = this.deliveryMan;
        TransferData.needDateTime = this.needDateTime;
        TransferData.addLine(this.itemcode).then(() => {
          this.showLoading();
          TransferData.createTransfer()
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Transferencia creada con éxito',
              });
              this.hideLoading();
              this.itemcode = '';
              this.stockSelected = '';
              this.showlogin = false;
              this.deliveryMan = false;
              this.needDateTime = '09:00';
              this.urgent = true;
            })
            .catch(() => {
              this.hideLoading();
              this.$q.notify({
                type: 'negative',
                message:
                  'No se ha podido crear la transferencia, intentelo más tarde',
              });
              this.itemcode = '';
              this.stockSelected = '';
              this.showlogin = false;
              this.deliveryMan = false;
              this.needDateTime = '09:00';
              this.urgent = true;
            });
        });
      }
    },
  },
});
</script>
<style>
.table-border {
  border-bottom: 1px solid #0000001f !important;
}
.column-header {
  background-color: #ffda00 !important;
}

table thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
}

table tbody td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  padding: 5px !important;
}

table thead {
  position: sticky;
  z-index: 1;
}
.scroll-big {
  inset-block-start: 0px; /* "top" */
  background-color: rgb(142, 199, 255) !important;
}
.scroll-normal {
  inset-block-start: 52px; /* "top" */
  background-color: rgb(142, 199, 255) !important;
}
.store-cell {
  background-color: #ffd9004a !important;
}
td {
  width: 100px;
}
</style>
