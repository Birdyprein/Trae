# 关于我与技能区域内容移除 Spec

## Why
用户希望"关于我"和"技能"两个区域显示空白状态，保留布局框架（框框），但不显示具体内容。

## What Changes
- 移除"关于我"区域内的个人简介、兴趣爱好、正在学习等内容
- 移除"技能"区域内的技能列表、进度条、类别图标等内容
- 保留两个区域的标题和网格布局框架
- 保留空的玻璃态卡片框作为占位展示

## Impact
- Affected code: `src/components/sections/About.tsx`, `src/components/sections/Skills.tsx`

## ADDED Requirements
### Requirement: 空白关于我展示
系统 SHALL 在"关于我"区域显示空白卡片框架，不显示具体个人信息内容。

#### Scenario: 显示空白关于我卡片
- **WHEN** 用户访问"关于我"区域
- **THEN** 系统显示空的玻璃态卡片框，无个人简介、兴趣爱好、正在学习等内容

### Requirement: 空白技能展示
系统 SHALL 在"技能"区域显示空白卡片框架，不显示具体技能内容。

#### Scenario: 显示空白技能卡片
- **WHEN** 用户访问"技能"区域
- **THEN** 系统显示空的玻璃态卡片框，无技能名称、进度条等内容