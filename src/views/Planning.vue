<template>
  <div>
    <div class="page-title">
      <h3>
        {{'Planning_Title' | localize}}
      </h3>
      <h4>{{info.bill | currency('RUB') }}</h4>
    </div>

    <Loader v-if="loading" />

    <p 
      class="center"
      v-else-if="!categories.length"
    >
      {{'Planning_Categories_Empty' | localize}}
      <router-link to="/categories">
        {{'Planning_Categories_Add' | localize}}
      </router-link>
    </p>

    <section v-else>
      <div 
        v-for="cat in categories"
        :key="cat.id"
      >
        <p>
          <strong>{{cat.title}}</strong>
          {{cat.spent | currency }} {{'Planning_From' | localize}} {{cat.limit | currency }}
        </p>
        <div class="progress" v-tooltip.noloc="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import currencyFilter from '@/filters/currency.filter'
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'planning',
  metaInfo() {
    return {
      title: this.$title('Planning_Title')
    }
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info']),
    above () {
      return localizeFilter('Planning_Above')
    },
    remains () {
      return localizeFilter('Planning_Remain')
    }
  },
  async mounted () {
    try {
      const records = await this.$store.dispatch('fetchRecords')
      const categories = await this.$store.dispatch('fetchCategories')

      this.categories = categories.map(cat => {
        const spent = records
          .filter(r => r.categoryId === cat.id)
          .filter(r => r.type === 'outcome')
          .reduce((total, record) => {
            return total += +record.amount
          }, 0)
        
        const percent = 100 * spent / cat.limit
        const progressPercent = percent > 100 ? 100 : percent
        const progressColor = percent < 60 
          ? 'green'
          : percent < 100
            ? 'yellow'
            : 'red'
        
        const tooltipValue = cat.limit - spent
        const tooltip = `${tooltipValue < 0 ? this.above : this.remains } ${currencyFilter(Math.abs(tooltipValue))}`

        return {
          ...cat,
          progressPercent,
          progressColor,
          spent,
          tooltip
        }
      })

      this.loading = false
    } catch (e) {}
  }
}
</script>
