<template>
  <h2 class="access__subtitle">Bienvenido a KAREWA</h2>
  <span class="access__welcome">Accede con tu correo electrónico y contraseña, si no estas registrado obtén una prueba gratuita registrándote ahora!</span>
  <Form class="form" @Submit="onSubmit" :validation-schema="loginValidateSchema" ref="loginForm" v-slot="{setErrors, handleSubmit, values, validate}">
    <fieldset class="form__fieldset">
      <div class="form__container">
        <label class="form__label form__label--inverted" for="email">Correo electrónico</label>
        <Field class="form__input form__input--inverted form__input--access form__input--email" type="email" name="email" placeholder="usuario@dominio.tld"/>
        <ErrorMessage name="email" class="form__alert" data-field="email"/>
      </div>

      <div class="form__container">
        <label class="form__label form__label--inverted" for="password">Contraseña</label>
        <Field class="form__input form__input--inverted form__input--access form__input--password" type="password" name="password" id="password" placeholder="************" />
        <ErrorMessage name="password" class="form__alert" data-field="password"/>
      </div>

      <router-link class="access__form-link" :to="{name: 'accessViewRecovery'}">¡Olvide mi contraseña!</router-link>

      <Field type="hidden" name="token" v-model="hcaptchaData"/>

      <hcaptcha-component v-if="showCaptcha" @hideCaptcha="showCaptcha = false" @releaseForm="(string) => {hcaptchaData = string, handleSubmit(onSubmit)}"></hcaptcha-component>
      <input class="form__submit btn btn__default btn--regular btn__default--warning" type="submit" value="Iniciar sesión" @click.prevent="validate().then(r => validateForm(r))"/>
    </fieldset>
  </Form>
  <router-link class="btn btn__transparent btn__transparent--light btn--regular" :to="{name: 'accessViewRegistration'}">¿No tienes una cuenta?, ¡créala ahora!</router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import { useAppStore } from '../../store/index.js'
import { userSession } from '../../helpers/set.session.js'
import { useRouter } from 'vue-router'
import hcaptchaComponent from './hcaptcha.vue'

const loginForm = ref(null)
const store = useAppStore()
const router = useRouter()
const hcaptchaData = ref(null)
const showCaptcha = ref(false)

const loginValidateSchema = yup.object().shape({
  password: yup.string().required().min(8).label('contraseña'),
  email: yup.string().required().email().label('correo electrónico')
})

function onSubmit(values, actions) {
  new apiRequest().Post({
    'module': 'access/login',
    'data': values
  }).then(response => {
    loginForm.value.resetForm()
    new userSession().set(response.data.data.access_token).then(() => {
      store.push_alert(response.data)
      router.push({name: 'homeView'})
    }).catch(error => {
      store.push_alert({code: 'SERVER-ERROR'})
    })
  }).catch(error => {
    if(error.status === 400) {
      let errors = setFieldMessages(error.data.errors)
      loginForm.value.setErrors(errors)
    } else {
      store.push_alert(error.data)
    }
  })
}

function validateForm(response) {
  if(response.valid) {
    this.showCaptcha = true
  }
}
</script>
