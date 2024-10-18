<template>
	<div class="new-element" v-if="newElements.length > 0">
		<div class="new-element__list" v-if="showOptions">
			<router-link class="new-element__element" v-for="element in newElements" :to="{name: element.name}">{{ element.text }}</router-link>
		</div>
		<button class="new-element__button" @click="showOptions = !showOptions" :class="{'new-element__button--rotate': showOptions}">
			<icon-set icon="new_element" eclass="new-element__icon" />
		</button>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useAppStore } from '../../store/index.js'
import { useRoute} from 'vue-router'

const store = useAppStore()
const showOptions = ref(false)
const route = useRoute()

const newElements = computed(() => store.newElements)

watch(() => route.path, () => {
	showOptions.value = false
	store.new_elements([])
})

</script>

<style scope>
@import '../../assets/sass/components/_new_elements.sass'
</style>
