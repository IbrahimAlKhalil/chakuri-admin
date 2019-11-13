<template>
    <el-popover placement="top-start" trigger="click" popper-class="popover"
                class="avatar-wrapper">
        <div class="avatar" slot="reference">
            <img :src="user.photo?$fileUrl(user.photo): $auth.altPhoto" :alt="user.name">
        </div>

        <div class="menu">
            <router-link to="/dashboard/profile" class="el-dropdown-menu__item">
                <i class="el-icon-user-solid"></i> একাউন্ট
            </router-link>
            <div class="el-dropdown-menu__item" @click="signOut">
                <i class="fas fa-sign-out-alt"></i>
                প্রস্থান
            </div>
        </div>
    </el-popover>
</template>

<script>
    import {elPopover, elDialog} from '@/el';

    export default {
        components: {elPopover, elDialog},

        data() {
            return {
                user: this.$auth.user,
                open: false
            };
        },

        methods: {
            async signOut() {
                await this.$store.dispatch('auth/signOut');
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";

    .avatar-wrapper {
        height: 100%;
        max-width: 60px;
    }

    .avatar {
        height: 100%;
        border-radius: 50%;
        cursor: pointer;

        img {
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            border-radius: 50%;
            border: 10px solid transparent;

            &:hover {
                border-color: $bg;
            }
        }
    }

    .menu {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .el-dropdown-menu__item {
        display: block;
        text-decoration: none;
    }
</style>
