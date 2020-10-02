<template>
    <section id="settings">
        <div class="col1">
            <h3>{{ $t("Settings") }}</h3>
            <p>{{ $t("UpdateYourProfile") }}</p>

            <transition name="fade">
                <p v-if="showSuccess" class="success">{{ $t("profileUpdated") }}</p>
            </transition>

            <form @submit.prevent>
                <label for="name">{{ $t("Name") }}</label>
                <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />

                <label for="lang">{{ $t("Lang") }}</label>
                <select v-model.trim="lang" name="lang" id="lang">
                    <option value="en">{{ $t("English") }}</option>
                    <option value="ca">{{ $t("Catalan") }}</option>
                    <option value="es">{{ $t("Spanish") }}</option>
                </select>
                <button @click="updateProfile()" class="button">{{ $t("UpdateProfile") }}</button>
            </form>
        </div>
    </section>
</template>

<script>
    import {
        mapState
    } from 'vuex'

    export default {
        data() {
            return {
                name: '',
                lang: 'en',
                //   title: '',
                showSuccess: false
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        watch: {
            userProfile(val) {
                this.lang = val.lang;
            }
        },
        mounted() {
            this.lang = this.userProfile.lang;
        },
        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    lang: this.lang !== '' ? this.lang : this.userProfile.lang,
                    // title: this.title !== '' ? this.title : this.userProfile.title
                })

                this.name = ''
                //   this.title = ''

                this.showSuccess = true

                setTimeout(() => {
                    this.showSuccess = false
                }, 2000)
            }
        }
    }

</script>
