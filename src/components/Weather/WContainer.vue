<script setup lang="ts">
import { weatherState } from "@/components/Weather/useWeather";
import { reactive, ref, watch } from "vue";
import VueHighcharts from "vue3-highcharts";

const displayChart = ref(false);

const chartOptions = reactive({
  series: [
    {
      data: [], // sample data
    },
  ],
});

watch(weatherState, (v) => {
  if (v.temperatures.length) {
    chartOptions.series[0].data = v.temperatures;
    displayChart.value = true;
  }
});
</script>

<template>
  <div>
    <VueHighcharts v-if="displayChart" :options="chartOptions" />
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
