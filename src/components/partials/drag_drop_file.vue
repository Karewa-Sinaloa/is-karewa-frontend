<template>
	<div class="drag-drop" :class="[{'drag-drop--out': fileIsOut}, {'drag-drop--in': fileIsIn}]" @dragleave.prevent="setDragLeave" @dragover.prevent="setDragOver" @drop.prevent="dropFile" draggable="true">
		<label class="drag-drop__label" :for="props.id" :id="props.id" v-text="props.texts.title"></label>
		<span class="drag-drop__help" v-text="props.texts.text"></span>
		<button class="btn btn__outlined btn--small btn__outlined--primary" v-if="!responseData">
			<span v-text="props.texts.button_text"></span>
			<input class="drag-drop__input" type="file" :id="props.id" :name="props.id" :accept="props.accept" @change="setFile"/>
		</button>
		<div v-else>
			<span class="drag-drop__success material-symbols-outlined">cloud_done</span>
			<span class="drag-drop__remove material-symbols-outlined" @click="removeFile">delete</span>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['texts', 'id', 'accept', 'module'])
import { apiRequest } from '../../api/requests.js'
import { useAppStore } from '../../store/index.js'

const emit = defineEmits(['filename', 'remove'])

const fileIsOut = ref(null)
const fileIsIn = ref(null)
const store = useAppStore()
const file = ref({
	name: props.id,
	file: null
})
const responseData = ref(null)

function setDragOver() {
	fileIsOut.value = false
	fileIsIn.value = true
}

function setDragLeave() {
	fileIsIn.value = false
	fileIsOut.value = true
}

function uploadFile(file) {
	new apiRequest('multipart/form-data').Upload({
		module: props.module,
		files: [file]
	}).then(response => {
		responseData.value = response.data.data
		emit('filename', response.data.data.filename)
	}).catch(error => {
		console.log(error)
		store.push_alert(error.data)
	})
}

function dropFile(e) {
	fileIsIn.value = false
	fileIsOut.value = false
	file.value.file = e.dataTransfer.items[0].getAsFile()
	uploadFile(file.value)
}

function setFile(e) {
	file.value.file = e.target.files[0]
	uploadFile(file.value)
}

 function removeFile() {
	 responseData.value = null
	 emit('remove')
 }
</script>
