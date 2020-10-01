<template>
    <div class="tag-num-reports">
        {{maybePluralize(num ,'report')}}
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    
    export default {
        props: ['project'],
        data() {
            return {
            }
        },
        computed: {
            ...mapState(['reports']),
            num() {
                let c= this.reports.filter(i=>{ return i.idProject == this.project.id });
                return c ? c.length : 0;
            }
        },
        methods: {
            maybePluralize(count, noun, suffix = 's') {
				let t = this.$t(`${noun}${count !== 1 ? suffix : ''}`)
                return  `${count} ${t}`
            },
        },
    }

</script>

<style lang="scss" scoped>
    .tag-num-reports {
        display:inline-block; 
        font-size: 12px; 
        background-color:#eee; 
        padding: 5px; 
        border-radius: 3px; 
        margin-right:10px !important;
    }

</style>
