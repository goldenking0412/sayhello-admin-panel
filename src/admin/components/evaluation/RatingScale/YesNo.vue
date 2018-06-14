<template>
    <div>
        <label>
            <input type="radio" v-model="inputVal" @click="setValue(true)" :value="true"> Yes
        </label>

        <label>
            <input type="radio" v-model="inputVal" @click="setValue(false)" :value="false"> No
        </label>

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