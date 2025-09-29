<template>
  <div class="edit-test-paper">
    <!-- Back -->
    <el-button type="text" @click="goBack">← Back</el-button>

    <!-- Form -->
    <el-form :model="form" label-position="top" class="form-box">
      <el-form-item label="Test Paper Title">
        <el-input v-model="form.title" placeholder="Enter test paper title" />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Status">
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
      <el-input v-model="search" placeholder="Search questions" clearable />
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
    </div>

    <!-- Question Table -->
    <el-table
      ref="questionTable"
      :data="tableData"
      :row-key="row => row.id"
      border
      style="width:100%"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" min-width="180" />
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
        @current-change="loadQuestions"
      />
    </div>

    <!-- ✅ Level Exam Config -->
    <div class="level-config">
      <h3>Level Exam Config</h3>
      <el-table :data="levelSummary" border>
        <el-table-column prop="level" label="Level" width="120" />
        <el-table-column prop="selected" label="Selected Questions" width="160" />
        <el-table-column label="Mode" width="160">
          <template #default="scope">
            <el-select v-model="form.level_config[scope.row.level].mode">
              <el-option label="By Count" value="count" />
              <el-option label="By Marks" value="marks" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Questions">
          <template #default="scope">
            <el-input-number
              v-if="form.level_config[scope.row.level].mode === 'count'"
              v-model="form.level_config[scope.row.level].exam_questions"
              :min="0"
              :max="scope.row.selected"
            />
          </template>
        </el-table-column>
        <el-table-column label="Total Marks">
          <template #default="scope">
            <el-input-number
              v-if="form.level_config[scope.row.level].mode === 'marks'"
              v-model="form.level_config[scope.row.level].total_marks"
              :min="0"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Selected Questions -->
    <div class="selected-questions">
      <h3>Selected Questions</h3>
      <ul>
        <li v-for="q in selectedQuestions" :key="q.id">
          {{ q.name }} ({{ q.level }} - {{ q.marks }} marks)
        </li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="actions">
      <el-button type="primary" size="large" @click="submitForm">
        Update Test Paper
      </el-button>
      <el-button type="danger" size="large" @click="deletePaper">
        Delete Test Paper
      </el-button>
      <el-button size="large" @click="goBack">Cancel</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { get_questions_api } from "@/apis/admin_api";
import {
  get_test_paper_api,
  update_test_paper_api,
  delete_test_paper_api,
} from "@/apis/test_paper_api";

const route = useRoute();
const router = useRouter();
const questionTable = ref(null);

const form = ref({
  title: "",
  status: "Draft",
  questions: [],
  level_config: {
    "Level 1": { mode: "count", exam_questions: 0, total_marks: 0 },
    "Level 2": { mode: "count", exam_questions: 0, total_marks: 0 },
    "Level 3": { mode: "count", exam_questions: 0, total_marks: 0 },
    "Level 4": { mode: "count", exam_questions: 0, total_marks: 0 },
  },
});

const search = ref("");
const filterCategory = ref("");
const filterLevel = ref("");
const page = ref(1);
const pageSize = 20;
const total = ref(0);

const tableData = ref([]);
const selectedQuestions = ref([]);

// 加载试卷详情
async function loadTestPaper() {
  const id = route.params.id;
  const data = await get_test_paper_api(id);
  form.value = {
    title: data.title,
    status: data.status,
    questions: data.questions || [],
    level_config: data.level_config || form.value.level_config,
  };
  selectedQuestions.value = data.questions_detail || [];
  await loadQuestions();
}

// 加载题目
async function loadQuestions() {
  const params = {
    page: page.value,
    page_size: pageSize,
    search: search.value || undefined,
    category: filterCategory.value || undefined,
    level: filterLevel.value || undefined,
  };
  const data = await get_questions_api(params);
  tableData.value = data.results || data;
  total.value = data.count || data.length || 0;

  await nextTick();
  tableData.value.forEach((row) => {
    if (form.value.questions.includes(row.id)) {
      questionTable.value.toggleRowSelection(row, true);
    }
  });
}

// 选择逻辑
function handleSelect(selection, row) {
  if (selection.some((q) => q.id === row.id)) {
    if (!form.value.questions.includes(row.id)) {
      form.value.questions.push(row.id);
      selectedQuestions.value.push(row);
    }
  } else {
    form.value.questions = form.value.questions.filter((id) => id !== row.id);
    selectedQuestions.value = selectedQuestions.value.filter((q) => q.id !== row.id);
  }
}
function handleSelectAll(selection) {
  const currentIds = tableData.value.map((q) => q.id);
  if (selection.length) {
    selection.forEach((q) => {
      if (!form.value.questions.includes(q.id)) {
        form.value.questions.push(q.id);
        selectedQuestions.value.push(q);
      }
    });
  } else {
    form.value.questions = form.value.questions.filter((id) => !currentIds.includes(id));
    selectedQuestions.value = selectedQuestions.value.filter((q) => !currentIds.includes(q.id));
  }
}

// Level summary
const levelSummary = computed(() => {
  return ["Level 1", "Level 2", "Level 3", "Level 4"].map((level) => ({
    level,
    selected: selectedQuestions.value.filter((q) => q.level === level).length,
  }));
});

watch([search, filterCategory, filterLevel], () => {
  page.value = 1;
  loadQuestions();
});

onMounted(loadTestPaper);

// 更新
async function submitForm() {
  await update_test_paper_api(route.params.id, form.value);
  ElMessage.success("Test paper updated successfully!");
  history.back();
}

// 删除
async function deletePaper() {
  try {
    await ElMessageBox.confirm("Are you sure you want to delete?", "Confirm", {
      type: "warning",
    });
    await delete_test_paper_api(route.params.id);
    ElMessage.success("Deleted!");
    router.push("/admin-home/test-papers");
  } catch {}
}

function goBack() {
  history.back();
}
</script>

<style scoped>
.filters { display:flex; gap:12px; margin-bottom:12px; }
.level-config { margin-top:20px; padding:12px; border:1px solid #eee; border-radius:6px; }
.selected-questions { margin-top:20px; padding:12px; border:1px solid #eee; border-radius:6px; }
.actions { margin-top:20px; display:flex; gap:12px; }
</style>
