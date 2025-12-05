"use client";

import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/letter-gallery";
import ImageViewer from "./components/image-viewer";
import Layout from "../components/layout";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

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

  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    imageSrc: string;
    nameTag: string;
    timeTag: string;
  }>({
    isOpen: false,
    imageSrc: "",
    nameTag: "",
    timeTag: ""
  });

  // Fetch config
  function getLetterGalleryConfig() {
    fetch("/letter-gallery/letter-gallery-config.json")
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
          result.letterPropsList.push({
            imageList: props.imageList || [props.imageSrc], // 兼容旧格式
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

  const openImageViewer = (imageSrc: string, nameTag: string, timeTag: string) => {
    setViewerState({
      isOpen: true,
      imageSrc,
      nameTag,
      timeTag
    });
  };

  const closeImageViewer = () => {
    setViewerState({
      isOpen: false,
      imageSrc: "",
      nameTag: "",
      timeTag: ""
    });
  };

  return (
    <Layout>
      <div className={styles.backgroundContainer}>
        <div 
          className={styles.backgroundImage}
          style={{ backgroundImage: `url('${config.backgroundImage}')` }}
        ></div>
        <div 
          className={styles.backgroundImage}
          style={{ backgroundImage: `url('/bg/letter-background.jpg')` }}
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
      />
    </Layout>
  );
}