<script setup lang="ts">
import WTimeSlotItem from "@/components/Weather/WTimeSlotItem.vue";
import { weatherState } from "@/components/Weather/useWeather";

console.log(weatherState);
</script>

<template>
  <div class="w-timeslot-list">
    <WTimeSlotItem
      v-for="(timeSlot, index) in weatherState.weatherTimeSlots"
      :key="index"
      :weather="timeSlot"
    />
  </div>
</template>

<style scoped>
.w-timeslot-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}
</style>
