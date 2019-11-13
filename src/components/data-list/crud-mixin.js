import messageBox from 'element-ui/lib/message-box';

export default {
    props: {
        beforeCreate: Function,
        beforeCheck: Function,

        createForm: Array,
        editForm: Array
    },

    data() {
        return {
            createDialog: false,
            editDialog: false,
            editItem: null
        };
    },

    methods: {
        confirm() {
            return new Promise(resolve => {
                messageBox.confirm(`Are you sure you want to do this? This action may <strong>Chane some states of the item/s you selected</strong>. Continue?`, 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    center: true,
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            });
        },

        edit(item) {
            this.editItem = item;
            this.editDialog = true;
        },

        async create() {
            let shouldCreate = await this.callLifeCycle('beforeCreate');

            if (!shouldCreate) {
                return;
            }

            this.createDialog = true;
        },

        addItem(item, unshift) {
            const {items} = this.exposed;

            const add = unshift ? items.unshift : items.push;

            if (this.$props.decorator) {
                add.call(items, this.$props.decorator(item));
            } else {
                add.call(items, item);
            }

            this.exposed.total = this.exposed.total + 1;
        },

        // This method is given to the child by scoped slot
        removeItem(item) {
            this.remove(false, item);
        },

        async remove(multiple, item) {

            // At least one item should be checked if multiple items should be deleted
            if (multiple && !this.exposed.items.some(a => a.checked)) {
                // No item selected
                return this.$notify({
                    type: 'warning',
                    message: 'Please select at least one item to be deleted'
                });
            }


            // Confirm about this action before doing
            const confirmed = await this.confirm();


            if (!confirmed) {
                // Canceled
                return false;
            }

            let success;

            if (!multiple) {
                success = await this.removeOne(item);
            } else {
                await this.removeMultiple();
            }

            if (success && !multiple) {
                return this.$notify({
                    type: 'success',
                    message: 'Deleted'
                });
            } else if (!multiple) {
                // Notify
                this.$notify({
                    type: 'error',
                    message: 'Sorry this item could not be deleted, maybe some other data/functionality are dependent on this item',
                    duration: 8000
                });
            }
        },

        async removeOne(item) {
            const {items} = this.exposed;

            const option = {
                method: 'DELETE'
            };

            const response = await this.$fetch(`${this.endpoint}/${item.id}`, option).response();

            const success = response.status === 200 || response.status === 204;

            if (success) {
                // Remove item from array
                items.splice(items.indexOf(item), 1);
                this.exposed.total = this.exposed.total - 1;
            }

            return success;
        },

        async removeMultiple() {
            const toBeRemoved = this.exposed.items.filter(item => item.checked);

            // At least one item should be selected
            if (!toBeRemoved.length) {
                return this.$notify({
                    type: 'warning',
                    message: 'Please select at least one item to be deleted'
                });
            }

            const result = await Promise.all(toBeRemoved.map(item => this.removeOne(item)));

            const successCount = result.filter(item => !!item).length;
            const failedCount = result.filter(item => !item).length;

            if (successCount) {
                // Notify
                return this.$notify({
                    type: 'success',
                    message: 'Deleted'
                });
            }

            if (failedCount === toBeRemoved.length) {
                // Notify
                return this.$notify({
                    type: 'error',
                    message: 'Sorry these items could not be deleted, because some other data/functionality are dependent on these items',
                    duration: 8000
                });
            }

            if (successCount && failedCount) {
                // Notify
                this.$notify({
                    type: 'error',
                    message: 'Sorry some of the items could not be deleted, maybe some other data/functionality are dependent on these items',
                    duration: 8000
                });
            }
        },

        async updated(value) {
            this.editDialog = false;

            // Notify
            this.$notify({
                type: 'success',
                message: 'Updated'
            });

            this.$emit('updated', {
                value,
                methods: {
                    reset: this.reset
                }
            });
        },

        created(item) {
            this.createDialog = false;

            this.addItem(item);

            // Notify
            this.$notify({
                type: 'success',
                message: 'Created'
            });

            this.$emit('created', item);
        }
    }
};
