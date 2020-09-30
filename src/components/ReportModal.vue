<template>
    <div class="report-modal c-modal">
        <div class="c-container" >
            <a @click="close()">close</a>
            <h3>Report</h3> 
			<button @click="viewPDF()" v-if="report && report.id!=undefined" :disabled="reportData.comment == ''" class="button">
				view Pdf
			</button>
			
            <form @submit.prevent>
                <div>
                    <label for="rcomment"></label>
                    <textarea v-model.trim="reportData.comment" id="rcomment"></textarea>
                </div>
                <button @click="addReport()" v-if="!report || report.id==undefined" :disabled="reportData.comment == ''" class="button">add report</button>
                <button @click="saveProject()"  v-else :disabled="reportData == report" class="button">save changes</button>
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
				let textarea = document.getElementById("rcomment");
                if (val == undefined) {
                    this.mode = 'add';
                    this.reportData = {
						comment: '',
						idProject: this.project ? this.project.id : ''
					}
					
					textarea.style.height="";
                } else {
                    this.mode = 'edit';
                    this.reportData = {
						comment: val.comment,
						idProject: val.idProject
					}
					setTimeout(() => {
						textarea.style.height = ""; /* Reset the height*/
						textarea.style.height = Math.min(textarea.scrollHeight, 800) + "px";
					}, 200);
					
                }
			},
			project(val){
				if (val!=undefined)
					this.reportData.idProject= val.id;
			}           
		},
		mounted() {
			var textarea = document.getElementById("rcomment");
			textarea.oninput = function() {
				textarea.style.height = ""; /* Reset the height*/
				textarea.style.height = Math.min(textarea.scrollHeight, 800) + "px";
			};
		},
        methods: {
			saveProject(){
				this.reportData.id = this.report.id;
                this.$store.dispatch('saveReport', this.reportData)
                this.close();
			},
            addReport(){
				this.$store.dispatch('createReport', this.reportData)
                this.close();
			}, 
			viewPDF(){

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
		overflow-y: scroll;
		z-index: 99999;
		.c-container{
			margin: 10vh auto 0 !important;
		}
		h3: {
			padding-bottom: 20px;
		}
	}
</style>

