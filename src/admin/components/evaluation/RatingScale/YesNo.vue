<template>
    <div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="inputVal" @click="setValue(true)" :value="true"> 
            <label class="form-check-label">Yes</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="inputVal" @click="setValue(false)" :value="false"> 
          <label class="form-check-label">No</label>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],
    created() {
        if (typeof this.value == "undefined")
            this.inputVal = true;
    },
    data() {
        return { inputVal: this.value }
    },
    methods: {
        setValue(val) {
            this.inputVal = val;
        }
    },
    watch: {
        inputVal(val) {
            this.$emit('input', val);
        }
    }
}
</script>

<style scoped>
    .nactive {
        opacity: 0.4;
    }
</style>