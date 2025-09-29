<!-- ExamPage.vue -->
<template>
  <div class="exam-wrap">
    <!-- 左侧题目 -->
    <div class="exam-main">
      <template v-for="typeKey in orderedGroupKeys" :key="typeKey">
        <div class="question-group" v-if="groupedQuestions[typeKey]?.length">
          <h2 class="group-title">{{  typeKey }}</h2>

          <div
            v-for="(q, idx) in groupedQuestions[typeKey]"
            :key="q.id"
            class="question-card"
          >
            <p class="q-title">
              <strong>Question {{ idx + 1 }}</strong>
              <span class="marks">[{{ q.marks }} marks]</span>
            </p>
            <p class="q-text">{{ q.question_text }}</p>

            <!-- 单选题 -->
            <el-radio-group
              v-if="q.type === 'Single Choice'"
              v-model="answers[q.id]"
              class="options"
            >
              <el-radio
                v-for="(c, j) in q.choices"
                :key="c.id"
                :label="c.id"
                class="option-item"
              >
                {{ String.fromCharCode(65 + j) }}. {{ c.text }}
              </el-radio>
            </el-radio-group>

            <!-- 多选题 -->
            <el-checkbox-group
              v-else-if="q.type === 'Multiple Choice'"
              v-model="answers[q.id]"
              class="options"
            >
              <el-checkbox
                v-for="(c, j) in q.choices"
                :key="c.id"
                :label="c.id"
                class="option-item"
              >
                {{ String.fromCharCode(65 + j) }}. {{ c.text }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </div>

    <!-- 右侧固定栏 -->
    <div class="exam-sidebar">
      <div class="timer">
        Time Left: {{ formattedTime }}
      </div>

      <div class="nav">
        <div
          v-for="(q, i) in allQuestions"
          :key="q.id"
          class="nav-item"
          :class="{ answered: isAnswered(q.id) }"
          @click="scrollToQuestion(q.id)"
        >
          {{ i + 1 }}
        </div>
      </div>

      <el-button type="primary" size="large" class="submit-btn" @click="onSubmit">
        Submit
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { ElMessage } from "element-plus";

// === 1. 加载本地数据 ===
const session = JSON.parse(localStorage.getItem("exam_session") || "{}");
const paper = session?.paper || {};
const allQuestions = ref(paper.generated_questions || []);

// === 2. 答案存储 ===
const answers = ref({});

// 初始化多选为 []，单选保持 undefined
function initAnswers() {
  const map = {};
  for (const q of allQuestions.value) {
    if (q.type === "Multiple Choice") {
      map[q.id] = Array.isArray(map[q.id]) ? map[q.id] : [];
    } else {
      // 单选、其他题型默认不设值（由用户选择产生）
      if (map[q.id] === undefined) map[q.id] = undefined;
    }
  }
  answers.value = { ...answers.value, ...map };
}

// === 3. 分组 + 组内排序 + 组顺序映射 ===
const groupOrder = [
  "Single Choice",
  "Multiple Choice",
  "True/False",
  "Short Answer",
  "Essay",
];


const groupedQuestions = computed(() => {
  const groups = {};
  for (const q of allQuestions.value) {
    if (!groups[q.type]) groups[q.type] = [];
    groups[q.type].push(q);
  }
  Object.keys(groups).forEach((k) => {
    groups[k].sort((a, b) => a.id - b.id);
  });
  return groups;
});

const orderedGroupKeys = computed(() => {
  const keys = Object.keys(groupedQuestions.value);
  // 先按自定义顺序排；未出现在列表里的放到最后，按字母序
  const known = keys.filter(k => groupOrder.includes(k)).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );
  const unknown = keys.filter(k => !groupOrder.includes(k)).sort();
  return [...known, ...unknown];
});

// === 4. 倒计时 ===
const startedAt = session?.startedAt || Date.now();
const duration = session?.duration || 2700; // 秒
const remaining = ref(duration - Math.floor((Date.now() - startedAt) / 1000));
let timer;

onMounted(() => {
  initAnswers();
  timer = setInterval(() => {
    remaining.value = duration - Math.floor((Date.now() - startedAt) / 1000);
    if (remaining.value <= 0) {
      clearInterval(timer);
      onSubmit();
    }
  }, 1000);
});
onUnmounted(() => clearInterval(timer));

const formattedTime = computed(() => {
  const safe = Math.max(0, remaining.value);
  const m = String(Math.floor(safe / 60)).padStart(2, "0");
  const s = String(safe % 60).padStart(2, "0");
  return `${m}:${s}`;
});

// === 5. 工具：是否已作答（多选需长度>0，单选需有值） ===
function isAnswered(qid) {
  const v = answers.value[qid];
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && v !== "";
}

// === 6. 点击右侧导航滚动到题目 ===
function scrollToQuestion(qid) {
  const el = document.querySelector(`[data-qid="${qid}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// === 7. 提交 ===
function onSubmit() {
  // 这里可以把 answers.value 发给后端
  console.log("提交答案:", answers.value);
  ElMessage.success("Submitted!");
}
</script>

<style scoped>
.exam-wrap {
  display: flex;
  gap: 24px;
  padding: 20px;
  background: #f7f9fc;
}

/* 左侧题目区域 */
.exam-main {
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;
}

/* 题目组 */
.group-title {
  font-size: 20px;
  font-weight: 700;
  color: #243084;
  margin: 20px 0 10px;
}

.question-card {
  background: #fff;
  border: 1px solid #e3eaf2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 18px;
}

/* 给每道题一个可滚动定位的锚点 */
.question-card { position: relative; }
.question-card::before {
  /* 留出顶部粘性头部（若有） */
  content: "";
  display: block;
  position: absolute;
  top: -80px;
  height: 80px;
  width: 1px;
}

.q-title {
  font-size: 16px;
  font-weight: 600;
  color: #2b3d99;
}
.marks {
  font-size: 14px;
  color: #666;
  margin-left: 6px;
}
.q-text {
  margin: 8px 0 12px;
  font-size: 15px;
  color: #222;
}

/* 选项分组：关键！让子项横向“靠左”而不是居中 */
.options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start; /* ←← 修正默认的居中对齐 */
  width: 100%;
}

/* 单选/多选项本体：顶对齐 + 占满可用宽度，文本可换行 */
:deep(.option-item.el-radio),
:deep(.option-item.el-checkbox) {
  align-items: flex-start !important;
  display: inline-flex; /* 与 EP 默认保持一致，但上面强制顶对齐 */
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

/* 图标与多行文字的顶对齐更自然 */
:deep(.el-radio__input),
:deep(.el-checkbox__input) {
  margin-top: 2px; /* 让小圆点/方框略微下沉，和多行文字更协调 */
}

/* 标签文本：左对齐、允许换行 */
:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  margin-left: 8px !important;
  padding: 0 !important;
  text-align: left !important;
  white-space: normal !important;
  font-size: 15px;
  line-height: 1.5;
}

/* 右侧栏 */
.exam-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e3eaf2;
  border-radius: 8px;
  padding: 16px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.timer {
  font-weight: 600;
  color: #2b3d99;
  margin-bottom: 12px;
  text-align: center;
}

.nav {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}
.nav-item {
  width: 32px;
  height: 32px;
  border: 1px solid #2b3d99;
  color: #2b3d99;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  cursor: pointer;
}
.nav-item.answered {
  background: #2b3d99;
  color: #fff;
}

.submit-btn {
  width: 100%;
  font-weight: 600;
}
</style>
