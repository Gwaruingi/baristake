const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Path to the conflicting directory
const conflictingDir = path.join(__dirname, '..', 'app', 'api', 'auth', '[...nextauth]');

console.log(`Checking for conflicting directory: ${conflictingDir}`);

// Check if the directory exists
if (fs.existsSync(conflictingDir)) {
  console.log('Found conflicting directory, removing...');
  
  // Use rimraf to remove the directory
  rimraf.sync(conflictingDir);
  
  console.log('Conflicting directory removed successfully.');
} else {
  console.log('No conflicting directory found.');
}

// Create a placeholder file to indicate this directory should not be used
const placeholderDir = path.join(__dirname, '..', 'app', 'api', 'auth', 'nextauth-removed');
if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
  fs.writeFileSync(
    path.join(placeholderDir, 'README.md'), 
    'This directory exists to indicate that the [...nextauth] directory has been removed.\nAuthentication is now handled by the Pages Router in pages/api/auth/[...nextauth].js'
  );
  console.log('Created placeholder directory to prevent future conflicts.');
}
