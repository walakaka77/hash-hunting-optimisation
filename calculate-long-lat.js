const fs = require('fs');
const path = require('path');
const { exiftool } = require('exiftool-vendored');

// Utility to convert DMS to Decimal Degrees
function dmsToDecimal(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') dd *= -1;
  return +dd.toFixed(5);
}

// Extract DMS components from EXIF GPS string
function parseDMS(dmsStr) {
  const regex = /(\d+)[^\d]+(\d+)[^\d]+([\d.]+)[^\d]+([NSEW])/;
  const match = dmsStr.match(regex);
  if (!match) return null;
  return {
    degrees: parseInt(match[1]),
    minutes: parseInt(match[2]),
    seconds: parseFloat(match[3]),
    direction: match[4]
  };
}

// Process files in a directory
async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  const output = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (!fs.lstatSync(fullPath).isFile()) continue;

    try {
      const tags = await exiftool.read(fullPath);
      const latRaw = tags.GPSLatitude;
    const lonRaw = tags.GPSLongitude;
    const latRef = tags.GPSLatitudeRef || '';
    const lonRef = tags.GPSLongitudeRef || '';

    if (!latRaw || !lonRaw) continue;

    let latDec, lonDec;

    if (typeof latRaw === 'number' && typeof lonRaw === 'number') {
    // Already decimal — apply N/S/E/W direction manually if needed
    latDec = latRef === 'S' ? -latRaw : latRaw;
    lonDec = lonRef === 'W' ? -lonRaw : lonRaw;
    } else if (typeof latRaw === 'string' && typeof lonRaw === 'string') {
    const lat = parseDMS(latRaw);
    const lon = parseDMS(lonRaw);
    if (!lat || !lon) continue;
    latDec = dmsToDecimal(lat.degrees, lat.minutes, lat.seconds, lat.direction);
    lonDec = dmsToDecimal(lon.degrees, lon.minutes, lon.seconds, lon.direction);
    } else {
    continue; // unsupported format
    }

      output.push(`${file}\n${latDec}\n${lonDec}\n`);
    } catch (e) {
      console.warn(`Failed to process ${file}: ${e.message}`);
    }
  }
  // Write the processed GPS data to a file and close the exiftool instance
  fs.writeFileSync('output.txt', output.join('\n'), 'utf8');
  console.log('✅ Output written to output.txt');
  await exiftool.end();
}

// Replace this with your directory
const directoryPath = '.';
processDirectory(directoryPath);
