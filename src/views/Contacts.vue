<template>
    <div id="contacts">
        <section>
            <div class="col1">
                <div class="profile" style="text-align:center; padding-top:10px;">
                    <h5 style="margin-bottom:20px;">{{ $t("Contacts") }}</h5>
                    <div class="create-contact">
                        <button @click="createContact()" style="width:100%" class="button">{{ $t("Add_contact") }}</button>
                    </div>
                </div>
            </div>
            <div class="col2">
                <div class="filter">
                    {{$t("Show")}} :
                    <button @click="refreshList('All')" :disabled="filter=='All'" class="button" style="margin-right:10px;">{{$t("All")}}</button>
                    <button @click="refreshList('clients')" :disabled="filter=='clients'" class="button">{{$t("Clients")}}</button>
                    <button @click="refreshList('experts')" :disabled="filter=='experts'" class="button">{{$t("Experts")}}</button>
                    <button @click="refreshList('providers')" :disabled="filter=='providers'" class="button">{{$t("Providers")}}</button>
                </div>
                <ContactsList :contacts="contactsList"></ContactsList>

            </div>
        </section>

    </div>
</template>

<script>
    import ContactsList from '@/components/ContactsList.vue'
    import eventBus from '@/event-bus.js'
    import {
        mapState
    } from 'vuex'
    // import moment from 'moment'

    export default {
        components: {
            ContactsList
        },
        data() {
            return {
                contactsList: [], 
                filter: 'All'
            }
        },
        watch: {
            contacts(val) {
                this.refreshList(this.filter);
            }
        },
        computed: {
            ...mapState(['userProfile', 'contacts']),
        },
        methods: {
            async refreshList(filter) {
                this.filter = filter;
                if (this.filter == "clients") {
                    this.contactsList = [];
                    await Promise.all(this.contacts.map(async (contact) => {
                        await Promise.all(contact.type.map(async (t) => {
                            if (t.slug == "client") this.contactsList.push(contact);
                        }));
                    }));
                } else if (this.filter == "experts") {
                    this.contactsList = [];
                    await Promise.all(this.contacts.map(async (contact) => {
                        await Promise.all(contact.type.map(async (t) => {
                            if (t.slug == "expert") this.contactsList.push(contact);
                        }));
                    }));
                } else if (this.filter == "providers") {
                    this.contactsList = [];
                    await Promise.all(this.contacts.map(async (contact) => {
                        await Promise.all(contact.type.map(async (t) => {
                            if (t.slug == "provider") this.contactsList.push(contact);
                        }));
                    }));
                } else {
                    this.contactsList = this.contacts;
                }
            },
            createContact() {
                eventBus.$emit('contact:open', undefined);
            }
        },
        mounted() {
            this.refreshList(this.filter);
        }
    }

</script>

<style lang="scss" scoped>
    #contacts {
         @media only screen and (max-width: 600px) {
                .col1{padding-top:0px; padding-bottom: 0px}
                .profile{padding-bottom:10px;}
            }
        .filter {
            button {
                padding: 5px;
                margin-right: 10px;
                min-width: 100px;
                ;
            }
            @media only screen and (max-width: 600px) {
                button {
                    padding: 5px 15px;
                    margin-right: 10px;
                    min-width: 10px;
                }
            }
            margin-bottom:10px;
        }
    }

</style>
