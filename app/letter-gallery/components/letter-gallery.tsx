"use client";

import { useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";
import styles from "./styles.module.css";

interface GalleryWallProps {
  picturePropsList: FramedPictureProps[];
  onImageClick: (imageSrc: string, nameTag: string, timeTag: string) => void;
}

export default function GalleryWall(props: GalleryWallProps) {
  return (
    <>
      <div className={styles.letterGalleryContainer}>
        {props.picturePropsList.map((pictureProps, index) => (
          <FramedPicture
            key={pictureProps.nameTag + index.toString()}
            imageList={pictureProps.imageList}
            nameTag={pictureProps.nameTag}
            timeTag={pictureProps.timeTag}
            rotate={0} // 强制不倾斜
            herf={pictureProps.herf}
            onClick={props.onImageClick} // 直接传递点击处理函数
          ></FramedPicture>
        ))}
      </div>
    </>
  );
}