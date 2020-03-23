import io from 'socket.io-client';
import {retrieveToken} from '@/modules/tokenizer';
import config from '@/config';

const url = new URL(config.baseURL);

let socket = null;

export default function () {
    if (socket && socket.connected) {
        return socket;
    }

    socket = io.connect(url.host, {
        path: process.env.NODE_ENV === 'development' ? '/socket.io' : '/socketio',
        query: {
            'token': retrieveToken()
        },
        transports: ['websocket']
    });

    return socket;
};
