<template>
  <div class="preview-test-paper" v-if="paper">
    <h2>{{ paper.title }}</h2>
    <p><strong>Status:</strong> {{ paper.status }}</p>

    <div
      v-for="(q, i) in paper.generated_questions"
      :key="q.id"
      class="question"
    >
      <p>
        <strong>Q{{ i + 1 }}.</strong> {{ q.question_text }}
        <span class="meta">({{ q.type }} · {{ q.level }} · {{ q.marks }} marks)</span>
      </p>

      <!-- Single Choice -->
      <el-radio-group v-if="q.type === 'Single Choice'">
        <el-radio
          v-for="(c, j) in q.choices"
          :key="c.id"
          :label="c.text"
        >
          {{ String.fromCharCode(65 + j) }}. {{ c.text }}
        </el-radio>
      </el-radio-group>

      <!-- Multiple Choice -->
      <el-checkbox-group v-else-if="q.type === 'Multiple Choice'">
        <el-checkbox
          v-for="(c, j) in q.choices"
          :key="c.id"
          :label="c.text"
        >
          {{ String.fromCharCode(65 + j) }}. {{ c.text }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 图片 -->
      <div v-if="q.image" class="image-box">
        <img :src="q.image" alt="question image" />
      </div>
    </div>

    <el-button @click="goBack">Back</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { get_exam_api } from "@/apis/test_paper_api";

const route = useRoute();
const router = useRouter();
const paper = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id; // /test-papers/:id/preview
    paper.value = await get_exam_api(id);
    
  } catch (err) {
    console.error("❌ Failed to load paper:", err);
  }
});

function goBack() {
  router.push("/admin-home/test-papers");
}
</script>

<style scoped>
.preview-test-paper {
  padding: 20px;
}
.question {
  margin-bottom: 24px;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.meta {
  color: #888;
  font-size: 13px;
  margin-left: 8px;
}
.image-box {
  margin-top: 8px;
}
.image-box img {
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
