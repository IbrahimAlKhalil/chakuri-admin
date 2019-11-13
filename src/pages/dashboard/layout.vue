<template>
    <section class="dashboard-user">
        <aside class="sidebar">
            <div class="el-card">
                <div class="el-card__body">
                    <div class="el-menu">
                        <template v-for="(item, index) in menuItems">
                            <router-link :to="item.link"
                                         class="el-menu-item" :key="index">
                                <div>
                                    <i :class="item.icon"></i> &nbsp;{{item.title}}
                                </div>
                                <span v-if="item.badge"
                                      class="el-badge__content el-badge__content--primary">{{item.badge | enToBn}}</span>
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </aside>

        <section class="contents">
            <transition name="el-fade-in">
                <router-view/>
            </transition>
        </section>
    </section>
</template>


<script>
    export default {
        computed: {
            menuItems() {
                return this.$store.state.menu.dashboard;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";
    @import "~cropperjs/dist/cropper.min.css";

    .dashboard-user {
        padding: 10px;
        display: grid;
        grid-gap: 25px;
    }

    .sidebar {
        display: none;
        width: 350px;
        align-self: flex-start;
        position: sticky;
        top: 85px;
    }

    .contents {
        width: 100%;
    }

    .el-card__body {
        padding: 0;
    }

    .el-menu-item {
        border-bottom: 1px solid #EBEEF5;
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
            color: $--link-color;
        }

        i {
            color: inherit;
        }
    }

    .router-link-active {
        background: transparentize($--link-color, .9);
        color: $--link-color;
    }

    @media screen and (min-width: $--md) {
        .sidebar {
            display: block;
        }
        /*
                .wrapper {
                    padding: 25px 0 15px 50px;
                }*/

        .dashboard-user {
            grid-template-columns: 350px 1fr;
            padding: 25px;
        }
    }
</style>
