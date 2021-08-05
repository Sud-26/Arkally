<template>
    <nav class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/system">
                <img src="../assets/logo.png" alt="UNET - cars from Japan" />
            </router-link>
            <a role="button"
               class="navbar-burger"
               v-bind:class="{ 'is-active': isActive }"
               @click="isActive = !isActive"
               aria-label="menu"
               aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu" v-bind:class="{ 'is-active': isActive }" @click="isActive = !isActive">
            <div class="navbar-start">
                <div v-if="isAdmin" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-item">
                        <span class="icon">
                            <i class="fas fa-cogs"></i>
                        </span>
                        <span> Control Panel</span>
                    </a>
                    <div class="navbar-dropdown is-right">
                        <router-link to="/plans/" class="navbar-item">
                            Price Plans
                        </router-link>
                        <router-link to="/invoices/" class="navbar-item">
                            Invoices
                        </router-link>
                        <router-link to="/users/" class="navbar-item">
                            Users
                        </router-link>
                        <router-link to="/rates/" class="navbar-item">
                            Exchange Rates
                        </router-link>
                        <router-link to="/requests/" class="navbar-item">
                            Requests
                        </router-link>
                        <router-link to="/inland/" class="navbar-item">
                            Inland Prices
                        </router-link>
                        <router-link to="/companies/" class="navbar-item">
                            Inland Companies
                        </router-link>
                        <router-link to="/rec/" class="navbar-item">
                            Rec Fee
                        </router-link>
                        <router-link to="/purchases/" class="navbar-item">
                            Purchases
                        </router-link>
                        <router-link to="/jibaiseki/" class="navbar-item">
                            Jibaiseki
                        </router-link>
                        <router-link to="/profit/" class="navbar-item">
                            Profit
                        </router-link>
                    </div>
                </div>
                <router-link to="/auctions/advance" class="navbar-item">
                    Auctions
                </router-link>
                <router-link v-if="userNotVisitor" to="/bids/" class="navbar-item">
                    Bids
                </router-link>
                <router-link v-if="userNotVisitor" to="/cars/" class="navbar-item">
                    Garage
                </router-link>
                <router-link to="/favorites/" class="navbar-item">
                    Favorites
                </router-link>
                <router-link v-if="userNotVisitor" to="/history/" class="navbar-item">
                    History
                </router-link>
                <router-link v-if="userNotVisitor" to="/tools/" class="navbar-item">
                    Tools
                </router-link>
            </div>
            <div class="navbar-end">
                <goal v-if="isAdmin"></goal>
                <deposit v-else></deposit>
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-item">
                        <span>{{ userName }}</span>
                        <span class="icon">
                            <i class="far fa-user-circle"></i>
                        </span>
                    </a>
                    <div class="navbar-dropdown is-right">
                        <a class="navbar-item is-active" @click.prevent="logout">
                            LOGOUT
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
    import Deposit from './Navigation/Deposit'
    import Goal from './Navigation/Goal'
    import apiAuth from '../api/apiAuth'
    export default {
        components: {
            Deposit,
            Goal
        },
        data() {
            return {
                isActive: false,
            }
        },
        methods: {
            logout() {
                this.$store.commit('removeToken')
                this.$store.commit('removeRole')
                this.$store.commit('removeUserName')
                this.$store.commit('removeUserCreditAmount')
                this.$store.commit('removeUserManagerGoal')
                this.$router.push({ path: '/login' })
            }
        },
        computed: {
            userNotVisitor () {
                return this.$store.getters.getUserRole !== 'Visitor'
            },
            userName () {
                return this.$store.getters.getUserName
            },
            isAdmin() {
                if (this.$store.getters.getUserRole === 'Admin') {
                    return true
                }
            }
        }
    }
</script>

<style scoped>

</style>
