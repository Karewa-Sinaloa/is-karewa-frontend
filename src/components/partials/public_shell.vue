<template>
	<div class="public-view public-shell">
		<public-header />
		<main class="public-shell__main">
			<slot />
		</main>
		<public-footer />
	</div>
</template>

<script setup>
	import PublicHeader from './public_header.vue';
	import PublicFooter from './public_footer.vue';
</script>

<style lang="sass">
	@use "../../assets/sass/components/_public_shell.sass"
</style>
