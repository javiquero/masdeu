<template>
    <header>
        <section>
            <div class="col1">
                <router-link to="/">
                    <h3>Masdeu app</h3>
                </router-link>
                <ul class="inline">
                    <li>
                        <router-link to="/contacts">Contacts</router-link>
                    </li>
                    <li>
                        <router-link to="/projects">Projects</router-link>
                    </li>
                    <!-- <li>
                      <router-link to="/settings">Settings</router-link> 
                    </li> -->
                    <li><a @click="logout()">Logout</a></li>
                </ul>
            </div>
        </section>
    </header>
</template>

<script>
    export default {
        methods: {
            logout() {
                this.$store.dispatch('logout')
            }
        }
    }

</script>
