<template>
    <data-list endpoint="dashboard/pages"
               title="Position"
               :decorator="decorate"
               :per-page="10"
               :before-create="create">

        <template #default="{data, methods}">

            <items-count :data="data"/>

            <data-table :cols="cols" :data="data" :methods="methods" :actions="[]">
                <template #default="{item}">
                    <td v-highlight="data.highlight">{{item.title}}</td>
                    <td>
                        <a class="link" :href="$store.state.homeUrl+'/pages/'+item.id" target="_blank">
                            {{$store.state.homeUrl}}/pages/{{item.id}}
                        </a>
                    </td>
                    <td v-highlight="data.highlight">{{item.author}}</td>
                </template>


                <template #actions="{item}">
                    <div class="el-menu-item" @click="edit(item)">
                        <i class="fa fa-edit"></i> Edit
                    </div>
                    <div class="el-menu-item" @click="methods.removeItem(item)">
                        <i class="fa fa-trash"></i> Delete
                    </div>
                </template>
            </data-table>
        </template>
    </data-list>
</template>

<script>
    import dataList from '@/components/data-list/paginated';
    import dataTable from '@/components/table';
    import itemsCount from '@/components/items-count';

    export default {
        components: {itemsCount, dataList, dataTable},

        data() {
            return {
                cols: ['Title', 'Link', 'Author']
            };
        },

        methods: {
            decorate(item) {
                item.checked = false;

                return item;
            },

            async create() {
                await this.$router.push(`pages/create`);

                return false;
            },

            edit(item) {
                this.$router.push(`pages/edit/${item.id}`);
            }
        }
    };
</script>
