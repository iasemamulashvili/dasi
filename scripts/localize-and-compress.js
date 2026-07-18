const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(publicDir, 'Images');

// Ensure public/Images folder exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download utility helper returning Promise
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download from ${url}. Status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// PNG Header dimensions parser (IHDR chunk)
function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, type: 'png', isTransparent: true };
    }
  } catch (e) {
    // Failed to read/parse
  }
  return null;
}

// JPEG Header dimensions parser (SOF marker)
function getJpegDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    let i = 0;
    if (buffer[i] === 0xff && buffer[i + 1] === 0xd8) {
      i += 2;
      while (i < buffer.length) {
        if (buffer[i] === 0xff) {
          const marker = buffer[i + 1];
          if (marker === 0xc0 || marker === 0xc2) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return { width, height, type: 'jpeg', isTransparent: false };
          } else {
            const len = buffer.readUInt16BE(i + 2);
            i += 2 + len;
          }
        } else {
          i++;
        }
      }
    }
  } catch (e) {
    // Failed to read/parse
  }
  return null;
}

// General image dimension reader
function getImageDetails(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const size = fs.statSync(filePath).size;
  const pngDetails = getPngDimensions(filePath);
  if (pngDetails) return { ...pngDetails, size };
  const jpegDetails = getJpegDimensions(filePath);
  if (jpegDetails) return { ...jpegDetails, size };
  
  // Fallback for file without extension (could be png/jpeg)
  return { width: 0, height: 0, type: 'unknown', size, isTransparent: false };
}

async function run() {
  console.log('\x1b[35m====================================================\x1b[0m');
  console.log('\x1b[35m       LOCALIZE & COMPRESS ASSETS PIPELINE          \x1b[0m');
  console.log('\x1b[35m====================================================\x1b[0m\n');

  try {
    // Step 1: Download live assets
    console.log('\x1b[36m[STEP 1]\x1b[0m Downloading live logo and banner_image.webp...');
    const bannerUrl = 'https://dasigames.com/Images/banner_image.webp';
    const logoUrl = 'https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png';
    
    const bannerDest = path.join(imagesDir, 'banner_image.webp');
    const originalLogoDest = path.join(imagesDir, 'dasigames_logo_original.png');

    await downloadFile(bannerUrl, bannerDest);
    console.log(`  -> Downloaded banner_image.webp (${fs.statSync(bannerDest).size} bytes)`);

    await downloadFile(logoUrl, originalLogoDest);
    console.log(`  -> Downloaded original transparent logo (${fs.statSync(originalLogoDest).size} bytes)\n`);

    // Step 2: Compare Logo Qualities
    console.log('\x1b[36m[STEP 2]\x1b[0m Auditing available logo files for transparency and resolution...');
    
    const localLogo1 = path.join(publicDir, 'dasi-logo');
    const localLogo2 = path.join(publicDir, 'dasi-logo-jpeg.jfif');

    const detailsOriginal = getImageDetails(originalLogoDest);
    const detailsLocal1 = getImageDetails(localLogo1);
    const detailsLocal2 = getImageDetails(localLogo2);

    console.log('  Logo files details:');
    if (detailsOriginal) {
      console.log(`    - Original (Downloaded): PNG, ${detailsOriginal.width}x${detailsOriginal.height}, size: ${detailsOriginal.size} bytes, Transparent: true`);
    }
    if (detailsLocal1) {
      console.log(`    - Local "dasi-logo": ${detailsLocal1.type.toUpperCase()}, ${detailsLocal1.width}x${detailsLocal1.height}, size: ${detailsLocal1.size} bytes, Transparent: ${detailsLocal1.isTransparent}`);
    }
    if (detailsLocal2) {
      console.log(`    - Local "dasi-logo-jpeg": ${detailsLocal2.type.toUpperCase()}, ${detailsLocal2.width}x${detailsLocal2.height}, size: ${detailsLocal2.size} bytes, Transparent: ${detailsLocal2.isTransparent}`);
    }

    // Selection criteria:
    // 1. Transparency is required because the logo sits on top of a dark header background.
    // 2. High resolution (highest pixels count).
    // Let's decide which is best:
    let bestLogoPath = originalLogoDest; // Default fallback is original
    let bestReason = 'Downloaded transparent PNG';

    if (detailsLocal1 && detailsLocal1.isTransparent && (detailsLocal1.width * detailsLocal1.height > (detailsOriginal ? detailsOriginal.width * detailsOriginal.height : 0))) {
      bestLogoPath = localLogo1;
      bestReason = 'Local "dasi-logo" (larger transparent resolution)';
    }

    console.log(`\n  -> Selected best logo: ${bestReason}`);
    
    // Copy best logo to public/Images/dasigames_logo.png
    const finalLogoDest = path.join(imagesDir, 'dasigames_logo.png');
    fs.copyFileSync(bestLogoPath, finalLogoDest);
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Saved high-quality logo to public/Images/dasigames_logo.png\n`);

    // Clean up temporary/other files as requested
    console.log('\x1b[36m[CLEANUP]\x1b[0m Deleting unused/lower-quality logo files...');
    if (fs.existsSync(originalLogoDest)) fs.unlinkSync(originalLogoDest);
    if (fs.existsSync(localLogo1)) fs.unlinkSync(localLogo1);
    if (fs.existsSync(localLogo2)) fs.unlinkSync(localLogo2);
    console.log('  -> Cleanup of old logos finished.\n');

    // Step 3: WebP Image Compression
    console.log('\x1b[36m[STEP 3]\x1b[0m Downloading Google libwebp tools to compress massive PNGs...');
    const zipUrl = 'https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.3.2-windows-x64.zip';
    const tempDir = path.join(rootDir, 'reports', 'temp-webp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const zipDest = path.join(tempDir, 'webp.zip');
    await downloadFile(zipUrl, zipDest);
    console.log('  -> Downloaded libwebp package.');

    console.log('  -> Extracting libwebp binaries...');
    // Use native PowerShell Expand-Archive to extract cleanly
    execSync(`powershell -Command "Expand-Archive -Path '${zipDest}' -DestinationPath '${tempDir}' -Force"`, { stdio: 'ignore' });
    
    // Locate cwebp.exe binary path
    const cwebpBinary = path.join(tempDir, 'libwebp-1.3.2-windows-x64', 'bin', 'cwebp.exe');
    if (!fs.existsSync(cwebpBinary)) {
      throw new Error(`cwebp.exe binary not found at expected path: ${cwebpBinary}`);
    }
    console.log(`  -> Found cwebp.exe binary: ${cwebpBinary}`);

    // Compress the three massive PNGs
    const imagesToCompress = [
      'crown-quest.png',
      'hotel-manager.png',
      'lumber-chopper.png'
    ];

    console.log('\n  -> Compressing assets to WebP (Quality: 85)...');
    imagesToCompress.forEach(imgName => {
      const srcPath = path.join(publicDir, imgName);
      if (fs.existsSync(srcPath)) {
        const outName = imgName.replace('.png', '.webp');
        const destPath = path.join(publicDir, outName);
        
        console.log(`    Converting ${imgName} (${(fs.statSync(srcPath).size / (1024 * 1024)).toFixed(2)} MB)...`);
        execSync(`"${cwebpBinary}" -q 85 "${srcPath}" -o "${destPath}"`, { stdio: 'ignore' });
        console.log(`    -> Created ${outName} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB) 🟢`);
        
        // Remove original raw PNG file to shrink git size
        fs.unlinkSync(srcPath);
      }
    });

    // Clean up libwebp temp folder
    console.log('\n  -> Cleaning up temporary webp download folders...');
    execSync(`powershell -Command "Remove-Item -Path '${tempDir}' -Recurse -Force"`, { stdio: 'ignore' });
    console.log('  -> Temporary files cleaned successfully.');

    // Step 4: Update games.json pointers
    console.log('\n\x1b[36m[STEP 4]\x1b[0m Updating src/data/games.json image path pointers to WebP...');
    const gamesJsonPath = path.join(rootDir, 'src', 'data', 'games.json');
    if (fs.existsSync(gamesJsonPath)) {
      let content = fs.readFileSync(gamesJsonPath, 'utf8');
      content = content.replace(/\.png/g, '.webp');
      fs.writeFileSync(gamesJsonPath, content, 'utf8');
      console.log('\x1b[32m[SUCCESS]\x1b[0m games.json data references updated to WebP paths.');
    }

  } catch (error) {
    console.error('\n\x1b[31m[ERROR]\x1b[0m Script execution failed:', error.message);
    process.exit(1);
  }
}

run();
