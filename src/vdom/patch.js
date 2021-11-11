// 此文件主要做两个事: 1. 进行第一次初始化渲染; 2. 进行新旧虚拟dom的比对操作

// 把虚拟节点 渲染成真实节点
export function render(vnode, container) {
  console.log(vnode)
  let el = createElm(vnode);
  container.appendChild(el);
}

// 创建真实节点
function createElm(vnode) {
  let { tag, props, key, children, text} = vnode
  if(typeof tag === 'string') {
    // 创建标签 
    vnode.el = document.createElement(tag); // vnode.el 是真实dom
    
    updateProperties(vnode)

    // 递归处理孩子虚拟节点
    children.forEach(child => { // child是虚拟节点
      return render(child, vnode.el)
    })
  } else {
    // 创建文本
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

// 给真实dom 添加或更新属性
function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.props
  let el = vnode.el

  // 更新属性的逻辑
  // 如果老的中的属性, 新的属性中没有, 直接删掉
  for(let key in oldProps) {
    if(!newProps[key]) {
      delete el[key];
    }
  }
  
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for(let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }
  
  // 第一次添加属性 直接循环添加即可
  for(let key in newProps) {
    if(key === 'style') { // 如果属性是style 是对象 需要继续遍历
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if(key === 'class') {
      el.className = newProps[key]
    } else {
      el[key] = newProps[key]
    }
  }
}