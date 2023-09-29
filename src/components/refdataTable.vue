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
            <th class="mint-reverse">Referencia</th>
          </tr>
          <tr>
            <td class="mint-cell text-center">
              {{ data.supplierReferenceNumber }}
            </td>
          </tr>
          <tr>
            <th class="mint-reverse">Temporada</th>
          </tr>
          <tr>
            <td class="mint-cell text-center">FW22{{ data.fullseason }}</td>
          </tr>
          <tr>
            <th class="mint-reverse">Marca</th>
          </tr>
          <tr>
            <td class="mint-cell text-center">{{ data.brand }}</td>
          </tr>
          <tr>
            <th class="mint-reverse">Sección</th>
          </tr>
          <tr>
            <td class="mint-cell text-center">{{ data.section }}</td>
          </tr>
          <tr>
            <th class="mint-reverse">Family</th>
          </tr>
          <tr>
            <td class="mint-cell text-center">{{ data.family }}</td>
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
