<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="$v.title.$model"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          >
          <label for="name">Название</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            Введите название категории
          </span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="$v.limit.$model"
            :class="{ invalid: ($v.limit.$dirty && !$v.limit.required) || ($v.limit.$dirty && !$v.limit.minValue) }"
          >
          <label for="limit">Лимит</label>
          <span 
            class="helper-text invalid"
            v-if="($v.limit.$dirty && !$v.limit.required) || ($v.limit.$dirty && !$v.limit.minValue)"
          >
            Минимальная величина {{$v.limit.$params.minValue.min}}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    title: '',
    limit: 100
  }),
  validations: {
    title: { required },
    limit: { required, minValue: minValue(100) }
  },
  mounted () {
    M.updateTextFields()
  },
  methods: {
    async submitHandler () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit
        })
        this.title = ''
        this.limit = 100
        this.$v.$reset()
        this.$message('Категория создана')
        this.$emit('created', category)
      } catch (e) {}
    }
  }
}
</script>
