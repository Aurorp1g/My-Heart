"use client";

import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/letter-gallery";
import ImageViewer from "./components/image-viewer";
import Layout from "../components/layout";
import styles from "./styles.module.css";
import ClientAuthGuard from "../auth/client-auth-guard";
import { useState, useEffect } from "react";
import { imageLoader } from "../utils/image-loader";
import { getRelativePath } from "../utils/path-helper";

interface LetterGalleryConfig {
  backgroundImage: string;
  randomOrder: boolean;
  letterPropsList: FramedPictureProps[];
}

export default function LetterGalleryPage() {
  const [config, setConfig] = useState<LetterGalleryConfig>({
    backgroundImage: "",
    randomOrder: false,
    letterPropsList: [],
  });

  const [backgroundStyle, setBackgroundStyle] = useState<string>("");
  const [fallbackBackgroundStyle, setFallbackBackgroundStyle] = useState<string>("");

  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    imageSrc: string;
    nameTag: string;
    timeTag: string;
    imageList: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    imageSrc: "",
    nameTag: "",
    timeTag: "",
    imageList: [],
    currentIndex: 0
  });

  // 加载背景图片
  useEffect(() => {
    const loadBackgroundImages = async () => {
      try {
        // 加载主要背景图片（从配置文件中获取）
        if (config.backgroundImage && config.backgroundImage !== "") {
          const mainBgStyle = await imageLoader.getBackgroundImage('letter');
          setBackgroundStyle(mainBgStyle);
        } else {
          // 如果没有配置主要背景图片，使用默认背景图片
          const defaultBgStyle = await imageLoader.getBackgroundImage('letter');
          setBackgroundStyle(defaultBgStyle);
        }

        // 加载备用背景图片
        const fallbackBgStyle = await imageLoader.getBackgroundImage('letter');
        setFallbackBackgroundStyle(fallbackBgStyle);
      } catch (error) {
        console.error('背景图片加载失败:', error);
        const defaultBgStyle = `url('${getRelativePath('/bg/letter-background.jpg')}')`;
        setBackgroundStyle(defaultBgStyle);
        setFallbackBackgroundStyle(defaultBgStyle);
      }
    };

    loadBackgroundImages();
  }, [config.backgroundImage]);

  // Fetch config
  function getLetterGalleryConfig() {
    fetch(getRelativePath('/letter-gallery/letter-gallery-config.json'))
      .then((response) => response.json())
      .then((data) => {
        let result: LetterGalleryConfig = {
          backgroundImage: "",
          randomOrder: false,
          letterPropsList: [],
        };

        // Background image
        if (data.backgroundImage != "" && data.backgroundImage) {
          result.backgroundImage = data.backgroundImage;
        }

        // Random order
        if (data.randomOrder) {
          result.randomOrder = data.randomOrder;
        }

        // Letter props list - 适配新的多图片数据结构
        (data.letterList as any[]).forEach((props) => {
          const imageList = props.imageList 
            ? props.imageList.map((img: string) => getRelativePath(img))
            : props.imageSrc 
              ? [getRelativePath(props.imageSrc)] 
              : [];

          result.letterPropsList.push({
            imageList: imageList,
            nameTag: props.nameTag,
            timeTag: props.timeTag,
            herf: props.herf,
          });
        });

        setConfig(result);
      });
  }
  useEffect(() => {
    getLetterGalleryConfig();
  }, []);

  // Shuffle for random order
  const shuffle = (array: FramedPictureProps[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const letterPropsList = config.randomOrder ? shuffle([...config.letterPropsList]) : config.letterPropsList;

  // 获取所有图片的URL列表（展平所有相框的图片）
  const getAllImageUrls = () => {
    const allImages: string[] = [];
    letterPropsList.forEach(letter => {
      if (letter.imageList && letter.imageList.length > 0) {
        allImages.push(...letter.imageList);
      }
    });
    return allImages;
  };

  // 根据图片URL查找索引和图片信息
  const findImageInfo = (imageSrc: string) => {
    const allImages = getAllImageUrls();
    const index = allImages.findIndex(img => img === imageSrc);
    
    if (index !== -1) {
      // 查找对应的相框信息
      const letter = letterPropsList.find(letter => 
        letter.imageList && letter.imageList.includes(imageSrc)
      );
      
      if (letter) {
        return {
          index,
          nameTag: letter.nameTag,
          timeTag: letter.timeTag
        };
      }
    }
    return null;
  };

  const openImageViewer = (imageSrc: string, nameTag: string, timeTag: string) => {
    const imageList = getAllImageUrls();
    const imageInfo = findImageInfo(imageSrc);
    
    setViewerState({
      isOpen: true,
      imageSrc,
      nameTag,
      timeTag,
      imageList,
      currentIndex: imageInfo?.index || 0
    });
  };

  const closeImageViewer = () => {
    setViewerState({
      isOpen: false,
      imageSrc: "",
      nameTag: "",
      timeTag: "",
      imageList: [],
      currentIndex: 0
    });
  };

  // 切换到上一张图片
  const goToPrevImage = () => {
    if (viewerState.currentIndex > 0) {
      const newIndex = viewerState.currentIndex - 1;
      const imageSrc = viewerState.imageList[newIndex];
      const imageInfo = findImageInfo(imageSrc);
      
      if (imageInfo) {
        setViewerState(prev => ({
          ...prev,
          imageSrc,
          nameTag: imageInfo.nameTag,
          timeTag: imageInfo.timeTag,
          currentIndex: newIndex
        }));
      }
    }
  };

  // 切换到下一张图片
  const goToNextImage = () => {
    if (viewerState.currentIndex < viewerState.imageList.length - 1) {
      const newIndex = viewerState.currentIndex + 1;
      const imageSrc = viewerState.imageList[newIndex];
      const imageInfo = findImageInfo(imageSrc);
      
      if (imageInfo) {
        setViewerState(prev => ({
          ...prev,
          imageSrc,
          nameTag: imageInfo.nameTag,
          timeTag: imageInfo.timeTag,
          currentIndex: newIndex
        }));
      }
    }
  };

  return (
    <ClientAuthGuard>
      <Layout>
        <div className={styles.backgroundContainer}>
          <div 
            className={styles.backgroundImage}
            style={{ backgroundImage: backgroundStyle }}
          ></div>
          <div 
            className={styles.backgroundImage}
            style={{ backgroundImage: fallbackBackgroundStyle }}
          ></div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.pageHeader}>
            <h1>信廊</h1>
            <p>这里收藏着我的信件</p>
          </div>
          <GalleryWall 
            picturePropsList={letterPropsList}
            onImageClick={openImageViewer}
          />
        </div>
        
        {/* 图片查看器 */}
        <ImageViewer
          isOpen={viewerState.isOpen}
          imageSrc={viewerState.imageSrc}
          nameTag={viewerState.nameTag}
          timeTag={viewerState.timeTag}
          onClose={closeImageViewer}
          imageList={viewerState.imageList}
          currentIndex={viewerState.currentIndex}
          onPrev={goToPrevImage}
          onNext={goToNextImage}
        />
      </Layout>
    </ClientAuthGuard>
  );
}