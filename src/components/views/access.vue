<script setup>
</script>

<template>
	<div class="access">
		<div class="access__column access__column--left">
			<div class="access__hub">
				<router-view></router-view>
			</div>
		</div>
		<div class="access__column access__column--right desktop-view">
			<picture>
				<source media="(min-width:1024px)" srcset="../../assets/images/calc_1024.webp" />
				<source media="(min-width:640px)" srcset="../../assets/images/calc_640.webp" />
				<img class="access__banner" src="../../assets/images/calc_350.webp" alt="Welcome banner">
			</picture>
		</div>
	</div>
</template>

<style lang="sass">
	@use "../../assets/sass/components/_access.sass"
</style>
