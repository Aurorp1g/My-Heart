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
    // 检查是否在客户端环境中
    this.isClient = typeof window !== 'undefined';
    
    // 只在客户端环境中预加载图片
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

  /**
   * 获取背景图片URL，优先使用Base64，其次使用网络图片
   */
  public async getBackgroundImage(page: 'home' | 'gallery' | 'letter'): Promise<string> {
    const config = backgroundImages[page] as BackgroundConfig;
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

    // 优先使用Base64编码
    if (config.base64 && config.base64.trim() !== '') {
      return `url('${config.base64}')`;
    }

    // 其次使用网络图片
    const fallbackUrl = `${assetPrefix}${config.fallback}`;
    
    // 只在客户端环境中检查图片加载状态
    if (this.isClient && !this.imagesLoaded.has(fallbackUrl)) {
      await this.preloadImage(fallbackUrl);
    }

    return `url('${fallbackUrl}')`;
  }

  /**
   * 预加载网络图片（仅在客户端环境中可用）
   */
  private async preloadImage(url: string): Promise<void> {
    // 确保只在客户端环境中执行
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

  /**
   * 预加载所有备用图片（仅在客户端环境中执行）
   */
  private preloadFallbackImages(): void {
    if (!this.isClient) {
      return;
    }

    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
    
    Object.values(backgroundImages).forEach((config: BackgroundConfig) => {
      if (config.fallback) {
        const url = `${assetPrefix}${config.fallback}`;
        this.preloadImage(url);
      }
    });
  }

  /**
   * 更新Base64编码（用于动态更新）
   */
  public updateBase64(page: 'home' | 'gallery' | 'letter', base64: string): void {
    const config = backgroundImages[page] as BackgroundConfig;
    if (config) {
      config.base64 = base64;
      this.base64Cache.set(page, base64);
    }
  }

  /**
   * 获取图片加载状态（仅在客户端环境中有效）
   */
  public isImageLoaded(url: string): boolean {
    if (!this.isClient) {
      return false;
    }
    return this.imagesLoaded.get(url) || false;
  }

  /**
   * 检查是否在客户端环境中
   */
  public isClientEnvironment(): boolean {
    return this.isClient;
  }
}

// 导出单例实例
export const imageLoader = ImageLoader.getInstance();