"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.css";

interface ImageViewerProps {
  isOpen: boolean;
  imageSrc: string;
  nameTag: string;
  timeTag: string;
  onClose: () => void;
}

export default function ImageViewer({ isOpen, imageSrc, nameTag, timeTag, onClose }: ImageViewerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-[1100] flex items-center justify-center ${styles.imageViewerBackdrop}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative max-w-5xl max-h-full mx-4 ${styles.imageViewerContent}`}
            initial={{ scale: 0.7, opacity: 0, y: 50, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50, rotate: 5 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              mass: 1.1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 装饰元素 */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full opacity-40 blur-sm"></div>
            
            {/* 关闭按钮 */}
            <motion.button
              className={`absolute -top-6 -right-6 z-10 rounded-full p-3 text-white text-2xl ${styles.imageViewerCloseButton}`}
              onClick={onClose}
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            
            {/* 图片容器 */}
            <motion.div 
              className="p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* 图片装饰边框 */}
              <div className="rounded-2xl overflow-hidden">
                <motion.img
                  src={imageSrc}
                  alt={nameTag}
                  className={`w-full max-h-[70vh] object-contain ${styles.imageViewerImage}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                />
              </div>
              
              {/* 图片信息 */}
              {(nameTag || timeTag) && (
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {nameTag && (
                    <motion.h3 
                      className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {nameTag}
                    </motion.h3>
                  )}
                  {timeTag && (
                    <motion.p 
                      className="text-white/80 text-lg font-light italic"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      📅 {timeTag}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* 底部提示 */}
            <motion.div 
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ✨ 点击背景关闭 ✨
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}