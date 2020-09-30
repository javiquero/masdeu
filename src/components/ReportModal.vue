<template>
    <div class="report-modal c-modal">
        <div class="c-container" >
            <a @click="close()">close</a>
            <h3>Report</h3>
			
            <form @submit.prevent>
                <div>
                    <label for="pcomment">Comments</label>
                    <textarea v-model.trim="reportData.comment" class="focusable" id="pcomment"></textarea>
                </div>

                <button @click="addReport()" :disabled="reportData.comment == ''" class="button">add report</button>
            </form>
        </div>
    </div>
</template>

<script>
import {
        mapState
    } from 'vuex'
     export default {
        props: ['project', 'report'],
        data() {
            return {
                mode:'add',
                reportData: {
					comment: '',
					idProject:''
                }
            }
        },watch: { 
			report(val, oldval) {
                if (val == undefined) {
                    this.mode = 'add';
                    this.reportData = {
						comment: '',
						idProject: this.project ? this.project.id : ''
                    }
                } else {
                    this.mode = 'edit';
                    this.reportData = {
						comment: val.comment,
						idProject: val.idProject
                    }
                }
			},
			project(val){
				if (val!=undefined)
					this.reportData.idProject= val.id;
			}           
        },
        methods: {
            addReport(){
				this.$store.dispatch('createReport', this.reportData)
                this.close();
			}, 
			close(){
				this.reportData={
					comment: '',
					idProject:''
                }
				this.$emit('close')
			}
        }
    }

</script>

<style lang="scss">
	.report-modal {
		.c-container{
			margin: 10vh auto 0 !important;
		}
		h3: {
			padding-bottom: 20px;
		}
	}
</style>

