<template>
  <div class="test-papers">
    <!-- Toolbar -->
    <div class="toolbar">
      <el-button type="primary" plain @click="goCreate">
        <el-icon><Plus /></el-icon> Create Test Paper
      </el-button>
    </div>

    <!-- Table -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="code" label="Code" width="120" />
      <el-table-column prop="title" label="Title" min-width="260" />
      <el-table-column prop="status" label="Status" width="160">
        <template #default="scope">
          <el-tag :type="statusTagType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- ✅ 新增 Test Result 列 -->
      <el-table-column label="Result" width="160">
        <template #default="scope">
          <el-button type="primary" plain size="small" @click="goResult(scope.row)">
            <el-icon><Histogram /></el-icon> View Result
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="420">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'Pending'"
            type="primary"
            size="small"
            @click="generate(scope.row)"
          >
            Generate
          </el-button>
          <el-button size="small" @click="preview(scope.row)">Preview</el-button>
          <el-button
            v-if="['Pending', 'Unpublished'].includes(scope.row.status)"
            type="primary" plain size="small"
            @click="publish(scope.row)"
          >
            Publish
          </el-button>
          <el-button
            v-if="scope.row.status === 'Published'"
            type="warning" plain size="small"
            @click="unpublish(scope.row)"
          >
            Unpublish
          </el-button>
          <el-button
            v-if="scope.row.status !== 'Expired'"
            plain size="small"
            @click="edit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            v-if="['Pending','Unpublished'].includes(scope.row.status)"
            type="danger" plain size="small"
            @click="del(scope.row)"
          >
            Delete
          </el-button>
          <el-button
            v-if="scope.row.status === 'Published'"
            type="success" size="small"
            @click="share(scope.row)"
          >
            Share
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
        @current-change="loadTestPapers"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Plus, Histogram } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  get_test_papers_api,
  delete_test_paper_api,
  update_test_paper_api,
} from "@/apis/test_paper_api";

const router = useRouter();
const page = ref(1);
const pageSize = 10;
const total = ref(0);
const tableData = ref([]);

// 加载数据
async function loadTestPapers() {
  try {
    const params = { page: page.value, page_size: pageSize };
    const data = await get_test_papers_api(params);
    tableData.value = data.results || data; // DRF 分页兼容
    total.value = data.count || data.length || 0;
  } catch (err) {
    console.error("❌ Failed to load test papers:", err);
  }
}
onMounted(loadTestPapers);

// 状态样式
function statusTagType(status) {
  switch (status) {
    case "Published":
      return "success";
    case "Pending":
      return "info";
    case "Unpublished":
      return "warning";
    case "Expired":
      return "danger";
    default:
      return "info";
  }
}

// Actions
function goCreate() {
  router.push("/admin-home/test-papers/create");
}
function goResult(row) {
  router.push(`/admin-home/test-papers/${row.id}/result`);
}
function generate(row) {
  console.log("Generate:", row);
}
function preview(row) {
  router.push(`/admin-home/test-papers/${row.id}/preview`);
}

async function publish(row) {
  try {
    await update_test_paper_api(row.id, { ...row, status: "Published" });
    ElMessage.success("Published!");
    loadTestPapers();
  } catch (err) {
    ElMessage.error("Publish failed");
  }
}
async function unpublish(row) {
  try {
    await update_test_paper_api(row.id, { ...row, status: "Unpublished" });
    ElMessage.success("Unpublished!");
    loadTestPapers();
  } catch (err) {
    ElMessage.error("Unpublish failed");
  }
}
function edit(row) {
  router.push(`/admin-home/test-papers/${row.id}/edit`);
}

async function del(row) {
  try {
    await ElMessageBox.confirm(
      `Are you sure to delete test paper "${row.title}"?`,
      "Confirm Delete",
      { type: "warning" }
    );
    await delete_test_paper_api(row.id);
    ElMessage.success("Deleted!");
    loadTestPapers();
  } catch (err) {
    if (err !== "cancel") {
      console.error(err);
      ElMessage.error("Delete failed");
    }
  }
}
function share(row) {
  const link = `${window.location.origin}/test/${row.code}`;
  navigator.clipboard.writeText(link);
  ElMessage.success("Share link copied!");
}
</script>

<style scoped>
.test-papers {
  padding: 20px;
}
.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
