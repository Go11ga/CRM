<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Profile_Title' | localize() }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model.trim="$v.name.$model"
          :class="{ invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength)}"
        >
        <label for="description">{{'Profile_Name' | localize}}</label>
        <small 
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >
          {{'Profile_Message_EnterName' | localize}}
        </small>
        <small 
          class="helper-text invalid"
          v-else-if="$v.name.$dirty && !$v.name.minLength"
        >
          {{'Profile_Message_NameLength' | localize }} {{$v.name.$params.minLength.min}} {{'Profile_Message_WordSymbols' | localize}}
        </small>
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Profile_Update' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'Profile',
  metaInfo() {
    return {
      title: this.$title('Profile_Title')
    }
  },
  data: () => ({
    name: '',
    isRuLocale: true
  }),
  validations: {
    name: { required, minLength: minLength(3) }
  },
  computed: {
    ...mapGetters(['info'])
  },
  mounted () {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU'

    setTimeout(() => {
      M.updateTextFields()
    })
  },
  methods: {
    ...mapActions(['updateInfo']),

    async submitHandler () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
      } catch (e) {}
    }
  }
}
</script>

<style scoped>
  .switch {
    margin-bottom: 2rem;
  }
</style>
