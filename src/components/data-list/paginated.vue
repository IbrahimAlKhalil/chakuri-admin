<template>
    <div>

        <!-- Toolbar -->
        <div v-if="!hideToolbar" class="el-card is-always-shadow mb-1">
            <div class="el-card__body toolbar flex justify-between">
                <div class="flex align-center" @keydown.enter="reset">
                    <template v-if="search">
                        <el-input v-model="keyword" placeholder="Search"></el-input>
                        <el-button icon="fa fa-search" type="primary"
                                   @click="reset"></el-button>
                    </template>

                    <slot name="inputs" v-bind:methods="{reset}"></slot>
                </div>

                <div class="tools">
                    <template v-if="crud">
                        <el-tooltip v-if="actions.includes('create')" content="Create">
                            <el-button icon="fa fa-plus" @click="create" circle></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="actions.includes('delete')" content="Delete">
                            <el-button icon="fa fa-trash" @click="remove(true)" circle></el-button>
                        </el-tooltip>
                    </template>

                    <slot name="tool-btns" v-bind:methods="{remove, create}"></slot>
                </div>

                <div class="menu">
                    <el-popover popper-class="popover">
                        <el-button slot="reference" :icon="menuIcon"></el-button>

                        <div class="el-menu">
                            <template v-if="crud">
                                <div class="el-menu-item" @click="create"><i class="fa fa-plus"></i> Create</div>
                                <div class="el-menu-item" @click="remove(true)"><i class="fa fa-trash"></i> Delete
                                </div>
                            </template>

                            <slot name="tool-menu" v-bind:methods="{remove, create}"></slot>
                        </div>
                    </el-popover>
                </div>
            </div>

            <slot v-bind:methods="{reset}" name="after-toolbar"></slot>
        </div>

        <!-- Show items -->
        <component :is="tag">
            <slot v-bind:data="exposed" v-bind:methods="{check, removeItem, edit}"/>

            <empty :empty="!exposed.total" :loading="loading"/>
        </component>

        <div class="el-card is-always-shadow mt-1" v-show="exposed.total > perPage">
            <div class="el-card__body flex justify-center">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="exposed.total"
                        :page-size="perPage"
                        :current-page="page"
                        hide-on-single-page
                        @current-change="goTo">
                </el-pagination>
            </div>
        </div>

        <template v-if="crud && (createForm && editForm)">
            <data-form :fields="createForm" :endpoint="endpoint" type="create" @submitted="created" :title="title"
                       :show.sync="createDialog"/>

            <data-form :fields="editForm" :endpoint="endpoint" type="edit" :item="editItem" @submitted="updated"
                       :title="title" :show.sync="editDialog"/>
        </template>
    </div>
</template>

<script>
    import crudMixin from './crud-mixin';
    import toolbarMixin from './toolbar-mixin';
    import paginatedMixin from './paginated-mixin';


    export default {
        mixins: [crudMixin, toolbarMixin, paginatedMixin],
        components: {
            dataForm: () => import('./data-form'),
        },

        props: {
            title: {
                type: String,
                required: true,
            },

            endpoint: {
                type: String,
                required: true,
            },
        },

        data() {
            return {};
        },

        methods: {
            async callLifeCycle(name, param) {
                const fn = this.$props[name];

                let returnValue = true;

                // Call
                if (typeof fn === 'function') {
                    returnValue = await fn(param);
                }

                return !!returnValue;
            },

            async check(item) {
                let check = await this.callLifeCycle('beforeCheck', item);

                if (!check) {
                    return;
                }

                item.checked = !item.checked;
            },
        },
    };
</script>


<!-- Toolbar styles -->

<style lang="scss" scoped>
    @import "../../styles/var";

    .toolbar {
        padding: 10px;
    }

    .tools {
        display: none;
    }

    @media all and (min-width: $--md) {
        .toolbar {
            padding: 15px;
        }

        .tools {
            display: block;
        }

        .menu {
            display: none;
        }
    }
</style>
