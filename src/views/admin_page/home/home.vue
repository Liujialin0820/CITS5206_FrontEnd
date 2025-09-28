<template>
  <el-container class="app-shell">
    <el-aside width="240px" class="app-aside">
      <Sidebar />
    </el-aside>

    <el-container class="app-main">
      <el-header class="app-header">
        <div class="brand">Korean Placement Admin</div>

      </el-header>

      <el-main class="app-content">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
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
