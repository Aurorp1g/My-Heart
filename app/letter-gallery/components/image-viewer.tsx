"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

interface ImageViewerProps {
  isOpen: boolean;
  imageSrc: string;
  nameTag: string;
  timeTag: string;
  onClose: () => void;
  imageList?: string[]; // 新增：图片列表
  currentIndex?: number; // 新增：当前图片索引
  onPrev?: () => void; // 新增：上一张回调
  onNext?: () => void; // 新增：下一张回调
}

export default function ImageViewer({ 
  isOpen, 
  imageSrc, 
  nameTag, 
  timeTag, 
  onClose,
  imageList = [],
  currentIndex = 0,
  onPrev,
  onNext 
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算是否有上一张/下一张
  const hasPrev = imageList.length > 0 && currentIndex > 0;
  const hasNext = imageList.length > 0 && currentIndex < imageList.length - 1;

  // 禁用页面滚动 - 简化版本
  useEffect(() => {
    if (isOpen) {
      // 保存当前滚动位置
      const scrollY = window.scrollY;
      // 禁用滚动但不改变页面位置
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      // 保持页面在当前位置
      window.scrollTo(0, scrollY);
    } else {
      // 恢复滚动
      document.body.style.overflow = '';
      document.body.style.position = '';
    }

    // 清理函数
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, [isOpen]);

  // 重置状态
  const resetState = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // 缩放功能
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => resetState();

  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // 拖拽功能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (hasPrev && onPrev) onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (hasNext && onNext) onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasPrev, hasNext, onPrev, onNext]);

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
            ref={containerRef}
            className={`relative ${styles.imageViewerContent}`}
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
            
            {/* 控制工具栏 */}
            <div className={`absolute top-4 right-4 flex gap-2 z-20 ${styles.toolbar}`}>
              <motion.button
                className={`${styles.toolbarButton}`}
                onClick={zoomOut}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="缩小"
              >
                <i className="fa-solid fa-magnifying-glass-minus"></i>
              </motion.button>
              
              <motion.button
                className={`${styles.toolbarButton}`}
                onClick={resetZoom}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="重置"
              >
                <span className="text-xs font-bold">1:1</span>
              </motion.button>
              
              <motion.button
                className={`${styles.toolbarButton}`}
                onClick={zoomIn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="放大"
              >
                <i className="fa-solid fa-magnifying-glass-plus"></i>
              </motion.button>
            </div>
            
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
            
            {/* 上一张/下一张导航按钮 */}
            {imageList.length > 1 && (
              <>
                {/* 上一张按钮 */}
                {hasPrev && (
                  <motion.button
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-4 text-white text-2xl ${styles.navButton}`}
                    onClick={onPrev}
                    whileHover={{ scale: 1.15, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    title="上一张 (←)"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                )}
                
                {/* 下一张按钮 */}
                {hasNext && (
                  <motion.button
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-4 text-white text-2xl ${styles.navButton}`}
                    onClick={onNext}
                    whileHover={{ scale: 1.15, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    title="下一张 (→)"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )}
                
                {/* 图片计数器 */}
                <motion.div 
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-sm font-medium z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentIndex + 1} / {imageList.length}
                </motion.div>
              </>
            )}
            
            {/* 图片容器 */}
            <motion.div 
              className="p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* 图片装饰边框 */}
              <div 
                className="rounded-2xl overflow-hidden cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: scale > 1 ? 'grab' : 'default' }}
              >
                {/* 使用普通img元素而不是motion.img，避免动画冲突 */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt={nameTag}
                  className={`w-full max-h-[70vh] object-contain ${styles.imageViewerImage}`}
                  style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease'
                  }}
                  draggable={false}
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

            {/* 操作提示 */}
            <motion.div 
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-light text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div>✨ 滚轮缩放 • 拖拽移动 • 点击背景关闭 ✨</div>
              <div className="text-xs mt-1">快捷键: +放大 -缩小 0重置 Esc关闭 ←→切换</div>
            </motion.div>

            {/* 缩放指示器 */}
            {scale !== 1 && (
              <motion.div 
                className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {Math.round(scale * 100)}%
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}