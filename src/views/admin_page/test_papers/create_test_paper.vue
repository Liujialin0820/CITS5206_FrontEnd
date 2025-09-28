<template>
  <div class="create-test-paper">
    <!-- Back -->
    <el-button type="text" @click="goBack">← Back</el-button>

    <!-- Form -->
    <el-form :model="form" label-position="top" class="form-box" ref="formRef">
      <el-form-item label="Test Paper Title" prop="title">
        <el-input v-model="form.title" placeholder="Enter test paper title" />
      </el-form-item>

      <el-row :gutter="16">
        <!-- Level -->
        <el-col :span="8">
          <el-form-item label="Level" prop="level">
            <el-select v-model="form.level" placeholder="Select level">
              <el-option label="Level 1" value="Level 1" />
              <el-option label="Level 2" value="Level 2" />
              <el-option label="Level 3" value="Level 3" />
              <el-option label="Level 4" value="Level 4" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Category -->
        <el-col :span="8">
          <el-form-item label="Category" prop="category">
            <el-select v-model="form.category" placeholder="Select category">
              <el-option label="Vocabulary" value="Vocabulary" />
              <el-option label="Grammar" value="Grammar" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Status -->
        <el-col :span="8">
          <el-form-item label="Status" prop="status">
            <el-select v-model="form.status" placeholder="Select status">
              <el-option label="Draft" value="Draft" />
              <el-option label="Published" value="Published" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- Filters -->
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Search questions"
        prefix-icon="Search"
        clearable
        class="search-box"
      />
      <el-select v-model="filterCategory" placeholder="Category" clearable>
        <el-option label="Vocabulary" value="Vocabulary" />
        <el-option label="Grammar" value="Grammar" />
      </el-select>
      <el-select v-model="filterLevel" placeholder="Level" clearable>
        <el-option label="Level 1" value="Level 1" />
        <el-option label="Level 2" value="Level 2" />
        <el-option label="Level 3" value="Level 3" />
        <el-option label="Level 4" value="Level 4" />
      </el-select>
      <el-button type="primary" @click="loadQuestions">Search</el-button>
    </div>

    <!-- Question Table -->
    <el-table
      :data="filteredData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" min-width="180" />
      <el-table-column prop="category" label="Category" width="120" />
      <el-table-column prop="level" label="Level" width="120" />
      <el-table-column prop="marks" label="Marks" width="100" />
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
      />
    </div>

    <!-- Selected Questions -->
    <div class="selected-questions">
      <h3>Selected Questions</h3>
      <ul>
        <li v-for="q in selectedQuestions" :key="q.id">
          {{ q.name }} ({{ q.marks }} marks)
        </li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="actions">
      <el-button type="primary" size="large" @click="submitForm">
        Save Test Paper
      </el-button>
      <el-button size="large" @click="goBack">Cancel</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { get_questions_api } from "@/apis/admin_api";

const formRef = ref(null);
const form = ref({
  title: "",
  level: "",
  category: "",
  status: "Draft",
  questions: [],
});

const search = ref("");
const filterCategory = ref("");
const filterLevel = ref("");
const page = ref(1);
const pageSize = 10;
const total = ref(0);

const tableData = ref([]);
const selectedQuestions = ref([]);

// Load questions
async function loadQuestions() {
  const params = {
    page: page.value,
    page_size: pageSize,
    search: search.value || undefined,
    category: filterCategory.value || undefined,
    level: filterLevel.value || undefined,
  };
  try {
    const data = await get_questions_api(params);
    tableData.value = data.results || data;
    total.value = data.count || data.length || 0;
  } catch (err) {
    console.error("❌ Failed to load questions:", err);
  }
}

onMounted(loadQuestions);

// Filters
const filteredData = computed(() => tableData.value);

// Handle selection
function handleSelectionChange(val) {
  selectedQuestions.value = val;
  form.value.questions = val.map((q) => q.id);
}

// Submit
function submitForm() {
  console.log("✅ Create Test Paper:", form.value);
  // TODO: call create_test_paper_api(form.value)
}

// Back
function goBack() {
  history.back();
}
</script>

<style scoped>
.create-test-paper {
  padding: 24px;
  max-width: 1100px;
}
.form-box {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
.selected-questions {
  margin-top: 20px;
  padding: 12px;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 6px;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}
</style>
