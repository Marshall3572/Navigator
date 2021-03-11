const $siteList = $(".siteList");
const $lastLi = $siteList.find('li:last-child');//使用伪类选择器
const x = localStorage.getItem( 'x')
const xObject = JSON.parse(x) //字符串变成一个对象
/*不能用const hashMap = {}来定义全局变量，
因为我们使用parcel预览，他会默认在代码外加一个作用域，改用window*/
const hashMap =  xObject || [
    {logo: 'B' , url: 'https://www.bilibili.com/'},
    {logo: 'V' , url: 'https://cn.vuejs.org/'}
]
const simplifyUrl = (url) =>{
    return url.replace('https://','')
    .replace('http://','')
    .replace('www.','')
    .replace(/\/.*/, '')  //删除/开头的内容
}


const render = () => {
    $siteList.find('li:not(.last)').remove() //重新渲染之前，将"新增站点"之前的所有站点清空，避免重复生成
    hashMap.forEach((node, index)=>{
        const $li = $(`<li>
                    <div class="site">
                        <div class="logo">${node.logo}</div>
                        <div class="link">${simplifyUrl(node.url)}</div>
                        <div class="close">
                          <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                          </svg>
                        </div>
                    </div>
            </li>`).insertBefore($lastLi)
            $li.on('click', () => {
              window.open(node.url)
            })
            $li.on('click', '.close', (e) => {
              e.stopPropagation() // 阻止冒泡
              hashMap.splice(index, 1)
              render()
            })
    })
}

render();

$('.addButton').on('click',()=>{
    let url = window.prompt("请问你要添加的网址是什么？");
    //智能纠正用户错误
    if(url.indexOf('http') !== 0){
        url = 'https://' + url;
    }
    //新增网址
    hashMap.push({
      logo: simplifyUrl(url)[0].toUpperCase(),
      url: url
    });
    render();
});

// 用户关闭页面前触发
window.onbeforeunload = ()=>{
    const string = JSON.stringify(hashMap) //对象变成一个字符串
    localStorage.setItem('x',string)
};
//键盘事件，按下网页首字母自动跳转
$(document).on('keypress', (e) => {
  const {key} = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
    }
  }
})