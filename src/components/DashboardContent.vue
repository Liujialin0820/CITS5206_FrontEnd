<template>
    {{ authStore.user }}
  <div class="dashboard">
    <!-- 顶部统计卡片 -->
    <div class="stats">
      <el-card class="stat">
        <div class="num">{{ display(stats.students) }}</div>
        <div class="label">Total Students</div>
      </el-card>
      <el-card class="stat">
        <div class="num">{{ display(stats.testPapers) }}</div>
        <div class="label">Total Test Paper</div>
      </el-card>
      <el-card class="stat">
        <div class="num">{{ display(stats.questions) }}</div>
        <div class="label">Total Questions</div>
      </el-card>
      <el-card class="stat">
        <div class="num">{{ display(stats.attempts) }}</div>
        <div class="label">Total Test Attempt</div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts">
      <el-card class="chart-card">
        <div ref="barRef" class="chart"></div>
      </el-card>
      <el-card class="chart-card">
        <div ref="radarRef" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as echarts from "echarts";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const props = defineProps({
  stats: { type: Object, default: () => ({}) },
  categories: { type: Array, default: () => [] },
  barData: { type: Array, default: () => [] },
  radarIndicators: { type: Array, default: () => [] }, // [{ name, max? }, ...]
  radarData: { type: Array, default: () => [] }, // [values...]
});

function display(val) {
  return typeof val === "number" ? val : "—";
}

const barRef = ref(null);
let barChart = null;

const radarRef = ref(null);
let radarChart = null;

function renderBar() {
  if (!barRef.value) return;
  if (!barChart) barChart = echarts.init(barRef.value);
  barChart.setOption({
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: props.categories,
      axisTick: { alignWithLabel: true },
    },
    yAxis: { type: "value", splitLine: { show: true } },
    series: [
      {
        type: "bar",
        data: props.barData,
        barMaxWidth: 40,
        itemStyle: { borderRadius: [6, 6, 0, 0] },
      },
    ],
  });
}

function renderRadar() {
  if (!radarRef.value) return;
  if (!radarChart) radarChart = echarts.init(radarRef.value);
  radarChart.setOption({
    tooltip: {},
    radar: {
      indicator: props.radarIndicators,
      splitArea: { show: true },
    },
    series: [
      {
        type: "radar",
        areaStyle: {},
        data: [{ value: props.radarData }],
      },
    ],
  });
}

function resize() {
  barChart && barChart.resize();
  radarChart && radarChart.resize();
}

onMounted(() => {
  renderBar();
  renderRadar();
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  barChart && barChart.dispose();
  radarChart && radarChart.dispose();
});

watch(() => [props.barData, props.categories], renderBar, { deep: true });
watch(() => [props.radarData, props.radarIndicators], renderRadar, {
  deep: true,
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 16px;
}
.stat {
  text-align: center;
  padding: 10px 0;
}
.num {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}
.label {
  color: #6b7280;
  margin-top: 6px;
}
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.chart-card {
  height: 360px;
}
.chart {
  width: 100%;
  height: 100%;
}
@media (max-width: 1024px) {
  .charts {
    grid-template-columns: 1fr;
  }
}
</style>
