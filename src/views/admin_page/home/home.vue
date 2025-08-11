<template>
  <el-container class="app-shell">
    <el-aside width="240px" class="app-aside">
      <Sidebar />
    </el-aside>

    <el-container class="app-main">
      <el-header class="app-header">
        <div class="brand">Korean Placement Admin</div>
        <div class="header-right">
          <el-input
            v-model="keyword"
            placeholder="Search…"
            clearable
            size="large"
            class="w-64"
          />
          <el-button size="large" @click="onRefresh">Refresh</el-button>
        </div>
      </el-header>

      <el-main class="app-content">
        <DashboardContent
          :stats="stats"
          :bar-data="barData"
          :radar-data="radarData"
          :categories="categories"
          :radar-indicators="radarIndicators"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import DashboardContent from "@/components/DashboardContent.vue";

const keyword = ref("");

// —— 这些数据通常来自 API ——
// 为了避免写死具体数字，这里给出结构示例；你接上后端后替换为真实值即可。
const stats = ref({
  students: null,
  testPapers: null,
  questions: null,
  attempts: null,
});

const categories = ref([
  "Vocabulary",
  "Grammar",
  "Listening",
  "Reading",
  "Writing",
]);
const barData = ref([]); // 对应每个类别的问题数量 e.g. [..]
const radarIndicators = ref(
  categories.value.map((name) => ({ name })) // max 可选：接入数据后再设
);
const radarData = ref([]); // 各维度平均分 e.g. [..]

function onRefresh() {
  // TODO: 调你的 API，更新 stats / barData / radarData
  // 示例：
  // const res = await api.get('/dashboard')
  // stats.value = res.data.stats
  // barData.value = res.data.bar
  // radarIndicators.value = res.data.radar.indicators
  // radarData.value = res.data.radar.values
}
</script>

<style scoped>
.app-shell {
  height: 100vh;
}
.app-aside {
  background: #1f3a77;
  color: #fff;
}
.app-main {
  background: #f6f8fb;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eaecef;
}
.brand {
  font-weight: 700;
  font-size: 18px;
}
.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}
.w-64 {
  width: 16rem;
}
</style>
