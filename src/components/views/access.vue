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
				<source media="(min-width:1024px)" srcset="../../assets/images/calc_1024.jpg" />
				<source media="(min-width:640px)" srcset="../../assets/images/calc_640.jpg" />
				<img class="access__banner" src="../../assets/images/calc_350.jpg" alt="Welcome banner">
			</picture>
		</div>
	</div>
</template>

<style lang="sass">
	@import "../../assets/sass/components/_access.sass"
</style>
