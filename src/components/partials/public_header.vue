<template>
	<header class="public-header">
		<div class="public-header__inner public-container">
			<router-link
				v-if="logoLink"
				class="public-header__brand"
				:to="logoLink"
			>
				<img
					v-if="logo"
					class="public-header__logo"
					:src="logo.src"
					:alt="logo.alt"
				/>
			</router-link>
			<img
				v-else-if="logo"
				class="public-header__logo"
				:src="logo.src"
				:alt="logo.alt"
			/>
			<nav
				class="public-header__nav"
				aria-label="Navegación principal"
			>
				<ul class="public-header__menu">
					<li
						v-for="link in links"
						:key="link.to ?? link.href"
					>
						<router-link
							v-if="link.to"
							class="public-header__link"
							:to="link.to"
						>{{ link.label }}</router-link>
						<a
							v-else
							class="public-header__link"
							:href="link.href"
						>{{ link.label }}</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script setup>
	import logoImg from '../../assets/images/logo.png';
	import { publicNavLinks } from '../../helpers/public.nav.js';

	defineProps({
		logo: {
			type: Object,
			default: () => ({
				src: logoImg,
				alt: 'Monitor Karewa',
			}),
		},
		logoLink: {
			type: [String, Object],
			default: () => ({ name: 'publicHomeView' }),
		},
		links: {
			type: Array,
			default: () => publicNavLinks,
		},
	});
</script>

<style lang="sass">
	@use "../../assets/sass/components/_public_header.sass"
</style>
