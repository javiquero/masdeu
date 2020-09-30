<template>
    <div class="projects-list">
        <div v-if="projects && projects.length">
            <div v-for="project in list" :key="project.id" class="post" >
                <div style="width:70%" @click="viewproject(project)">
                    <h5>{{ project.name | trimLength}}</h5>
                    <span>{{ project.createdOn | formatDate }}</span>
                    <p>{{ project.address | trimLength }}</p>
                </div>
                <div style="width:30%;">
					<button @click="createReport(project)"  class="button"><i class="fal fa-comment-alt-plus" ></i>add report</button>                   
                </div>
            </div>
             <router-link v-if="limit!=undefined &&  list.length!=projects.length" to="/projects">Show all projects</router-link>
        </div>
        <div v-else>
            <p class="no-results">There are currently no projects</p>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
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
				this.$root.$emit('report:open', {project:project, report: undefined});
			},
            viewproject(project) {
                this.$root.$emit('project:open', project);
            }
        },
        filters: {
            formatDate(val) {
                if (!val) {
                    return '-'
                }

                let date = val.toDate()
                return moment(date).fromNow()
            },
            trimLength(val) {
				if (val.length < 200) {
                    return val
                }
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
			
			button{
				width:100%; min-width: auto; display: inline-block; text-align: center; 
				i{
					margin-right:10px;
				}
			}
		}
		.router-link-active{
			margin-top: 10px; padding-left:10px;display:block;
		}
    }

</style>
