<template>
  <li class="voucher">
    <div class="column fit">
      <!-- Banner -->
      <div class="col-auto banner row items-center q-px-md">
        <span class="col-12 ">
          {{ voucher.merchant }}
        </span>
      </div>

      <!-- Content -->
      <div class="col column justify-between">
        <div class="col-auto row justify-between">
          <!-- Logo -->
          <div class="col-12 q-pt-lg q-px-xl">
            <q-img :src="voucher.logo" :ratio="16/9" class="logo" />
          </div>
          <div class="col-12 row justify-between q-pa-lg">
            <!-- Card No. -->
            <div class="col-auto card_number">
              <span class="text-weight-light">Card No.</span>
              <span class="text-weight-bold q-px-sm">{{ voucher.code }}</span>
            </div>
            <!-- Pin -->
            <div class="col-auto pin">
              <span class="text-weight-light">PIN</span>
              <span class="text-weight-bold q-px-sm">{{ voucher.pin }}</span>
            </div>
            <!-- Balance -->
            <div class="col-12 row">
              <div class="col-12 row q-py-md">
                <span class="col-12 text-weight-light ">Remaining Balance</span>
                <span class="col-12 text-h5 text-weight-bold">${{ voucher.balance }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Barcode -->
        <div class="col-auto row q-pb-md">
          <div class="col-12 barcode-container row justify-center">
            <!-- <img id="barcode-img" class="col-auto barcode" /> -->
            <BarcodeHDR />
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.voucher {
  width: 100%;
  // height: 60vh;
  border-radius: 1em;
  overflow: hidden;
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
  background-color: white;
}
.banner {
  height: 3em;
  background-color: $primary;
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}
.balance {
  height: 5em;
  background-color: $grey-1;
  border-radius: 0.5em;

}
.logo {
  padding: 0 1em;
  border-radius: 1em;
  overflow: hidden;
}
.barcode {
  filter: brightness(2)
}
</style>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import bwipjs from 'bwip-js'
import BarcodeHDR from './BarcodeHDR.vue';

interface VoucherCardItemProps {
  voucher: Voucher;
}

const props = withDefaults(defineProps<VoucherCardItemProps>(), {
  voucher: () => ({
    id: '',
    code: '',
    pin: '',
    balance: 0,
    originalBalance: 0,

    merchant: '',
    logo: ''
  })
})

const generateBarcode = () => {
  let options = {
        bcid:        'code128',       // Barcode type
        text:        props.voucher.code,    // Text to encode
        height:      12,              // Bar height, in millimeters
        includetext: false,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
        textcolor:   'ff0000',        // Red text
    };

  let canvas = document.createElement('canvas');
  try {
      bwipjs.toCanvas(canvas, options);
      document.getElementById('barcode-img').src = canvas.toDataURL('image/png');
  } catch (e) {
      // `e` may be a string or Error object
  }
}

onMounted(() => {
  generateBarcode();
})


</script>