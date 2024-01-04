<template>
  <div>
    <q-btn
      dense
      icon="alarm"
      color="black"
      round
      title="Stock solicitado"
      @click="$router.replace('/stockrequested')"
    >
      <q-badge color="red" floating>{{ RequestedStock }}</q-badge>
    </q-btn>
    <q-btn
      dense
      color="blue"
      round
      icon="move_down"
      class="q-ml-md"
      title="Transferencias entrada"
      @click="$router.replace('/transfersin')"
    >
      <q-badge color="red" floating>{{ TransferIn }}</q-badge>
    </q-btn>
    <q-btn
      dense
      color="green"
      round
      icon="move_up"
      class="q-ml-md"
      title="Transferencias salida"
      @click="$router.replace('/transfersout')"
    >
      <q-badge color="red" floating>{{ TransfersOut }}</q-badge>
    </q-btn>
    <q-btn
      dense
      color="orange"
      round
      icon="alarm"
      class="q-ml-md"
      title="Reservas abiertas"
      @click="$router.replace('/reservas')"
    >
      <q-badge color="red" floating>{{ Reservations }}</q-badge>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { useWhsStore } from "../stores/whs";
import { defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  name: "NotificationBadges",
  setup() {
    const store = useWhsStore();
    return {
      store,
    };
  },
  data() {
    this.store.$subscribe(() => {
      this.getNotifications();
    });
    return {
      RequestedStock: 0 as number,
      TransfersOut: 0 as number,
      TransferIn: 0 as number,
      Reservations: 0 as number,
    };
  },

  methods: {
    getNotifications() {
      axios
        .get(
          `${this.store.options["ApiEndPoint"]}/NotifyWhsStatus/${this.store.getCurrentWhsCode.whsCode}/`
        )
        .then((x) => {
          this.RequestedStock = x.data.requestedStock;
          this.TransfersOut = x.data.transfersOut;
          this.TransferIn = x.data.transfersIn;
          this.Reservations = x.data.reservations;
        })
        .catch((err) => console.log("Axios err: ", err));
    },
  },
  mounted() {
    this.RequestedStock = 0;
    this.TransfersOut = 0;
    this.TransferIn = 0;
    this.Reservations = 0;
    this.getNotifications();
    setInterval(() => this.getNotifications(), 300000);
  },
});
</script>
