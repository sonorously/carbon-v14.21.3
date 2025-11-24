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

// 获取div的高度
export const getContextHeight = function (){
  const h = document.querySelector('.card-bottom')?.offsetHeight ?? 0;
  console.log('获取到card-bottom的高度', h);
  return h
}