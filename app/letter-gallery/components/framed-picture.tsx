"use client";

import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import styles from "./styles.module.css";

const nameTagFont = Oswald({ subsets: ["latin"] });

export interface FramedPictureProps {
  onClick?: (imageSrc: string, nameTag: string, timeTag: string) => void;
  imageList: string[];
  nameTag: string;
  timeTag: string;
  rotate?: number;
  herf?: string;
}

export default function FramedPicture(props: FramedPictureProps) {
  function getRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // 处理图片点击事件
  const handleImageClick = (imageSrc: string) => {
    if (props.onClick) {
      props.onClick(imageSrc, props.nameTag, props.timeTag);
    }
  };

  // 处理整个相框的点击事件（用于外部链接）
  const handleFrameClick = () => {
    // 如果有外部链接，在新窗口打开
    if (props.herf && props.herf !== "") {
      window.open(props.herf, "_blank");
    }
  };

  return (
    <motion.div
      className={styles.framedPicture + " shadow-xl cursor-pointer"}
      initial={{ scale: 0.7, rotate: 0 }}
      whileInView={{ scale: 1, rotate: props.rotate ?? getRandom(-5, 5) }}
      transition={{ type: "spring", stiffness: 400, damping: 20, mass: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      drag
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={handleFrameClick}
    >
      <div className={styles.imageListContainer}>
        {props.imageList.map((imageSrc, index) => (
          <motion.img
            key={index}
            src={imageSrc}
            alt={"image about " + props.nameTag}
            className={styles.framedPictureImage}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡到相框
              handleImageClick(imageSrc);
            }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      {props.nameTag != "" && (
        <h1
          className={nameTagFont.className + " " + styles.framedPictureNameTag}
        >
          {props.nameTag}
        </h1>
      )}

      {props.timeTag != "" && (
        <p
          className={nameTagFont.className + " " + styles.framedPictureTimeTag}
        >
          {props.timeTag}
        </p>
      )}
    </motion.div>
  );
}