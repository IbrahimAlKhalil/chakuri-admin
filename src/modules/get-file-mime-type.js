function mimeType(signature) {
    switch (signature) {
        case '89504E47':
            return 'image/png';
        // case '47494638':
        //     return 'image/gif'
        // case '25504446':
        //     return 'application/pdf'
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1':
            return 'image/jpeg';
        // case '504B0304':
        //     return 'application/zip'
        default:
            return 'octet/stream';
    }
}


export function getFileMimeType(file) {
    return new Promise(resolve => {
        const reader = new FileReader;

        reader.onloadend = evt => {
            const uint = new Uint8Array(evt.target.result);

            let bytes = [];
            uint.forEach((byte) => {
                bytes.push(byte.toString(16));
            });

            resolve(mimeType(bytes.join('').toUpperCase()));
        };

        reader.readAsArrayBuffer(file.slice(0, 4));
    });
}
