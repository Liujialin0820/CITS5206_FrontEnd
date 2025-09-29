<template>
  <div class="sidebar">
    <div class="logo">
      <span class="dot" />
      <span class="text">Dashboard</span>
    </div>

    <el-menu
      class="menu"
      router
      background-color="transparent"
      text-color="#e6eaf6"
      active-text-color="#ffffff"
      :default-active="active"
    >
      <el-menu-item index="/admin-home/dashboard">
        <el-icon><i class="el-icon-menu" /></el-icon>
        <span>Dashboard</span>
      </el-menu-item>

      <el-menu-item index="/admin-home/question-bank">
        <el-icon><i class="el-icon-document" /></el-icon>
        <span>Question Bank</span>
      </el-menu-item>

      <el-menu-item index="/admin-home/test-papers">
        <el-icon><i class="el-icon-files" /></el-icon>
        <span>Test Paper Pool</span>
      </el-menu-item>

      <el-menu-item index="/admin-home/students">
        <el-icon><i class="el-icon-user" /></el-icon>
        <span>Student Information</span>
      </el-menu-item>
    </el-menu>

    <div class="spacer" />
    <div class="logout">
      <el-button type="primary" plain round>Sign out</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const active = ref("dashboard");
</script>

<style scoped>
.sidebar {
  height: 90%;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  color: #e6eaf6;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 8px;
  margin-bottom: 8px;
}
.logo .dot {
  width: 10px;
  height: 10px;
  background: #ffd54f;
  border-radius: 50%;
}
.logo .text {
  font-weight: 700;
  font-size: 18px;
}
.menu {
  border-right: none;
}
.spacer {
  flex: 1;
}
.logout {
  padding: 10px;
  display: flex;
  justify-content: center;
}
</style>
