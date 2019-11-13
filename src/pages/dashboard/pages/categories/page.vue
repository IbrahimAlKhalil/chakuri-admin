<template>
    <data-list endpoint="dashboard/categories"
               title="Category"
               :decorator="decorate"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="25">

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <data-table :cols="cols" :data="data" :methods="methods">
                <template #default="{item}">
                    <td v-highlight="data.highlight">{{item.name}}</td>
                    <td><i :class="item.icon"></i></td>
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
                },
                {
                    name: 'icon',
                    label: 'Icon',
                    type: 'text',
                    placeholder: 'Go to https://fontawesome.com/icons to get icon'
                }
            ];

            return {
                createForm: form,

                editForm: form,

                cols: ['Name', 'Icon']
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
