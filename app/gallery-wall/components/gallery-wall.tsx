"use client";

import { useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";
import ImageViewer from "./image-viewer";

interface GalleryWallProps {
  picturePropsList: FramedPictureProps[];
}

export default function GalleryWall(props: GalleryWallProps) {
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
    <>
      <div className="flex flex-wrap justify-between items-center xl:py-20 xl:p-40 gap-x-10 gap-y-20">
        {props.picturePropsList.map((props, index) => (
          <FramedPicture
            key={props.nameTag + index.toString()}
            imageSrc={props.imageSrc}
            nameTag={props.nameTag}
            timeTag={props.timeTag}
            rotate={props.rotate}
            onClick={() => {
              // 如果有外部链接，在新窗口打开
              if (props.herf && props.herf !== "") {
                window.open(props.herf, "_blank");
              } else {
                // 否则在当前页面查看大图
                openImageViewer(props.imageSrc, props.nameTag, props.timeTag);
              }
            }}
          ></FramedPicture>
        ))}
      </div>

      {/* 图片查看器 */}
      <ImageViewer
        isOpen={viewerState.isOpen}
        imageSrc={viewerState.imageSrc}
        nameTag={viewerState.nameTag}
        timeTag={viewerState.timeTag}
        onClose={closeImageViewer}
      />
    </>
  );
}