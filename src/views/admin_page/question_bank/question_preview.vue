<template>
  <el-dialog
    v-model="visible"
    title="Preview Question"
    width="600px"
    destroy-on-close
  >
    <div v-if="question">
      <!-- 标题和分值 -->
      <p>
        <strong>{{ question.name }}</strong>
        <span v-if="question.marks">({{ question.marks }} marks)</span>
      </p>
      <p>{{ question.question_text }}</p>

      <!-- 图片展示 -->
      <div v-if="question.image" class="preview-image">
        <img :src="question.image.image" alt="question image" />
      </div>

      <!-- 单选 -->
      <el-radio-group
        v-if="question.type === 'Single Choice'"
        v-model="selectedAnswer"
      >
        <el-radio
          v-for="(choice, index) in question.choices"
          :key="choice.id || index"
          :label="index"
        >
          {{ String.fromCharCode(65 + index) }}. {{ choice.text }}
        </el-radio>
      </el-radio-group>

      <!-- 多选 -->
      <el-checkbox-group
        v-else
        v-model="selectedAnswers"
      >
        <el-checkbox
          v-for="(choice, index) in question.choices"
          :key="choice.id || index"
          :label="index"
        >
          {{ String.fromCharCode(65 + index) }}. {{ choice.text }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <template #footer>
      <el-button @click="close">Close</el-button>
      <el-button type="primary" @click="submit">Submit</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
// All comments in English
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  question: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const visible = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);
watch(visible, (val) => emit("update:modelValue", val));

const selectedAnswer = ref(null); // for single choice
const selectedAnswers = ref([]);  // for multiple choice

function close() {
  visible.value = false;
}

function submit() {
  if (props.question.type === "Single Choice") {
    emit("submit", { selected: selectedAnswer.value });
  } else {
    emit("submit", { selected: selectedAnswers.value });
  }
  visible.value = false;
}
</script>

<style scoped>
.preview-image {
  margin: 12px 0;
}
.preview-image img {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #eee;
}
</style>
