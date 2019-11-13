export default {
    data() {
        return {
            editForm: [
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
                            trigger: 'blur'
                        }
                    ]
                }
            ]
        }
    }
}
