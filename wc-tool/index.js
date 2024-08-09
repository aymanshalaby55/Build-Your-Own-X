#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');

function countWords(str) {
    return str.split(/\s+/).length;
}

function countLines(str) {
    return str.split('\n').length;
}

function countBytes(str) {
    return str.length;
}

program
    .option('-c, --bytes', 'count bytes')
    .option('-l, --lines', 'count lines')
    .option('-w, --words', 'count words')
    .argument('[file]', 'file to read (if not specified, reads from stdin)')
    .action((file, options) => {
        const processData = (str) => {
            if (options.bytes) {
                console.log(`${countBytes(str)} bytes`);
            }

            if (options.lines) {
                console.log(`${countLines(str)} lines`);
            }

            if (options.words) {
                console.log(`${countWords(str)} words`);
            }

            if (!options.bytes && !options.lines && !options.words) {
                console.log(countBytes(str) + " " + countLines(str) + " " + countWords(str), `${file}`);
            }
        };

        if (file) {
            fs.readFile(file, (err, data) => {
                if (err) throw err;
                processData(data.toString());
            });
        } else {
            let input = '';
            process.stdin.on('data', (chunk) => {
                input += chunk;
            });

            process.stdin.on('end', () => {
                processData(input);
            });

            process.stdin.resume();
        }
    });

program.parse(process.argv);
