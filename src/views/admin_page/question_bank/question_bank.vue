<template>
  <div class="question-bank">
    <!-- Top toolbar -->
    <div class="toolbar">
      <el-button
        type="primary"
        plain
        @click="$router.push('/admin-home/question-bank/create')"
      >
        <el-icon><Plus /></el-icon> Create Question
      </el-button>
      <DownloadCsvTemplate />

      <el-upload
        :action="`${baseUrl}/questions/import_csv/`"
        :headers="uploadHeaders"
        accept=".csv"
        :show-file-list="false"
        name="file"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
      >
        <el-button type="primary" plain>
          <el-icon><Upload /></el-icon> Import CSV
        </el-button>
      </el-upload>
    </div>

    <!-- Filters -->
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Search by name"
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

    <!-- Table -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" min-width="160" />
      <el-table-column prop="category" label="Category" width="140" />
      <el-table-column prop="type" label="Type" width="160" />
      <el-table-column prop="level" label="Level" width="120" />
      <el-table-column prop="marks" label="Marks" width="100" />
      <el-table-column prop="accuracy" label="Accuracy" width="120">
        <template #default="scope">
          <span
            v-if="
              scope.row.accuracy !== null && scope.row.accuracy !== undefined
            "
          >
            {{ (scope.row.accuracy * 100).toFixed(1) }}%
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="300">
        <template #default="scope">
          <el-button size="small" @click="preview(scope.row)">
            Preview
          </el-button>
          <el-button size="small" type="primary" plain @click="edit(scope.row)">
            Edit
          </el-button>
          <el-button size="small" type="danger" plain @click="del(scope.row)">
            Delete
          </el-button>
          <el-button size="small" plain @click="showStat(scope.row)"
            >Stats</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <QuestionStateDialog ref="statDialogRef" />

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

    <!-- Preview Dialog -->
    <el-dialog
      v-model="previewVisible"
      title="Preview Question"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentQuestion">
        <!-- title + marks -->
        <p>
          <strong>{{ currentQuestion.name }}</strong>
          <span v-if="currentQuestion.marks">
            ({{ currentQuestion.marks }} marks)
          </span>
        </p>
        <p>{{ currentQuestion.question_text }}</p>

        <!-- image preview -->
        <div v-if="currentQuestion.image" class="preview-image">
          <img :src="currentQuestion.image.image" alt="question image" />
        </div>

        <!-- Single choice -->
        <el-radio-group
          v-if="currentQuestion.type === 'Single Choice'"
          v-model="selectedAnswer"
        >
          <el-radio
            v-for="(choice, index) in currentQuestion.choices"
            :key="choice.id || index"
            :label="index"
          >
            {{ String.fromCharCode(65 + index) }}. {{ choice.text }}
          </el-radio>
        </el-radio-group>

        <!-- Multiple choice -->
        <el-checkbox-group v-else v-model="selectedAnswers">
          <el-checkbox
            v-for="(choice, index) in currentQuestion.choices"
            :key="choice.id || index"
            :label="index"
          >
            {{ String.fromCharCode(65 + index) }}. {{ choice.text }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">Close</el-button>
        <el-button type="primary" @click="submitPreviewAnswer">
          Submit
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// All comments in English
import { ref, computed, onMounted, watch } from "vue";
import { Plus, Upload, Search } from "@element-plus/icons-vue";
import { get_questions_api, delete_question_api } from "@/apis/admin_api";
import { useRouter } from "vue-router";
import DownloadCsvTemplate from "./download_csv_template.vue";
import { useAuthStore } from "@/stores/authStore";
import QuestionStateDialog  from "./question_state_dialog.vue";

const statDialogRef = ref(null);

function showStat(row) {
  if (statDialogRef.value) {
    statDialogRef.value.open(row.id);
  } else {
    console.error("❌ statDialogRef is null");
  }
}

const router = useRouter();
const baseUrl = import.meta.env.VITE_BASE_URL;
const auth = useAuthStore();

// Filters
const search = ref("");
const selectedCategory = ref("");
const selectedLevel = ref("");

// Table state
const page = ref(1);
const pageSize = 100;
const total = ref(0);
const tableData = ref([]);

// Preview state
const previewVisible = ref(false);
const currentQuestion = ref(null);
const selectedAnswer = ref(null);
const selectedAnswers = ref([]);

// Token for upload headers
const uploadHeaders = computed(() => {
  return auth.token ? { Authorization: `JWT ${auth.token}` } : {};
});

// Success/error for CSV import
function handleImportSuccess(res) {
  ElMessage.success(res.message || "CSV imported successfully!");
  loadQuestions();
}

function handleImportError(err) {
  console.error("❌ Import failed:", err);
  ElMessage.error("CSV import failed");
}

// Load questions from backend
async function loadQuestions() {
  try {
    const params = {
      page: page.value,
      page_size: pageSize,
      category: selectedCategory.value || undefined,
      level: selectedLevel.value || undefined,
      search: search.value || undefined,
    };
    const data = await get_questions_api(params);
    tableData.value = data.results || data;
    total.value = data.count || data.length || 0;
  } catch (err) {
    console.error("❌ Failed to load questions:", err);
  }
}

// Auto reload when filters change
watch([search, selectedCategory, selectedLevel], () => {
  page.value = 1; // reset to first page
  loadQuestions();
});

onMounted(loadQuestions);

// Actions
function preview(row) {
  currentQuestion.value = row;
  selectedAnswer.value = null;
  selectedAnswers.value = [];
  previewVisible.value = true;
}

function submitPreviewAnswer() {
  if (currentQuestion.value.type === "Single Choice") {
    console.log("Selected:", selectedAnswer.value);
  } else {
    console.log("Selected:", selectedAnswers.value);
  }
  ElMessage.success("Answer submitted (preview mode only)");
  previewVisible.value = false;
}

function edit(row) {
  router.push(`/admin-home/question-bank/${row.id}/edit`);
}

async function del(row) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete question "${row.name}"?`,
      "Confirm Delete",
      { type: "warning" }
    );
    await delete_question_api(row.id);
    tableData.value = tableData.value.filter((q) => q.id !== row.id);
    ElMessage.success("Deleted successfully");
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error("Delete failed");
      console.error(err);
    }
  }
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

.filters .el-select {
  width: 180px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.preview-image {
  margin: 12px 0;
  text-align: center;
}
.preview-image img {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #eee;
}
</style>
