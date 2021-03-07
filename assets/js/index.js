
//头像缓冲动画
let parentDom = document.getElementsByClassName('portrait')[0];
let imgLoad = function (url) {
  let img = new Image();
  img.crossOrigin = "Anonymous"; 
  img.src = './assets/images/me.jpg';
  img.onload = function () {
    setTimeout(function () {
      document.getElementsByClassName('loading')[0].style.display = 'none';
      img.setAttribute("class", "avatar");
      // img.style.display = 'block';
      img.style.cssText = "width:8rem;height:11rem;display:block;transform: scale(.7);";
      parentDom.appendChild(img);
    }, 500)
  };
};
imgLoad();

//导出pdf
document.getElementById("download_resume").onclick = function () {
  let target = document.getElementById("resume_lxy");
  target.style.background = "#FFFFFF";
  html2canvas(target, {
    dpi: 300,
    useCORS: true,
    onrendered: function (canvas) {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;

      //一页pdf显示html页面生成的canvas高度;
      let pageHeight = contentWidth / 592.28 * 841.89;
      //未生成pdf的html页面高度
      let leftHeight = contentHeight;
      //页面偏移
      let position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      let imgWidth = 595.28;
      let imgHeight = 592.28 / contentWidth * contentHeight;

      let pageData = canvas.toDataURL('image/jpeg', 1.0);

      let pdf = new jsPDF('', 'pt', 'a4');

      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }

      pdf.save("个人简历（刘昕宇）.pdf");
    }
  })
}

//截图
document.getElementById("download_img").onclick = function(){
  let that = this
  let opts = {
    logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
    allowTaint: true, // 否允许跨源图像污染画布
    backgroundColor: null, // 解决生成的图片有白边
    useCORS: true // 如果截图的内容里有图片,解决文件跨域问题
  }
  html2canvas(document.getElementById('page_box'), opts).then((canvas) => {
    let url = canvas.toDataURL('image/png')
    let a = document.createElement('a')
    a.href = url
    a.download = '个人简历（刘昕宇）'
    a.click()
  })
}