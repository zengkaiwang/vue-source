import {vnode} from './create-element'

// h() 方法 用来生成虚拟dom对象
export default function h(tag, props, ...children) {
  let key = props.key
  delete props.key; // 属性中不应该包含key
  children = children.map(child => {
    if(typeof child === 'object') {
      return child
    } else {
      return vnode(undefined, undefined, undefined, undefined, child)

    }
  })
  return vnode(tag, props, key, children)
}