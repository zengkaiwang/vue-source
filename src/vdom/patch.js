// 此文件主要做两个事: 1. 进行第一次初始化渲染; 2. 进行新旧虚拟dom的比对操作

// 把虚拟节点 渲染成真实节点
export function render(vnode, container) {
  let el = createElm(vnode);
  container.appendChild(el);
}

// 把虚拟dom创建成真实节点, 这是是vue在操作dom
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
  let newProps = vnode.props || {}
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

export function patch(oldVnode, newVnode) {
  // 1. 比对标签: 如果标签不一样,直接用新的替换,因为现实使用中用户一般不会只更新父标签
  if(oldVnode.tag != newVnode.tag) { // 以前是dev 现在是p
    // 必须拿到当前元素的父亲, 才能替换掉自己
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
  }

  // 2. 比较文本, 标签一样, 可能都是undefined
  if(!oldVnode.tag) {
    if(oldVnode.text != newVnode.text) { // 如果文本内容不容, 直接用新的元素的内容来替换到文本节点
      oldVnode.el.textContent = newVnode.text;
    }
  }

  // 3. 标签一样的情况
  // 3.1 比对属性, 可能属性不同
  let el = newVnode.el = oldVnode.el; // 标签一样 复用即可
  updateProperties(newVnode, oldVnode.props); // 做属性比对

  // 3.2 比对孩子, 有三种情况
  let oldChildren = oldVnode.children || []
  let newChildren = newVnode.children || []

  if(oldChildren.length > 0 && newChildren.length > 0) {
    // 1) 老的有孩子 新的有孩子 该情况是vue最核心的代码
    updateChildren(el, oldChildren, newChildren) // 不停的递归比较
  } else if(oldChildren.length > 0) {
    // 2) 老的有孩子 新的没孩子
    el.innerHTML = ''
  } else if(newChildren.length > 0) { 
    // 3) 老的没孩子 新的有孩子
    for(let i = 0; i < children.length; i++) {
      let child = children[i];
      el.appendChild(createElm(child)) // 将新的虚拟节点的孩子 循环放到老的节点中即可
    }
  }

}

// vue最核心的代码 diff算法 双指针
function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0; // 老的开始索引
  let oldStartVnode = oldChildren[0] // 老的开始虚拟节点
  let oldEndIndex = oldChildren.length -1 // 老的结尾索引
  let oldEndVnode = oldChildren[oldEndIndex] // 老的结尾虚拟节点

  let newStartIndex = 0; // 新的开始索引
  let newStartVnode = newChildren[0] // 新的开始虚拟节点
  let newEndIndex = newChildren.length -1 // 新的结尾索引
  let newEndVnode = newChildren[newEndIndex] // 新的结尾虚拟节点

  // 新的或老的,孩子列表的 两个指针重合了 就停止while循环
  // 这里建议画图理解
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {

    // 1) 头比头相同 新旧首指针指向的相同
    if(isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode) // 用新的属性更新老的属性
      oldStartVnode = oldChildren[++oldStartIndex] // 把指针往后移
      newStartVnode = newChildren[++newStartIndex] // 把指针往后移
    
    // 2) 尾比尾相同 新旧尾指针指向的相同
    } else if(isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]

    // 3) 头比尾相同 倒叙 需要做移动操作
    } else if(isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      // 移动oldStartVnode 到oldEndVnode 后边
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling) // nextSibling是下一个元素
      // 更新指针
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    
    // 4) 尾比头相同 
    } else if(isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      // 移动oldEndVnode 到oldStartVnode 前边
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      // 更新指针
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    
    // 5) 两个列表 是乱序 也无复用节点
    } else {
      
    }

  }

  // 如果到最后还有剩余, 需要将剩余的插入
  if(newStartIndex <= newEndIndex) { // 新的两个指针还没重合, 说明新的孩子多
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      // 可能是往前边插 也可能是往后边插
      // 设定要参考元素: 指针往后挪一个, patch的时候 已经往newVnode上挂载了el属性
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      // newChildren[i]是剩下的元素 ,没有patch过 所以没有el属性
      parent.insertBefore(createElm(newChildren[i]),ele)

      // insertBefore(插入的元素, null) = appendChild()
      // parent.appendChild(createElm(newChildren[i]))
    }
  }

}

// 判断新旧虚拟节点 是否相同
function isSameVnode(oldVnode, newVnode) {
  // 如果标签和key都一样 则认为是同一个节点, 两个虚拟节点一样则可以复用真实节点
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}