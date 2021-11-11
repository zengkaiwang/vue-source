export function compiler(node, vm) { // node 就是文档碎片
  let childNodes = node.childNodes; // 只有第一层 只有儿子
  // 将列数组转化成数组
  [...childNodes].forEach((child) => { // node节点 一种是元素 一种是文本
    if(child.nodeType == 1) { // 1表示元素 3表示文本
      // console.log('元素类型的node节点', child)
      compiler(child, vm) // 递归编译当前元素的孩子节点
    } else if(child.nodeType == 3) {
      // console.log('文本类型的node节点', child)
      util.compilerText(child, vm)
    }
  })
}

const defaultReg = /\{\{((?:.|\r?\n)+?)\}\}/g   // 匹配{{school.name}}
// const defaultReg = /\{\{(.+)\}\}/g   // 匹配{{school.name}} 简化正则 不考虑空格的情况
export const util = {
  compilerText(node,vm) { // 编译文本 替换{{school.name}}
    if(!node.expr) { // 保存一下最初的{{}}模板
      node.expr = node.textContent
    }
    // console.log('node.textContent', node.textContent)
    node.textContent = node.expr.replace(defaultReg, function(...args){
      // console.log('args[1]', args[1])
      // return util.getValue(vm, args[1])
      return JSON.stringify(util.getValue(vm, args[1])) // 使用JSON.stringify方便查看 
    })
  },
  // 通过vm.school.name 获取属性值
  getValue(vm, expr) { // expr是school.name
    let keys = expr.split('.')
    // console.log('keys', keys)
    const result = keys.reduce((prev, current) =>{
      prev = prev[current]
      return prev
    }, vm)
    // console.log('reduce结果', result)
    return result
  }
}