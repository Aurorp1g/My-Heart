#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

//console.log('备份.git目录...');

const outDir = path.join(__dirname, '..', 'out');
const gitDir = path.join(outDir, '.git');
const backupDir = path.join(__dirname, '..', '.git-backup');

// 检查out目录是否存在
if (!fs.existsSync(outDir)) {
  //console.log('out目录不存在，跳过备份');
  process.exit(0);
}

// 检查.git目录是否存在
if (!fs.existsSync(gitDir)) {
  //console.log('out目录下没有.git文件夹，跳过备份');
  process.exit(0);
}

try {
  // 清理备份目录
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
  
  // 使用Windows命令备份.git目录（保留隐藏属性）
  //console.log('备份.git目录...');
  execSync(`xcopy "${gitDir}" "${backupDir}" /E /I /H /Q`, { stdio: 'pipe' });
  //console.log('.git目录已备份');
  
  // 执行构建命令
  console.log('开始构建...');
  process.chdir(path.join(__dirname, '..'));
  execSync('next build', { stdio: 'inherit' });
  
  // 构建完成后恢复.git目录
  //console.log('恢复.git目录...');
  if (fs.existsSync(backupDir)) {
    // 删除可能存在的.git目录
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }
    
    // 使用Windows命令恢复.git目录（保留隐藏属性）
    execSync(`xcopy "${backupDir}" "${gitDir}" /E /I /H /Q`, { stdio: 'pipe' });
    
    // 清理备份目录
    fs.rmSync(backupDir, { recursive: true, force: true });
    console.log('构建完成');
  }
  
} catch (error) {
  console.error('.git目录恢复失败:', error.message);
  // 清理备份目录
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
  process.exit(1);
}