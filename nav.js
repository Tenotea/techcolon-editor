const menuIcon = document.querySelector('.menu')
const navCanvas = document.querySelector('.nav');
const closeMenu = document.querySelector('.close-menu');

menuIcon.addEventListener('click', () => {
	navCanvas.classList.remove('animate__backOutRight')
	navCanvas.classList.remove('closed-state')
	navCanvas.classList.add('animate__backInLeft');
})

closeMenu.addEventListener('click', () => {
	navCanvas.classList.remove('animate__backInLeft');
	navCanvas.classList.add('closed-state')
	navCanvas.classList.add('animate__backOutRight');
})

// Box shadow appear effect
const siteHeader = document.querySelector('header')

window.addEventListener('scroll', () => {
	if (window.scrollY > 200) {
		siteHeader.classList.add('box-shadow')
	} else {
		siteHeader.classList.remove('box-shadow')
	}
})

function getDraftsFromLS() {
	let rawDrafts = localStorage.getItem('drafts')
	return rawDrafts ? JSON.parse(rawDrafts) : null
}

function setDraftsToLS(drafts){
  localStorage.setItem('drafts', JSON.stringify(drafts))
}


function createDefaultDraft() {
	let drafts = getDraftsFromLS()
	if(!drafts){
let documentContent = `
~#1 Level 1 Heading ~#1

~#2 Level 2 Heading ~#2

~#3 Level 3 Heading ~#3

~#4 Level 4 Heading ~#4

~#5 Level 5 Heading ~#5

~#6 Level 6 Heading ~#6

---

**Bold**

---

__Underline__

---

~~Italic~~

---

---

\`\` inline code\`\`

---

\`\`\`Block Level Code\`\`\`
---

---

[[https://www.website.com]]((Text Link))
[[https://www.website.com]]{{Button Link}}

---

** Load image via URL - visit [[https://imgbb.co]]((Imgbb.co)) for free image upload **
[[[baby_groot_guardians_of_the_galaxy_vol_2_4k-3840x2160.jpg]]]

---

^^This a blockquote^^

`
		let docId = Math.ceil(Math.random() * (10**5))
		let newDocument = {
			_id: docId,
			title: 'Editor Syntax',
			content: documentContent,
			lastMod: Date.now()
		}
		setDraftsToLS([newDocument])
	}
}
createDefaultDraft()
