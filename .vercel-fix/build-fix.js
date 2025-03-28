// This script runs before the build to ensure conflicting files are removed
const fs = require('fs');
const path = require('path');

// Path to the conflicting App Router auth file
const conflictingFilePath = path.join(__dirname, '../app/api/auth/[...nextauth]');

// Check if the directory exists
if (fs.existsSync(conflictingFilePath)) {
  console.log('Removing conflicting App Router auth file...');
  
  try {
    // Remove the directory recursively
    fs.rmSync(conflictingFilePath, { recursive: true, force: true });
    console.log('Successfully removed conflicting file.');
  } catch (error) {
    console.error('Error removing conflicting file:', error);
  }
} else {
  console.log('No conflicting file found, continuing with build...');
}
