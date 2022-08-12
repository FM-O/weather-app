<script setup lang="ts">
import { weatherState } from "@/components/Weather/useWeather";
</script>

<template>
  <div>
    <ul>
      <li
        v-for="(timeSlot, index) in weatherState.weatherTimeSlots"
        :key="index"
      >
        {{ timeSlot }}
      </li>
    </ul>
  </div>
</template>
