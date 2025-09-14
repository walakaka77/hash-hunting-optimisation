# Hash Map Generation Guide

## Introduction

This repository is designed to streamline the process of mapping and documenting hiking locations using [uMap](https://umap.openstreetmap.fr/), a browser-based mapping application. With uMap, you can upload GPS locations, add detailed descriptions, and visually organize your hikes. This project automates repetitive tasks, making it easier to update and maintain your hiking maps.

---

## Features & Scripts


### calculate-long-lat.js

This script automates the extraction and conversion of GPS coordinates from image files (using EXIF data), so you don’t have to do it manually for each image.


#### What each part does (with code snippets):

- **EXIF Extraction:**
  Uses the `exiftool-vendored` library to read GPS metadata from image files in a directory.
  ```js
  const { exiftool } = require('exiftool-vendored');
  const tags = await exiftool.read(fullPath);
  const latRaw = tags.GPSLatitude;
  const lonRaw = tags.GPSLongitude;
  ```

- **DMS to Decimal Conversion:**
  If the GPS data is in Degrees/Minutes/Seconds (DMS) format, it converts it to decimal degrees, which is the format required by most mapping tools.
  ```js
  function dmsToDecimal(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') dd *= -1;
    return +dd.toFixed(5);
  }
  ```

- **File Processing:**
  Loops through all files in the specified directory, processes only image files, and extracts their GPS coordinates.
  ```js
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (!fs.lstatSync(fullPath).isFile()) continue;
    // ...process file...
  }
  ```

- **Output:**
  For each image, writes the filename, latitude, and longitude (in decimal format) to `output.txt`.
  ```js
  output.push(`${file}\n${latDec}\n${lonDec}\n`);
  fs.writeFileSync('output.txt', output.join('\n'), 'utf8');
  ```
  This makes it easy to copy and paste the coordinates into uMap.

#### Example Workflow:

1. Place your images in the target directory.
2. Run the script (`node calculate-long-lat.js`).
3. Open `output.txt` to find a list of filenames and their corresponding coordinates, ready to use in uMap.


### retrieve-imgur.js

This script helps you quickly extract image links and their descriptions from an Imgur album page, making it easy to copy them into uMap. This is especially useful if your images are taken on a Mac/iPhone and uploaded to Imgur for sharing.

#### What each part does (with code snippets):

- **Select All Posts:**  
  The script selects all image posts on the Imgur album page.
  ```js
  document.querySelectorAll('.PostContent').forEach(post => {
    // ...process each post...
  });
  ```

- **Extract Image and Description:**  
  For each post, it finds the image and its description (if available).
  ```js
  const img = post.querySelector('img');
  const desc = post.querySelector('.ImageDescription-editable');
  ```

- **Store Results:**  
  If an image is found, it stores the image URL and description in an array.
  ```js
  if (img) {
    results.push({
      src: img.src,
      description: desc ? desc.textContent.trim() : '(No description)'
    });
  }
  ```

- **Output for Easy Copying:**  
  Finally, it prints out all descriptions and image URLs in a format that’s easy to copy and paste into uMap.
  ```js
  results.forEach(item => {
    console.log(`${item.description}\n${item.src}\n`);
  });
  ```

#### Example Workflow:

1. Upload your images (from Mac/iPhone) to Imgur.
2. Open the Imgur album page in your browser.
3. Paste this script into the browser console and run it.
4. Copy the output and paste the image links and descriptions into uMap.

---

## Workflow Example
1. Use `calculate-long-lat.js` to generate GPS coordinates for your images.
2. Use `retrieve-imgur.js` to extract image links from Imgur.
3. Upload the coordinates and image links to uMap for a complete, interactive hiking map.

---

## About uMap
- **uMap** is a free, browser-based mapping tool that allows you to create custom maps with GPS locations, images, and detailed descriptions. It is ideal for documenting hikes and sharing them with others.

---

Feel free to update this guide as your workflow evolves!
