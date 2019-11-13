<template>
    <data-list endpoint="dashboard/moderators"
               title="Moderator"
               :decorator="decorate"
               :before-check="preventOwnCheck"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="6"
               :query="query"
               :actions="query.show === 'enabled'?actions:[]">

        <template #tool-btns="{methods}">
            <el-tooltip v-if="query.show === 'disabled'" content="Enable">
                <el-button icon="fa fa-check" @click="methods.remove(true)" circle></el-button>
            </el-tooltip>
        </template>


        <template #after-toolbar="{methods}">
            <div class="p-1 flex align-center">
                <div>
                    <el-button class="filter">
                        <i class="fa fa-filter"></i> Filter
                    </el-button>
                </div>
                <div class="ml-1">
                    <el-radio-button v-model="query.show" label="enabled" size="medium" @change="methods.reset">
                        Enabled
                    </el-radio-button>
                    <el-radio-button v-model="query.show" label="disabled" size="medium" @change="methods.reset">
                        Disabled
                    </el-radio-button>
                </div>
            </div>
        </template>

        <template #default="{data, methods}">

            <div class="wrapper">
                <div v-for="(user, index) in data.items" :key="index"
                     :class="['el-card item','is-always-shadow', {own: owner(user), checked: user.checked}]"
                     @click="methods.check(user)">

                    <el-checkbox v-show="user.checked" class="checkbox" size="medium"
                                 v-model="user.checked"></el-checkbox>

                    <el-popover v-if="!owner(user)" popper-class="popover action-menu" placement="left-start">
                        <el-button class="action-btn" slot="reference" icon="fas fa-ellipsis-v"
                                   @click.stop=""></el-button>

                        <div class="el-menu">
                            <div class="el-menu-item" @click="methods.edit(user)"><i class="fa fa-edit"></i> Edit</div>
                            <div class="el-menu-item" @click="methods.removeItem(user)"><i
                                    :class="user.disabled?'fa fa-check-circle':'fa fa-trash'"></i>
                                {{user.disabled?'Enable':'Disable'}}
                            </div>
                        </div>
                    </el-popover>

                    <div class="el-card__header flex flex-wrap justify-center">
                        <img :src="user.photo?$fileUrl(user.photo):altPhoto" :alt="user.name">

                        <div class="w-100 text-center mt-1" v-highlight="data.highlight">{{user.name}}</div>
                    </div>

                    <div class="el-card__body">
                        <div class="mt-1">
                            <b>Mobile: </b> <span v-highlight="data.highlight">{{user.mobile}}</span>
                        </div>

                        <div class="mt-1">
                            <b>Email: </b> <span v-highlight="data.highlight">{{user.email || 'n/a'}}</span>
                        </div>

                        <div class="mt-1">
                            <b>Roles: </b> <span v-for="(role, index) in user.roles" :key="index" class="el-badge">
                                    <strong class="el-badge__content el-badge__content--primary"
                                            v-highlight="data.highlight">
                                        {{role.name}}
                                    </strong>
                                </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </data-list>
</template>

<script>
    import {elButton, elPopover, elCheckbox, elTooltip, elRadioButton} from '@/el';
    import dataList from '@/components/data-list/lazy';
    import altPhoto from '@/assets/images/user.svg';

    import createMixin from './create-mixin';
    import editMixin from './edit-mixin';

    export default {
        mixins: [createMixin, editMixin],

        components: {
            elButton,
            elPopover,
            dataList,
            elCheckbox,
            elTooltip,
            elRadioButton
        },

        data() {
            return {
                altPhoto,
                roles: [],
                query: {
                    show: 'enabled'
                },
                actions: ['create', 'delete']
            };
        },

        methods: {
            owner(user) {
                return this.$auth.user.id === user.id;
            },

            decorate(item) {
                item.checked = false;

                return item;
            },

            preventOwnCheck(item) {
                const notOwn = this.$auth.user.id !== item.id;

                if (!notOwn) {
                    this.$notify({
                        type: 'warning',
                        message: 'You can\'t modify your own account'
                    });
                }

                return notOwn;
            }
        },

        async created() {
            const response = await this.$fetch('dashboard/roles-all').response();

            this.roles = response.json().filter(item => item.name !== 'Admin');
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../../../styles/var';


    .wrapper {
        display: grid;
        gap: 15px;
    }

    img {
        width: 110px;
        border-radius: 5px;
        background: #fff;
        display: block;
        margin: 0;
    }

    .item {
        padding: 0;
        word-break: break-all;
        position: relative;
        cursor: pointer;

        &.checked {
            border: 3px solid $--color-primary;
        }
    }

    .checkbox {
        position: absolute;
        left: 20px;
        top: 20px;
    }

    .own {
        border: 2px solid #fff000;
    }

    .action-menu {
        z-index: 200 !important;
    }

    .action-btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    @media all and (min-width: $--md) {
        .wrapper {
            grid-template-columns: repeat(3, minmax(200px, 1fr));
        }
    }
</style>
