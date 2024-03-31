<template>
  <div class="container">
    <div class="container_numbers">
      <div class="container_numbers-price" :class="{ highlight: price < targetPrice }">
        Price:
        <span class="container_numbers-price-info">{{ price }}€</span>
      </div>
      <div class="container_numbers-sellers" :class="{ highlight: sellers > targetSellers }">
        <span class="container_numbers-sellers-info">{{ sellers }}</span> Sellers
      </div>
    </div>
    <div class="container_img">
      <img width="100px" src="../assets/bitcoin.png" alt="bitcoin" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import io from 'socket.io-client'

const price = ref(1)
const targetPrice = ref(8)
const sellers = ref(2)
const targetSellers = ref(1)
let priceIntervalId = null
let sellersIntervalId = null

const socket = io('http://localhost:5173')

const numberStepper = (number, numberTarget, isPrice) => {
  const step = number < numberTarget ? 1 : -1
  const intervalId = setInterval(() => {
    if (number === numberTarget) {
      clearInterval(intervalId)
      return
    }
    number += step
    if (isPrice) price.value = number
    else sellers.value = number
  }, 100)
  return intervalId
}

onMounted(() => {
  // Listen for 'bitcoin' event from the server
  socket.on('bitcoin', (data) => {
    targetPrice.value = data.price
    targetSellers.value = data.sellers
  })
  priceIntervalId = numberStepper(price.value, targetPrice.value, true)
  sellersIntervalId = numberStepper(sellers.value, targetSellers.value, false)
})

onBeforeUnmount(() => {
  clearInterval(priceIntervalId)
  clearInterval(sellersIntervalId)
})

watch(
  targetPrice,
  (newTarget) => {
    clearInterval(priceIntervalId)
    priceIntervalId = numberStepper(price.value, newTarget, true)
  },
  { immediate: true }
)

watch(
  targetSellers,
  (newTarget) => {
    clearInterval(sellersIntervalId)
    sellersIntervalId = numberStepper(sellers.value, newTarget, false)
  },
  { immediate: true }
)
</script>
