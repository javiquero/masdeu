<template>
    <div id="app">
        <SiteNav v-if="showNav"></SiteNav>
        <transition name="fade">
            <ContactModal v-show="visibleContact" :contact="selectedContact" @close="hideContact()"></ContactModal>
        </transition>
        <transition name="fade">
            <ProjectModal v-show="visibleProject" :project="selectedProject" @close="hideProject()"></ProjectModal>
        </transition>
		<transition name="fade">
            <ReportModal v-show="visibleReport" :project="selectedProject" :report="selectedReport" @close="hideReport()"></ReportModal>
        </transition>
        <router-view />
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    import SiteNav from '@/components/SiteNav'
	import ContactModal from '@/components/ContactModal'
	import ProjectModal from '@/components/ProjectModal'
	import ReportModal from '@/components/ReportModal'

    export default {
        components: {
            SiteNav, ContactModal, ProjectModal, ReportModal
        },
        computed: {
            ...mapState(['userProfile']),
            showNav() {
                return Object.keys(this.userProfile).length > 0
            }
		},
		data() {
			return {
				visibleContact: false,
				selectedContact: undefined,
				visibleProject: false,
				selectedProject: undefined,
				visibleReport: false,
				selectedReport: undefined,
			}
		},
		watch: {
			userProfile(val){
				this.$i18n.locale=val.lang || "en";
			}
		},
		methods: {
			showContact(contact){
				this.visibleContact=true;
				this.selectedContact = contact;
			},
			hideContact(){
				this.visibleContact=false;
				this.selectedContact = undefined;
			},
			showProject(project){
				this.visibleProject=true;
				this.selectedProject = project;
			},
			hideProject(){
				this.visibleProject=false;
				this.selectedProject = undefined;
			},
			showReport(data){
				this.visibleReport=true;
				this.selectedProject = data.project;
				this.selectedReport = data.report;
			},
			hideReport(){
				this.visibleReport=false;
				if (!this.visibleProject) this.selectedProject = undefined;
				this.selectedReport = undefined;
			}
		},
        mounted() {
			const $root = this.$root;
            $root.$on('contact:open', (contact) => this.showContact(contact));
			$root.$on('contact:close', () => this.hideContact());
			$root.$on('project:open', (project) => this.showProject(project));
			$root.$on('project:close', () => this.hideProject());
			$root.$on('report:open', (data) => this.showReport(data));
            $root.$on('report:close', () => this.hideReport());
        },
    }

</script>
