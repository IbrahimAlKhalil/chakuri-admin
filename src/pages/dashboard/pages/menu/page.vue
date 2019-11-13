<template>
    <data-list endpoint="dashboard/menus"
               title="Menu"
               :decorator="decorate"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="10">

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <data-table :cols="cols" :data="data" :methods="methods">
                <template #default="{item}">
                    <td>
                        <router-link class="link" :to="`/dashboard/menu/${item.id}`"><span
                                v-highlight="data.highlight">{{item.name}}</span></router-link>
                    </td>
                    <td v-highlight="data.highlight">{{item.location}}</td>
                    <td>
                        <el-switch v-model="item.enabled" @change="updateState(item)"></el-switch>
                    </td>
                </template>
            </data-table>
        </template>
    </data-list>
</template>

<script>
    import dataList from '@/components/data-list/lazy';
    import dataTable from '@/components/table';
    import itemsCount from '@/components/items-count';
    import {elSwitch} from '@/el';

    export default {
        components: {itemsCount, dataList, dataTable, elSwitch},

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
                    name: 'menu_location_id',
                    label: 'Location',
                    type: 'select',
                    rules: [required],
                    source: 'dashboard/menu-locations',
                }
            ];

            return {
                createForm: form,

                editForm: form,

                cols: ['Name', 'Location', 'State']
            };
        },

        methods: {
            decorate(item) {
                item.checked = false;
                item.enabled = !!item.enabled;

                return item;
            },

            async updateState(item) {
                this.$fetch(`dashboard/menus/${item.id}`, {
                    method: 'PATCH',
                    body: {
                        enabled: Number(item.enabled)
                    }
                }).response()
                    .then(response => {
                        if (response.status === 200 || response.status === 204) {
                            return this.$notify({
                                type: 'success',
                                message: 'Updated',
                                title: 'Success'
                            });
                        }

                        item.enabled = false;

                        this.$notify({
                            type: 'error',
                            message: 'Sorry, something went wrong. Please try later.',
                            title: 'Error'
                        });
                    });
            }
        }
    };
</script>
