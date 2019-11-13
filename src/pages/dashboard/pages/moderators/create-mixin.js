export default {
    data() {

        const trigger = 'blur';
        const required = {required: true};


        return {
            createForm: [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    rules: [required]
                },

                {
                    name: 'mobile',
                    label: 'Mobile',
                    type: 'text',
                    rules: [
                        // TODO: Reuse validators, DRY
                        required,
                        {
                            validator: (rule, value, callback) => {
                                value = value.toString();

                                const length = value.length;

                                if (/^\+880/.test(value) && length === 14) {
                                    return callback();
                                } else if (length === 11) {
                                    return callback();
                                }


                                callback('Sorry, number must be at least 11 characters');
                            }
                        },
                        {
                            validator: async (rule, mobile, callback) => {
                                const response = await this.$fetch('mobile-exists', {
                                    method: 'POST',
                                    body: {
                                        user_type_id: 3,
                                        mobile
                                    }
                                }).response();

                                if (!!response.json()) {
                                    return callback('Sorry, this number is already in use');
                                }

                                callback();
                            }, trigger: 'blur'
                        }
                    ]
                },

                {
                    name: 'roles',
                    label: 'Roles',
                    type: 'select',
                    source: 'dashboard/roles-all',
                    multiple: true,
                    rules: [
                        {
                            validator: (rule, value, callback) => {
                                if (!value || !value.length) {
                                    return callback('Please select at least one role');
                                }

                                callback();
                            },
                            trigger
                        }
                    ]
                },

                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    rules: [
                        required,
                        {
                            min: 8,
                            message: `Sorry, password must be at least 8 characters long`,
                            trigger
                        }
                    ]
                },

                {
                    name: 'rePassword',
                    label: 'Confirm Password',
                    type: 'password',
                    rules: [
                        {required: true, message: 'Please enter your password again'},
                        {
                            validator: (rule, value, callback) => {
                                if (document.getElementById('create-password').value === value) {
                                    return callback();
                                }

                                callback('Sorry, passwords didn\'t match!');
                            },
                            trigger
                        }
                    ]
                }
            ]
        };
    },
}
