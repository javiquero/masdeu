<template>
    <div class="contacts-list">
        <div v-if="contacts && contacts.length">
            <div v-for="contact in list" :key="contact.id" class="post" >
                <div style="width:70%" @click="viewContact(contact)">
                    <h5 >{{ contact.name | trimLength}}</h5> 
					<p class="tag" v-for="type in contact.type" :key="type.id" >
						{{type.name}}
					</p>
                    <span>{{ contact.createdOn | formatDate }}</span>
                    <p>{{ contact.address | trimLength }}</p>
                    <p>{{ contact.phone1 | trimLength }}</p>
                </div>
                <div style="width:30%;">
                    <a v-if="contact.phone1 || contact.phone2" :href="'tel:'+ contact.phone1 || contact.phone2" class="button">
                        <i class="fal fa-phone" ></i><p>Call</p> 
                    </a>
                    <a v-if="contact.email" :href="'mailto:'+ contact.email" style="margin-top:10px" class="button">
						<i class="fal fa-envelope" ></i><p>Email</p> 
					</a>
                </div>
            </div>

             <router-link  v-if="limit!=undefined && list.length!=contacts.length" to="/contacts">Show all contacts</router-link>
        </div>
        <div v-else>
            <p class="no-results">There are currently no contacts</p>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        props: ['contacts', 'limit'],
        data() {
            return {
            }
        },
        computed: {
            list(){
                if (this.limit!=undefined) return this.contacts.slice(0,this.limit);
                return this.contacts;
            }
        },
        methods: {
            viewContact(contact) {
                this.$root.$emit('contact:open', contact);
            }
        },
        filters: {
            formatDate(val) {
                if (!val) {
                    return '-'
                }

                let date = val.toDate()
                return moment(date).fromNow()
            },
            trimLength(val) {
                if (val.length < 200) {
                    return val
                }
                return `${val.substring(0, 200)}...`
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contacts-list {
        a:hover {
            color: white;
        }
        .router-link-active{
            margin-top:20px;
		}
		.post {
			display:flex;			
			h5 {display:inline-block; margin-right: 20px !important;  }
			@media only screen and (max-width: 600px) {
				h5 {max-width:100px;  white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
			}
			.tag {
				display:inline-block; font-size: 12px; background-color:#eee; padding: 5px; border-radius: 3px; margin-right:10px !important;
			}
			a{
				width:100%; min-width: auto; display: inline-block; text-align: center; 
				i{ margin-right:10px; }
				p { display:inline; }
				@media only screen and (max-width: 600px) {
					i{ margin-right:0px; }
					p { display:none; }
				}
			}
		}
		.router-link-active{
			margin-top: 10px; padding-left:10px;display:block;
		}
    }

</style>
