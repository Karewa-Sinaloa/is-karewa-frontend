<template>
	<div class="autocomplete" v-if="elementList.length > 0 && displayOptions" ref="eList">
		<span class="autocomplete__option" v-for="option in elementList" @click.prevent="changeElement(option.name)">{{option.name}}</span>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['elements', 'stringValue', 'showOptions'])
const emit = defineEmits(['newStringValue'])
const currentElement = ref(null)
const elementList = ref([])
const eList = ref([])
const displayOptions = ref(false)

onMounted(() => {
	returnElementOptions()
	//document.addEventListener('keyup', e => {
	//	if(eList.value != null) {
	//		let options = eList.value.querySelectorAll('span')
	//		if(e.keyCode == 38 && elementList.value.length > 0) {
	//			options[0].focus()
	//		}
	//	}
	//})
})

watch(() => props.stringValue, () => {
	returnElementOptions()
})

watch(() => props.showOptions, () => {
	setTimeout(() => {
		displayOptions.value = props.showOptions
	}, 200)
	returnElementOptions()
})

function returnElementOptions() {
	elementList.value = props.elements
	if(props.stringValue && props.stringValue.length > 0) {
		elementList.value = []
		props.elements.forEach(el => {
			let regex = new RegExp(`^${props.stringValue}`, 'i')
			if(el.name.match(regex) && el.name != props.stringValue) {
				elementList.value.push(el)
			} else if(props.stringValue == el.name) {
				elementList.value = []
			}
		})
	}
}

function changeElement(value) {
	emit('newStringValue', value)
	if(value == props.stringValue) {
		elementList.value = []
	}
}
</script>
