<template>
  <div>
    <input v-model="barcodeData" placeholder="Introduce el texto para el código de barras" />
    <button @click="generateBarcode">Generar Código de Barras</button>
    <canvas ref="barcodeCanvas" />
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
  methods: {
    async generateBarcode() {
      const canvas = this.$refs.barcodeCanvas;
      const context = canvas.getContext('2d');

      if (context) {
        // Limpia el canvas antes de generar un nuevo código de barras
        context.clearRect(0, 0, canvas.width, canvas.height);

        try {
          //const format = 'CODE128';

          // Genera el código de barras utilizando bwip-js
          await bwipjs.toCanvas(canvas, {
            bcid: 'code128',
            text: this.barcodeData,
            scale: 3,
            includetext: true,
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
canvas {
  border: 1px solid #ccc;
  margin-top: 20px;
}
</style>
