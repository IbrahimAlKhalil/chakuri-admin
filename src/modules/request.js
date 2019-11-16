import config from '@/config';

const locked = Symbol('locked');

export class Fetcher {
    [locked] = false;
    callbacks = [];

    constructor(endPoint, defaultOptions) {

        const options = {
            method: 'GET',
            headers: {},
            body: null,
            ...defaultOptions
        };

        this.options = options;
        this.endPoint = endPoint;

        // Create XMLHttpRequest instance
        const xhr = this.xhr = new XMLHttpRequest;

        // Open the request before adding headers
        xhr.open(options.method, `${config.baseURL}/${endPoint}`);

        // Run before handlers
        for (let handler of Fetcher.beforeEachHandlers) {
            try {
                handler(this);
            } catch (e) {
                throw e;
            }
        }

        // Set request headers
        for (let header in options.headers) {
            xhr.setRequestHeader(header, options.headers[header]);
        }
    }

    response(delay = 0) {
        return new Promise((resolve, reject) => {

            // You can't call this method twice
            if (this[locked]) {
                return reject('Response object is locked');
            }

            // Lock the response
            this[locked] = true;

            const xhr = this.xhr;

            // Add onload event handler
            xhr.onload = () => {
                // headers method
                const headers = () => {

                    // Convert the header string into an array
                    // of individual headers
                    const arr = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/);

                    // Create a map of header names to values
                    const headerMap = {};
                    arr.forEach(line => {
                        const parts = line.split(': ');
                        const header = parts.shift();
                        headerMap[header] = parts.join(': ');
                    });

                    return headerMap;
                };

                // json method
                const json = () => JSON.parse(xhr.responseText);

                // Response object
                const response = {
                    header: xhr.getResponseHeader.bind(xhr),
                    headers,
                    json,
                    text: xhr.responseText,
                    status: xhr.status
                };

                resolve(response);

                // Run callbacks
                for (let handler of this.callbacks) {
                    try {
                        handler(this, response);
                    } catch (e) {
                        throw e;
                    }
                }


                // Run after handlers
                for (let handler of Fetcher.afterEachHandlers) {
                    try {
                        handler(this, response);
                    } catch (e) {
                        throw e;
                    }
                }
            };

            let timeout = 0;

            xhr.onabort = () => {
                clearTimeout(timeout);

                reject('Aborted');
            };
            xhr.onerror = () => reject(xhr.responseText);

            let body = this.options.body;

            if (body && body.constructor === Object) {
                body = Fetcher.convertToFormData(body);
            }

            if (delay) {
                timeout = setTimeout(() => xhr.send(body), delay);

                return;
            }

            xhr.send(body);
        });
    }

    after(fn, req = true) {
        this.callbacks.push(fn);

        if (req) {
            this.response();
        }
    }

    abort() {
        this.xhr.abort();
    }

    static beforeEachHandlers = [];
    static afterEachHandlers = [];

    static before(handler) {
        Fetcher.beforeEachHandlers.unshift(handler);
    }

    static after(handler) {
        Fetcher.afterEachHandlers.unshift(handler);
    }

    static arrayToFormData(arr, formData, parent) {
        arr.forEach((item, index) => {
            if (Array.isArray(item)) {
                return this.arrayToFormData(item, formData, `${parent}[${index}]`);
            }

            if (typeof item === 'object') {
                return this.objectToFormData(item, formData, `${parent}[${index}]`);
            }

            formData.append(`${parent}[${index}]`, item);
        });
    }

    static objectToFormData(obj, formData, parent) {
        for (let key in obj) {
            const value = obj[key];

            if (Array.isArray(value)) {
                this.arrayToFormData(value, formData, !parent ? key : `${parent}[${key}]`);
                continue;
            }

            if (typeof value === 'object') {
                this.objectToFormData(value, formData, !parent ? key : `${parent}[${key}]`);
                continue;
            }

            if (!parent) {
                formData.append(key, value);
                continue;
            }

            formData.append(`${parent}[${key}]`, value);
        }
    }

    static convertToFormData(data) {
        const formData = new FormData;

        if (Array.isArray(data)) {
            throw new Error('Data must be an object');
        }

        this.objectToFormData(data, formData, '');

        return formData;
    }
}

export default function request(endPoint, options) {
    return new Fetcher(endPoint, options);
}
