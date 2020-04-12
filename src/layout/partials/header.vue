<template>
    <el-header class="flex justify-between header">
        <nav-mobile/>
        <div class="logo flex align-center">
            <router-link to="/" class="link">
                KhidmatBD
            </router-link>
        </div>
        <div v-if="$auth.user" class="auth-menu flex align-center">
            <el-popover popper-class="popover notification-popper">
                <el-badge slot="reference" :value="notification.unread | enToBn" :max="50" type="primary"
                          :hidden="notification.unread === 0">
                    <el-button icon="el-icon-message-solid" size="medium" @click="load"></el-button>
                </el-badge>

                <div>
                    <div class="items">
                        <div class="el-menu">
                            <notification v-for="(item, index) in notificationItems.slice(0, 6)" :key="index"
                                          :item="item" small/>
                        </div>

                        <empty :empty="!notification.items.length" :loading="notification.loading" size="small"/>
                    </div>


                    <router-link class="el-button el-button--default no-underline w-100 d-block see-more"
                                 to="/dashboard/notifications">আরও
                        দেখুন
                    </router-link>
                </div>
            </el-popover>
        </div>
        <nav-desktop/>
    </el-header>
</template>

<script>
    import {mapState} from 'vuex';
    import empty from '@/components/empty';
    import {elHeader, elBadge, elButton, elPopover} from '@/el';
    import Notification from '@/layout/partials/notification';

    export default {
        components: {
            Notification,
            navDesktop: () => import('./nav-desktop'),
            navMobile: () => import('./nav-mobile'),
            elHeader,
            elBadge,
            elButton,
            elPopover,
            empty
        },

        data() {
            return {
                logo: require('@/assets/images/logo.png'),
                name: 'Sahara Software And Technology'
            };
        },

        computed: {
            ...mapState({
                notification: state => state.notification
            }),

            notificationItems() {
                return this.notification.items.slice(0, 6);
            }
        },

        methods: {
            async load() {
                const {dispatch} = this.$store;

                if (this.notification.page === 0) {
                    await dispatch('notification/loadItems');
                }

                dispatch('notification/hideCount');
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";

    .header {
        background: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, .1);
        position: sticky;
        top: 0;
        z-index: 1004;
        padding: 0 10px;
    }

    .logo {
        padding: 10px;

        img {
            height: 100%;
        }
    }

    .auth-menu {
        margin-right: 20px;
        margin-left: auto;
    }

    .items {
        width: 450px;
        max-width: calc(100vw - 60px);
    }

    .see-more {
        border-width: 0;
        border-top: 1px solid $--border-color-light;
    }
</style>

<style>
    .notification-popper[x-placement^="bottom"] {
        margin-top: 22px !important;
    }
</style>
