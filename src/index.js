import Vue from 'vue'

let vm = new Vue({
  el: '#app',
  data() {
    return {
      msg: '旧的msg值',
      name: 'wzk',
      school: {
        name: 'zhangsan',
        age: 12
      },
      arr: [1,2,3],
      objArr: [{a: 'a的value值'}, 2, 3],
      firstName: 'zengkai',
      lastName: 'wang'
    }
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    }
  },
  // watch: {
  //   msg(newValue, oldValue) {
  //     console.log('watch的实现', newValue, oldValue)
  //   }
  // }
})

// console.log('vm', vm)
// ============初始化编译通过
// vm.msg = 'wzk'
// vm.msg = 'wzk1'
// vm.msg = 'wzk3'

// vm.name = 'sacler'
// vm.school.name = 'wzk22'

// ================数组劫持\数组的依赖收集更新========
// vm.arr = [3,3,3]
// vm.arr.push(4)
// vm.objArr[0].a = '新的a值'

// ===============watch的实现=======
// vm.msg = '新的msg的值'

// =============computed计算属性的实现========
// 更改计算属性的依赖值
vm.firstName = 'vivian'
// 此时属性firstNsme的dep中,只有一个计算属性,即dep = [计算属性watcher],应该再往dep中添加一个渲染watcher 即 dep = [计算属性watcher, 渲染watcher]

