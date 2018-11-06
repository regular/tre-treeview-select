const Tree = require('tre-treeview')
const h = require('mutant/html-element')
const Value = require('mutant/value')
const computed = require('mutant/computed')

function renderName(kv) {
  const name = kv.value && kv.value.content && kv.value.content.name || 'no name'
  return h('span', name)
}

function makeId(kv) {
  return 'k_' + kv.key.substr(1, kv.key.lastIndexOf('.') - 1) 
}

module.exports = function(ssb, opts) {
  const summary = opts.summary || renderName
  const primSelection = Value()
  const secSelection = Value([])
  return Tree(ssb, Object.assign({}, opts, {
    summary: renderItem
  }))

  function renderItem(kv) {
    const id = makeId(kv)
    return h('span', {
      id: id,
      classList: computed([primSelection, secSelection], (prime, secondary) => {
        if (prime == id) return ['selected']
        if (secondary.includes(id)) return ['secondary-selected']
      }),
      'ev-click': e => {
        console.log(id)
        if (e.ctrlKey) {
          let list = secSelection() || []
          if (!list.includes(id)) list.push(id)
          else list = list.filter( i => i !== id )
          secSelection.set(list)
        } else {
          primSelection.set(id)
        }
        e.preventDefault()
      }
    }, summary(kv))
  }

}
