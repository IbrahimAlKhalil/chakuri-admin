<template>
    <el-dialog title="ছবির আকার পরিবর্তন করুন"
               :visible="!!photo"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :fullscreen="fullscreen()"
               :destroy-on-close="true"
               append-to-body
               @opened="crop"
               @close="destroy"
               center>
        <div>
            <img :src="photo" class="w-100 crop-img" ref="crop">
        </div>

        <span slot="footer">
                <el-button @click="close('cancel')" :disabled="!initialized">বাতিল করুন</el-button>
                <el-button type="primary" @click="close('save')" :disabled="!initialized">ঠিক আছে</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Cropper from 'cropperjs'
    import {elDialog, elButton} from '@/el'

    let cropper

    export default {
        components: {elDialog, elButton},

        props: ['photo'],

        data() {
            return {
                initialized: false,
            }
        },

        methods: {
            async close(action) {

                if (action === 'cancel') {
                    return this.$emit('cancel')
                }

                cropper.getCroppedCanvas().toBlob(photo => {
                    this.$emit('done', photo)
                }, 'image/jpeg', 0.60)
            },

            destroy() {
                this.initialized = false
                cropper.destroy()
                URL.revokeObjectURL(this.$props.photo)
            },

            crop() {
                this.$nextTick(() => {
                    const {crop} = this.$refs
                    const instance = this

                    cropper = new Cropper(crop, {
                        aspectRatio: 1,
                        viewMode: 2,
                        highlight: false,
                        guides: false,
                        checkOrientation: false,
                        ready() {
                            instance.initialized = true
                        }
                    })
                })
            },

            fullscreen() {
                return innerWidth < 920
            }
        }
    }
</script>

<style lang="scss" scoped>
    .crop-img {
        max-height: calc(100vh - 240px);
    }
</style>
