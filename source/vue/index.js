import { initState } from './observe'
import { compiler } from './utils'
import Watcher from './observe/watcher'

// 使用构造函数定义Vue,而非使用es6的类,是为了文件模块化方便
function Vue(options) {
  this._init(options)
}

Vue.prototype._init = function(options) {
  let vm = this
  vm.$options = options

  // MVVM原理,需要对数据初始化
  initState(vm)

  // 初始化渲染
  if(vm.$options.el) {
    vm.$mount()
  }
}

Vue.prototype.$mount = function() {
  let vm = this
  let el = vm.$el = query(vm.$options.el)

  // 通过watcher来听通知渲染
  let updataComponent = () => {
    console.log('编译文本')
    vm._update() // 更新组件 渲染的逻辑
  }

  // new 一个watcher 默认执行组件更新
  // 组件的更新,就是通过watcher发通知
  // new 一个实例 就生成一个watch, 此处生成的watcher是渲染watcher
  new Watcher(vm, updataComponent)
}

// 更新组件
Vue.prototype._update = function() {
  // 用用户传入的值, 更新视图
  let vm = this
  let el = vm.$el

  // 先用vue1.0的原理实现, 回头再用vue2.0的虚拟dom重写
  let node = document.createDocumentFragment()
  let firstChild
  while(firstChild = el.firstChild) {
    node.appendChild(firstChild) // appendChild 是具有移动的功能 
  }

  // 对文本进行替换
  compiler(node, vm)
  el.appendChild(node)
}

// 获取dom元素
function query(el) {
  if(typeof el === 'string') {
    return document.querySelector(el)
  }
  return el
}

// watch的实现原理
Vue.prototype.$watch = function(key, handler) {
  // 原理: 创建一个watcher
  let vm = this
  new Watcher(vm, key, handler, {user: true}) // user就是个标识,表示是用户watcher
}

export default Vue