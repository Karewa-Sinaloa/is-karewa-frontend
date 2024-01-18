<template>
	<div class="d-flex access-container access-bg-color">
		<div class="col-6 align-items-center row justify-content-center mx-0 access-container__col">
			<div class="col-6">
				<router-view></router-view>
			</div>
		</div>
		<div class="col-6 mx-0 access-container__col">
			<picture>
				<source media="(min-width:1024px)" srcset="../../assets/images/calc_1024.jpg" />
				<source media="(min-width:640px)" srcset="../../assets/images/calc_640.jpg" />
				<img class="d-block w-100 object-fit-cover" style="height: 100%" src="../../assets/images/calc_350.jpg" alt="Welcome banner">
			</picture>
		</div>
	</div>
</template>

<script setup>
</script>
