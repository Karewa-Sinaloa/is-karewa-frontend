<template>
	<button class="btn btn__icon btn__icon--regular btn__icon--rounded" @click="setShowOptions">
		<icon-set icon="options"/>
		<div class="result-actions" :class="{'result-actions--active': showOptions}" @click.stop>
			<span class="result-actions__triangle"></span>
			<router-link :to="optionList.go" class="result-actions__option">
				<icon-set icon="view"/>
				<span>Ver</span>
			</router-link>
			<router-link :to="{name: optionList.go.name, params: optionList.go.params, query: {edit: true}}" class="result-actions__option">
				<icon-set icon="edit"/>
				<span>Editar</span>
			</router-link>

			<button class="result-actions__option" @click="setDeleteItem">
				<icon-set icon="delete"/>
				<span>Eliminar</span>
			</button>
		</div>
	</button>
</template>


<script setup>
	import { onMounted, ref, watch, computed } from 'vue'

	const props = defineProps(['optionList'])
	const emits = defineEmits(['deleteItem'])
	const showOptions = ref(false)

document.addEventListener('click', () => {
	showOptions.value = false
})

function setShowOptions() {
	setTimeout(() => {
		showOptions.value = true
	}, 100)
}

function setDeleteItem() {
	showOptions.value = false
	emits('deleteItem', props.optionList.go.params.id)
}
</script>
