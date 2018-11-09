const {client} = require('tre-client')
const Tree = require('.')
const Str = require('tre-string')
const h = require('mutant/html-element')
const Value = require('mutant/value')
const setStyle = require('module-styles')('tre-treview-select-demo')

function parentHasClsass(el, cl) {
  if (el.parentElement) {
    if (el.parentElement.classList.contains(cl)) return true
    return parentHasClsass(el.parentElement, cl)
  }
  return false
}

setStyle(`
  span {
    margin: .2em;
  }
  li {
    list-style-type: none;
  }
  span[data-key].selected {
    background-color: blue;
  }
  span[data-key].secondary-selected {
    background-color: yellow;
  }
`)

client( (err, ssb, config) => {
  console.log('tre config', config.tre)
  if (err) return console.error(err)

  const renderString = Str({
    canEdit: el => {
      console.log('canEdit', el)
      return parentHasClsass(el, 'selected')
    },
    save: (text, el) => {
      const key = el.parentElement.getAttribute('data-key')
      console.log('Saving', key, text)
      ssb.revisions.patch(key, content => {
        content.name = text
        return content 
      }, (err, result)=>{
        if (err) return console.error(err)
        console.log(result)
      })
    }
  })
  
  const sel = Value()

  const renderTree = Tree(ssb, {
    primarySelection: sel,
    summary: kv => [h('span', kv.value.content.type), renderString(kv.value.content.name)]
  })

  document.body.appendChild(
    h('div', [
      h('span', 'selection'),
      h('span', sel)
    ])
  )

  document.body.appendChild(
    h('ul',
      renderTree({
        key: config.tre.branches.root,
        value: { content: { name: 'root' } }
      })
    )
  )
})
