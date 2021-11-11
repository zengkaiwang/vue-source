import { observe } from './index'
import Dep from './dep'
import { arrayMethods, observerArray } from './array'

// 定义Observer类
class Observer {
  constructor(data) {
    this.dep = new Dep(); // 此dep, 专门为数组设定, 定义到了Observer实例上

    // 每个对象, 包括数组都有一个__ob__属性, 返回的是当前observer实例
    // 这个对象, 可能是用户定义的data对象, 也可能是递归到的data中的子对象, 如data中的school arr
    Object.defineProperty(data, '__ob__', {
      get: ()=>this
    })

    if(Array.isArray(data)) {
      // 重写push等方法
      data.__proto__ = arrayMethods  // 让数组 通过原型链来找自定义的push等方法
      observerArray(data) // 对数组中的每一项进行观测,当然只观测那些是对象的项
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for(let i=0; i< keys.length; i++) {
      let key = keys[i] // 用户传的key
      let value = data[key] // 用户传入的值
      defineReactive(data, key, value)
    }
  }
}

// 定义响应式的数据变化
function defineReactive(data, key, value) {
  // 如果value还是对象,需要递归深度观察, 如data:{name: 'wzk',arr: [1,2,3]}中的arr
  let childOb = observe(value) // childOb是一个Observer实例

  let dep = new Dep() // 给每个data中的属性 都有一个dep实例

  Object.defineProperty(data, key, {
    get() {
      console.log('observe-get中取值操作-key', key)
      if(Dep.target) {
        // alert('observer-get-defineProperty-获取数据')
        // dep收集依赖
        dep.depend() // 让dep 中可以存watcher，我还希望让这个watcher中也存放dep，实现一个多对多的关系

        if(Array.isArray(value) && childOb) { // 这里是数组的依赖收集[重点**]
          // 如果childOb有值, 说明value还是对象 或者数组
          childOb.dep.depend() // 让数组也收集了当前的渲染watcher
        }
      }
      return value
    },
    set(newValue) {
      if(newValue === value) return
      console.log('observe-set中赋值操作-key', key)
      observe(newValue) // 如果设置的值也是对象,也需要监控起来
      value = newValue // 为啥能实现:value这个形参相当于defineReactive中定义了一个第三方变量
      // data[key] = newValue // 这样设置会死循环
      // console.log('查看设置后的数据', data)
      dep.notify() // 发布通知 更新
    }
  })
} 

export default Observer