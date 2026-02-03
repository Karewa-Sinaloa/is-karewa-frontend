<template>
	<vue-hcaptcha tabindex="1" class="form__captcha" :sitekey="hCaptchaKey" theme="dark" @expired="captchaClosed" @challengeExpired="captchaClosed" @closed="captchaClosed" language="es" @verify="captchaValidation" @executed="reset()" @error="captchaError"></vue-hcaptcha>
</template>

<script setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { useAppStore } from '../../store/index.js'

const store = useAppStore()

const emit = defineEmits(['releaseForm', 'hideCaptcha'])

store.loading(true)

const hCaptchaKey = import.meta.env.VITE_HCAPTCHA_KEY
const hCaptchaEndpoint = import.meta.env.VITE_HCAPTCHA_ENDPOINT

function captchaValidation(data) {
	emit('releaseForm', data)
	captchaClosed()
}

function captchaClosed() {
	store.loading(false)
	emit('hideCaptcha')
}

function captchaError(err) {
  store.loading(false)
  store.push_alert({code: 'HCAPTCHA-ERROR', message: err})
  emit('hideCaptcha')
}
</script>
