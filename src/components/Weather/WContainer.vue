<script setup lang="ts">
import { weatherState } from "@/components/Weather/useWeather";
import { reactive, ref, watch } from "vue";
import VueHighcharts from "vue3-highcharts";
import * as Highcharts from "highcharts";

import {
  focusedCoordinates,
  useWeather,
} from "@/components/Weather/useWeather";
import WTimeSlotList from "./WTimeSlotList.vue";

const { fetchWeatherByCoords, updateWeatherState } = useWeather();

const displayChart = ref(false);

const chartOptions = reactive({
  title: {
    text: "Temperatures evolution within the 5 days",
    style: { color: "var(--color-text)" },
  },
  colors: [
    "#cee32d",
    "#ff0000",
    "#8bbc21",
    "#910000",
    "#1aadce",
    "#492970",
    "#f28f43",
    "#77a1e5",
    "#c42525",
    "#a6c96a",
  ],
  chart: {
    backgroundColor: "var(--color-background)",
  },
  legend: {
    itemStyle: { color: "var(--color-text)" },
    itemHoverStyle: { color: "#cee32d" },
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      // don't display the dummy year
      month: "%e. %b",
      year: "%b",
    },
    labels: {
      style: { color: "var(--color-text)" },
    },
    title: {
      text: "Date",
      style: { color: "var(--color-text)" },
    },
  },
  yAxis: {
    labels: {
      style: { color: "var(--color-text)" },
    },
    title: {
      text: "temperatures (celsius)",
      style: { color: "var(--color-text)" },
    },
  },
  series: weatherState.series,
});

watch(weatherState, (v) => {
  // TEMPORARY HACK TO REFRESH GRAPH
  displayChart.value = false;

  chartOptions.series = weatherState.series;

  setTimeout(() => {
    displayChart.value = true;
  }, 500);
  // if (v.temperatures.length) {
  //   // Better to transform the coordinates into a dedicated feature (composable) or into useWeather
  //   chartOptions.series[0].data = v.temperatures.map((temp, index) => {
  //     const time = new Highcharts.Time({});

  //     return [
  //       time.dateFormat("%Y-%m-%d %H:%M:%S", v.dates[index] * 1000),
  //       temp,
  //     ];
  //   });
  //   console.log(weatherState.series);

  //   // chartOptions.series = [chartOptions.series[0], ...weatherState.series];
  //   displayChart.value = true;
  // }
});

const getWeatherForCity = async () => {
  weatherState.series = [];
  displayChart.value = false;

  const cityWeatherData = await fetchWeatherByCoords();

  updateWeatherState(cityWeatherData);

  if (weatherState.temperatures.length) {
    // Better to transform the coordinates into a dedicated feature (composable) or into useWeather
    weatherState.series[0] = {
      data: weatherState.temperatures.map((temp, index) => {
        const time = new Highcharts.Time({});

        return [
          time.dateFormat(
            "%Y-%m-%d %H:%M:%S",
            weatherState.dates[index] * 1000
          ),
          temp,
        ];
      }),
    } as never; // HACK ==== NEED TO CHANGE;

    // chartOptions.series = [chartOptions.series[0], ...weatherState.series];
    displayChart.value = true;
  }
};
</script>

<template>
  <div class="w-container">
    <button
      data-cy="get-weather-button"
      v-if="focusedCoordinates.lat && focusedCoordinates.lon"
      @click="getWeatherForCity()"
    >
      Get weather (currently selected city)
    </button>
    <VueHighcharts
      class="w-highcharts"
      v-if="displayChart"
      :options="chartOptions"
    />
    <WTimeSlotList />
  </div>
</template>

<style scoped>
.w-container {
  margin-top: 2rem;
}

.w-highcharts {
  margin-top: 1.5rem;
}

.w-container button {
  border: 2px solid #cee32d;
  background-color: transparent;
  padding: 1rem 2rem;

  cursor: pointer;
  color: var(--color-text);
}

.w-container button:hover {
  background-color: #cee32d;
  color: #2c2c2c;
}
</style>
