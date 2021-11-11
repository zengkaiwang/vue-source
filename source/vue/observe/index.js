import Dep from './dep'
import Observer from './observer'
import Watcher from './watcher'

// 本文件用来数据初始化
export function initState(vm) {
  let opts = vm.$options
  if(opts.data) {
    initData(vm) // 初始化data
  }

  if(opts.computed) {
    initComputed(vm, opts.computed) // 初始化计算属性
  }

  if(opts.watch) {
    initWatch(vm) // 初始化watch监听
  }
}

// 将用户传入的data数据,通过Object.defineProperty重新定义
function initData(vm) {
  let data = vm.$options.data
  // 用户设置data可能是一个对象,可能设置的是一个函数
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

  // 为了用户能this.msg 直接取值,需要做一层代理
  for(let key in data) {
    proxy(vm, '_data', key)
  }

  // 观察数据
  observe(data)
}

// 代理数据 vm.msg = vm._data.msg
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

export function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return
  }

  return new Observer(data)
}

function initComputed(vm, computed) {
  // 将计算属性的配置 放到vm上
  let watchers = vm._watchersComputed = Object.create(null); // 创建存储计算属性的watcher的对象

  // 原理就是给每一个计算属性 创建一个watcher
  for(let key in computed) { // {fullName: ()=>this.firstName + this.lastName}
    let userDef = computed[key]
    watchers[key] = new Watcher(vm, userDef, ()=>{}, {lazy: true}) // lazy是一个标识, 表示是计算属性的watcher ,且默认这只为这个方法不执行
    
    // 将这个计算属性,定义到vm, 这样用户vm.fullName这样用
    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key)
    })
    
  }
}

function createComputedGetter(vm, key) {
  let watcher = vm._watchersComputed[key]
  return function () { // 用户取值的时候,会执行这个方法
    if(watcher) {
      // 如果dirty是false的话, 不需要重新执行计算属性中的方法, 实现了缓存
      if(watcher.dirty) { // 如果页面取值, 而且dirty是true, 就会去调用watcher的get方法
        watcher.evaluate()
      }
      // 存储Dep.target 的也是一个栈 [渲染watcher, 计算属性watcher]
      if(Dep.target) { // 此时的Dep.target 已经是渲染watcher了 
        // 计算属性wacher中 有个deps属性, 它记录了多个dep, 包括firstNam的dep 和lastName的dep
        watcher.depend() // 往Wacher类上新增一个depend方法
      }
      return watcher.value
    }
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch // 获取用户传入的watch属性
  for(let key in watch) {
    let handler = watch[key];
    createWatcher(vm, key, handler)
  }
}
function createWatcher(vm, key, handler) {
  // 内部还是使用$watch方法
  return vm.$watch(key, handler)
}