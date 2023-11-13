// node client/src/helpers/img-resize.js

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir =
  '/home/fezza/Desktop/allbirds/client/public/images/main-page/header-nav';
const outputDir = `${inputDir}/../output`;
const quality = 70;

const processDirectory = (inputPath, outputPath) => {
  fs.readdirSync(inputPath).forEach((file) => {
    const inputFile = path.join(inputPath, file);
    const outputFile = path.join(outputPath, file);

    if (fs.lstatSync(inputFile).isDirectory()) {
      fs.mkdirSync(outputFile, { recursive: true });
      processDirectory(inputFile, outputFile);
    } else if (file.match(/\.(jpe?g|png)$/i)) {
      sharp(inputFile)
        .webp({ quality })
        .toFile(outputFile.replace(/\.(jpe?g|png)$/i, '.webp'));
    }
  });
};

fs.mkdirSync(outputDir, { recursive: true });
processDirectory(inputDir, outputDir);
