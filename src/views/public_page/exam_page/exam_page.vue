<!-- ExamPage.vue -->
<template>
  <div class="exam-wrap">
    <!-- Left: questions -->
    <div class="exam-main">
      <template v-for="typeKey in orderedGroupKeys" :key="typeKey">
        <div class="question-group" v-if="groupedQuestions[typeKey]?.length">
          <h2 class="group-title">{{ typeKey }}</h2>

          <div
            v-for="(q, idx) in groupedQuestions[typeKey]"
            :key="q.id"
            class="question-card"
            :data-qid="q.id"
          >
            <p class="q-title">
              <strong>Question {{ idx + 1 }}</strong>
              <span class="marks">[{{ q.marks }} marks]</span>
            </p>
            <p class="q-text">{{ q.question_text }}</p>

            <!-- Single Choice -->
            <el-radio-group
              v-if="q.type === 'Single Choice'"
              v-model="answers[q.id]"
              class="options"
            >
              <el-radio
                v-for="(c, j) in q.choices"
                :key="c.id"
                :label="Number(c.id)"
                class="option-item"
              >
                {{ String.fromCharCode(65 + j) }}. {{ c.text }}
              </el-radio>
            </el-radio-group>

            <!-- Multiple Choice -->
            <el-checkbox-group
              v-else-if="q.type === 'Multiple Choice'"
              v-model="answers[q.id]"
              class="options"
            >
              <el-checkbox
                v-for="(c, j) in q.choices"
                :key="c.id"
                :label="Number(c.id)"
                class="option-item"
              >
                {{ String.fromCharCode(65 + j) }}. {{ c.text }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </div>

    <!-- Right: sidebar -->
    <div class="exam-sidebar">
      <div class="timer">Time Left: {{ formattedTime }}</div>

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

      <el-button
        type="primary"
        size="large"
        class="submit-btn"
        :disabled="!attemptToken"
        @click="onSubmit"
      >
        Submit
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { start_exam_api, submit_exam_api } from "@/apis/exam_api";

/* 1) Read local session */
const session = JSON.parse(localStorage.getItem("exam_session") || "{}");
const paper = session?.paper || {};
const allQuestions = ref(paper.generated_questions || []);

/* 2) Answers: Multiple[] / Single undefined */
const answers = ref({});
function initAnswers() {
  const map = {};
  for (const q of allQuestions.value) {
    map[q.id] = q.type === "Multiple Choice" ? [] : undefined;
  }
  answers.value = map;
}

/* 3) Grouping + sorting */
const groupOrder = ["Single Choice", "Multiple Choice", "True/False", "Short Answer", "Essay"];
const groupedQuestions = computed(() => {
  const groups = {};
  for (const q of allQuestions.value) {
    (groups[q.type] ||= []).push(q);
  }
  Object.keys(groups).forEach((k) => groups[k].sort((a, b) => a.id - b.id));
  return groups;
});
const orderedGroupKeys = computed(() => {
  const keys = Object.keys(groupedQuestions.value);
  const known = keys.filter((k) => groupOrder.includes(k))
    .sort((a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b));
  const unknown = keys.filter((k) => !groupOrder.includes(k)).sort();
  return [...known, ...unknown];
});

/* 4) Timer (aligned to backend after start) */
const attemptToken = ref(session?.attemptToken || null);
const startedAt = ref(Number(session?.startedAt) || Date.now()); // ms
const duration  = ref(Number(session?.duration)  || 2700);       // s
const remaining = ref(0);
let timer = null;

function tick() {
  const spent = Math.floor((Date.now() - startedAt.value) / 1000);
  remaining.value = Math.max(0, duration.value - spent);
  if (remaining.value <= 0) {
    clearInterval(timer);
    onSubmit();
  }
}
function startTimer() {
  if (timer) clearInterval(timer);
  tick();
  timer = setInterval(tick, 1000);
}
onUnmounted(() => timer && clearInterval(timer));

const formattedTime = computed(() => {
  const m = String(Math.floor(remaining.value / 60)).padStart(2, "0");
  const s = String(remaining.value % 60).padStart(2, "0");
  return `${m}:${s}`;
});

/* 5) Utils */
function isAnswered(qid) {
  const v = answers.value[qid];
  return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== "";
}
function scrollToQuestion(qid) {
  const el = document.querySelector(`[data-qid="${qid}"]`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
function saveSessionPatch(patch) {
  const s = JSON.parse(localStorage.getItem("exam_session") || "{}");
  localStorage.setItem("exam_session", JSON.stringify({ ...s, ...patch }));
}

/* 6) Start exam (get attempt_token + started_at + duration_seconds) */
async function onStartExam() {
  try {
    if (attemptToken.value) {
      startTimer();
      return;
    }
    const stu = session.student || {};
    const pap = session.paper || {};
    if (!pap?.id) {
      ElMessage.error("No paper id.");
      startTimer();
      return;
    }
    const res = await start_exam_api({
      paper_id: pap.id,
      student: { name: stu.name, student_no: stu.studentNo, email: stu.email },
    });
    const data = res?.data ?? res;

    attemptToken.value = data.attempt_token;
    const srvStart = Date.parse(data.started_at);
    startedAt.value = Number.isFinite(srvStart) ? srvStart : Date.now();
    if (data.duration_seconds != null) {
      const dur = Number(data.duration_seconds);
      if (Number.isFinite(dur) && dur > 0) duration.value = dur;
    }

    saveSessionPatch({
      attemptToken: attemptToken.value,
      startedAt: startedAt.value,
      duration: duration.value,
    });

    startTimer();
    ElMessage.success("Exam started");
  } catch (err) {
    console.error(err);
    startTimer(); // still run local timer; submit will be blocked without token
    ElMessage.error("Failed to start exam");
  }
}

/* 7) Submit */
async function onSubmit() {
  if (!attemptToken.value) {
    ElMessage.error("Please start the exam first");
    return;
  }
  const payloadAnswers = allQuestions.value.map((q) => {
    const v = answers.value[q.id];
    if (q.type === "Single Choice") {
      return { question_id: q.id, selected_choice_ids: v ? [Number(v)] : [] };
    } else if (q.type === "Multiple Choice") {
      const arr = Array.isArray(v) ? v.map((x) => Number(x)) : [];
      return { question_id: q.id, selected_choice_ids: arr };
    } else {
      return { question_id: q.id, text_answer: typeof v === "string" ? v : "" };
    }
  });

  const payload = {
    attempt_token: attemptToken.value,
    answers: payloadAnswers,
    duration_seconds: Math.floor((Date.now() - startedAt.value) / 1000),
  };

  try {
    const res = await submit_exam_api(payload);
    const data = res?.data ?? res;
    timer && clearInterval(timer);
    // Do NOT show score
    ElMessage.success("Submitted!");
    // Optional: navigate to a result/thanks page
  } catch (err) {
    console.error(err);
    ElMessage.error("Submit failed, you can only submit once.");
  }
}

/* 8) Mount */
onMounted(() => {
  initAnswers();
  onStartExam();
});
</script>

<style scoped>
.exam-wrap {
  display: flex;
  gap: 24px;
  padding: 20px;
  background: #f7f9fc;
}

/* Left column */
.exam-main {
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;
}

/* Group header */
.group-title {
  font-size: 20px;
  font-weight: 700;
  color: #243084;
  margin: 20px 0 10px;
}

/* Question card */
.question-card {
  background: #fff;
  border: 1px solid #e3eaf2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 18px;
  position: relative;
}

/* Anchor spacer for sticky headers */
.question-card::before {
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

/* Options container */
.options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  width: 100%;
}

/* Option item layout */
:deep(.option-item.el-radio),
:deep(.option-item.el-checkbox) {
  align-items: flex-start !important;
  display: inline-flex;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.el-radio__input),
:deep(.el-checkbox__input) {
  margin-top: 2px;
}

:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  margin-left: 8px !important;
  padding: 0 !important;
  text-align: left !important;
  white-space: normal !important;
  font-size: 15px;
  line-height: 1.5;
}

/* Right sidebar */
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

/* Question navigator */
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

/* Submit button */
.submit-btn {
  width: 100%;
  font-weight: 600;
}
</style>
