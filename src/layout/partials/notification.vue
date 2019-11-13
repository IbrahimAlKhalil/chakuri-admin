<template>
    <router-link :class="`el-menu-item flex align-center ${!item.seen?' unseen':''}`"
                 :to="item.link" @click.native="seen(item)">
        <div class="pic" v-if="item.pic" :style="style">
        </div>

        <div class="flex justify-between align-center w-100">
            <div :class="`message ${small?' small':''}`">
                <strong>{{item.title}}</strong> {{item.message}}
            </div>

            <!--<div class="blur"></div>-->

            <div>
                <i :class="iconClass"></i>
            </div>
        </div>
    </router-link>
</template>

<script>

    export default {
        props: ['item', 'small'],

        computed: {
            iconClass() {
                const {item} = this.$props;

                return {
                    'far fa-envelope': !item.seen,
                    'far fa-envelope-open': item.seen,
                    mail: true
                };
            },

            style() {
                return {
                    background: `url(${this.$fileUrl(this.$props.item.pic)}) no-repeat center`,
                    backgroundSize: 'cover'
                };
            }
        },

        methods: {
            seen(item) {
                this.$store.dispatch('notification/seen', item);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../styles/var";

    $max-line: 3;
    $line-height: 1.4rem;

    a {
        text-decoration: none;
        border-bottom: 1px solid $--border-color-base;
        position: relative;

        &.unseen {
            background: #f5f8ff;
        }
    }

    .message {
        border: 10px solid transparent;
        overflow: hidden;
        color: #000;
        min-height: 35px;
        text-overflow: ellipsis;
        position: relative;

        &.small {
            line-height: $line-height;
            max-height: $line-height * $max-line;
        }
    }

    /*.blur {
        width: 74px;
        height: 36px;
        position: absolute;
        background: linear-gradient(285deg, #fff6a6, transparent);
        right: 0;
        bottom: 0;
    }*/

    .mail {
        color: $--color-primary;
        margin-right: 10px;
    }

    .fa-envelope-open {
        color: $--color-secondary;
    }

    .pic {
        min-width: 50px;
        max-width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0 0 1px rgba(0, 0, 0, .6);
        border: 2px solid white;
    }
</style>
