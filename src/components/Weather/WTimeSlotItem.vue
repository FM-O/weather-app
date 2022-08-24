<script setup lang="ts">
import SunnyIcon from "@/components/assets/SunnyIcon.vue";
import RainyIcon from "@/components/assets/RainyIcon.vue";
import CloudyIcon from "@/components/assets/CloudyIcon.vue";
import WindIcon from "@/components/assets/WindIcon.vue";
import HumidityIcon from "@/components/assets/HumidityIcon.vue";

import Highcharts from "highcharts";

import { computed } from "vue";
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
});

const trendIcon = computed(() => {
  const w = props.weather.trend;

  switch (w) {
    case "Clear":
      return SunnyIcon;
    case "Clouds":
      return CloudyIcon;
    case "Rain":
      return RainyIcon;
    default:
      return SunnyIcon;
  }
});

const formatDate = (date: string) => {
  const time = new Highcharts.Time({});
  const timestamp = Date.parse(date);

  return isNaN(timestamp) ? date : time.dateFormat("%A %b %H:%M:%S", timestamp);
};
</script>

<template>
  <div class="w-item">
    <div class="w-item-date">
      {{ formatDate(weather.dt) }}
    </div>
    <div class="w-item-trend">
      <keep-alive>
        <component class="trend-icon" v-bind:is="trendIcon"></component>
      </keep-alive>
      <div class="w-item-description">{{ weather.description }}</div>
    </div>
    <div class="w-item-temp">{{ weather.temp }}</div>
    <div class="w-item-min-temp">Lowest temp: {{ weather.min_temp }}</div>
    <div class="w-item-max-temp">Highest temp: {{ weather.max_temp }}</div>
    <div class="w-item-wind">
      <WindIcon class="wind-icon" />
      {{ weather.wind }}
    </div>
    <div class="w-item-humidity">
      <HumidityIcon class="humidity-icon" />
      {{ weather.humidity }}
    </div>
  </div>
</template>

<style scoped>
.w-item {
  border: 2px solid #cee32d;
  padding: 1rem;
  color: var(--color-text);
}

.w-item-date {
  margin-bottom: 1rem;
  background-color: whitesmoke;
  padding: 1rem;
  font-size: 1.4rem;
  color: #2c2c2c;
}

.w-item-trend {
  display: flex;
  align-items: center;
}

.w-item-trend .trend-icon {
  margin-right: 1rem;
}

.w-item-description {
  font-size: 1.6rem;
}

.w-item-temp {
  margin-top: 1rem;
  font-size: 2.4rem;
}

.w-item-wind {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
}

.wind-icon {
  transform: scale(0.5);
  width: 48px;
  height: 48px;
}

.w-item-humidity {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
}
.humidity-icon {
  transform: scale(0.5);
  width: 48px;
  height: 48px;
}
</style>
