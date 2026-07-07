# 作品展示区域内容移除 Spec

## Why
用户希望作品展示区域显示空白状态，保留布局框架（框框），但不显示具体项目内容。

## What Changes
- 移除项目卡片内的图片、标题、描述、技术标签和操作按钮
- 保留作品展示区域的整体布局框架（标题、分类筛选按钮、网格容器）
- 保留空的玻璃态卡片框作为占位展示

## Impact
- Affected code: `src/components/sections/Projects.tsx`
- Affected data: `src/data/portfolio.ts` 中的 projects 数据将不再显示

## ADDED Requirements
### Requirement: 空白作品展示
系统 SHALL 在作品展示区域显示空白卡片框架，不显示具体项目内容。

#### Scenario: 显示空白卡片
- **WHEN** 用户访问作品展示区域
- **THEN** 系统显示空的玻璃态卡片框，无图片、标题、描述等内容

#### Scenario: 保留布局结构
- **WHEN** 作品展示区域渲染
- **THEN** 标题、分类筛选按钮和网格布局框架正常显示