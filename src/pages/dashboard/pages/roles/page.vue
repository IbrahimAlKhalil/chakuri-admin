<template>
    <data-list endpoint="dashboard/roles"
               title="Role"
               :decorator="decorate"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="20">

        <template #default="{data, methods}">

            <div class="wrapper">
                <div v-for="(item, index) in data.items" :key="index"
                     :class="['el-card item','is-always-shadow', {checked: item.checked}]"
                     @click="methods.check(item)">

                    <el-checkbox v-show="item.checked" class="checkbox" size="medium"
                                 v-model="item.checked"></el-checkbox>

                    <el-popover popper-class="popover action-menu" placement="left-start">
                        <el-button class="action-btn" slot="reference" icon="fas fa-ellipsis-v"
                                   @click.stop=""></el-button>

                        <div class="el-menu">
                            <div class="el-menu-item" @click="methods.edit(item)"><i class="fa fa-edit"></i> Edit
                            </div>
                            <div class="el-menu-item" @click="methods.removeItem(item)"><i class="fa fa-trash"></i>
                                Delete
                            </div>
                        </div>
                    </el-popover>

                    <div class="el-card__header flex flex-wrap justify-center">
                        <div class="w-100 text-center" v-highlight="data.highlight">
                            {{item.name}}
                        </div>
                    </div>

                    <div class="el-card__body text-center">
                        {{item.description}}

                        <el-divider/>

                        <span v-for="(permission, index) in item.permissions" :key="index" class="el-badge">
                                <strong class="el-badge__content el-badge__content--info"
                                        v-highlight="data.highlight">
                                    {{permission.name}}
                                </strong>
                            </span>
                    </div>
                </div>
            </div>
        </template>
    </data-list>
</template>

<script>
    import {elButton, elCheckbox, elTooltip, elPopover, elDivider} from '@/el';
    import dataList from '@/components/data-list/lazy';

    export default {
        components: {elButton, elCheckbox, elTooltip, dataList, elPopover, elDivider},

        data() {
            const required = {required: true};

            const form = [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    rules: [required]
                },

                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                },

                {
                    name: 'permissions',
                    label: 'Permissions',
                    type: 'select',
                    source: 'dashboard/permissions',
                    multiple: true
                }
            ];

            return {
                createForm: form,

                editForm: form
            };
        },

        methods: {
            decorate(item) {
                item.checked = false;

                return item;
            },
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../../../styles/var';


    .wrapper {
        display: grid;
        grid-gap: 15px;
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

    .action-menu {
        z-index: 200 !important;
    }

    .action-btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .el-badge__content {
        font-size: .9rem;
        padding: 3px 6px;
    }

    @media all and (min-width: $--md) {
        .wrapper {
            grid-template-columns: repeat(3, minmax(200px, 1fr));
        }
    }
</style>
