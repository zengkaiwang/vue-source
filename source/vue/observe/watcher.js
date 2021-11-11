import { pushTarget, popTarget } from './dep'
import { util } from '../utils'

let id = 0
// 渲染使用这个类\ 计算属性也用他\ vm.$watch也用他
class Watcher { // 通过id 每次new示例产生的watcher 都要有唯一标识
  /**
   * 
   * @param {*} vm 当前组件的实例 new Vue
   * @param {*} exprOrFn 用户传入的表达式 或者函数
   * @param {*} cd 用户传入的回调函数 vm.$watch('msg', cd)
   * @param {*} opts 一些其他参数
   */
  //用户定义的watcch  vm, msg, (newValue, oldValue)=> {}, {user: true}
  //用户定义的计算属性 vm, ()=>this.firstName + this.lastName , ()=>{}, {lazy: true}
  constructor(vm, exprOrFn, cd=()=>{}, opts={}) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn // getter 是用户传入的第二个参数
    } else {
      // 对watch的实现进行兼容处理
      this.getter = function(){
        return util.getValue(vm, exprOrFn)
      }
    }
    // 对watch的实现进行兼容处理
    if(opts.user) {
      this.user = true
    }
    // 对计算属性的实现进行兼容处理
    this.lazy = opts.lazy; // lazy这个值为true, 则表示是计算属性
    this.dirty = this.lazy; // 缓存, 计算属性比watch多了个缓存

    this.cd = cd
    this.opts = opts
    this.id = id++

    this.deps = []; // watcher 也要记录多个dep
    this.depsId = new Set() // 用来不重复记录dep

    // this.get() // 实例化创建watch 默认会调用自身的get方法
    // 对watch的实现进行兼容处理, 创建wacher的时候,先将表达式对应的值取出来 (老值)
    // this.value = this.get()
    // 如果是计算属性watcher的话,不会默认调用get
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    pushTarget(this) // 渲染watcher Dep.target = watcher; msg变化了 需要让这个watcher重新执行 

    // 对于计算属性 fullName() {return this.firstName + this.lastName} 
    // 当这个函数调用的时候就会通过pushTarget(this)将当前计算属性watcher存起来
    // 当fullName这个函数执行时,会走firstName的get 和lastName的get ,此时firstName属性的dep = [计算属性watcher] 且lastName属性的dep = [计算属性watcher]
    let value = this.getter.call(this.vm)

    // this.getter() // 执行传入的函数 更新编译文本-里边用到observer的get-dep.append
    // let value = this.getter() // 对watch的实现进行兼容处理

    popTarget() // 为什么立即又删除了改watcher? 不是立即,前边通过getter()执行了编译阶段

    return value // 对watch的实现进行兼容处理
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  depend() {
    let i = this.deps.length
    // firstNam的dep 和lastName的dep
    while(i--) {
      this.deps[i].depend()
    }
  }
  // 让watcher和dep相互记忆
  addDep(dep) { // 同一个watcher 不应该重复记录dep
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep) // 把dep 记录到watcher中
      dep.addSub(this) // 把watcher 收集记录到dep中
    }
  }
  update() { // 如果立即调用get 会导致页面多次刷新
    // this.get()
    // queueWatcher(this)

    // 兼容计算属性处理
    if(this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    // this.get()
    // 对watch的实现进行兼容处理
    let value = this.get()
    if(value != this.value) {
      // value 是新值 this.value是老值 cd是用户定义的watch的回调函数
      this.cd(value, this.value);
    }
  }
}

// 异步批量更新
let has = {}
let queue = []
function queueWatcher(watcher) { 
  let id = watcher.id
  if(has[id] == null) { // 对重复wacher进行过滤
    has[id] = watcher
    queue.push(watcher)

    // flushQueue() // 延迟处理 达到批量一次更新的效果
    // setTimeout(() => {
    //   flushQueue()
    // })
    nextTick(flushQueue);
  }
}

function flushQueue() {
  queue.forEach(watcher => watcher.run())
  has = {}
  queue = []
}

// 异步nextTick的实现原理
let callbacks = []
function flushCallbacks() {
  callbacks.forEach(cd => cd())
}
function nextTick(cd) {
  callbacks.push(cd)

  // 异步有多种方式,也是分执行顺序的 promise mutationObserver setImmediate setTimeout
  let timerFunc = () => {
    flushCallbacks()
  }
  // 1.优先考虑Promise
  if(Promise) {
    return Promise.resolve().then(timerFunc)
  }
  // 2.降级到MutationObserver
  if(MutationObserver) {
    let observe = new MutationObserver(timerFunc) // H5的api
    let textNode = document.createTextNode(1)
    observe.observe(textNode, { characterData: true})
    textNode.textContent = 2
    return
  }
  // 3.降级到setImmediate（只有IE支持）
  if(typeof setImmediate != 'undefined') {
    return setImmediate(timerFunc)
  }
  // 4.以上都不支持，用setTimeout兜底
  setTimeout(timerFunc, 0)
}

export default Watcher