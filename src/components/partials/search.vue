<template>
	<div class="search">
		<div class="search__container">
			<h1 class="search__title">Búsqueda</h1>
			<form class="form">
				<div class="form__container form__container--half">
					<input class="form__input" type="search" placeholder="Buscar ...">
				</div>
			</form>
			<div class="results">
				<div class="results__header">
					<div class="results__column">
						<span class="result__column-id">Descripción</span>
					</div>

					<div class="results__column">
						<span class="result__column-id">Código</span>
					</div>

					<div class="results__column">
						<span class="result__column-id">Acciones</span>
					</div>
				</div>
				<div class="result">

				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
	@import "../../assets/sass/components/_search.sass"
	@import "../../assets/sass/components/_results.sass"
</style>
