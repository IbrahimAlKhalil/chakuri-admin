<template>
    <div class="el-collapse-item"
         :class="{'is-active': isActive, 'is-disabled': disabled }">
        <div>
            <div class="el-collapse-item__header" @click="handleHeaderClick" :tabindex="disabled ? undefined : 0"
                 @keyup.space.enter.stop="handleEnterClick"
                 :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
                 @focus="handleFocus"
                 @blur="focusing = false"
            >
                <slot name="title">{{title}}</slot>
                <i class="el-collapse-item__arrow el-icon-arrow-right" :class="{'is-active': isActive}"></i>
            </div>
        </div>
        <el-collapse-transition>
            <div class="el-collapse-item__wrap" v-if="isActive">
                <div class="el-collapse-item__content">
                    <slot></slot>
                </div>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script>
    import Emitter from 'element-ui/src/mixins/emitter'
    import {generateId} from 'element-ui/src/utils/util'
    import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition'

    export default {
        name: 'ElCollapseItem',
        components: {ElCollapseTransition},
        componentName: 'ElCollapseItem',

        mixins: [Emitter],

        data() {
            return {
                contentWrapStyle: {
                    height: 'auto',
                    display: 'block'
                },
                contentHeight: 0,
                focusing: false,
                isClick: false,
                id: generateId()
            }
        },

        inject: ['collapse'],

        props: {
            title: String,
            name: {
                type: [String, Number],
                default() {
                    return this._uid
                }
            },
            disabled: Boolean
        },

        computed: {
            isActive() {
                return this.collapse.activeNames.indexOf(this.name) > -1
            }
        },

        methods: {
            handleFocus() {
                setTimeout(() => {
                    if (!this.isClick) {
                        this.focusing = true
                    } else {
                        this.isClick = false
                    }
                }, 50)
            },
            handleHeaderClick() {
                if (this.disabled) return
                this.dispatch('ElCollapse', 'item-click', this)
                this.focusing = false
                this.isClick = true
            },
            handleEnterClick() {
                this.dispatch('ElCollapse', 'item-click', this)
            }
        }
    }
</script>
