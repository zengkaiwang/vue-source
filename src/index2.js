import { h, render } from './vdom'

// let app = document.getElementById('app')

// 虚拟dom, 就是一个对象, 用来表示真实dom

// 将如下的dom节点,生成虚拟dom
// <div id="container"><span style="color: red">hello</span>wzk</div>

let oldVnode = h('div', {id: 'container', key: 1, class: 'aa'},
  h('span', {style: {color: 'red'}}, 'hello'),
  'wzk'
)
// console.log(oldVnode)

let container = document.getElementById('app')
render(oldVnode, container)