<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{'Register_Name' | localize}}</span>

      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="$v.email.$model"
          :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
        >
        <label for="email">Email</label>
        <small class="helper-text invalid"
          v-if="$v.email.$dirty && !$v.email.required"
        >
          {{'Register_Email_Empty' | localize}}
        </small>
        <small class="helper-text invalid"
          v-else-if="$v.email.$dirty && !$v.email.email"
        >
          {{'Register_Email_Input' | localize}}
        </small>
      </div><!-- /. Email -->

      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="$v.password.$model"
          :class="{ invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">{{'Register_Password' | localize}}</label>
        <small 
          class="helper-text invalid"
          v-if="$v.password.$dirty && !$v.password.required"
        >
          {{'Register_Password_Enter' | localize}}
        </small>
        <small 
          class="helper-text invalid"
          v-else-if="$v.password.$dirty && !$v.password.minLength"
        >
          {{'Register_Password_Must' | localize}} {{$v.password.$params.minLength.min}} {{'Register_Password_Symbols' | localize}}
        </small>
      </div><!-- /. Password -->

      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="$v.name.$model"
          :class="{ invalid: $v.password.$dirty && !$v.password.required }"
        >
        <label for="name">{{'Register_Enter_Name' | localize}}</label>
        <small 
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >
          {{'Register_Enter_Name_Input' | localize}}
        </small>
      </div><!-- /. Name -->

      <p>
        <label>
          <input type="checkbox" v-model="$v.agree.$model" />
          <span>{{'Register_Enter_Accept' | localize}}</span>
        </label>
      </p>

    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          {{'Register_Register' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{'Register_Have_Account' | localize}}
        <router-link to="/login">{{'Register_Enter' | localize}}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'register',
  metaInfo() {
    return {
      title: this.$title('Register_Title')
    }
  },
  data: () => ({
    email: '',
    password: '',
    name: '',
    agree: false
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
    name: { required },
    agree: { checked: v => v }
  },
  methods: {
    async submitHandler () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      }

      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
      } catch (e) {}
    }
  }
}
</script>
