<template>
    <div class="flex justify-center align-center menu-icon">
        <el-button icon="el-icon-menu" @click="showNav" circle/>

        <transition name="el-fade-in">
            <div class="back-drop" v-if="show"></div>
        </transition>

        <transition name="jump">
            <div class="wrapper" v-if="show" @click.self="hideNav">
                <div class="scroll">
                    <nav>
                        <el-card class="box-card h-100">
                            <div slot="header" class="header">
                                <template v-if="$auth.user">
                                    <div class="flex flex-wrap justify-center">
                                        <img :src="$auth.user.photo?$fileUrl($auth.user.photo):$auth.user.altPhoto"
                                             :alt="$auth.user.name">
                                    </div>

                                    <el-divider/>
                                </template>
                                <div class="mt-1 flex justify-center">
                                    <el-button-group v-if="$auth.user">
                                        <router-link class="el-button no-underline el-button--primary"
                                                     to="/dashboard/profile">
                                            <i class="el-icon-setting"></i> একাউন্ট
                                        </router-link>
                                        <el-button icon="fas fa-sign-out-alt" @click="signOut">
                                            প্রস্থান
                                        </el-button>
                                    </el-button-group>
                                </div>
                            </div>
                            <div>
                                <div class="el-menu">
                                    <menu-item v-for="(item, index) in menu"
                                               :key="index" :index="index" :item="item"/>
                                </div>
                            </div>
                        </el-card>
                    </nav>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {elCard, elButton, elButtonGroup, elDivider} from '@/el';
    import menuItem from './menu-item';
    import {mapState} from 'vuex';

    export default {
        components: {menuItem, elButtonGroup, elButton, elCard, elDivider},

        computed: {
            ...mapState({
                show: ({menu}) => menu.show
            }),

            menu() {
                const {state} = this.$store;
                return state.layout === 'master' ? state.menu.main : state.menu.dashboard;
            }
        },

        methods: {
            showNav() {
                this.$store.commit('menu/toggle', true);
            },

            hideNav() {
                this.$store.commit('menu/toggle', false);
            },

            async signOut() {
                this.hideNav();

                await this.$store.dispatch('auth/signOut');
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";

    .el-menu {
        display: grid;
        border-right: 0;
    }

    .back-drop, .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;

        @media screen and (min-width: $__md) {
            display: none;
        }
    }

    .back-drop {
        background: rgba(0, 0, 0, .2);
    }

    .scroll {
        width: 70%;
        height: 100%;
        overflow-y: auto;
    }

    .header {
        img {
            width: 100px;
        }
    }

    .btn-group button {
        width: auto;
    }

    .btn {
        text-decoration: none;
    }

    .box-card {
        min-height: 100vh;
        border-radius: 0;
    }

    ul {
        padding: 0;
        margin: 0;
        width: 100%;

        a {
            text-decoration: none;
            color: inherit;
        }
    }

    @media screen and (min-width: $__md) {
        .menu-icon {
            display: none;
        }

        .back-drop, .wrapper {
            display: none;
        }
    }
</style>
