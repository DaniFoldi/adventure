<script lang="ts" setup>
  import { onMounted, ref } from 'vue'


  const isLoading = ref(true)
  const story = ref<Array<{role: string; content: string}>>([])

  onMounted(async () => {
    const response = await fetch('/api/adventure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify([])
    })
    story.value = await response.json()
    isLoading.value = false
    console.log(story.value)
  })

  async function step(value: 'A' | 'B' | 'C') {
    isLoading.value = true
    story.value.push({
      role: 'user',
      content: `I choose ${value}!`
    })
    const response = await fetch('/api/adventure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(story.value)
    })
    story.value = await response.json()
    isLoading.value = false
  }
</script>

<template>
  <div class="bg-gray-200 is-centered nes-container with-title">
    <p class="title">
      Welcome, adventurer!
    </p>
    <p>This is a text-based adventure game running on Cloudflare Workers</p>
    <p>It uses Workers AI to generate the stories.</p>
    <p>Read about it <a href="https://danifoldi.com/blog/posts/adventure">here</a>.</p>
  </div>
  <section class="message-list">
    <template v-for="[ index, item ] in story.entries()" :key="index">
      <div v-if="item.role === 'assistant'">
        <div class="from-left nes-balloon" :class="{ 'is-primary': index === 0 }">
          <template v-for="paragraph in item.content.split(/\n/).filter(Boolean)" :key="paragraph">
            <p class="leading-normal mb-2">
              {{ paragraph }}
            </p>
          </template>
        </div>
        <div v-if="item.content.endsWith('?') && story.at(-1) === item" class="bg-gray-200 gap-4 grid grid-cols-3 group justify-items-stretch nes-container">
          <button
            class="is-primary nes-btn"
            :class="{ 'is-disabled': isLoading }"
            :disabled="isLoading"
            type="button"
            @click="step('A')"
          >
            A
          </button>
          <button
            class="is-primary nes-btn"
            :class="{ 'is-disabled': isLoading }"
            :disabled="isLoading"
            type="button"
            @click="step('B')"
          >
            B
          </button>
          <button
            class="is-primary nes-btn"
            :class="{ 'is-disabled': isLoading }"
            :disabled="isLoading"
            type="button"
            @click="step('C')"
          >
            C
          </button>
        </div>
      </div>
      <div v-else-if="item.role === 'user'">
        <div class="from-right nes-balloon">
          <p>{{ item.content }}</p>
        </div>
      </div>
    </template>
    <div v-if="isLoading" class="bg-gray-400 nes-container">
      <p>Loading...</p>
    </div>
  </section>
</template>
