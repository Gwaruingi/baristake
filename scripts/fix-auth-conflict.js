/**
 * This script resolves conflicts between App Router and Pages Router
 * by ensuring NextAuth is properly configured for Pages Router
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting auth conflict resolution script...');

// Paths to check and remove
const conflictingPaths = [
  path.join(__dirname, '..', 'app', 'api', 'auth', '[...nextauth]'),
  path.join(__dirname, '..', 'app', 'page.tsx'),
];

// Function to safely remove a directory or file
function safeRemove(pathToRemove) {
  try {
    if (fs.existsSync(pathToRemove)) {
      console.log(`Removing: ${pathToRemove}`);
      
      const stats = fs.statSync(pathToRemove);
      if (stats.isDirectory()) {
        // Remove directory recursively
        fs.rmSync(pathToRemove, { recursive: true, force: true });
      } else {
        // Remove file
        fs.unlinkSync(pathToRemove);
      }
      return true;
    } else {
      console.log(`Path does not exist: ${pathToRemove}`);
      return false;
    }
  } catch (error) {
    console.error(`Error removing ${pathToRemove}:`, error);
    return false;
  }
}

// Create a placeholder file to indicate this directory should not be used
function createPlaceholder() {
  const placeholderDir = path.join(__dirname, '..', 'app', 'api', 'auth', 'nextauth-removed');
  if (!fs.existsSync(placeholderDir)) {
    fs.mkdirSync(placeholderDir, { recursive: true });
    fs.writeFileSync(
      path.join(placeholderDir, 'README.md'), 
      'This directory exists to indicate that the [...nextauth] directory has been removed.\nAuthentication is now handled by the Pages Router in pages/api/auth/[...nextauth].js'
    );
    console.log('Created placeholder directory to prevent future conflicts.');
  }
}

// Clean build caches
function cleanBuildCaches() {
  try {
    console.log('Cleaning build caches...');
    
    // Remove .next directory
    safeRemove(path.join(__dirname, '..', '.next'));
    
    // Remove Vercel output directory if it exists
    safeRemove(path.join(__dirname, '..', '.vercel', 'output'));
    
    console.log('Build caches cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning build caches:', error);
  }
}

// Main function
function resolveAuthConflict() {
  console.log('Starting auth conflict resolution...');
  
  // Remove conflicting paths
  conflictingPaths.forEach(safeRemove);
  
  // Create placeholder
  createPlaceholder();
  
  // Clean build caches
  cleanBuildCaches();
  
  console.log('Auth conflict resolution completed successfully.');
}

// Run the resolution
resolveAuthConflict();
