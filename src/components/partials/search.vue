<template>
	<div class="search">
		<div class="search__container">
			<h1 class="search__title">Búsqueda</h1>
			<form class="form">
				<div class="form__container form__container--half">
					<input class="form__input" type="search" placeholder="Buscar ...">
				</div>
			</form>
			<div class="s-results">
				<div class="s-results__header">

					<div class="s-results__column">
						<span class="s-results__column-id">Código</span>
					</div>
					
					<div class="s-results__column">
						<span class="s-results__column-id">Descripción</span>
					</div>

				</div>
				<div class="s-results__result">
					<div class="s-results__column">
						<span class="s-results__data s-results__data--main"></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
	@import "../../assets/sass/components/_search.sass"
	@import "../../assets/sass/components/_results.sass"
</style>
