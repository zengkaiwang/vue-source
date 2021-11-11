import { observe } from '.'
// 主要做的事就是拦截用户调用的push pop unshift shift reverse sort splice, 只改写这7个方法
// 不处理那些不改变数组的方法,如conccat

// 先获取老的数组的方法
let oldArrayProtoMethods = Array.prototype;

// 拷贝一个新的对象 可以查到老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods);

// 定义新的方法, 然后通过原型链 prototype __proto__ 挂载
let methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse', 
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function(...args) { //剩余运算符 arr.push(1,2,3) args = [1,2,3]
    oldArrayProtoMethods[method].apply(this, args) // 函数劫持
    
    // 劫持了函数后, 在里边可以增加自定义逻辑
    let insertedArr; // 新插入元素组成的数组
    switch (method) { // 只对新增的属性 进行观察
      case 'push':
      case 'unshift':  
        insertedArr = args;
        break;
      case 'splice':
        insertedArr = args.slice(2) // 截取splice 新增的内容
        break;
      default:
        break;
    }
    if(insertedArr) observerArray(insertedArr) // 对新增的元素进行观察
    console.log('调用了数组更新的新的方法了, --更新视图')

    // 这里根据收集的依赖, 对数组进行更新
    this.__ob__.dep.notify() // 调用push等方法后, 通知视图更新. 在这里发布订阅

    console.log('this', this) // 这里的this 就是data中定义的arr属性, 该属性是一个数组

    return this // 让新方法可以链式操作
  }
})

// 对数组新增的元素进行观察
export function observerArray(insertedArr) { // 循环对新增的每一项都进行数据观测
  for(let i = 0; i< insertedArr.length; i++) {
    observe(insertedArr[i]) // 没有对数组的索引进行检测
    // oberve函数内部 也只对对象数据进行检测处理
  }
}
