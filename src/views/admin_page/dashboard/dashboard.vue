<template>
  <div class="dashboard">
    <!-- Top stats -->
    <div class="stats-row">
      <div class="stat-card" v-for="(item, i) in stats" :key="i">
        <div class="stat-value">{{ item.value }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts">
      <div class="chart-box">
        <div ref="barChartRef" class="chart"></div>
      </div>
      <div class="chart-box">
        <div ref="radarChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// All comments in English
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

// Stats
const stats = [
  { label: "Total Students", value: 25 },
  { label: "Total Test Paper", value: 10 },
  { label: "Total Questions", value: 25 },
  { label: "Total Test Attempt", value: 50 },
];

// Chart refs
const barChartRef = ref(null);
const radarChartRef = ref(null);

onMounted(() => {
  initBarChart();
  initRadarChart();
});

// Bar chart
function initBarChart() {
  const chart = echarts.init(barChartRef.value);
  chart.setOption({
    title: { text: "Number of Questions per Category", left: "center" },
    tooltip: {},
    xAxis: {
      type: "category",
      data: ["Vocabulary", "Grammar", "Listening", "Reading", "Writing"],
    },
    yAxis: {
      type: "value",
      name: "Number of Questions",
    },
    series: [
      {
        data: [12, 15, 9, 10, 6],
        type: "bar",
        itemStyle: { color: "#f8b400" },
      },
    ],
  });
}

// Radar chart
function initRadarChart() {
  const chart = echarts.init(radarChartRef.value);
  chart.setOption({
    title: { text: "Average Score per Question Category (Radar Chart)", left: "center" },
    tooltip: {},
    radar: {
      indicator: [
        { name: "Vocabulary", max: 100 },
        { name: "Grammar", max: 100 },
        { name: "Listening", max: 100 },
        { name: "Reading", max: 100 },
        { name: "Writing", max: 100 },
      ],
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: [80, 85, 75, 78, 65],
            areaStyle: { color: "rgba(255,165,0,0.5)" },
            lineStyle: { color: "#ffa500" },
          },
        ],
      },
    ],
  });
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

.charts {
  display: flex;
  gap: 20px;
}

.chart-box {
  flex: 1;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
}

.chart {
  width: 100%;
  height: 360px;
}
</style>
