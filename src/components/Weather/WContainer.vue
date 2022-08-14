<script setup lang="ts">
import { weatherState } from "@/components/Weather/useWeather";
import { reactive, ref, watch } from "vue";
import VueHighcharts from "vue3-highcharts";
import Highcharts from "Highcharts";
import {
  focusedCoordinates,
  useWeather,
} from "@/components/Weather/useWeather";
import WTimeSlotList from "./WTimeSlotList.vue";

const { fetchWeatherByCoords } = useWeather();

const displayChart = ref(false);

const chartOptions = reactive({
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      // don't display the dummy year
      month: "%e. %b",
      year: "%b",
    },
    title: {
      text: "Date",
    },
  },
  yAxis: {
    title: {
      text: "temperatures (celsius)",
    },
  },
  series: [
    {
      data: [[]], // sample data
    } as { data: any }, // type hack
  ],
});

watch(weatherState, (v) => {
  if (v.temperatures.length) {
    // Better to transform the coordinates into a dedicated feature (composable) or into useWeather
    chartOptions.series[0].data = v.temperatures.map((temp, index) => {
      const time = new Highcharts.Time({});

      return [
        time.dateFormat("%Y-%m-%d %H:%M:%S", v.dates[index] * 1000),
        temp,
      ];
    });
    displayChart.value = true;
  }
});
</script>

<template>
  <div class="w-container">
    {{ focusedCoordinates.lat }}
    {{ focusedCoordinates.lon }}

    <button
      v-if="focusedCoordinates.lat && focusedCoordinates.lon"
      @click="fetchWeatherByCoords()"
    >
      Get weather
    </button>
    <VueHighcharts v-if="displayChart" :options="chartOptions" />
    <WTimeSlotList />
  </div>
</template>

<style scoped>
.w-container {
  margin-top: 2rem;
}
.w-container button {
  border: 2px solid #cee32d;
  background-color: transparent;
  padding: 1rem 2rem;

  cursor: pointer;
  color: whitesmoke;
}

.w-container button:hover {
  background-color: #cee32d;
  color: #2c2c2c;
}
</style>
