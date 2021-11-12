// 该js文件配合开发vdom的
import { h, render, patch } from '../source/vue/vdom'

// let app = document.getElementById('app')

// 虚拟dom, 就是一个对象, 用来表示真实dom

// 将如下的dom节点,生成虚拟dom
// <div id="container"><span style="color: red">hello</span>wzk</div>

// let oldVnode = h('div', {id: 'container', key: 1, class: 'aa'},
//   h('span', {style: {color: 'red'}}, 'hello'),
//   'wzk'
// )

let oldVnode = h('div', {id: 'container'},
  h('li', {style: {background: 'red'}, key: 'a'}, 'a'),
  h('li', {style: {background: 'yellow'}, key: 'b'}, 'b'),
  h('li', {style: {background: 'blue'}, key: 'c'}, 'c'),
  h('li', {style: {background: 'pink'}, key: 'd'}, 'd'),
)

// let oldVnode = h('div', {id: 'container', key: 1, class: 'aa'})
// console.log(oldVnode)

let container = document.getElementById('app')
render(oldVnode, container)

// 更新操作
// 
let newVnode = h('div', {id: 'container'},
  h('li', {style: {background: 'pink'}, key: 'e'}, 'e'),
  h('li', {style: {background: 'blue'}, key: 'a'}, 'a'),
  h('li', {style: {background: 'yellow'}, key: 'f'}, 'f'),
  h('li', {style: {background: 'red'}, key: 'c'}, 'c'),
  h('li', {style: {background: 'red'}, key: 'n'}, 'n'),
)

// 尾比头相同
// let newVnode = h('div', {id: 'container'},
//   h('li', {style: {background: 'pink'}, key: 'd'}, 'd'),
//   h('li', {style: {background: 'blue'}, key: 'a'}, 'a'),
//   h('li', {style: {background: 'yellow'}, key: 'b'}, 'b'),
//   h('li', {style: {background: 'red'}, key: 'c'}, 'c'),
// )

// 头比尾相同
// let newVnode = h('div', {id: 'container'},
//   h('li', {style: {background: 'pink'}, key: 'd'}, 'd'),
//   h('li', {style: {background: 'blue'}, key: 'c'}, 'c'),
//   h('li', {style: {background: 'yellow'}, key: 'b'}, 'b'),
//   h('li', {style: {background: 'red'}, key: 'a'}, 'a'),
// )

// 尾比尾相同 新的虚拟节点 在开头多的情况
// let newVnode = h('div', {id: 'container'},
//   h('li', {style: {background: 'skyblue'}, key: 'f'}, 'f'),
//   h('li', {style: {background: 'skyblue'}, key: 'e'}, 'e'),
//   h('li', {style: {background: 'red'}, key: 'a'}, 'a'),
//   h('li', {style: {background: 'yellow'}, key: 'b'}, 'b'),
//   h('li', {style: {background: 'blue'}, key: 'c'}, 'c'),
//   h('li', {style: {background: 'pink'}, key: 'd'}, 'd'),
// )

// 头比头相同 新的虚拟节点 在结尾多的情况
// let newVnode = h('div', {id: 'container'},
//   h('li', {style: {background: 'red'}, key: 'a'}, 'a'),
//   h('li', {style: {background: 'yellow'}, key: 'b'}, 'b'),
//   h('li', {style: {background: 'blue'}, key: 'c'}, 'c'),
//   h('li', {style: {background: 'pink'}, key: 'd'}, 'd'),
//   h('li', {style: {background: 'purple'}, key: 'e'}, 'e'),
// )

// let newVnode = h('p', {id: 'aa'}, 
//   h('span', {style: {color: 'yellow'}}, 'world'),
//   'vivian'
// )

// let newVnode = h('div', {id: 'aa'},)

// patchVnode patch()方法 用新的虚拟节点 和老的虚拟节点做对比 更新真实dom
setTimeout(() => {
  patch(oldVnode, newVnode);
}, 1000)