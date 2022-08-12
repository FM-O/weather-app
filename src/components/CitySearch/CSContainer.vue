<script setup lang="ts">
import CForm from "@/components/CitySearch/CSForm.vue";

import {
  focusedCoordinates,
  useWeather,
} from "@/components/Weather/useWeather";

const { fetchWeatherByCoords } = useWeather();
</script>

<template>
  <div>
    <CForm />

    {{ focusedCoordinates.lat }}
    {{ focusedCoordinates.lon }}

    <button @click="fetchWeatherByCoords()">get Weather</button>
  </div>
</template>
