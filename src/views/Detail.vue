<template>
  <div>
    <Loader v-if="loading" />

    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">
          {{'Detail_History' | localize}}
        </router-link>
        <a class="breadcrumb" @click.prevent>
          {{ record.type === 'income' ? income : outcome }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div 
            class="card"
            :class="{
              'red' : record.type === 'outcome',
              'green' : record.type === 'income'
            }"
          >
            <div class="card-content white-text">
              <p>{{'Detail_Desciption' | localize}}: {{record.description}}</p>
              <p>{{'Detail_Sum' | localize}}: {{record.amount | currency}}</p>
              <p>{{'Detail_Category' | localize}}: {{record.categoryName}}</p>

              <small>{{record.date | date('datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <p class="center" v-else>
      {{'Detail_Record' | localize}} = {{ $route.params.id }} {{'Detail_Not_Found' | localize}}
    </p>

  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'detail',
  metaInfo() {
    return {
      title: this.$title('Detail_Title')
    }
  },
  data: () => ({
    record: null,
    loading: true
  }),
  computed: {
    income () {
      return localizeFilter('Detail_Income')
    },
    outcome () { 
      return localizeFilter('Detail_Outcome')
    }
  },
  async mounted () {
    try {
      const id = this.$route.params.id
      const record = await this.$store.dispatch('fetchRecordById', id)
      const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

      this.record = {
        ...record,
        categoryName: category.title
      }

      this.loading = false
    } catch (e) {}
  }
}
</script>
