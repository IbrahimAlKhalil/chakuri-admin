<template>
    <div class="el-card is-always-shadow">
        <el-form class="el-card__body" :model="model" :rules="rules" @submit.native.prevent="submit" ref="form"
                 v-loading="loading">
            <div class="mb-1" v-if="link">
                <strong>Link: </strong>
                <a class="link" :href="link">{{link}}</a>
            </div>

            <el-form-item prop="title">
                <label for="title">Title</label>
                <el-input v-model="model.title" id="title" :maxlength="titleMax" show-word-limit></el-input>
            </el-form-item>

            <el-form-item prop="content">
                <label>Content</label>
                <ck-editor :editor="editor" v-model="model.content" :config="config"></ck-editor>
            </el-form-item>

            <el-button class="mt-2 d-block" nativeType="submit" icon="fa fa-save"> Save</el-button>
        </el-form>
    </div>
</template>

<script>
    import {elInput, elForm, elFormItem, elButton} from '@/el';


    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

    import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
    import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
    import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
    import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
    import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

    import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
    import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
    import Heading from '@ckeditor/ckeditor5-heading/src/heading';
    import Indent from '@ckeditor/ckeditor5-indent/src/indent';
    import List from '@ckeditor/ckeditor5-list/src/list';
    import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
    import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
    import Image from '@ckeditor/ckeditor5-image/src/image';
    import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
    import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
    import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
    import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
    import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';

    import {component as ckEditor} from '@ckeditor/ckeditor5-vue/dist/ckeditor';

    export default {
        components: {elInput, elForm, elFormItem, ckEditor, elButton},

        data() {
            return {
                model: {
                    title: '',
                    content: ''
                },

                editor: ClassicEditor,

                titleMax: 1000,
                // editor: ClassicEditor,
                config: {
                    plugins: [
                        EssentialsPlugin,
                        BoldPlugin,
                        ItalicPlugin,
                        LinkPlugin,
                        ParagraphPlugin,

                        Autoformat,
                        MediaEmbed,
                        List,
                        BlockQuote,
                        Heading,
                        Indent,
                        Alignment,
                        Image,
                        ImageCaption,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter
                    ],
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'indent',
                            'outdent',
                            '|',
                            'alignment',
                            '|',
                            'bold',
                            'italic',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'blockQuote',
                            'imageUpload',
                            'mediaEmbed'
                        ]
                    },
                    image: {
                        toolbar: [
                            'imageStyle:full',
                            'imageStyle:side',
                            '|',
                            'imageTextAlternative'
                        ]
                    },
                    // This value must be kept in sync with the language defined in webpack.config.js.
                    language: 'en'
                },
                link: null,
                loading: false
            };
        },

        computed: {
            rules() {
                const required = {required: true, message: 'This field is required'};
                const {titleMax} = this;

                return {
                    title: [
                        required,
                        {max: titleMax}
                    ],
                    content: [
                        required
                    ]
                };
            }
        },

        methods: {
            async submit() {
                const {form} = this.$refs;

                try {
                    await form.validate();
                } catch (e) {
                    this.$notify({
                        type: 'error',
                        title: 'Error',
                        message: 'Please fill all the required fields'
                    });
                }

                const {id} = this.$route.params;

                const response = await this.$fetch(`dashboard/pages/${id || ''}`, {
                    method: id ? 'PATCH' : 'POST',
                    body: this.model
                }).response();

                if (response.status === 200 || response.status === 204) {
                    !id && this.$router.push(`/dashboard/pages/edit/${response.json().id}`);

                    return this.$notify({
                        type: 'success',
                        title: 'Success',
                        message: !id ? 'Saved' : 'Updated'
                    });
                }


                this.$notify({
                    type: 'error',
                    title: 'Error',
                    message: 'Something went wrong, please try later'
                });
            },

            updateLink(id) {

                if (!id) {
                    this.link = null;
                    return;
                }

                this.link = this.$store.state.homeUrl + '/pages/' + id;
            }
        },

        async created() {
            this.$watch('$route.params.id', (id) => {
                this.updateLink(id);
            });

            const {id} = this.$route.params;

            if (!id) {
                return;
            }

            this.loading = true;

            const response = await this.$fetch(`dashboard/pages/${id}`).response();

            if (response.status === 404) {
                this.$notify({
                    type: 'error',
                    title: 'Error',
                    message: 'Sorry, the page you are looking for doesn\'t exist'
                });

                return this.$router.back();
            }

            this.updateLink(id);
            this.model = response.json();
            this.loading = false;
        }
    };
</script>

<style lang="scss" scoped>
    label {
        font-size: 1.1em;
    }
</style>

<style>
    .ck-editor__editable {
        min-height: 300px;
    }
</style>
