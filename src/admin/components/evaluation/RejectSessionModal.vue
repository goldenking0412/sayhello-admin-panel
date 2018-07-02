<template>
  <modal name="precheck.reject" class="commonModal" @before-open="beforeOpen">
    <div class="p-4">
      <h4 class="text-center mb-4">Reject session</h4>
      <form @submit.prevent="validateBeforeSubmit">
        <ul class="listReasons">
          <li v-for="(reason, index) in reasons" :key="index" @click.prevent="selectReason(index)"
            :class="{active: reasonSelected == index}">
            {{ reason }}
          </li>
        </ul>
        <hr>
        <div class="text-right mt-4">
          <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
          <button class="btn btn-success btn-md ml-2">
            Reject
          </button>
        </div>
      </form>
      <loading v-if="loading"/>
    </div>
  </modal>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        reasons: [],
        sessionId: null,
        reasonSelected: null,
        params: {
          reason: '',
          precheck_status: false
        },
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        Object.assign(this.$data, this.$options.data())
        this.sessionId = event.params

        this.loading = true
        this.loadReasons()
      },
      selectReason(index) {
        this.reasonSelected = index
        this.params.reason = this.reasons[index]
      },
      loadReasons() {
        this.axios.get('/v5/common/session_reject_resons')
          .then((res) => {
            this.reasons = res.data.reasons
            this.loading = false
          })
          .catch((res) => {
            this.$flash.notify('danger', 'Can\'t load reasons. Please try again')
            this.loading = false
          })
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.rejectSession()
            return
          }
        })
      },
      rejectSession() {
        if (!this.reasonSelected) {
          this.$flash.notify('danger', "Please select a reason")
          return
        }

        this.loading = true
        this.axios.post('/v5/students/learning_nodes/' + this.sessionId + '/precheck', this.params)
          .then((res) => {
            this.loading = false
            this.close()
            this.$flash.notify('success', 'Session has been rejected successfully')
            this.$emit('session-rejected')
          })
          .catch((res) => {
            this.$flash.notify('success', 'Can\'t reject session. Please try again')
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('precheck.reject');
      }
    }
  }
</script>

<style scoped>
  .listReasons {
    list-style: none;
    padding: 0px;
    margin: 0px;
  }
  .listReasons li {
    border: 1px solid #888;
    border-radius: 3px;
    padding: 8px 10px;
    margin-bottom: 8px;
    background: #e6e6e6;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
  }
  .listReasons li.active {
    background: #FFF;
    border: 1px solid #17bb17;
  }
</style>
