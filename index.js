import {Buffer} from 'node:buffer';
import decompressTar from '@xhmikosr/decompress-tar';
import {fileTypeFromBuffer} from 'file-type';
import {isStream} from 'is-stream';
import unbzip2Stream from 'unbzip2-stream';

const decodeToBuffer = input => new Promise((resolve, reject) => {
	const chunks = [];
	unbzip2Stream()
		.on('data', chunk => chunks.push(chunk))
		.on('end', () => resolve(Buffer.concat(chunks)))
		.on('error', reject)
		.end(input);
});

const decompressTarBz2 = () => async input => {
	if (!Buffer.isBuffer(input) && !isStream(input)) {
		throw new TypeError(`Expected a Buffer or Stream, got ${typeof input}`);
	}

	if (Buffer.isBuffer(input)) {
		const type = await fileTypeFromBuffer(input);

		if (!type || type.mime !== 'application/x-bzip2') {
			return [];
		}

		// Decode to a buffer so decompress-tar still runs its tar check and returns
		// [] for bzip2 that isn't a tar, matching the old seek-bzip behavior
		return decompressTar()(await decodeToBuffer(input));
	}

	return decompressTar()(input.pipe(unbzip2Stream()));
};

export default decompressTarBz2;
