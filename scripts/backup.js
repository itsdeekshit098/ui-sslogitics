/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Environment Variables required from GitHub Actions
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'documents';
const GDRIVE_SERVICE_ACCOUNT_JSON = process.env.GDRIVE_SERVICE_ACCOUNT_JSON;
const GDRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID;

const DB_DUMP_FILE = 'db-backup.sql';
const STORAGE_DUMP_DIR = 'storage-backup';
const ZIP_FILE_NAME = `backup-${new Date().toISOString().split('T')[0]}.zip`;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GDRIVE_SERVICE_ACCOUNT_JSON || !GDRIVE_FOLDER_ID) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function downloadFolder(bucketName, folderPath = '') {
  console.log(`Listing files in ${bucketName}/${folderPath || '<root>'}`);
  
  const { data: files, error } = await supabase.storage.from(bucketName).list(folderPath);

  if (error) {
    console.error('Error listing files:', error);
    return;
  }

  if (!files || files.length === 0) {
    return;
  }

  for (const file of files) {
    const fullPath = folderPath ? `${folderPath}/${file.name}` : file.name;

    // If there is no metadata, Supabase treats it as a folder representation
    if (!file.metadata) {
      if (file.name !== '.emptyFolderPlaceholder') {
        await downloadFolder(bucketName, fullPath);
      }
      continue;
    }

    console.log(`Downloading: ${fullPath}`);
    const { data: fileData, error: downloadError } = await supabase.storage.from(bucketName).download(fullPath);

    if (downloadError) {
      console.error(`Failed to download ${fullPath}:`, downloadError);
      continue;
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    
    // Create local directory if needed
    const localDir = path.join(STORAGE_DUMP_DIR, folderPath);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    const localPath = path.join(STORAGE_DUMP_DIR, fullPath);
    fs.writeFileSync(localPath, buffer);
  }
}

async function createZip() {
  console.log(`Creating zip archive: ${ZIP_FILE_NAME}`);
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ZIP_FILE_NAME);
    const archive = archiver('zip', {
      zlib: { level: 9 } // maximum compression
    });

    output.on('close', function() {
      console.log(`Zip archive complete. ${archive.pointer()} total bytes.`);
      resolve();
    });

    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        reject(err);
      }
    });

    archive.on('error', function(err) {
      reject(err);
    });

    archive.pipe(output);

    // Append the database dump if it exists
    if (fs.existsSync(DB_DUMP_FILE)) {
      archive.file(DB_DUMP_FILE, { name: DB_DUMP_FILE });
      console.log(`Added ${DB_DUMP_FILE} to zip.`);
    } else {
      console.warn(`WARNING: ${DB_DUMP_FILE} not found. Continuing without database dump.`);
    }

    // Append the storage folder
    if (fs.existsSync(STORAGE_DUMP_DIR)) {
      archive.directory(STORAGE_DUMP_DIR, 'storage');
      console.log(`Added storage directory to zip.`);
    }

    archive.finalize();
  });
}

async function uploadToGoogleDrive() {
  console.log('Authenticating with Google Drive...');
  
  let credentials;
  try {
    credentials = JSON.parse(GDRIVE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error("Invalid GDRIVE_SERVICE_ACCOUNT_JSON format. Ensure it is strict JSON:", err);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  console.log(`Uploading ${ZIP_FILE_NAME} to Google Drive...`);
  
  const fileMetadata = {
    name: ZIP_FILE_NAME,
    parents: [GDRIVE_FOLDER_ID]
  };

  const media = {
    mimeType: 'application/zip',
    body: fs.createReadStream(ZIP_FILE_NAME)
  };

  try {
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name'
    });
    console.log(`Upload successful! File ID: ${file.data.id}`);
  } catch (err) {
    console.error('Error uploading to Google Drive:', err.message);
    if (err.response && err.response.data) {
      console.error(err.response.data);
    }
    process.exit(1);
  }
}

async function main() {
  try {
    if (!fs.existsSync(STORAGE_DUMP_DIR)) {
      fs.mkdirSync(STORAGE_DUMP_DIR, { recursive: true });
    }

    console.log('========= [1/3] Downloading Supabase Storage =========');
    await downloadFolder(SUPABASE_BUCKET);

    console.log('\n========= [2/3] Zipping Files =========');
    await createZip();

    console.log('\n========= [3/3] Uploading to Google Drive =========');
    await uploadToGoogleDrive();

    console.log('\n✅ Backup process completed successfully!');
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

main();
