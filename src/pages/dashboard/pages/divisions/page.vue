<template>
    <data-list endpoint="dashboard/divisions"
               title="Division"
               :decorator="decorate"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="25">

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <data-table :cols="cols" :data="data" :methods="methods">
                <template #default="{item}">
                    <td>
                        <router-link class="link" :to="`/dashboard/districts/${item.id}`">
                            <span v-highlight="data.highlight">{{item.name}}</span>
                        </router-link>
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

    export default {
        components: {itemsCount, dataList, dataTable},

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

                cols: ['Name']
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
