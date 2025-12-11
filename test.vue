<template>
    <div ref="con">
        <input type="text" v-model="text" @input="handleChange" />
        <div v-if="showList">
            <div v-for="item in list" :key="item">{{ item }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')

const list = ref([])

const con=ref(null)

let showList = ref(false)



const handleChange = async (e) => {
    const data = await axios.get(`https://api.github.com/search/users?q=${e.target.value}`, {
        params: {
            q: e.target.value
        }
    })

    list.value = data.list

    showList.value = true
}

const handleClick = (e) => {
    if(!con.value.contains(e.target)) {
        showList.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClick)
})

onUnmounted(() => document.removeEventListener("click", handleClick));
</script>

<style></style>