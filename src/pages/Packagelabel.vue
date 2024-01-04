<template>
  <div>
    <div class="packagelabel">
      <q-img src="~assets/mint.png" width="40px"/>
      <div class="barcode-container">
        <canvas ref="barcodeCanvas" style="width: 200px; height: 50px;" />
        <q-label class="bulto-label"><b>Bulto:</b> {{ packageid }}</q-label>
      </div>
    </div>
  </div>
</template>
<script>
import bwipjs from 'bwip-js';

export default {
  data() {
    return {
      barcodeData: '', // Texto para el código de barras
    };
  },
  props: {
    packageid: String,
  },
  watch: {
    packageid() {
      this.barcodeData = this.packageid;
      this.generateBarcode();
    },
  },
  mounted() {
    this.barcodeData = this.packageid;
    this.generateBarcode();
  },
  methods: {
    async generateBarcode() {
      const canvas = this.$refs.barcodeCanvas;
      const context = canvas.getContext('2d');

      if (context) {
        // Limpia el canvas antes de generar un nuevo código de barras
        context.clearRect(0, 0, canvas.width, canvas.height);

        try {
          const format = 'code128';

          // Genera el código de barras utilizando bwip-js
          await bwipjs.toCanvas(canvas, {
            bcid: format,
            text: this.barcodeData,
            scale: 3,
            includetext: false,
            textxalign: 'center',
          });
        } catch (error) {
          console.error(`Error al generar el código de barras: ${error}`);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales para el componente */
.packagelabel {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.barcode-container {
  text-align: center;
  margin-top: 10px; /* Ajusta según sea necesario */
}

canvas {
  margin: 20px;
}

.bulto-label {
  margin-top: 5px; /* Ajusta según sea necesario */
}
</style>
