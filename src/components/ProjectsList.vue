<template>
    <div class="projects-list">
        <div v-if="projects && projects.length">
            <div v-for="project in list" :key="project.id" class="post" >
                <div style="width:70%" @click="viewproject(project)">
                    <h5>{{ trimLength(project.name)}}</h5> <LabelNumReports style="position: absolute;" :project="project"></LabelNumReports>
                    <span>{{ formatDate(project.createdOn)}}</span>
                    <p>{{ trimLength(project.address) }}</p>
                </div>
                <div style="width:30%;">
                    <button @click="createReport(project)"  class="button"><i class="fal fa-comment-alt-plus" ></i><p>{{ $t("add") }} </p> {{ $t("report") }} </button>                   
                </div>
            </div>
             <router-link v-if="limit!=undefined &&  list.length!=projects.length" to="/projects"> {{ $t("Show_all_projects") }}</router-link>
        </div>
        <div v-else>
            <p class="no-results">{{ $t("No_projects") }}</p>
        </div>
    </div>
</template>

<script>
    import eventBus from '@/event-bus.js'
    import LabelNumReports from "@/components/LabelNumReports.vue"
    import moment from 'moment'
  
    export default {
        components: {LabelNumReports},
        props: ['projects', 'limit'],
        data() {
            return {
            }
        },
        computed: {
            list() {
                if (this.limit!=undefined) return this.projects.slice(0,this.limit);
                return this.projects;
            }
        },
        methods: {
            createReport(project){
                eventBus.$emit('report:open', {project:project, report: undefined});
            },
            viewproject(project) {
                eventBus.$emit('project:open', project);
            },
            formatDate(val) {
                if (!val) return '-';
                return moment(val.toDate()).locale(this.$i18n.locale).fromNow()
            },
            trimLength(val) {
                if (val.length < 200) return val 
                return `${val.substring(0, 200)}...`
            }
        }
    }

</script>

<style lang="scss" scoped>
    .projects-list {
        a:hover {
            color: white;
        }
        .router-link-active{
            margin-top:20px;
        }
        
        .post {
            display:flex;			
            h5 {display:inline-block; margin-right: 20px !important;  }
            @media only screen and (max-width: 600px) {

                h5 {max-width:100px;  white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
            }
            button{
                width:100%; min-width: auto; display: inline-block; text-align: center; 
                i{ margin-right:10px; }
                p{
                    display: inline;
                }
                @media only screen and (max-width: 768px) {
                    i{ margin-right:0px; }
                    p { display:none; }
                }
            }
        }
        .router-link-active{
            margin-top: 10px; padding-left:10px;display:block;
        }
    }

</style>
