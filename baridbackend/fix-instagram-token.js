/**
 * This script updates all Instagram tokens in the database
 * by cleaning them of any newlines, carriage returns, 
 * or extra whitespace that may cause authentication issues.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixInstagramTokens() {
  try {
    console.log('Fetching Instagram integrations...');
    
    // Get all Instagram integrations
    const integrations = await prisma.integration.findMany({
      where: {
        name: 'INSTAGRAM',
      },
    });
    
    console.log(`Found ${integrations.length} Instagram integrations`);
    
    if (integrations.length === 0) {
      console.log('No Instagram integrations found.');
      return;
    }

    // Check and fix each token
    let fixedCount = 0;
    for (const integration of integrations) {
      const originalToken = integration.token || '';
      if (!originalToken) {
        console.log(`Integration ${integration.id} has no token, skipping.`);
        continue;
      }

      // Clean the token: remove all whitespace, newlines, and carriage returns
      const cleanToken = originalToken.replace(/\s+/g, '');
      
      // Check if token needed cleaning
      if (cleanToken !== originalToken) {
        console.log(`Fixing token for integration ${integration.id} (userId: ${integration.userId})`);
        console.log(`Original token length: ${originalToken.length}, Clean token length: ${cleanToken.length}`);
        
        // Update the token in the database
        await prisma.integration.update({
          where: { id: integration.id },
          data: { token: cleanToken },
        });
        
        fixedCount++;
      }
    }
    
    console.log(`Fixed ${fixedCount} tokens out of ${integrations.length} integrations`);
  } catch (error) {
    console.error('Error fixing Instagram tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
fixInstagramTokens()
  .then(() => console.log('Done!'))
  .catch(error => console.error('Script error:', error));
