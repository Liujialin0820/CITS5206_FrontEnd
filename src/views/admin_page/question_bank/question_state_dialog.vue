<template>
  <el-dialog
    v-model="visible"
    :title="`Statistics: ${question?.text || ''}`"
    width="700px"
  >
    <div v-if="question">
      <!-- 题干信息 -->
      <p class="q-text">
        {{ question.text }}
        <span class="meta">
          ({{ question.type }} · {{ question.marks }} marks ·
          {{ question.level }})
        </span>
      </p>
      <p class="sub-info">Attempts: {{ question.attempts }}</p>

      <!-- 表格展示 -->
      <el-table :data="question.choices" border stripe style="width: 100%">
        <el-table-column label="Option" min-width="180">
          <template #default="scope">
            <span
              :class="{
                correct: scope.row.is_correct,
                wrong: !scope.row.is_correct,
              }"
            >
              {{ scope.row.text }}
              <span v-if="scope.row.is_correct" class="tag">✔ Correct</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="selected_total"
          label="Selected Count"
          width="140"
          align="center"
        />
        <el-table-column
          prop="wrong_selected"
          label="Wrong Selected"
          width="160"
          align="center"
        />
        <el-table-column label="Wrong Rate" width="160" align="center">
          <template #default="scope">
            {{ (scope.row.wrong_rate_per_attempt * 100).toFixed(1) }}%
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="visible = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { get_question_stat_api } from "@/apis/admin_api";

const visible = ref(false);
const question = ref(null);

async function open(questionId) {
  try {
    const res = await get_question_stat_api(questionId);
    question.value = res; // axios 可能返回 data
    console.log(res);
    
    visible.value = true;
  } catch (err) {
    console.error("❌ Failed to fetch stats:", err);
  }
}

defineExpose({ open });
</script>

<style scoped>
.q-text {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 15px;
}
.sub-info {
  margin-bottom: 16px;
  color: #666;
  font-size: 13px;
}
.correct {
  color: #2b7a0b;
  font-weight: 600;
}
.wrong {
  color: #b91c1c;
}
.tag {
  margin-left: 8px;
  font-size: 12px;
  color: #2b7a0b;
}
</style>
