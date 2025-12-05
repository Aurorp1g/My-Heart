"use client";

import { useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";

interface GalleryWallProps {
  picturePropsList: FramedPictureProps[];
  onImageClick: (imageSrc: string, nameTag: string, timeTag: string) => void;
}

export default function GalleryWall(props: GalleryWallProps) {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center xl:py-20 xl:p-40 gap-x-10 gap-y-20">
        {props.picturePropsList.map((pictureProps, index) => (
          <FramedPicture
            key={pictureProps.nameTag + index.toString()}
            imageSrc={pictureProps.imageSrc}
            nameTag={pictureProps.nameTag}
            timeTag={pictureProps.timeTag}
            rotate={pictureProps.rotate}
            onClick={() => {
              // 如果有外部链接，在新窗口打开
              if (pictureProps.herf && pictureProps.herf !== "") {
                window.open(pictureProps.herf, "_blank");
              } else {
                // 否则调用父组件的图片查看器打开函数
                props.onImageClick(pictureProps.imageSrc, pictureProps.nameTag, pictureProps.timeTag);
              }
            }}
          ></FramedPicture>
        ))}
      </div>
    </>
  );
}