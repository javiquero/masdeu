<template>
    <div id="projects">
        <section>
            <div class="col1">
                <div class="profile" style="text-align:center; padding-top:10px;">
                    <h5 style="margin-bottom:20px;">{{ $t("Projects") }}</h5>
                    <div class="create-project">
                        <button @click="createProject()" style="width:100%" class="button">{{ $t("Add_project") }}</button>
                    </div>
                </div>
            </div>
            <div class="col2">
                <ProjectsList :projects="projects"></ProjectsList>
            </div>
        </section>

    </div>
</template>

<script>
    import ProjectsList from '@/components/ProjectsList.vue'
    import eventBus from '@/event-bus.js'
    import {
        mapState
    } from 'vuex'
    import moment from 'moment'

    export default {
        components: {
            ProjectsList
        },
        data() {
            return {}
        },
        computed: {
            ...mapState(['projects']),
        },
        methods: {
            createProject() {
                eventBus.$emit('project:open', undefined);
            },
            
        },
        mounted() {}
    }

</script>

<style lang="scss" scoped>
    #projects {
          a:hover {
            color: white;
        }
         @media only screen and (max-width: 600px) {
                .col1{padding-top:0px; padding-bottom: 0px}
                .profile{padding-bottom:10px;}
            }
    }

  

</style>
