import Notification from 'element-ui/packages/notification/src/main';
import MessageBox from 'element-ui/packages/message-box/src/main';
import {enToBn} from '@/modules/en-to-bn';
import {zeroPrefix} from '@/modules/zero-prefix';
import config from '@/config';
import store from '@/store';


/***
 * This plugin registers some common functionality
 */

export default {
    install(Vue) {
        // TODO: Try to move this in authenticator module
        Vue.prototype.$auth = store.state.auth;
        Vue.prototype.$notify = Notification;
        Vue.prototype.$messageBox = MessageBox;
        Vue.prototype.$paginate = function (items, page, perPage) {
            if (!items) {
                return [];
            }

            return items.slice(page * perPage - perPage, page * perPage);
        };

        const filters = {
            fileUrl: function (id) {
                return `${config.baseURL}/files/${id}`;
            },
            zeroPrefix: function (num) {
                if (!['string', 'number'].includes(typeof num)) {
                    return '';
                }

                return zeroPrefix(num);
            },
            enToBn: function (num) {
                if (!['string', 'number'].includes(typeof num)) {
                    return '';
                }

                return enToBn(num);
            },
            bnDate: function (isoDate) {
                if (!isoDate) {
                    return '';
                }

                const date = new Date(isoDate);

                return enToBn(`${zeroPrefix(date.getDate())}/${zeroPrefix(date.getMonth() + 1)}/${date.getFullYear()}`);

            }
        };

        for (let key in filters) {
            Vue.prototype['$' + key] = filters[key];
            Vue.filter(key, filters[key]);
        }
    }
};
