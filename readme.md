# decompress-tarbz2 [![CI](https://github.com/kevva/decompress-tarbz2/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/kevva/decompress-tarbz2/actions/workflows/ci.yml)

> tar.bz2 decompress plugin


## Install

```sh
npm install decompress-tarbz2
```


## Usage

```js
import decompress from 'decompress';
import decompressTarbz from 'decompress-tarbz2';

decompress('unicorn.tar.gz', 'dist', {
	plugins: [
		decompressTarbz()
	]
}).then(() => {
	console.log('Files decompressed');
});
```


## API

### decompressTarbz()(input)

Returns both a `Promise` for a `Buffer` and a [`Duplex stream`](https://nodejs.org/api/stream.html#stream_class_stream_duplex).

#### input

Type: `Buffer` `Stream`

Buffer to decompress.


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
