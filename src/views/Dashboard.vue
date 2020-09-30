<template>
    <div id="dashboard">

        <section>
            <div class="col1">
                <div class="profile">
                    <h5>Hi {{ userProfile.name }}!!</h5>
                    <p>What do you want to do today ?</p>
                    <div class="create-post">
                        <button @click="createContact()" class="button">Add contact</button>
                        <button @click="createProject()" class="button">Add project</button>
                    </div>
                </div>
            </div>
            <div class="col2">
                <div style="margin-bottom:20px;" v-show="projects.length>0">
                     <h4 >Last projects</h4>
                     <ProjectsList :limit="5" :projects="projects"></ProjectsList>
                </div>
                <div style="margin-bottom:20px;" v-show="contacts.length>0">
                    <h4 >Last contacts</h4>
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
    import ProjectsList from '@/components/ProjectsList'
    import ContactsList from '@/components/ContactsList'

    export default {
        components: {
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
