<template>
  <div class="boxPagination">
    <ul class="pagination justify-content-end">
      <li class="page-item" :class="{disabled: current == 1}">
        <a class="page-link" href="javascript:void(0)" @click.prevent="previous()">Prev</a>
      </li>
      <li class="page-item" v-for="(item, index) in pageItems" :key="index" :class="{active: item == current, disabled: item == '...'}">
        <a class="page-link" href="javascript:void(0)" @click.prevent="changePage(item)">
          {{ item }}
        </a>
      </li>
      <li class="page-item" :class="{disabled: current == pages}">
        <a class="page-link" href="javascript:void(0)" @click.prevent="next()">Next</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    'pages'
  ],
  data() {
    return {
      current: 1,
      pageItems: []
    }
  },
  mounted() {
    this.generatePageItems()
  },
  methods: {
    previous() {
      if (this.current === 1) {
        return
      }

      this.current--
      this.$emit('page-changed', this.current)
    },
    next() {
      if (this.current === this.pages) {
        return
      }

      this.current++
      this.$emit('page-changed', this.current)
    },
    changePage(page) {
      this.current = page
      this.$emit('page-changed', page)
    },
    generatePageItems() {
      this.pageItems = []
      if (this.pages < 6) {
        for(let index = 1; index <= this.pages; index++) {
          this.pageItems.push(index)
        }
      } else {
        if (this.current < 4) {
          for(let index = 1; index <= 5; index++) {
            this.pageItems.push(index)
          }
          this.pageItems.push('...')
          this.pageItems.push(this.pages)
        } else if(this.current + 4 > this.pages) {
          this.pageItems.push(1)
          this.pageItems.push('...')
          this.pageItems.push(this.pages - 4)
          this.pageItems.push(this.pages - 3)
          this.pageItems.push(this.pages - 2)
          this.pageItems.push(this.pages - 1)
          this.pageItems.push(this.pages)
        } else {
          this.pageItems.push(1)
          this.pageItems.push('...')
          this.pageItems.push(this.current - 1)
          this.pageItems.push(this.current)
          this.pageItems.push(this.current + 1)
          this.pageItems.push('...')
          this.pageItems.push(this.pages)
        }
      }
    },
    setCurrentPage(page) {
      this.current = page
      this.generatePageItems()
    }
  },
  watch: {
    pages() {
      this.generatePageItems()
    },
    current() {
      this.generatePageItems()
    }
  }
}
</script>
