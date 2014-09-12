'use strict';

var bz2 = require('seek-bzip');
var File = require('vinyl');
var isBzip2 = require('is-bzip2');
var sbuff = require('simple-bufferstream');
var stripDirs = require('strip-dirs');
var tar = require('tar');
var through = require('through2');

/**
 * tar.bz2 decompress plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
    opts = opts || {};
    opts.strip = +opts.strip || 0;

    return through.obj(function (file, enc, cb) {
        var files = [];

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new Error('Streaming is not supported'));
            return;
        }

        if (!isBzip2(file.contents)) {
            cb(null, file);
            return;
        }

        file.contents = bz2.decode(file.contents);

        sbuff(file.contents).pipe(tar.Parse())
            .on('error', function (err) {
                cb(err);
                return;
            })

            .on('entry', function (file) {
                if (file.type !== 'Directory') {
                    var chunk = [];
                    var len = 0;

                    file.on('data', function (data) {
                        chunk.push(data);
                        len += data.length;
                    });

                    file.on('end', function () {
                        chunk = Buffer.concat(chunk, len);
                        files.push(new File({
                            contents: chunk,
                            path: stripDirs(file.path, opts.strip)
                        }));
                    });
                }
            })

            .on('end', function () {
                cb(null, files);
            });
    });
};
