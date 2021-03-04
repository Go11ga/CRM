<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      exact
    >
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
import localizeFilter from '@/filters/localize.filter'

export default {
  props: ['value'],
  data () {
    return {
      links: [
        { title: localizeFilter('Sidebar_Bill'), url: '/' },
        { title: localizeFilter('Sidebar_History'), url: '/history' },
        { title: localizeFilter('Sidebar_Planning'), url: '/planning' },
        { title: localizeFilter('Sidebar_New_Record'), url: '/record' },
        { title: localizeFilter('Sidebar_Categories'), url: '/categories' },
      ]
    }
  }
}
</script>
