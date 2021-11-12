// 终版 整合vdom
import Vue from 'vue'

let vm = new Vue({
  el: '#app',
  data() {
    return {
      msg: 'hello'
    }
  },
  render(h) {
    return h('div', {id: 'aaa'}, this.msg)
  }
})

setTimeout(() => {
  vm.msg = '新msg值'
}, 1000)