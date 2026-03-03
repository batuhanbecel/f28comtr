import fs from 'fs';
import path from 'path';

export function getPortfolioImages(photographerId: string): string[] {
  const portfolioPath = path.join(process.cwd(), 'public', 'portfolios', photographerId);
  
  try {
    const files = fs.readdirSync(portfolioPath);
    return files
      .filter(file => {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return false;
        
        // Filter out 0-byte corrupted files
        const filePath = path.join(portfolioPath, file);
        const stats = fs.statSync(filePath);
        return stats.size > 1024; // Only include files larger than 1KB
      })
      .map(file => `/portfolios/${photographerId}/${file}`)
      .sort();
  } catch (error) {
    console.error(`Error reading portfolio for ${photographerId}:`, error);
    return [];
  }
}

export function getBrandLogos(): string[] {
  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands');
  
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading brand logos:', error);
    return [];
  }
}

export function getPartnerLogos(): string[] {
  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands', 'partners');
  
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/partners/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading partner logos:', error);
    return [];
  }
}

export function getClientLogos(): string[] {
  const logosPath = path.join(process.cwd(), 'public', 'logos', 'brands', 'clients');
  
  try {
    const files = fs.readdirSync(logosPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map(file => `/logos/brands/clients/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading client logos:', error);
    return [];
  }
}

export function getAIImages(): string[] {
  const aiImagesPath = path.join(process.cwd(), 'public', 'ai-images');
  
  try {
    const files = fs.readdirSync(aiImagesPath);
    return files
      .filter(file => {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return false;
        
        // Filter out 0-byte corrupted files
        const filePath = path.join(aiImagesPath, file);
        const stats = fs.statSync(filePath);
        return stats.size > 1024; // Only include files larger than 1KB
      })
      .map(file => `/ai-images/${file}`)
      .sort();
  } catch (error) {
    console.error('Error reading AI images:', error);
    return [];
  }
}
