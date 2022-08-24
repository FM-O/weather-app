<script setup lang="ts">
import WTimeSlotItem from "@/components/Weather/WTimeSlotItem.vue";
import { weatherState } from "@/components/Weather/useWeather";
</script>

<template>
  <div class="w-timeslot-list" data-cy="weather-timeslots-container">
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

@media screen and (min-width: 1024px) {
  .w-timeslot-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
