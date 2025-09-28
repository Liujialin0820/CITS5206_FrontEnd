<template>
  <div class="test-papers">
    <!-- Toolbar -->
    <div class="toolbar">
      <el-button type="primary" plain @click="goCreate">
        <el-icon><Plus /></el-icon> Create Test Paper
      </el-button>
      <el-button type="primary" plain @click="goResult">
        <el-icon><Histogram /></el-icon> Test Result
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
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Plus, Histogram } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const page = ref(1);
const pageSize = 5;
const total = ref(30);

const tableData = ref([
  { id: "00001", code: "TST001", title: "Korean Beginner Level Test A", status: "Published" },
  { id: "00002", code: "TST002", title: "Korean Beginner Level Test B", status: "Pending" },
  { id: "00003", code: "TST003", title: "Korean Placement Test - General", status: "Unpublished" },
  { id: "00004", code: "TST004", title: "Korean Listening Test Level 1", status: "Published" },
  { id: "00005", code: "TST005", title: "Korean Reading Test Level 2", status: "Expired" },
]);

function statusTagType(status) {
  switch (status) {
    case "Published": return "success";
    case "Pending": return "info";
    case "Unpublished": return "warning";
    case "Expired": return "danger";
    default: return "";
  }
}

// Actions
function goCreate() { router.push("/admin-home/test-papers/create"); }
function goResult() { router.push("/admin-home/test-papers/result"); }
function generate(row) { console.log("Generate:", row); }
function preview(row) { router.push(`/admin-home/test-papers/${row.id}/preview`); }
function publish(row) { console.log("Publish:", row); }
function unpublish(row) { console.log("Unpublish:", row); }
function edit(row) { router.push(`/admin-home/test-papers/${row.id}/edit`); }
function del(row) { console.log("Delete:", row); }
function share(row) { console.log("Share:", row); }
</script>

<style scoped>
.test-papers { padding: 20px; }
.toolbar { display: flex; gap: 16px; margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
</style>
