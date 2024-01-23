<template>
  <div class="row">
    <div class="col-4 q-pr-md">
      <q-img :src="data.urlPhoto" :ratio="1" fit="scale-down"
        ><template v-slot:error>
          <div class="absolute-full flex flex-center text-white">
            <q-icon name="no_photography" size="xl" />
          </div>
        </template>
      </q-img>
    </div>
    <div class="col-8">
      <table style="width: 100%">
        <thead>
          <tr>
            <th class="mint-reverse font-xs" colspan="2">Referencia</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs" colspan="2">
              {{ data.supplierReferenceNumber }}
            </td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs" colspan="2">Temporada</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs" colspan="2">{{ data.fullSeason }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs" colspan="2">Marca</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs" colspan="2">{{ data.brand }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs" colspan="2">Sección</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs" colspan="2">{{ data.section }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs" colspan="2">Family</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs" colspan="2">{{ data.family }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs">PVP</th>
            <th class="mint-reverse font-xs">PVP Rebaja</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs">{{ data.price }}</td>
            <td class="mint-cell text-center font-xs">{{ data.salePrice }}</td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { ItemInfo } from "../interfaces/ItemData";
import { defineComponent } from "vue";

export default defineComponent({
  name: "refdataTableComponent",
  props: {
    data: {
      type: Object as () => ItemInfo, // Especificar el tipo
      default: {} as ItemInfo, // Valor por defecto
    },
  },
});
</script>



