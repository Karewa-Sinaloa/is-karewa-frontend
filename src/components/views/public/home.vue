<template>
	<div class="public-view">
		<public-header />
		<section class="home-hero">
			<picture class="home-hero__media">
				<source
					media="(min-width:1024px)"
					srcset="../../../assets/images/hero_home.webp"
				/>
				<img
					src="../../../assets/images/hero_home_mobile.webp"
					alt=""
				/>
			</picture>
			<div class="home-hero__overlay"></div>
			<div class="home-hero__content">
				<h1 class="home-hero__title">Somos Monitor Karewa</h1>
				<p class="home-hero__text">Monitor Karewa es una plataforma digital e independiente de vigilancia ciudadana que mide y hace pública la información sobre el gasto y las contrataciones públicas de los gobiernos (como compras, rentas, servicios y obras públicas).</p>
			</div>
		</section>
	</div>
</template>

<script setup>
	import PublicHeader from '../../partials/public_header.vue';
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_home_hero.sass"
</style>
