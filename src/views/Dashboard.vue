<template>
    <div id="dashboard">

        <section>
            <div class="col1">
                <div class="profile">
                    <h5>{{$t("Hi")}} {{ userProfile.name }}!!</h5>
                    <p>{{$t("WhatDoYouWant")}}</p>
                    <div class="create-post">
                        <button @click="createContact()" class="button">{{$t("Add_contact")}}</button>
                        <button @click="createProject()" class="button">{{$t("Add_project")}}</button>
                    </div>
                </div>
            </div>
            <div class="col2">
                <!-- <div style="margin-bottom:20px;" v-show="projects.length>0">
                     <h4 >Last report</h4>
                     <ReportsList :project="projects?projects[0]:undefined"></ReportsList>
                </div> -->
                <div style="margin-bottom:20px;" v-show="projects.length>0">
                     <h4 >{{$t("LastProjects")}}</h4>
                     <ProjectsList :limit="5" :projects="projects"></ProjectsList>
                </div>
                <div style="margin-bottom:20px;" v-show="contacts.length>0">
                    <h4 >{{$t("LastContacts")}}</h4>
                     <ContactsList :limit="5" :contacts="contacts"></ContactsList>
                </div>   
            </div>
        </section>

    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    // import ReportsList from '@/components/ReportsList'
    import ProjectsList from '@/components/ProjectsList'
    import ContactsList from '@/components/ContactsList'

    export default {
        components: {
            // ReportsList,
            ProjectsList,
            ContactsList
        },
        data() {
            return {}
        },
        computed: {
            ...mapState(['userProfile', 'contacts', 'projects'])
        },
        methods: {
            createProject() {
                this.$root.$emit('project:open', undefined);
            },
            createContact() {
                this.$root.$emit('contact:open', undefined);
            }
        }
    }

</script>

<style lang="scss" scoped>
    a:hover {
        color: white;
    }

</style>
