<template>
	<div class="sidebar">
		<div class="sidebar__logo">
			<img class="sidebar__logo-image" src="../../assets/images/logo.png" alt="My company logo">
			<span class="sidebar__company-name">Monitor Karewa</span>
		</div>
		<div class="nav">
			<router-link class="nav__element" :to="{name: 'homeView'}">
				<icon-set icon="dashboard" />
				<span class="nav__element-text">Panel de control</span>
			</router-link>
      <router-link class="nav__element" :to="{name: 'organizationView'}">
        <icon-set icon="business" />
        <span class="nav__element-text">Mi organización</span>
      </router-link> 
      <span class="nav__element" @mouseover="showSubmenu($event, true)" @mouseleave="showSubmenu($event, false)">
        <div>
          <icon-set icon="business" />
          <span class="nav__element-text">Proveedores</span>
        </div>
        <div class="nav__sub-container">
          <router-link class="nav__element" :to="{name: 'proveedoresList'}">
            <icon-set icon="business" />
            <span class="nav__element-text">Todos</span>
          </router-link>
          <router-link class="nav__element" :to="{name: 'proveedoresCreate'}">
            <icon-set icon="business" />
            <span class="nav__element-text">Crear nuevo</span>
          </router-link>
        </div>
      </span>
		</div>
	</div>
</template>

<script setup>
  
function showSubmenu(e, show) {
  const submenu = e.currentTarget.querySelector('.nav__sub-container')
  if(show) {
    submenu.style.display = 'block'
  } else {
    submenu.style.display = 'none'
  }
}

</script>

<style lang="sass">
	@use "../../assets/sass/components/_sidebar.sass"
</style>
