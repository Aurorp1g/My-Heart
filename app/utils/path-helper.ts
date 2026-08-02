export function getRelativePath(targetPath: string): string {
  if (typeof window === 'undefined') {
    return `./${targetPath.replace(/^\//, '').replace(/^\.\//, '')}`;
  }
  
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const depth = Math.max(0, pathParts.length);
  const cleanPath = targetPath.replace(/^\//, '').replace(/^\.\//, '');
  const relativePath = '../'.repeat(depth) + cleanPath;
  
  return relativePath;
}

export function getConfigPath(configType: 'gallery-wall' | 'letter-gallery'): string {
  if (typeof window === 'undefined') {
    return `./${configType}/${configType}-config.json`;
  }
  
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const depth = Math.max(0, pathParts.length);
  const relativePath = '../'.repeat(depth) + `${configType}/${configType}-config.json`;
  
  return relativePath;
}

export function fixImagePaths(imageSrc: string): string {
  return getRelativePath(imageSrc);
}

export function fixImageListPaths(imageList: string[]): string[] {
  return imageList.map(img => getRelativePath(img));
}