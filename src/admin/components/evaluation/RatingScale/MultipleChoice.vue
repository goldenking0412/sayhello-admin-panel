<template>
    <div>
        <p v-for="choice in choices">
            <label>
                <input type="radio" v-model="selectedVal" @click="setValue(choice.value)" :value="choice.value"> {{ choice.title }}
            </label>
        </p>
        

    </div>
</template>

<script>
export default {
    props: ['value', 'choices'],
    created() {
        
    },
    data() {
        return { 
            selectedVal: this.value,
            inputVal: this.value
        }
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