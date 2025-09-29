<template>
  <el-button type="primary" @click="downloadTemplate">
    📥 Download CSV Template
  </el-button>
</template>

<script setup>
function downloadTemplate() {
  const csvContent = `name,type,level,category,marks,question,choices,correctIndex
"Sample Question 1","Multiple Choice","Level 1","Vocabulary",5,"What is 2+2?","1|2|3|4","3"
"Sample Question 2","Single Choice","Level 2","Grammar",10,"Choose the correct form of the verb","Run|Running|Ran","1"
"Sample Question 3","Multiple Choice","Level 3","Vocabulary",8,"Which of these are fruits?","Apple|Car|Banana|Orange","0,2,3"
"Sample Question 4","Single Choice","Level 1","Grammar",6,"Select the article for 'apple'","a|an|the","1"`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "questions_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
