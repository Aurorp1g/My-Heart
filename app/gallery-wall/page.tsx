"use client";

import { useState, useEffect, useCallback } from "react";
import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";
import ImageViewer from "./components/image-viewer";
import Layout from "../components/layout";
import ClientAuthGuard from "../auth/client-auth-guard";
import styles from "./styles.module.css";
import { imageLoader } from "../utils/image-loader";
import { getRelativePath } from "../utils/path-helper";

interface GalleryWallConfig {
  backgroundImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

export default function GalleryWallPage() {
  const [config, setConfig] = useState<GalleryWallConfig>({
    backgroundImage: "",
    randomOrder: false,
    picturePropsList: [],
  });
  const [backgroundStyle, setBackgroundStyle] = useState({});

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

  const getGalleryWallConfig = useCallback(() => {
    fetch(getRelativePath('/gallery-wall/gallery-wall-config.json'))
      .then((response) => response.json())
      .then((data) => {
        let result: GalleryWallConfig = {
          backgroundImage: "",
          randomOrder: false,
          picturePropsList: [],
        };

        if (data.backgroundImage != "" && data.backgroundImage) {
          result.backgroundImage = data.backgroundImage;
        }

        if (data.randomOrder) {
          result.randomOrder = data.randomOrder;
        }

        (data.pictureList as FramedPictureProps[]).forEach((props) => {
          result.picturePropsList.push({
            imageSrc: getRelativePath(props.imageSrc),
            nameTag: props.nameTag,
            timeTag: props.timeTag,
            herf: props.herf,
            pinPriority: props.pinPriority,
          });
        });

        result.picturePropsList.sort((a, b) => {
          if (a.pinPriority && b.pinPriority) {
            if (a.pinPriority !== b.pinPriority) {
              return b.pinPriority - a.pinPriority;
            }
          } else if (a.pinPriority) {
            return -1;
          } else if (b.pinPriority) {
            return 1;
          }
          
          return b.timeTag.localeCompare(a.timeTag);
        });

        setConfig(result);
      });
  }, []);

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const backgroundImage = await imageLoader.getBackgroundImage('gallery');
        setBackgroundStyle({ backgroundImage });
      } catch (error) {
        console.error('背景图片加载失败:', error);
        const fallbackImage = `url('${getRelativePath('/bg/gallery-background.jpg')}')`;
        setBackgroundStyle({ backgroundImage: fallbackImage });
      }
    };

    loadBackground();
    getGalleryWallConfig();
  }, [getGalleryWallConfig]);

  // Shuffle for random order
  const shuffle = (array: FramedPictureProps[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  if (config.randomOrder) {
    config.picturePropsList = shuffle(config.picturePropsList);
  }

  // 获取所有图片的URL列表
  const getAllImageUrls = () => {
    return config.picturePropsList.map(picture => picture.imageSrc);
  };

  // 根据图片URL查找索引和图片信息
  const findImageInfo = (imageSrc: string) => {
    const index = config.picturePropsList.findIndex(picture => picture.imageSrc === imageSrc);
    if (index !== -1) {
      const picture = config.picturePropsList[index];
      return {
        index,
        nameTag: picture.nameTag,
        timeTag: picture.timeTag
      };
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
      const picture = config.picturePropsList[newIndex];
      
      setViewerState(prev => ({
        ...prev,
        imageSrc: picture.imageSrc,
        nameTag: picture.nameTag,
        timeTag: picture.timeTag,
        currentIndex: newIndex
      }));
    }
  };

  // 切换到下一张图片
  const goToNextImage = () => {
    if (viewerState.currentIndex < config.picturePropsList.length - 1) {
      const newIndex = viewerState.currentIndex + 1;
      const picture = config.picturePropsList[newIndex];
      
      setViewerState(prev => ({
        ...prev,
        imageSrc: picture.imageSrc,
        nameTag: picture.nameTag,
        timeTag: picture.timeTag,
        currentIndex: newIndex
      }));
    }
  };

  return (
    <ClientAuthGuard>
      <Layout>
        <div className={styles.backgroundContainer}>
          <div 
            className={styles.backgroundImage}
            style={backgroundStyle}
          ></div>
        </div>
        <div className={styles.contentWrapper}>
          <GalleryWall 
            picturePropsList={config.picturePropsList}
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