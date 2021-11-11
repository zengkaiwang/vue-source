
// Dep类 用来收集依赖 收集的是一个个watcher
let id = 0
class Dep {
  constructor() {
    this.id = id++ // 一定是++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  depend() { // 收集依赖的方法
    if(Dep.target) { // Dep.target 是当前watcher
      Dep.target.addDep(this) // this是Dep实例 期望dep和watcher能都相互记忆
    }
  }
}

// 用来保存当前watcher的方法
let stack = [] // 为什么需要一个数组储存呢? 为了保存多个呗 push后不一定立即pop啊
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget() {
  // alert('popTarget')
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep