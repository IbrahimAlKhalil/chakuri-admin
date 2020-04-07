<template>
    <div class="el-card">
        <el-form v-if="loaded" class="el-card__body" :model="models" :rules="rules" @submit.native.prevent="submit">
            <section>
                <!--                <h3 class="mt-2">কাজ</h3>-->

                <el-form-item prop="institute_name">
                    <label class="d-block" for="institute-name">Institute name</label>
                    <el-input type="text" id="institute-name" :maxlength="200" show-word-limit
                              v-model="models.institute_name">
                    </el-input>
                </el-form-item>

                <el-form-item prop="position_id">
                    <label class="d-block" for="position">Position</label>

                    <el-select v-model="models.position_id"
                               id="position"
                               class="d-block-important" placeholder="Select position"
                               @focus="loadOptions('positions', position)">
                        <div slot="empty"></div>
                        <el-option v-for="(option, index) in position.options" :value="option.value"
                                   :label="option.label" :key="index"/>
                    </el-select>
                </el-form-item>

                <el-form-item prop="vacancy">
                    <label class="d-block" for="vacancy">Vacancy (Optional)</label>

                    <el-input type="number" id="vacancy" v-model="models.vacancy" min="1">
                    </el-input>
                </el-form-item>


                <el-form-item prop="nature">
                    <label class="d-block" for="nature">Job Nature (Optional)</label>

                    <el-select
                            id="nature"
                            v-model="models.nature"
                            class="d-block-important" placeholder="Select job nature">
                        <div slot="empty"></div>
                        <el-option :value="1" label="Full Time"/>
                        <el-option :value="2" label="Part Time"/>
                    </el-select>
                </el-form-item>

                <range-input name="salary" append="TK (Monthly)" :models="models"
                             label="Salary (Optional)" :negotiable="true" @typeChange="rangeTypeChange"/>

                <el-form-item prop="negotiable">
                    <el-checkbox v-model="models.negotiable" :disabled="negotiableDisabled">Negotiable
                    </el-checkbox>
                    <br/>
                </el-form-item>

                <el-form-item prop="responsibilities">
                    <label class="d-block" for="responsibilities">Responsibilities (Optional)</label>
                    <el-input type="textarea" id="responsibilities" :maxlength="5000" rows="5" show-word-limit
                              v-model="models.responsibilities">
                    </el-input>
                </el-form-item>

                <el-form-item prop="deadline">
                    <label class="d-block" for="deadline">Deadline</label>

                    <el-input type="date" id="deadline" v-model="models.deadline">
                    </el-input>
                </el-form-item>
            </section>

            <section>
                <!--                <h3 class="mt-2">ঠিকানা</h3>-->

                <div class="group">
                    <el-form-item prop="district_id">
                        <label class="d-block" for="district">District</label>

                        <el-select v-model="models.district_id"
                                   id="district"
                                   class="d-block-important" placeholder="Select district"
                                   @focus="loadDistricts"
                                   @change="unselectThana">
                            <div slot="empty"></div>
                            <el-option v-for="(option, index) in district.options" :value="option.value"
                                       :label="option.label" :key="index"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="thana_id">
                        <label class="d-block" for="thana">Thana</label>

                        <el-select v-model="models.thana_id"
                                   id="thana"
                                   class="d-block-important" placeholder="Select thana"
                                   @focus="loadOptions(`thanas/by-district/${models.district_id}`, thana)"
                                   :disabled="!models.district_id">
                            <div slot="empty"></div>
                            <el-option v-for="(option, index) in thana.options" :value="option.value"
                                       :label="option.label" :key="index"/>
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item prop="village">
                    <label class="d-block" for="village">(Institutes's) Hometown / Road Number</label>
                    <el-input type="textarea" id="village" :maxlength="200" rows="5" show-word-limit
                              v-model="models.village">
                    </el-input>
                </el-form-item>
            </section>

            <section>
                <!--                <h3 class="mt-2">আবেদনকারী সম্পর্কে তথ্য</h3>-->

                <range-input name="age" append="Year" :models="models" label="Age (Optional)"/>

                <range-input name="experience" append="Year" :models="models" label="Experience (Optional)"/>

                <el-form-item prop="education">
                    <label class="d-block" for="education">Educational Qualification (Optional)</label>
                    <el-input type="textarea" id="education" :maxlength="200" rows="5" show-word-limit
                              v-model="models.education">
                    </el-input>
                </el-form-item>


                <el-form-item prop="gender">
                    <label class="d-block" for="gender">Gender</label>

                    <el-select v-model="models.gender"
                               id="gender"
                               class="d-block-important" placeholder="Select gender">
                        <div slot="empty"></div>
                        <el-option :value="1" label="Male"/>
                        <el-option :value="2" label="Female"/>
                        <el-option :value="3" label="Both"/>
                    </el-select>
                </el-form-item>


                <el-form-item prop="additional">
                    <label class="d-block" for="additional">Additional Requirements (Optional)</label>
                    <el-input type="textarea" id="additional" :maxlength="5000" rows="5" show-word-limit
                              v-model="models.additional">
                    </el-input>
                </el-form-item>

                <el-form-item prop="how_to_apply">
                    <label class="d-block" for="how-to-apply">How To Apply</label>
                    <el-input type="textarea" id="how-to-apply" :maxlength="5000" rows="5" show-word-limit
                              v-model="models.how_to_apply">
                    </el-input>
                </el-form-item>
            </section>

            <el-form-item prop="special">
                <el-checkbox v-model="models.special" id="special-job-check">Special Job</el-checkbox>
            </el-form-item>

            <div class="text-center mt-1">
                <el-button class="login-btn w-100"
                           :icon="!formLoading? 'el-icon-s-promotion' : 'el-icon-loading'"
                           type="primary"
                           nativeType="submit" :disabled="formLoading">&nbsp;&nbsp;Submit
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {elButton, elCheckbox, elForm, elFormItem, elInput, elOption, elRadioButton, elSelect} from '@/el';
    import rangeInput from './range-input';
    import elCollapse from '@components/collapse';
    import elCollapseItem from '@components/collapse-item';
    import messageBox from 'element-ui/lib/message-box';

    export default {
        components: {
            elForm,
            elFormItem,
            elInput,
            elSelect,
            elOption,
            elButton,
            elCollapse,
            elCollapseItem,
            elCheckbox,
            elRadioButton,
            rangeInput,
        },

        data() {
            return {
                formLoading: false,
                models: {
                    gender: 1,
                    negotiable: false,
                    special: false,
                    how_to_apply: '',
                    institute_name: '',
                },
                district: {
                    loading: true,
                    options: [],
                },
                thana: {
                    loading: true,
                    options: [],
                },
                position: {
                    loading: true,
                    options: [],
                },

                ageType: 1,

                negotiableDisabled: false,

                specialInfoLink: '',
                loaded: false,
            };
        },

        methods: {
            async minDate(rule, value, callback) {
                const d = new Date(value).getTime();
                const response = await this.$fetch('time').response();
                const min = Number(response.text) + 4.32e+7;

                if (d < min) {
                    const minDate = new Date(min);

                    callback(`Sorry deadline can't be less than ${minDate.toDateString()}`);
                }

                callback();
            },

            async submit(evt) {
                try {
                    await evt.target.__vue__.validate();
                } catch (e) {
                }

                const {models, edit} = this;

                if (!!edit && !(await this.confirm())) {
                    return;
                }

                const body = new FormData;

                for (const key in models) {
                    if (typeof models[key] === 'boolean') {
                        body.append(key, Number(models[key]));
                        continue;
                    }
                    body.append(key, models[key]);
                }

                const response = await this.$fetch(!!edit ? `dashboard/jobs/${edit}` : 'dashboard/jobs', {
                    method: !!edit ? 'PATCH' : 'POST',
                    body,
                }).response();

                if (response.status === 200) {
                    this.$notify({
                        message: 'Your job is successfully is posted',
                        type: 'success',
                    });

                    return this.$router.push('/dashboard/jobs');
                }

                this.$notify({
                    message: 'Sorry, check your inputs and try again',
                    type: 'error',
                });
            },

            async loadOptions(endpoint, field) {
                if (field.loaded) {
                    return;
                }

                const response = await this.$fetch(endpoint).response();
                const data = response.json();

                field.options = data.map(item => ({
                    value: item.id,
                    label: item.name,
                }));
            },

            rangeTypeChange(evt) {
                this.negotiableDisabled = this.models.negotiable = evt === 5;
            },

            loadDistricts() {
                this.loadOptions('districts', this.district);
                this.$set(this.thana, 'loaded', false);
            },

            unselectThana() {
                this.$set(this.models, 'thana_id', null);
            },

            confirm() {
                return new Promise(resolve => {
                    messageBox.confirm('Are your sure, you want to do this?', 'Confirmation', {
                        confirmButtonText: 'Yes do it',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                        center: true,
                    }).then(() => {
                        resolve(true);
                    }).catch(() => {
                        resolve(false);
                    });
                });
            },
        },

        computed: {

            edit() {
                return this.$route.params.id;
            },

            rules() {
                const required = {
                    required: true,
                    message: 'This field is required',
                };

                const {minDate} = this;

                return {
                    position_id: [required],
                    deadline: [required, {validator: minDate}],
                    gender: [required],
                    village: [required],
                    district_id: [required],
                    thana_id: [required],
                    how_to_apply: [required],
                    institute_name: [required],
                };
            },
        },

        async created() {
            if (!this.edit) {
                this.loaded = true;
                return;
            }

            const {models, thana} = this;

            this.loadOptions('positions', this.position);
            this.loadOptions('districts', this.district);

            const job = (await this.$fetch(`dashboard/jobs/${this.edit}/edit`).response()).json();

            job.deadline = new Date(job.deadline).toISOString().split('T')[0];

            for (let key in job) {
                this.$set(models, key, job[key]);
            }

            ['negotiable', 'special'].forEach(item => {
                models[item] = !!models[item];
            });

            await this.loadOptions(`thanas/by-district/${models.district_id}`, thana);

            this.loaded = true;
        },
    };
</script>

<style lang="scss" scoped>

    .group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 10px;
    }

    .select {
        display: block !important;
    }
</style>

<style>
    #special-job-check .el-checkbox__label {
        white-space: normal;
    }
</style>
