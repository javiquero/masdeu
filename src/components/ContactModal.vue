<template>
    <div class="contact-modal c-modal" >
        <div class="c-container" >
            <a @click="close()">{{ $t("close") }}</a>
            <h3>{{ $t("Contact") }}</h3>
            <form @submit.prevent>
                <div>
                    <label for="cmname">{{ $t("Name") }}</label>
                    <input v-model.trim="contactData.name" type="text" placeholder="" id="cmname" />
                </div>
                <div>
                    <label for="cmtype">{{ $t("Contact_type") }}</label>
                    <type-contact :type.sync="contactData.type"></type-contact>
                </div>
                <div>
                    <label for="cmaddress">{{ $t("Address") }}</label>
                    <input v-model.trim="contactData.address" type="text" placeholder="" id="cmaddress" />
                </div>
                <div>
                    <label for="cmphone1">{{ $t("Phone_number") }}</label>
                    <input v-model.trim="contactData.phone1" type="text" placeholder="" id="cmphone1" />
                </div>
                <div>
                    <label for="cmphone2">{{ $t("Alternative_phone_number") }}</label>
                    <input v-model.trim="contactData.phone2" type="text" placeholder="" id="cmphone2" />
                </div>
                <div>
                    <label for="cmemail">{{ $t("Email") }}</label>
                    <input v-model.trim="contactData.email" type="text" placeholder="" id="cmemail" />
                </div>
                <div>
                    <label for="cmcomment">{{ $t("Comments") }}</label>
                    <textarea v-model.trim="contactData.comment" id="cmcomment"></textarea>
                </div>

                <button @click="addContact()" v-if="!contact || contact.id==undefined" :disabled="contactData.name == ''" class="button">{{ $t("Add_contact") }}</button>
				<div v-else>
					<button @click="saveContact()" :disabled="contactData == contact" class="button">{{ $t("Save_changes") }}</button>
					<button @click="deleteContact()" style="margin-left:10px;" class="button danger">{{ $t("Delete") }}</button>
				</div>
               
            </form>
        </div>
    </div>
</template>

<script>
    import TypeContact from "@/components/TypeContact.vue"
    export default {
        components: {
            TypeContact
        },
        props: ['contact'],
        data() {
            return {
                mcontact: this.contact,
                mode: 'add',
                contactData: {
                    name: '',
                    address: '',
                    phone1: '',
                    phone2: '',
                    type: [],
                    email: '',
                    comment: ''
                }
            }
        },
        watch: {
            contact(val, oldval) {
                if (this.contact == undefined) {
                    this.mode = 'add';
                    this.contactData = {
                        name: '',
                        address: '',
                        phone1: '',
                        phone2: '',
                        type: [],
                        email: '',
                        comment: ''
                    }
                } else {
                    this.mode = 'edit';
                    this.contactData = {
                        name: this.contact.name,
                        address: this.contact.address,
                        phone1: this.contact.phone1,
                        phone2: this.contact.phone2,
                        type: this.contact.type,
                        email: this.contact.email,
                        comment: this.contact.comment
                    }
                }
            }
        },
        methods: {
            async saveContact() {
                this.contactData.id = this.contact.id;
                this.$store.dispatch('saveContact', this.contactData)
                // close modal
                this.close();
            },
            async addContact() {
                this.$store.dispatch('createContact', this.contactData)

                // close modal
				this.close();
			},
			async deleteContact(){
				this.contactData.id = this.contact.id;
				let s = await this.$store.getters.contactInProject(this.contact.id);
				if (s.length>0) {
					alert(this.$t("SorryThisContactIsIn") + s.length + " " + this.$t("Projects") + ". \n" + this.$t("UnableToDeleteRecord") + ".");
				}else{
					var r = confirm(this.$t("AreYouSureYouWantToRemoveTheContact"));
					if (r == true) {
						this.$store.dispatch('deleteContact', this.contactData)
						this.close();
					}
				}
			},
			close(){
				this.contactData={
					name: '',
                    address: '',
                    phone1: '',
                    phone2: '',
                    type: [],
                    email: '',
                    comment: ''
                }
				this.$emit('close')
			}
        }
    }

</script>

<style lang="scss">
	.contact-modal {
		z-index: 99999!important;
		.c-container{
			margin: 10vh auto 0 !important;
		}
		h3: {
			padding-bottom: 20px;
		}
	}
</style>
