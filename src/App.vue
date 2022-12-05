<template>
  <div >
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

  import eventBus from '@/event-bus.js'
  import {
      mapState
  } from 'vuex'
  import SiteNav from '@/components/SiteNav.vue'
  import ContactModal from '@/components/ContactModal.vue'
  import ProjectModal from '@/components/ProjectModal.vue'
  import ReportModal from '@/components/ReportModal.vue'
  
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
        eventBus.$on('contact:open', (contact) => this.showContact(contact));
        eventBus.$on('contact:close', () => this.hideContact());
        eventBus.$on('project:open', (project) => this.showProject(project));
        eventBus.$on('project:close', () => this.hideProject());
        eventBus.$on('report:open', (data) => this.showReport(data));
        eventBus.$on('report:close', () => this.hideReport());
      },
  }

</script>
