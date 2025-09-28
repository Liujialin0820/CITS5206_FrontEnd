<template>
  <div class="question-bank">
    <!-- 顶部操作按钮 -->
    <div class="toolbar">
      <el-button
        type="primary"
        plain
        @click="$router.push('/admin-home/question-bank/create')"
      >
        <el-icon><Plus /></el-icon> Create Question
      </el-button>

      <el-button type="primary" plain>
        <el-icon><Upload /></el-icon> Import Files
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Search"
        prefix-icon="Search"
        clearable
        class="search-box"
      />
      <el-select v-model="selectedCategory" placeholder="Category" clearable>
        <el-option label="Vocabulary" value="Vocabulary" />
        <el-option label="Grammar" value="Grammar" />
      </el-select>
      <el-select v-model="selectedLevel" placeholder="Level" clearable>
        <el-option label="Level 1" value="Level 1" />
        <el-option label="Level 2" value="Level 2" />
        <el-option label="Level 3" value="Level 3" />
        <el-option label="Level 4" value="Level 4" />
      </el-select>
    </div>

    <!-- 表格 -->
    <el-table :data="filteredData" stripe border style="width: 100%">
      <el-table-column prop="id" label="id" width="100" />
      <el-table-column prop="code" label="name" width="120" />
      <el-table-column prop="name" label="category" />
      <el-table-column prop="type" label="type" />
      <el-table-column prop="level" label="Level" />

      <el-table-column label="Actions" width="240">
        <template #default="scope">
          <el-button size="small" @click="preview(scope.row)"
            >Preview</el-button
          >
          <el-button size="small" type="primary" plain @click="edit(scope.row)"
            >Edit</el-button
          >
          <el-button size="small" type="danger" plain @click="del(scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="50"
        :page-size="10"
        v-model:current-page="page"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Plus, Upload, Search } from "@element-plus/icons-vue";

const search = ref("");
const selectedCategory = ref("");
const selectedLevel = ref("");
const page = ref(1);

// 示例数据
const tableData = ref([
  {
    id: "00001",
    code: "Q001",
    name: "Basic Greetings",
    category: "Vocabulary",
    type: "Multiple Choice",
    level: "Level 1",
  },
  {
    id: "00002",
    code: "Q002",
    name: "Food and Drinks",
    category: "Grammar",
    type: "Multiple Choice",
    level: "Level 2",
  },
  {
    id: "00003",
    code: "Q003",
    name: "Numbers Recognition",
    category: "Vocabulary",
    type: "Single Choice",
    level: "Level 3",
  },
  {
    id: "00004",
    code: "Q004",
    name: "Verb Conjugation",
    category: "Grammar",
    type: "Single Choice",
    level: "Level 4",
  },
]);

// 筛选逻辑
const filteredData = computed(() => {
  return tableData.value.filter((item) => {
    return (
      (!search.value ||
        item.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedCategory.value || item.category === selectedCategory.value) &&
      (!selectedLevel.value || item.level === selectedLevel.value)
    );
  });
});

// 按钮事件
function preview(row) {
  console.log("Preview:", row);
}
function edit(row) {
  console.log("Edit:", row);
}
function del(row) {
  console.log("Delete:", row);
}
</script>

<style scoped>
.question-bank {
  padding: 20px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  width: 260px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
