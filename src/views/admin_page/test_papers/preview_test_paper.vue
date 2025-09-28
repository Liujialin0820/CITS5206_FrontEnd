<template>
  <div class="preview-test-paper">
    <h2>{{ paper.title }}</h2>
    <p><strong>Status:</strong> {{ paper.status }}</p>

    <div v-for="(q, i) in paper.questions" :key="i" class="question">
      <p><strong>Q{{ i + 1 }}.</strong> {{ q.text }}</p>
      <el-radio-group>
        <el-radio v-for="(c, j) in q.choices" :key="j" :label="j">
          {{ String.fromCharCode(65 + j) }}. {{ c }}
        </el-radio>
      </el-radio-group>
    </div>

    <el-button @click="goBack">Back</el-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const paper = ref({
  title: "Korean Beginner Level Test A",
  status: "Published",
  questions: [
    { text: "Which is a Korean subject particle?", choices: ["은", "가", "의", "는"] },
    { text: "Translate '사과'", choices: ["Apple", "Banana", "Grape"] },
  ],
});

function goBack() {
  router.push("/admin-home/test-papers");
}
</script>

<style scoped>
.preview-test-paper { padding: 20px; }
.question { margin-bottom: 20px; }
</style>
