<template>
	<footer class="public-footer">
		<div class="public-footer__inner public-container">
			<img
				class="public-footer__logo"
				:src="logo.src"
				:alt="logo.alt"
			/>
			<p class="public-footer__text">
				Plataforma digital e independiente de vigilancia ciudadana del gasto y las contrataciones públicas.
			</p>
			<p class="public-footer__legal">© {{ year }} Monitor Karewa</p>
		</div>
	</footer>
</template>

<script setup>
	import logoImg from '../../assets/images/logo.png';

	const logo = {
		src: logoImg,
		alt: 'Monitor Karewa',
	};
	const year = new Date().getFullYear();
</script>

<style lang="sass">
	@use "../../assets/sass/components/_public_footer.sass"
</style>
