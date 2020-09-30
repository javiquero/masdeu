<template>
    <div class="report-modal c-modal">
        <div class="c-container">
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
                <button @click="saveProject()" v-else :disabled="reportData == report" class="button">save changes</button>
            </form>
        </div>
    </div>
</template>

<script>
    import {
        mapState
	} from 'vuex'
	
	import { jsPDF } from "jspdf";
    export default {
        props: ['project', 'report'],
        data() {
            return {
                mode: 'add',
                reportData: {
                    comment: '',
                    idProject: ''
                }

            }
        },
        watch: {
            report(val, oldval) {
                let textarea = document.getElementById("rcomment");
                if (val == undefined) {
                    this.mode = 'add';
                    this.reportData = {
                        comment: '',
                        idProject: this.project ? this.project.id : ''
                    }

                    textarea.style.height = "";
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
            project(val) {
                if (val != undefined)
                    this.reportData.idProject = val.id;
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
            saveProject() {
                this.reportData.id = this.report.id;
                this.$store.dispatch('saveReport', this.reportData)
                this.close();
            },
            addReport() {
                this.$store.dispatch('createReport', this.reportData)
                this.close();
			},
			addWrappedText({text, textWidth, doc, fontSize = 10, fontType = 'normal', lineSpacing = 7, xPosition = 10, initialYPosition = 10, pageWrapInitialYPosition = 10}) {
				var textLines = doc.splitTextToSize(text, textWidth); // Split the text into lines
				var pageHeight = doc.internal.pageSize.height - 20;        // Get page height, well use this for auto-paging
				// doc.setFontType(fontType);
				doc.setFontSize(fontSize);

				var cursorY = initialYPosition;

				textLines.forEach(lineText => {
					if (cursorY > pageHeight) { // Auto-paging
					doc.addPage();
					cursorY = pageWrapInitialYPosition;
					}
					doc.text(xPosition, cursorY, lineText);
					cursorY += lineSpacing;
				})
			},
            viewPDF() {
                    
                    const doc = new jsPDF({
                        orientation: "portrait",
                        // unit: "in",
                        // format: "a4"
					});
					doc.setFontSize(30).text(this.project.name, 40, 35);
					doc.setFontSize(15).text(this.project.address, 40, 42);
					doc.addImage("logo.png", "PNG", 15, 23, 20, 20);

					this.addWrappedText({
						text: this.reportData.comment, // Put a really long string here
						textWidth: 200,
						doc,

						// Optional
						fontSize: '12',
						fontType: 'normal',
						lineSpacing: 7,               // Space between lines
						xPosition: 20,                // Text offset from left of document
						initialYPosition: 65,         // Initial offset from top of document; set based on prior objects in document
						pageWrapInitialYPosition: 30  // Initial offset from top of document when page-wrapping
					});  
					
                    doc.save(`test.pdf`);
                
            },
            close() {
                this.reportData = {
                    comment: '',
                    idProject: ''
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

        .c-container {
            margin: 10vh auto 0 !important;
        }

        h3: {
            padding-bottom: 20px;
        }
    }

</style>
