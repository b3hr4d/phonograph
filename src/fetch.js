import { slice } from './utils/buffer.js';

const fetch = window.fetch || _fetch;

function _fetch ( url ) {
	return new Promise( ( fulfil, reject ) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'arraybuffer';

		xhr.onerror = reject;

		xhr.onload = () => {
			fulfil( new Response( xhr.response ) );
		};

		xhr.open( 'GET', url );
		xhr.send();
	});
}

class Response {
	constructor ( data ) {
		this.data = new Uint8Array( data );

		this.headers = {
			get: header => {
				if ( header === 'content-length' ) return this.data.length;
				return null;
			}
		};

		this.body = {
			getReader: () => new Reader( this.data )
		};
	}
}

class Reader {
	constructor ( data ) {
		this.data = data;
		this.p = 0;
		this.chunkSize = 32768;

		this.done = false;
	}

	read () {
		const chunk = this.done ?
			{ done: true, value: null } :
			{ done: false, value: this.data };

		this.done = true;
		return Promise.resolve( chunk )
	}
}

export default fetch;
