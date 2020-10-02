<template>
    <div class="report-modal c-modal">
        <div class="c-container">
            <a @click="close()">{{ $t("close") }}</a>
            <h3>{{ $t("Report") }} <span style="color: Gray; font-size: 17px; margin-left: 20px;">{{dt}}</span></h3>
            <button @click="viewPDF()" v-if="report && report.id!=undefined" :disabled="reportData.comment == ''" class="button">
                {{ $t("View_PDF") }}
            </button>

            <form @submit.prevent>
                <div>
                    <label for="rcomment"></label>
                    <textarea v-model.trim="reportData.comment" id="rcomment"></textarea>
                </div>
                <button @click="addReport()" v-if="!report || report.id==undefined" :disabled="reportData.comment == ''" class="button">{{ $t("Add_report") }}</button>
                <div v-else>
                <button @click="saveProject()"  :disabled="reportData == report" class="button">{{ $t("Save_changes") }}</button>
                <button @click="deleteReport()" style="margin-left:10px;" class="button danger">{{ $t("Delete") }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import { jsPDF } from "jspdf";
    import moment from 'moment'
    
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
		computed: {
			dt(){
				if (this.report){
				return moment(this.report.createdOn.toDate()).locale(this.$i18n.locale).format('LL')
				}else{
					return '';
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
            maybePluralize(count, noun, suffix = 's') {
                return  `${noun}${count !== 1 ? suffix : ''}`
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
                    doc.text(lineText, xPosition, cursorY);
                    cursorY += lineSpacing;
                })
            },
            addWrappedTextJustify({text, textWidth, doc, fontSize = 10, fontType = 'normal', lineSpacing = 7, xPosition = 10, initialYPosition = 10, pageWrapInitialYPosition = 10}) {
                let p = text.split("\n");
                let pageHeight = doc.internal.pageSize.height - 10; 
                doc.setFontSize(fontSize);
                let cursorY = initialYPosition;

                p.forEach(texto => {
                    let textLines = doc.splitTextToSize(texto, textWidth); // Split the text into lines
                    // doc.setFontType(fontType); <<-- https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#setFont
                    
                    if ((cursorY + (lineSpacing*textLines.length))> pageHeight) { // Auto-paging
                        let l = (pageHeight - cursorY) / lineSpacing;
                           let ll = textLines.slice(0, ~~l).join(" ");
                        texto = textLines.slice(~~l).join(" ");
                        doc.text(ll , xPosition, cursorY, { maxWidth: textWidth, lineHeightFactor: 1.5, align: "justify" });
                        
                        doc.addPage();
                        cursorY = pageWrapInitialYPosition;
                        textLines = doc.splitTextToSize(texto, textWidth);
                    }
                    doc.text(texto , xPosition, cursorY, { maxWidth: textWidth, lineHeightFactor: 1.5, align: "justify" });
                    cursorY +=  lineSpacing*textLines.length;
                })
            },	
            async  viewPDF() {
                const doc = new jsPDF({
                    orientation: "portrait"
                });
				
				let fontSize = 10;
				let lineSpacing = (fontSize/2);

                doc.setFontSize(fontSize+18).text(this.project.name, 40, 35);
                doc.setFontSize(fontSize+3).text(this.project.address, 40, 42);
                doc.addImage("logo.png", "PNG", 15, 23, 20, 20);

                let posy = 55;		
                
                let c = [];
                await Promise.all(this.project.clients.map(cli=>{
                    c.push( this.$store.getters.getContactById(cli).name);
                }));				
				if (c.length>0) {
					doc.setTextColor(0).setFontSize(fontSize).text(this.maybePluralize(this.project.clients.length, this.$t("Client")) + ":", 20, posy);
					this.addWrappedTextJustify({
						text: c.join("\r\n"), // Put a really long string here
						textWidth: 150,
						doc,
						fontSize: fontSize,
						fontType: 'normal',
						lineSpacing: lineSpacing,               // Space between lines
						xPosition: 40,                // Text offset from left of document
						initialYPosition: posy,         // Initial offset from top of document; set based on prior objects in document
					});  
					posy += lineSpacing * this.project.clients.length;  
				}

                let e = [];
                await Promise.all(this.project.experts.map(cli=>{
                    e.push( this.$store.getters.getContactById(cli).name);
				}));
				if (e.length>0) {
					doc.setTextColor(0).setFontSize(fontSize).text(this.maybePluralize(this.project.experts.length, this.$t("Expert")) + ":", 20, posy);
					this.addWrappedTextJustify({
						text: e.join("\r\n"), // Put a really long string here
						textWidth: 150,
						doc,
						fontSize: fontSize,
						fontType: 'normal',
						lineSpacing: lineSpacing,               // Space between lines
						xPosition: 40,                // Text offset from left of document
						initialYPosition: posy,         // Initial offset from top of document; set based on prior objects in document
					});  
					posy += lineSpacing * this.project.experts.length;  
				}
                posy += lineSpacing;



                doc.setTextColor(150).setFontSize(fontSize).text(moment(this.report.createdOn.toDate()).locale(this.$i18n.locale).format('LL'), 20, posy);
                doc.setTextColor(0);
                
                posy+= 10;

                this.addWrappedTextJustify({
                    text: this.reportData.comment, // Put a really long string here
                    textWidth: 170,
                    doc,
                    fontSize: fontSize,
                    fontType: 'normal',
                    lineSpacing: lineSpacing,               // Space between lines
                    xPosition: 20,                // Text offset from left of document
                    initialYPosition: posy,         // Initial offset from top of document; set based on prior objects in document
                    pageWrapInitialYPosition: 30  // Initial offset from top of document when page-wrapping
                });  
                
                doc.save(this.$t("Report") + `.pdf`);
                
            },
            deleteReport(){
                var r = confirm(this.$t("AreYouSureYouWantToRemoveTheReport"));
                if (r == true) {
                    this.reportData.id = this.report.id;
                    this.$store.dispatch('deleteReport', this.reportData)
                    this.close();
                }              
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
