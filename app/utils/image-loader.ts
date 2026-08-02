import backgroundImages from '../config/background-images.json';

interface BackgroundConfig {
  base64: string;
  fallback: string;
  description: string;
}

export class ImageLoader {
  private static instance: ImageLoader;
  private imagesLoaded = new Map<string, boolean>();
  private base64Cache = new Map<string, string>();
  private isClient = false;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
    
    if (this.isClient) {
      this.preloadFallbackImages();
    }
  }

  public static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  private getRelativePath(targetPath: string): string {
    if (!this.isClient) {
      return `./${targetPath.replace(/^\//, '').replace(/^\.\//, '')}`;
    }
    
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(Boolean);
    const depth = Math.max(0, pathParts.length);
    const cleanPath = targetPath.replace(/^\//, '').replace(/^\.\//, '');
    const relativePath = '../'.repeat(depth) + cleanPath;
    
    return relativePath;
  }

  public async getBackgroundImage(page: 'home' | 'gallery' | 'letter'): Promise<string> {
    const config = backgroundImages[page] as BackgroundConfig;

    if (config.base64 && config.base64.trim() !== '') {
      return `url('${config.base64}')`;
    }

    const relativePath = this.getRelativePath(config.fallback);
    
    if (this.isClient && !this.imagesLoaded.has(relativePath)) {
      await this.preloadImage(relativePath);
    }

    return `url('${relativePath}')`;
  }

  private async preloadImage(url: string): Promise<void> {
    if (!this.isClient) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.imagesLoaded.set(url, true);
        resolve();
      };
      img.onerror = () => {
        console.warn(`图片加载失败: ${url}`);
        this.imagesLoaded.set(url, false);
        resolve();
      };
      img.src = url;
    });
  }

  private preloadFallbackImages(): void {
    if (!this.isClient) {
      return;
    }
    
    Object.values(backgroundImages).forEach((config: BackgroundConfig) => {
      if (config.fallback) {
        const url = this.getRelativePath(config.fallback);
        this.preloadImage(url);
      }
    });
  }

  public updateBase64(page: 'home' | 'gallery' | 'letter', base64: string): void {
    const config = backgroundImages[page] as BackgroundConfig;
    if (config) {
      config.base64 = base64;
      this.base64Cache.set(page, base64);
    }
  }

  public isImageLoaded(url: string): boolean {
    if (!this.isClient) {
      return false;
    }
    return this.imagesLoaded.get(url) || false;
  }

  public isClientEnvironment(): boolean {
    return this.isClient;
  }
}

export const imageLoader = ImageLoader.getInstance();