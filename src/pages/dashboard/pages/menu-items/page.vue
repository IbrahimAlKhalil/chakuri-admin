<template>
    <div>
        <data-list endpoint="dashboard/menu-items"
                   title="Menu Item"
                   :decorator="decorate"
                   :create-form="createForm"
                   :edit-form="editForm"
                   :per-page="25"
                   :query="query">
            <template #tool-btns="{data}">
                <el-tooltip v-if="unsavedOrder" content="Save Current Order">
                    <el-button icon="fa fa-save" @click="updateOrder(data.items)" circle></el-button>
                </el-tooltip>
            </template>

            <template #tool-menu="{data}">
                <div v-if="unsavedOrder" class="el-menu-item" @click="updateOrder(data.items)"><i
                        class="fa fa-save"></i> Save
                    Order
                </div>
            </template>

            <template #default="{data, methods}">

                <items-count :data="data"/>

                <div class="el-card is-always-shadow mb-1" v-if="found">
                    <div class="el-card__body">
                        <template v-if="parent">
                            <template>
                                Showing items of <strong>{{parent.name}}</strong>.
                            </template>
                        </template>
                        <div v-else class="text-center">
                            <i class="el-icon-loading"></i>
                        </div>
                    </div>
                </div>

                <data-table :cols="cols" :data="data" :methods="methods" @dragged="unsavedOrder = true" draggable>
                    <template #default="{item}">
                        <td v-highlight="data.highlight">{{item.label}}</td>
                        <td v-highlight="data.highlight">{{item.type === 'page'?'Page':'Custom'}}</td>
                        <td v-highlight="data.highlight">{{item.link}}</td>
                    </template>
                </data-table>
            </template>
        </data-list>
    </div>
</template>

<script>
    import dataList from '@/components/data-list/lazy';
    import dataTable from '@/components/table';
    import itemsCount from '@/components/items-count';
    import {elButton, elTooltip} from '@/el';

    export default {
        components: {itemsCount, dataList, dataTable, elButton, elTooltip},

        data() {
            const {id} = this.$route.params;
            const required = {required: true};
            const type = {
                name: 'type',
                label: 'Type',
                type: 'select',
                rules: [required],
                value: 'page',
                data: [
                    {
                        id: 'page',
                        name: 'Page'
                    },
                    {
                        id: 'custom',
                        name: 'Custom'
                    }
                ]
            };

            const form = [
                {
                    name: 'label',
                    label: 'Label',
                    type: 'text',
                    rules: [required]
                },
                type,
                {
                    name: 'link',
                    label: 'Link',
                    type: 'text',
                    rules: [required],
                    prepend: function (models) {
                        return models.type === 'page' ? 'https://khidmatbd.com/' : 'URL';
                    }
                },
                {
                    name: 'menu_id',
                    type: 'hidden',
                    rules: [required],
                    value: id
                }
            ];

            return {
                cols: ['Label', 'Type', 'Link'],

                createForm: form,
                editForm: form,

                parent: null,

                query: {
                    parent: id
                },

                found: true,
                unsavedOrder: false
            };
        },

        methods: {
            decorate(item) {
                item.checked = false;

                return item;
            },

            async updateOrder(items) {
                const orders = items.map((item, order) => {
                    return {
                        id: item.id,
                        order: order + 1
                    };
                });

                this.$fetch('dashboard/menu-items/reorder', {
                    method: 'POST',
                    body: {
                        orders
                    }
                }).response();

                this.$notify({
                    type: 'success',
                    title: 'Success',
                    message: 'Updated'
                });

                this.unsavedOrder = false;
            }
        },

        async created() {
            const response = await this.$fetch(`dashboard/menus/${this.$route.params.id}`).response();

            if (response.status !== 404) {
                this.parent = response.json();
                return;
            }

            this.found = false;
        }
    };
</script>
