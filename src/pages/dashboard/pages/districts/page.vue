<template>
    <data-list endpoint="dashboard/districts"
               title="District"
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
                            Showing districts of <strong>{{parent.name}}</strong> division.
                        </template>
                        <template v-else>
                            Showing all districts.
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
                    <td>
                        <router-link class="link" :to="`/dashboard/thanas/${item.id}`">
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
            const {division} = this.$route.params;

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
                        name: 'division_id',
                        type: 'hidden',
                        rules: [required],
                        value: division
                    }
                ],

                editForm: [
                    ...form,
                    {
                        name: 'division_id',
                        label: 'Division',
                        type: 'select',
                        source: 'dashboard/divisions-all',
                        rules: [
                            {required: true, message: 'Please select a division'}
                        ]
                    }
                ],

                cols: ['Name'],

                query: {
                    parent: division
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

                query.parent = query.parent !== 0 ? 0 : this.$route.params.division;

                reset();
            },
            reload({methods, value}) {
                if (value.old.division_id !== value.item.division_id.division_id) {
                    methods.reset();
                }
            }
        },

        async created() {
            const response = await this.$fetch(`dashboard/divisions/${this.$route.params.division}`).response();

            if (response.status !== 404) {
                this.parent = response.json();
                return;
            }

            this.found = false;
        }
    };
</script>
