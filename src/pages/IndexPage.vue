<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-12 q-pa-md">
      <ul class="voucher-list">
        <voucher-card-item v-for="voucher in vouchers" :key="voucher.id" :voucher="voucher" />
      </ul>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.voucher-list {
  list-style-type: none;
  padding: 0;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

import VoucherCardItem from 'src/components/GiftCard/VoucherCardItem.vue';

const logo = 'https://logos-world.net/wp-content/uploads/2022/04/Coles-Symbol.png'
const vouchers = [
  { id: '1', code: '123', pin: '1234', balance: 100, originalBalance: 200, merchant: 'coles', logo }
]
</script>
