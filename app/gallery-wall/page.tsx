"use client";

import { FramedPictureProps } from "../gallery-wall/components/framed-picture";
import GalleryWall from "../gallery-wall/components/gallery-wall";
import ImageViewer from "../gallery-wall/components/image-viewer";
import Layout from "../components/layout";
import styles from "../gallery-wall/styles.module.css";
import { useState, useEffect } from "react";

interface GalleryWallConfig {
  backgroundImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

export default function Home() {
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
  }>({
    isOpen: false,
    imageSrc: "",
    nameTag: "",
    timeTag: ""
  });

  // Fetch config
  function getGalleryWallConfig() {
    fetch("/gallery-wall/gallery-wall-config.json")
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
            imageSrc: props.imageSrc,
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
          style={{ backgroundImage: `url('/bg/gallery-background.jpg')` }}
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
      />
    </Layout>
  );
}