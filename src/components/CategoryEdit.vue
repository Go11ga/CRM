<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>
          {{'Categories_Edit' | localize}}
        </h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field" >
          <select ref="select" v-model="current">
            <option 
              v-for="cat in categories" 
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.title }}
            </option>
          </select>
          <label>{{'Categories_Choose' | localize}}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="$v.title.$model"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          >
          <label for="name">{{'Categories_Name' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            {{'Categories_Name_Input' | localize}}
          </span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="$v.limit.$model"
            :class="{ invalid: ($v.limit.$dirty && !$v.limit.required) || ($v.limit.$dirty && !$v.limit.minValue) }"
          >
          <label for="limit">{{'Categories_Limit' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="($v.limit.$dirty && !$v.limit.required) || ($v.limit.$dirty && !$v.limit.minValue)"
          >
            {{'Categories_Min_Value' | localize}} {{$v.limit.$params.minValue.min}}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Categories_Update' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
      
      <button data-target="modal1" class="btn waves-effect waves-light red mt-1 modal-trigger">
        {{'Categories_Remove' | localize}}
        <i class="material-icons right">cancel</i>
      </button>

      <div id="modal1" class="modal" ref="modal">
        <div class="modal-content">
          <h4>{{'Categories_Remove_Cat' | localize}} {{ title }} ?</h4>
        </div>
        <div class="modal-footer">
          <button class="btn waves-effect waves-light red" @click.prevent="remove">
            {{'Categories_Remove' | localize}}
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    limit: 100,
    current: null
  }),
  validations: {
    title: { required },
    limit: { required, minValue: minValue(100) }
  },
  watch: {
    current (catId) {
      const { title, limit } = this.categories.find(c => c.id === catId)
      this.title = title
      this.limit = limit
    }
  },
  methods: {
    async submitHandler () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }

        await this.$store.dispatch('updateCategory', categoryData)
        this.$message('Категория обновлена')
        this.$emit('updated', categoryData)
      } catch (e) {}
    },
    async remove () {
      try {
        await this.$store.dispatch('removeCategory', this.current)
        this.$message('Категория удалена')
        this.$emit('removed', this.current)
        
      } catch (e) {

      } finally {
        const elem = this.$refs.modal
        const instance = M.Modal.getInstance(elem)
        instance.close()
      }
    }
  },
  created () {
    const { id, title, limit } = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  mounted () {
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()

    const elem = this.$refs.modal
    M.Modal.init(elem);
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>

<style scoped lang="scss">
  .mt-1 {
    margin-top: 1rem;
  }
</style>
