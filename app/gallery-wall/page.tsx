"use client";

import { FramedPictureProps } from "../gallery-wall/components/framed-picture";
import GalleryWall from "../gallery-wall/components/gallery-wall";
import ImageViewer from "../gallery-wall/components/image-viewer";
import Layout from "../components/layout";
import ClientAuthGuard from "../components/client-auth-guard";
import styles from "../gallery-wall/styles.module.css";
import { useState, useEffect } from "react";

interface GalleryWallConfig {
  backgroundImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

export default function Home() {
  const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || ''
  const [config, setConfig] = useState<GalleryWallConfig>({
    backgroundImage: "",
    randomOrder: false,
    picturePropsList: [],
  });

  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    imageSrc: string;
    nameTag: string;
    timeTag: string;
    imageList: string[]; // 新增：图片列表
    currentIndex: number; // 新增：当前索引
  }>({
    isOpen: false,
    imageSrc: "",
    nameTag: "",
    timeTag: "",
    imageList: [],
    currentIndex: 0
  });

  // Fetch config
  function getGalleryWallConfig() {
    fetch(`${assetPrefix}/gallery-wall/gallery-wall-config.json`)
      .then((response) => response.json())
      .then((data) => {
        let result: GalleryWallConfig = {
          backgroundImage: "",
          randomOrder: false,
          picturePropsList: [],
        };

        // Background image
        if (data.backgroundImage != "" && data.backgroundImage) {
          result.backgroundImage = data.backgroundImage;
        }

        // Random order
        if (data.randomOrder) {
          result.randomOrder = data.randomOrder;
        }

        // Picture props list
        (data.pictureList as FramedPictureProps[]).forEach((props) => {
          result.picturePropsList.push({
            imageSrc: `${assetPrefix}${props.imageSrc}`,
            nameTag: props.nameTag,
            timeTag: props.timeTag,
            herf: props.herf,
          });

          setConfig(result);
        });
      });
  }
  useEffect(() => {
    getGalleryWallConfig();
  }, []);

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
            style={{ backgroundImage: `url('${config.backgroundImage}')` }}
          ></div>
          <div 
            className={styles.backgroundImage}
            style={{ backgroundImage: `url('${assetPrefix}/bg/gallery-background.jpg')` }}
          ></div>
        </div>
        <div className={styles.contentWrapper}>
          <GalleryWall 
            picturePropsList={config.picturePropsList}
            onImageClick={openImageViewer}
          />
        </div>
        
        {/* 图片查看器 - 提升到页面级别，确保z-index生效 */}
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