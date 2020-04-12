<template>
    <data-list endpoint="dashboard/positions"
               title="Position"
               :decorator="decorate"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="25">

        <template #tool-btns="{data}">
            <el-tooltip v-if="reordered" content="Save Current Order">
                <el-button icon="fa fa-save" @click="updateOrder(data.items)" circle></el-button>
            </el-tooltip>
        </template>

        <template #tool-menu="{data}">
            <div v-if="reordered" class="el-menu-item" @click="updateOrder(data.items)"><i
                    class="fa fa-save"></i> Save
                Order
            </div>
        </template>

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <data-table :cols="cols" :data="data" :methods="methods" @dragged="reordered=true" draggable>
                <template #default="{item}">
                    <td v-highlight="data.highlight">{{item.name}}</td>
                </template>
            </data-table>
        </template>
    </data-list>
</template>

<script>
    import dataList from '@/components/data-list/lazy';
    import dataTable from '@/components/table';
    import itemsCount from '@/components/items-count';
    import {elButton, elTooltip} from '@/el';

    export default {
        components: {itemsCount, dataList, dataTable, elButton, elTooltip},

        data() {
            const required = {required: true};

            const form = [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    rules: [required]
                }
            ];

            return {
                createForm: form,

                editForm: form,

                cols: ['Name'],
                reordered: false
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

                this.$fetch('dashboard/positions/reorder', {
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
        }
    };
</script>
