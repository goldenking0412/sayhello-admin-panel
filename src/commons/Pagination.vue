<template>
  <div class="boxPagination">
    <ul class="pagination justify-content-end">
      <li class="page-item"><a class="page-link" href="#" @click.prevent="previous()">Previous</a></li>
      <li class="page-item"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="#" @click.prevent="next()">Next</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    ''
  ],
  data() {
    return {
      total: 0,
      current: 1,
      maxPages: 0,
      perPage: 15
    }
  },
  methods: {
    previous() {
      if (this.current === 1) {
        return
      }

      this.current--
    },
    next() {
      if (this.current === this.maxPages) {
        return
      }

      this.current++
    }
  }
}
</script>
