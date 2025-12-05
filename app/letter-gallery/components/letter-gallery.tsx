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
            onClick={() => {
              // 如果有外部链接，在新窗口打开
              if (pictureProps.herf && pictureProps.herf !== "") {
                window.open(pictureProps.herf, "_blank");
              } else {
                // 否则调用父组件的图片查看器打开函数（默认显示第一张图片）
                if (pictureProps.imageList.length > 0) {
                  props.onImageClick(pictureProps.imageList[0], pictureProps.nameTag, pictureProps.timeTag);
                }
              }
            }}
          ></FramedPicture>
        ))}
      </div>
    </>
  );
}