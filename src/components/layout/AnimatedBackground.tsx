import React from 'react';

/**
 * 动态背景组件
 * 深色渐变背景 + 3 个缓慢浮动的光晕球
 * 固定定位，z-index 为负值，不阻挡交互
 */
const AnimatedBackground: React.FC = () => {
  return (
    <>
      {/* 深色渐变背景 */}
      <div className="animated-bg" aria-hidden="true" />

      {/* 光晕球容器 */}
      <div className="orbs-container" aria-hidden="true">
        <div className="light-orb light-orb-1" />
        <div className="light-orb light-orb-2" />
        <div className="light-orb light-orb-3" />
      </div>
    </>
  );
};

export default AnimatedBackground;
