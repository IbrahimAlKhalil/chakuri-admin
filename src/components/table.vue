<template>
    <div class="el-card is-always-shadow">
        <div class="el-card__body">
            <table class="text-center">
                <thead>
                <tr>
                    <th>
                        <el-checkbox :indeterminate="indeterminate" v-model="allChecked" @change="checkAll"/>
                    </th>
                    <th>#</th>
                    <th v-for="(col, index) in cols" :key="index">{{col}}</th>
                    <th></th>
                </tr>
                </thead>

                <component :is="draggable?'draggable':'tbody'" v-model="data.items" v-bind="dragOptions"
                           @change="$emit('dragged')">
                    <tr v-for="(item, index) in data.items" :key="index">
                        <td>
                            <el-checkbox v-model="item.checked" @change="changed"/>
                        </td>
                        <td>{{index+1}}</td>
                        <slot v-bind:item="item"></slot>
                        <td>
                            <el-popover popper-class="popover action-menu" placement="left-start">
                                <el-button class="action-btn" slot="reference" icon="fas fa-ellipsis-v"
                                           @click.stop="" size="small"></el-button>

                                <div class="el-menu">
                                    <div v-if="actions.includes('edit')" class="el-menu-item"
                                         @click="methods.edit(item)"><i
                                            class="fa fa-edit"></i>
                                        Edit
                                    </div>
                                    <div v-if="actions.includes('delete')" class="el-menu-item"
                                         @click="methods.removeItem(item)"><i
                                            class="fa fa-trash"></i>
                                        Delete
                                    </div>

                                    <slot name="actions" v-bind:item="item"></slot>
                                </div>
                            </el-popover>
                        </td>
                    </tr>
                </component>
            </table>
        </div>
    </div>
</template>

<script>
    import {elButton, elCheckbox, elPopover} from '@/el';
    import draggable from 'vuedraggable';

    export default {
        components: {elButton, elCheckbox, elPopover, draggable},
        props: {
            cols: Array,
            data: Object,
            methods: Object,
            draggable: {
                type: Boolean,
                default: false
            },
            actions: {
                default: () => ['delete', 'edit']
            }
        },

        data() {
            return {
                allChecked: false,
                indeterminate: true,
            };
        },

        methods: {
            checkAll(value) {
                const {items} = this.$props.data;

                if (value) {
                    items.forEach(item => {
                        item.checked = true;
                    });
                } else {
                    items.forEach(item => {
                        item.checked = false;
                    });
                }

                this.indeterminate = false;
            },

            changed() {
                const {items} = this.$props.data;

                let checkedCount = items.filter(item => item.checked).length;

                this.allChecked = checkedCount === items.length;
                this.indeterminate = checkedCount > 0 && checkedCount < items.length;
            }
        },

        computed: {
            dragOptions() {
                if (!this.$props.draggable) {
                    return {};
                }

                return {
                    animation: 200,
                    group: 'description',
                    disabled: false,
                    ghostClass: 'ghost',
                    tag: 'tbody'
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import '../styles/var';

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        border-bottom: 1px solid $--border-color-light;
    }

    tbody tr {
        min-height: 52px;
        height: 52px;
    }

    tbody tr:nth-child(even) {
        background: transparentize($--color-primary, 0.95);
    }

    tr:hover {
        .action-btn {
            display: block;
        }
    }

    th:first-child, td:first-child {
        width: 15px;
    }

    th:nth-child(2), td:nth-child(2) {
        width: 50px;
    }

    th:last-child, td:last-child {
        min-width: 37px;
        width: 37px;
    }

    td {
        padding: 10px;
        word-break: break-all;
    }

    th {
        padding: 0 10px 15px 10px;
    }

    .action-btn {
        display: none;
    }
</style>
