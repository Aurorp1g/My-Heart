"use client";

import { FramedPictureProps } from "./gallery-wall/components/framed-picture";
import GalleryWall from "./gallery-wall/components/gallery-wall";
import Layout from "./components/layout";
import styles from "./gallery-wall/styles.module.css";
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

  return (
    <Layout>
      <div
        className={
          styles.background + " bg-[url('" + config.backgroundImage + "')]"
        }
      >
        <div className={styles.backgroundNoiseFilter}>
          <GalleryWall picturePropsList={config.picturePropsList}></GalleryWall>
        </div>
      </div>
    </Layout>
  );
}