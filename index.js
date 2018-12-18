const Tree = require('tre-treeview')
const h = require('mutant/html-element')
const Value = require('mutant/value')
const computed = require('mutant/computed')

function renderName(kv) {
  const name = kv.value && kv.value.content && kv.value.content.name || 'no name'
  return h('span', name)
}

function revisionRoot(kv) {
  return kv.value.content && kv.value.content.revisionRoot || kv.key
}

module.exports = function(ssb, opts) {
  const summary = opts.summary || renderName
  const primSelection = opts.primarySelection || Value()
  const secSelection = opts.secondarySelections || Value([])
  return Tree(ssb, Object.assign({}, opts, {
    summary: renderItem
  }))

  function renderItem(kv, ctx) {
    const revRoot = revisionRoot(kv)
    return h('span', {
      attributes: {
        'data-key': kv.key
      },
      classList: computed([primSelection, secSelection], (kv1, kv2) => {
        if (kv1 && revisionRoot(kv1) == revRoot) return ['selected']
        if (kv2.map(revisionRoot).includes(revRoot)) return ['secondary-selected']
      }),
      'ev-click': e => {
        if (e.ctrlKey) {
          let list = secSelection() || []
          if (!list.map(revisionRoot).includes(revRoot)) list.push(kv)
          else list = list.filter( i => revisionRoot(i) !== revRoot )
          secSelection.set(list)
        } else {
          const curr = primSelection()
          const k = curr && curr.key
          if (kv.key !== k) {
            primSelection.set(kv)
            e.stopPropagation()
            e.preventDefault()
          }
        }
      }
    }, summary(kv, ctx))
  }

}
