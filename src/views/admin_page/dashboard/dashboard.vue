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
      <!-- Chart 1: Students per Level -->
      <div class="chart-box">
        <div ref="studentsChartRef" class="chart"></div>
      </div>

      <!-- Chart 2: Questions & Accuracy -->
      <div class="chart-box">
        <div ref="questionsChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// All comments in English
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import http from "@/apis/http";

// Stats for cards
const stats = ref([
  { label: "Total Students", value: 0 },
  { label: "Total Test Papers", value: 0 },
  { label: "Total Questions", value: 0 },
  { label: "Total Attempts", value: 0 },
]);

// Chart refs
const studentsChartRef = ref(null);
const questionsChartRef = ref(null);

// Data for charts
const levelNames = ref([]);
const studentCounts = ref([]);
const questionCounts = ref([]);
const accuracies = ref([]);

// Load stats from backend
async function loadStats() {
  try {
    const data = await http.get("/exam/admin/global-stats/");
    // Example response structure:
    // {
    //   student_count: 120,
    //   paper_count: 20,
    //   question_count: 200,
    //   attempt_count: 350,
    //   levels: {
    //     "Level 1": { students: 40, questions: 50, accuracy: 75 },
    //     "Level 2": { students: 30, questions: 40, accuracy: 68 },
    //     ...
    //   }
    // }

    stats.value = [
      { label: "Total Students", value: data.student_count },
      { label: "Total Test Papers", value: data.paper_count },
      { label: "Total Questions", value: data.question_count },
      { label: "Total Attempts", value: data.attempt_count },
    ];

    levelNames.value = Object.keys(data.levels || {});
    studentCounts.value = levelNames.value.map((l) => data.levels[l].students);
    questionCounts.value = levelNames.value.map((l) => data.levels[l].questions);
    accuracies.value = levelNames.value.map((l) => data.levels[l].accuracy);

    initStudentsChart();
    initQuestionsChart();
  } catch (err) {
    console.error("❌ Failed to load stats:", err);
  }
}

// Chart 1: Students per Level
function initStudentsChart() {
  const chart = echarts.init(studentsChartRef.value);
  chart.setOption({
    title: { text: "Students per Level", left: "center" },
    tooltip: {},
    xAxis: { type: "category", data: levelNames.value },
    yAxis: { type: "value", name: "Students" },
    series: [
      {
        data: studentCounts.value,
        type: "bar",
        itemStyle: { color: "#5470C6" },
      },
    ],
  });
}

// Chart 2: Questions & Accuracy
function initQuestionsChart() {
  const chart = echarts.init(questionsChartRef.value);
  chart.setOption({
    title: { text: "Questions & Accuracy per Level", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Questions", "Accuracy %"] },
    xAxis: { type: "category", data: levelNames.value },
    yAxis: [
      { type: "value", name: "Questions" },
      { type: "value", name: "Accuracy %", min: 0, max: 100 },
    ],
    series: [
      {
        name: "Questions",
        type: "bar",
        data: questionCounts.value,
        itemStyle: { color: "#91CC75" },
      },
      {
        name: "Accuracy %",
        type: "line",
        yAxisIndex: 1,
        data: accuracies.value,
        itemStyle: { color: "#EE6666" },
        smooth: true,
      },
    ],
  });
}

onMounted(loadStats);
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
