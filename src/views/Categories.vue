<template>
  <div>
    <div class="page-title">
      <h3>{{'Categories_Title' | localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading" />

      <div class="row" v-else>

        <CategoryCreate @created="addNewCategory"/>

        <CategoryEdit
          v-if="categories.length" 
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
          @removed="removeCategory"
        />

        <p class="center" v-else>
          {{'Categories_Empty' | localize}}
        </p>
        
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'

export default {
  name: 'categories',
  metaInfo() {
    return {
      title: this.$title('Categories_Title')
    }
  },
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  components: {
    CategoryCreate, CategoryEdit
  },
  methods: {
    addNewCategory (category) {
      this.categories.push(category)
    },
    updateCategories (category) {
      const idx = this.categories.findIndex(el => el.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount++
    },
    removeCategory (id) {
      const idx = this.categories.findIndex(el => el.id === id)
      this.categories.splice(idx, 1)
    }
  },
  async mounted () {
    try {
      this.categories = await this.$store.dispatch('fetchCategories')
      this.loading = false
    } catch (e) {}
  }
}
</script>
