<template>
    <div class="project-modal c-modal">
        <div class="c-container" >
            <a @click="close()">{{ $t("close") }}</a>
            <h3 >{{ $t("Project") }}</h3>

            <form @submit.prevent>
                <div>
                    <label for="pname">{{ $t("Name") }}</label>
                    <input v-model.trim="projectData.name" type="text" class="focusable" placeholder="" id="pname" />
                </div>
                <div>
                    <label for="paddress">{{ $t("Address") }}</label>
                    <input v-model.trim="projectData.address" type="text" class="focusable" placeholder="" id="paddress" />
                </div>
                <div>
                    <label for="pclient">{{ $t("Client") }}</label>
                    <DropdownMulti :data="clients" title="" :value="projectData.clients" @add="addNewClient" fkey="name"></DropdownMulti>
                </div>
                <div>
                    <label for="pexpert">{{ $t("Expert") }}</label>
                    <DropdownMulti :data="experts" title="" :value="projectData.experts" @add="addNewExpert" fkey="name"></DropdownMulti>
                </div>

                <div>
                    <label for="pcomment">{{ $t("Comments") }}</label>
                    <textarea v-model.trim="projectData.comment" class="focusable" id="pcomment"></textarea>
                </div>
                 <div v-if="project && project.id!=undefined" >
                    <label for="pcomment">{{ $t("Reports") }}</label>
                    <ReportsList :project="project"></ReportsList>
                </div>

                <button @click="addProject()" v-if="!project || project.id==undefined" :disabled="projectData.name == ''" class="button">add project</button>
                <div v-else> <button @click="createReport(project)"   style="" class="button"><i class="fal fa-comment-alt-plus"></i>{{ $t("Add_report") }}</button>   
                <br>
                    <button @click="saveProject()" :disabled="projectData == project" class="button">{{ $t("Save_changes") }}</button>
                   
                    <button @click="deleteProject()" style="margin-left:10px;" class="button danger">{{ $t("Delete") }}</button>
                </div>
                
            </form>
        </div>
    </div>
</template>

<script>
import {
        mapState
    } from 'vuex'
    import ReportsList from '@/components/ReportsList'
    import DropdownMulti from '@/components/dropdownMulti'
    export default {
        components: {
            DropdownMulti, ReportsList
        },
        props: ['project'],
        data() {
            return {
                clients: [],
                experts:[],
                mode:'add',
                projectData: {
                    name: '',
                    address: '',
                    clients: [],
                    experts: [],
                    status: 'Active',
                    comment: ''
                }
            }
        },watch: { 
            project(val, oldval) {
                if (this.project == undefined) {
                    this.mode = 'add';
                    this.projectData = {
                        name: '',
                        address: '',
                        clients: [],
                        experts: [],
                        status: 'Active',
                        comment: ''
                    }
                } else {
                    this.mode = 'edit';
                    this.projectData = {
                        name: this.project.name,
                        address: this.project.address,
                        clients: this.project.clients,
                        experts: this.project.experts,
                        status: this.project.status,
                        comment: this.project.comment
                    }
                }
            },
            contacts(val) {
                this.refreshList();
            }
        },
        computed: {
            ...mapState(['contacts']),
        },
        methods: {
             async refreshList() {
                this.clients = [];
                await Promise.all(this.contacts.map(async (contact) => {
                    await Promise.all(contact.type.map(async (t) => {
                        if (t.slug == "client") this.clients.push(contact);
                    }));
                }));

                this.experts = [];
                await Promise.all(this.contacts.map(async (contact) => {
                    await Promise.all(contact.type.map(async (t) => {
                        if (t.slug == "expert") this.experts.push(contact);
                    }));
                }));
            },
           addNewExpert(d){
                this.$root.$emit('contact:open',{name: d,
                    address: '',
                    phone1: '',
                    phone2: '',
                    type:[{"name":"Expert","id":1,"slug":"expert"}],
                    email: '',
                    comment: ''});
            },
           addNewClient(d){
                this.$root.$emit('contact:open',{name: d,
                    address: '',
                    phone1: '',
                    phone2: '',
                    type:[{"name":"Client","id":0,"slug":"client"}],
                    email: '',
                    comment: ''});
           },
            addProject(){
                this.$store.dispatch('createProject', this.projectData)
                 this.close();
            },
            saveProject(){
                this.projectData.id = this.project.id;
                this.$store.dispatch('saveProject', this.projectData)
                 this.close();
            },
             deleteProject(){
                this.projectData.id = this.project.id;
                this.$store.dispatch('deleteProject', this.projectData)
                this.close()
            },
            createReport(project){
                this.$root.$emit('report:open', {project:project, report: undefined});
            },
            close(){
                this.projectData={
                    name: '',
                    address: '',
                    clients: [],
                    experts: [],
                    status: 'Active',
                    comment: ''
                }
                this.$emit('close')
            }
        },mounted() {
            this.refreshList(this.filter);
        }
    }

</script>

<style lang="scss">
    .project-modal {
        overflow-y: scroll;
         i{
                    margin-right:10px;
                }
        .c-container{
            margin: 10vh auto 0 !important;
        }
        h3: {
            padding-bottom: 20px;
        }
    }
</style>