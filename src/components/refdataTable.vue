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
            <td class="mint-cell text-center font-xs">{{ data.fullseason }}</td>
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
<!-- BarcodeDisplay.vue -->
<template>
  <div>
    <VueQrcodeReader @onDecode="onDecode" />
    <canvas ref="barcodeCanvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { VueQrcodeReader } from 'vue-qrcode-reader';
import bwipjs from 'bwip-js';

export default defineComponent({
  components: {
    VueQrcodeReader,
  },
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    onMounted(() => {
      // Lógica adicional que puede necesitar al iniciar el componente
    });

    const onDecode = (data: string) => {
      generateBarcode(data);
    };

    const generateBarcode = async (data: string) => {
      try {
        const format = 'CODE128';

        const canvas = canvasRef.value;
        const context = canvas?.getContext('2d');

        if (canvas && context) {
          // Limpia el canvas antes de generar un nuevo código de barras
          context.clearRect(0, 0, canvas.width, canvas.height);

          await bwipjs.toCanvas(canvas, {
            bcid: format,
            text: data,
            scale: 3,
            includetext: true,
            textxalign: 'center',
          });
        }
      } catch (error) {
        console.error(`Error al generar el código de barras: ${error}`);
      }
    };

    return {
      canvasRef,
      onDecode,
    };
  },
});
</script>
