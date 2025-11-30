/**
 * 处理 Blob 数据并触发下载
 * @param {Object} response - axios 响应对象
 * @param {string} defaultFilename - 默认文件名
 */
export const handleBlobDownload = function (response, defaultFilename){
    // 从响应头获取文件名（如果后端提供）
    let filename =  defaultFilename;
    // 创建 Blob 对象
    const blob = new Blob([response.data]);
    console.log('查看blob文件流：', blob);
    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    // 设置链接属性
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';
    // 添加到 DOM 并触发点击
    document.body.appendChild(link);
    link.click();
    // 清理资源
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
}

/* 文件下载的的时候返回的流文件中的文件名称 */
export const getFileNameFromHeaders = function ( headers ) {
  const contentDisposition = headers['content-disposition'];
  if (!contentDisposition) {
    return 'download.file';
  }
  let fileName = 'download.file';
  // 优先处理 RFC 5987 编码 (filename*=utf-8'')
  const utf8FilenameRegex = /filename\*=utf-8''([^;]+)/i;
  const utf8Matches = utf8FilenameRegex.exec(contentDisposition);
  if (utf8Matches && utf8Matches[1]) {
    fileName = decodeFileName(utf8Matches[1]);
  } else {
    // 处理普通文件名 (filename="...")
    const filenameRegex = /filename=["']?([^"';]+)["']?/i;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches && matches[1]) {
      fileName = decodeFileName(matches[1]);
    }
  }
  // 清理文件名中的非法字符
  fileName = fileName.replace(/[<>:"/\\|?*]/g, '_');
  console.log('转码后的文件名称：', fileName);
  return fileName;
}
/* 解码文件名函数 */
export const decodeFileName = function (encodedName) {
  try {
    // 移除可能存在的引号
    let name = encodedName.replace(/['"]/g, '');
    // URL 解码
    return decodeURIComponent(name);
  } catch (error) {
    console.warn('文件名解码失败，使用原始名称:', error);
    return encodedName;
  }
}

// 获取div的高度
export const getContextHeight = function (){
  const h = document.querySelector('.card-bottom')?.offsetHeight ?? 0;
  console.log('获取到card-bottom的高度', h);
  return h
}