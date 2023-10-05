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
            <th class="mint-reverse font-xs">Referencia</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs">
              {{ data.supplierReferenceNumber }}
            </td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs">Temporada</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs">{{ data.fullSeason }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs">Marca</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs">{{ data.brand }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs">Sección</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs">{{ data.section }}</td>
          </tr>
          <tr>
            <th class="mint-reverse font-xs">Family</th>
          </tr>
          <tr>
            <td class="mint-cell text-center font-xs">{{ data.family }}</td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { ItemInfo } from '../interfaces/ItemData';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'refdataTableComponent',
  props: {
    data: {} as ItemInfo,
  },
});
</script>
