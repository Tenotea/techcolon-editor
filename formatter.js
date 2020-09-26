// Editor Starts Here

const blogContent = document.getElementById('blog-content')
const blogPreviewBox = document.getElementById('preview')
let draftTitle = document.querySelector('#preview-header .title')
let copyButton = document.querySelector('#copy-button')

function createMatchBetweenRegex (symbol) {
 let exp = new RegExp(`${symbol}(.*?)${symbol}`, 'g')
  return exp
}

function render(){
  blogPreviewBox.innerHTML = blogContent.value
  applyFormat()
}

const operators = {
  h1:{
    id: 1,
    name: 'l1Header',
    pattern: createMatchBetweenRegex('~#1'),
    tag: 'h1',
    symbol: '##'
  },

  h2: {
    id: 2,
    name: 'l2Header',
    pattern: createMatchBetweenRegex('~#2'),
    tag: 'h2',
    symbol: '###'
  },

  h3: {
    id: 3,
    name: 'l3Header',
    pattern: createMatchBetweenRegex('~#3'),
    tag: 'h3',
    symbol: '####'
  },

  h4: {
    id: 4,
    name: 'l4Header',
    pattern: createMatchBetweenRegex('~#4'),
    tag: 'h4',
    symbol: '#####'
  },

  h5: {
    id: 5,
    name: 'l5Header',
    pattern: createMatchBetweenRegex('~#5'),
    tag: 'h5',
    symbol: '######'
  },

  h6: {
    id: 6,
    name: 'l6Header',
    pattern: createMatchBetweenRegex('~#6'),
    tag: 'h6',
    symbol: '#######'
  },

  bold:{
    id: 7,
    name: 'bold',
    pattern: createMatchBetweenRegex('\\*{2}'),
    tag: 'b',
    symbol: '**'
  },

  italic: {
    id: 8,
    name: 'italic',
    pattern: createMatchBetweenRegex('~{2}'),
    tag: 'i',
    symbol: '~~'
  },

  link: {
    id: 9,
    name: 'link',
    pattern: /\[{2}(.*?)\]{2}\({2}(.*?)\){2}/g,
    tag: 'a',
    href: true,
    className: 'link'
  },

  buttonLink: {
    id: 10,
    name: 'buttonLink',
    pattern: /\[{2}(.*?)\]{2}\{{2}(.*?)\}{2}/g,
    tag: 'a',
    href: true,
    className: 'link btn'
  },

  image: {
    id: 11,
    name: 'image',
    pattern: /\[{3}(.*?)\]{3}/g,
    tag: 'img',
    selfClosing: true,
    className: 'reference-image'
  },

  inlineCode: {
    id: 12,
    name: 'inlineCode',
    pattern: createMatchBetweenRegex('`{2}'),
    tag: 'code',
    className: 'code inline',
    symbol: '``'
  },

  blockCode: {
    id: 13,
    name: 'blockCode',
    pattern: createMatchBetweenRegex('`{3}'),
    tag: 'code',
    className: true,
    symbol: '```'
  },

  underline: {
    id: 14,
    name: 'underline',
    pattern: createMatchBetweenRegex('_{2}'),
    tag: 'u',
    symbol: '__'
  },

  lineBreak: {
    id: 15,
    name: 'lineBreak',
    pattern: /-{3}/g,
    tag: 'br',
    symbol: '---',
    selfClosing: true
  },

  blockquote: {
    id: 16,
    name: 'blockquote',
    pattern: createMatchBetweenRegex('\\^\\^'),
    tag: 'blockquote',
  }
}
let operatorNames = Object.keys(operators).reverse()

function constructHTML(currentOperator, extract, linkAddress){
  return  currentOperator.selfClosing ?
  `<${currentOperator.tag} ${linkAddress?`src="${linkAddress}"`:''}${linkAddress?`alt="techcolon_blogpost"`:''}${currentOperator.className?`class="${currentOperator.className}"`:''}/>`
  :
  `<${currentOperator.tag} ${currentOperator.className?`class="${currentOperator.className}"`:''} ${currentOperator.href?`href=${linkAddress}`:''}>${extract}</${currentOperator.tag}>`
}

function applyFormat(){
  operatorNames.forEach( operator => {
    let currentOperator = operators[operator]
    let matchesForCurrentOperatorIterator = blogPreviewBox.innerHTML.matchAll(currentOperator.pattern)
    if( matchesForCurrentOperatorIterator ){
      for (let matchesForCurrentOperator of matchesForCurrentOperatorIterator){
        let textPattern = matchesForCurrentOperator[0]
        let extract = matchesForCurrentOperator[1]
        let previewContent = blogPreviewBox.innerHTML.replace(textPattern, constructHTML(currentOperator, extract))
        if(currentOperator.id === 9 || currentOperator.id === 10){
          let linkAddress = matchesForCurrentOperator[1]
          extract = matchesForCurrentOperator[2]
          previewContent = blogPreviewBox.innerHTML.replace(textPattern, constructHTML(currentOperator, ( extract || linkAddress ), linkAddress))
        }

        if(currentOperator.id === 11){
          let linkAddress = matchesForCurrentOperator[1]
          previewContent = blogPreviewBox.innerHTML.replace(textPattern, constructHTML(currentOperator, null, linkAddress))
        }
        blogPreviewBox.innerHTML = previewContent
      }
    }
  })
}

// Editor ends Here //

let previewBox = document.getElementById('preview-box')
let closeIcon = document.getElementById('close-icon')
let previewButton = document.getElementById('preview-button')

previewButton.addEventListener('click', () => {
  render()
  previewBox.classList.add('active')
})

closeIcon.addEventListener('click', () => {
  previewBox.classList.remove('active')
})

/**
 ----    ---
    '   '    '
    '   '    '
    '---'    '
 */

//Helpers
function getDraftsFromLS(){
  let rawDrafts = localStorage.getItem('drafts')
  return rawDrafts ? JSON.parse(rawDrafts) : null
}

function setDraftsToLS(drafts){
  localStorage.setItem('drafts', JSON.stringify(drafts))
}

function save(){
  let id = window.location.search.split('=')[1]
  let content = blogContent.value
  let drafts = getDraftsFromLS()
  if(id){
    id = id.replace(/[^0-9]/, '')
    let currentWorkingDraft = drafts.filter( draft => draft._id === parseInt(id))
    if(currentWorkingDraft && currentWorkingDraft.length === 1){
      let oldDraft = currentWorkingDraft[0]
      let index = drafts.indexOf(oldDraft)
      oldDraft.content = content
      oldDraft.lastMod = Date.now()
      drafts.splice(index, 1, oldDraft)
      setDraftsToLS(drafts)
    } else {
      alert('This document does not exist')
    }
  } else {
    let docId = Math.ceil(Math.random() * (10**5))
    let docName = prompt('Enter a name for this draft')
    if(docName){
      let newDocument = {
        _id: docId,
        title: docName,
        content: content,
        lastMod: Date.now()
      }
      if(drafts){
        let newDrafts = drafts
        newDrafts.push(newDocument)
        setDraftsToLS(newDrafts)
      } else {
        setDraftsToLS([newDocument])
      }
      window.location.replace(window.location.href+'?id='+docId)
    }
  }
}

const saveButton = document.querySelector('#save-button')
saveButton.addEventListener('click', () => {
  save()
})

function copy(){
  new ClipboardJS('#copy-button')
}

copyButton.addEventListener('click', () => {
  render()
  copyButton.setAttribute('data-clipboard-text', blogContent.value)
  copy()
})

copyButton.addEventListener('dblclick', () => {
  render()
  copyButton.setAttribute('data-clipboard-target', previewBox.innerHTML)
  copy()
})

window.addEventListener('load', (e) => {
  let id = window.location.search.split('=')[1]
  if(id){
    let drafts = getDraftsFromLS()
    let currentWorkingDraft = drafts.filter( draft => draft._id === parseInt(id))
    if( currentWorkingDraft && currentWorkingDraft.length === 1 ){
      blogContent.value = currentWorkingDraft[0].content
      draftTitle.textContent = currentWorkingDraft[0].title
    }
    blogContent.addEventListener('input', () => {
      save()
    })
  }
})

// Components Documentation
/*

#(n) < Title > #(n)
** <bold text> **
~~ <italic text> ~~
__<underlined text>__
--<strikethrough>--
`` inline code ``
``` <Block size code> ```
[[link]]((Title)) -> Link
[[[src]]] -> Image
^^ Blockquote ^^
[[Link]]{{Title}} -> Button type link
--- Line break
*/
