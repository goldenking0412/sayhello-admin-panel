<template>
    <div>
        <div class="btn btn-primary" :class="{nactive:!inputVal}" @click="inputVal = true">Yes</div>&nbsp;
        <div class="btn btn-warning" :class="{nactive:inputVal}" @click="inputVal = false">No</div>
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