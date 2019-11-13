<template>
    <data-list endpoint="dashboard/thanas"
               title="Thana"
               :decorator="decorate"
               :create-form="createForm"
               :edit-form="editForm"
               :per-page="25"
               :query="query"
               @updated="reload">

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <div class="el-card is-always-shadow mb-1" v-if="found">
                <div class="el-card__body">
                    <template v-if="parent">
                        <template v-if="query.parent !== 0">
                            Showing thana of <strong>{{parent.name}}</strong> district.
                        </template>
                        <template v-else>
                            Showing all thana.
                        </template>

                        <strong class="link pointer" @click="toggleShowAll(methods.reset)">
                            <template v-if="query.parent !== 0">
                                Show All
                            </template>
                            <template v-else>
                                {{parent.name}}
                            </template>
                        </strong>
                    </template>
                    <div v-else class="text-center">
                        <i class="el-icon-loading"></i>
                    </div>
                </div>
            </div>

            <data-table :cols="cols" :data="data" :methods="methods">
                <template #default="{item}">
                    <td>{{item.name}}</td>
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
            const {district} = this.$route.params;

            const form = [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    rules: [required]
                }
            ];

            return {
                createForm: [
                    ...form,
                    {
                        name: 'district_id',
                        type: 'hidden',
                        rules: [required],
                        value: district
                    }
                ],

                editForm: [
                    ...form,
                    {
                        name: 'district_id',
                        label: 'District',
                        type: 'select',
                        source: 'dashboard/districts-all',
                        rules: [
                            {required: true, message: 'Please select a district'}
                        ]
                    }
                ],

                cols: ['Name'],

                query: {
                    parent: district
                },

                parent: null,
                found: true
            };
        },

        methods: {
            decorate(item) {
                item.checked = false;

                return item;
            },

            toggleShowAll(reset) {
                const {query} = this;

                query.parent = query.parent !== 0 ? 0 : this.$route.params.district;

                reset();
            },
            reload({methods, value}) {
                if (value.old.district_id !== value.item.district_id.district_id) {
                    methods.reset();
                }
            }
        },

        async created() {
            const response = await this.$fetch(`dashboard/districts/${this.$route.params.district}`).response();

            if (response.status !== 404) {
                this.parent = response.json();
                return;
            }

            this.found = false;
        }
    };
</script>
