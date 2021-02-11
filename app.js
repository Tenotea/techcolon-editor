const sortByTime = document.querySelector('.sort-by-time')
const sortAtoZ = document.querySelector('.sort-a-to-z')
const container = document.querySelector('.container')
const numberOfDocs = document.getElementById('number-of-docs')
let refreshEvent = new Event('refresh')

function createCardTitle(title){
  let titleElement = document.createElement('h1')
  titleElement.className = 'title'
  titleElement.textContent = title
  return titleElement
}

function createCardLastModified(timeString){
  let lastModElement = document.createElement('p')
  lastModElement.className = 'last-modified code inline'
  lastModElement.textContent = `Last mod: ${timeString} ago`
  return lastModElement
}

function createOpen(id) {
  let button = document.createElement('a')
  button.href = `/editor.html?id=${id}`
  button.id = 'save-button'
  button.innerHTML = '<i class="material-icons"> create </i> Open'
  return button
}

function createDelete(id) {
  let button = document.createElement('button')
  button.id = 'copy-button'
  button.className = 'delete-doc'
  button.innerHTML = '<i class="material-icons"> delete </i> Delete'
  button.setAttribute('doc', id)
  return button
}

function createDetails(title, timeString) {
  let detailsContainer = document.createElement('div')
  detailsContainer.className = 'details'
  detailsContainer.append(
  createCardTitle(title),
  createCardLastModified(timeString)
  )
  return detailsContainer
}

function createActions(id) {
let actionsContainer = document.createElement('div')
actionsContainer.className = 'actions'
actionsContainer.append(
  createOpen(id),
  createDelete(id)
  )
  return actionsContainer
}

function createCard(id, title, lastModified) {
  let card = document.createElement('div')
  card.className = 'card'
  card.append(
  createDetails(title, lastModified),
  createActions(id)
  )
  return card
}

function getDraftsFromLS(){
  let rawDrafts = localStorage.getItem('drafts')
  return rawDrafts ? JSON.parse(rawDrafts) : null
}

function clearContainer(){
  container.innerHTML = ''
}

function fetchDrafts(sort) {
  clearContainer()
  let allDrafts = getDraftsFromLS()
  if ( allDrafts && allDrafts.length > 0 ) {
    numberOfDocs.textContent = allDrafts.length
    switch (sort) {
      case 'time':
        allDrafts = allDrafts.sort( (a, b) => a.lastMod > b.lastMod ? -1 : 1)
        break;
      case 'rev-time':
        allDrafts = allDrafts.sort( (a, b) => a.lastMod > b.lastMod ? 1 : -1)
        break;
      case 'atoz':
        allDrafts = allDrafts.sort( (a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
        break;
      case 'rev-atoz':
        allDrafts = allDrafts.sort( (a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1)
        break;
      default:
        allDrafts = allDrafts.sort( (a, b) => a.lastMod > b.lastMod ? -1 : 1)
        break;
    }
    allDrafts.forEach( draft => {
      let timePassedInSeconds = Math.floor((Date.now() - draft.lastMod)/1000)
      let timePassedInMinutes = Math.floor(timePassedInSeconds/60)
      let secondsPassedAfterMinutes = timePassedInSeconds - (timePassedInMinutes*60)
      let timeString = `${timePassedInMinutes < 10 ? `0${timePassedInMinutes}`: timePassedInMinutes}m ${secondsPassedAfterMinutes < 10 ? `0${secondsPassedAfterMinutes}`: secondsPassedAfterMinutes}s`

      if(timePassedInMinutes > 60){
        let timePassedInHours = Math.floor(timePassedInMinutes/60)
        let minutesPassedAfterHours = timePassedInMinutes - (timePassedInHours * 60)
        timeString = `${timePassedInHours < 10 ? `0${timePassedInHours}`: timePassedInHours}h ${minutesPassedAfterHours < 10 ? `0${minutesPassedAfterHours}`: minutesPassedAfterHours}m`

        if( timePassedInHours > 24 ){
          let timePassedInDays = Math.floor(timePassedInHours/24)
          let hoursPassedAfterDay = timePassedInHours - (timePassedInDays * 24)
          timeString = `${timePassedInDays}d ${hoursPassedAfterDay}h`

          if(timePassedInDays > 7){
            let timePassedInWeeks = Math.floor(timePassedInDays/7)
            let daysPassedAfterWeek = timePassedInDays - (timePassedInWeeks * 7)
            timeString = `${timePassedInWeeks}w ${daysPassedAfterWeek}d`

            if(timePassedInWeeks > 4){
              let timePassedInMonths = Math.floor(timePassedInWeeks/4)
              timeString = `${timePassedInMonths}${timePassedInMonths > 1 ? 'months' : 'month'}`

              if(timePassedInMonths > 12){
                let timePassedInYears = Math.floor(timePassedInMonths/12)
                timeString = `${timePassedInYears}${timePassedInYears > 1 ? 'years' : 'year'}`
              }
            }
          }
        }
      }

      container.appendChild(
        createCard(draft._id, draft.title, timeString)
      )
    })
  } else {
    container.innerHTML = '<h1 class="no-drafts-message"> Docs Appear here </h1>'
  }
}

function deleteDocument(){
  const deleteButtons = document.querySelectorAll('.delete-doc')
  deleteButtons.forEach( button => {
    button.addEventListener('click', function(){
      let confirmedDelete = confirm('Are you sure you want to delete this draft?')
      if(confirmedDelete){
        let drafts = getDraftsFromLS()
        if(drafts){
          let id = this.attributes.doc.value
          let draftsToKeep = drafts.filter( draft => draft._id !== parseInt(id))
          localStorage.setItem('drafts', JSON.stringify(draftsToKeep))
          dispatchEvent(refreshEvent)
        }
      }
    })
  })
}

sortByTime.addEventListener('click', () => {
  refreshEvent.sort = 'time'
  dispatchEvent(refreshEvent)
})

sortByTime.addEventListener('dblclick', () => {
  refreshEvent.sort = 'rev-time'
  dispatchEvent(refreshEvent)
})

sortAtoZ.addEventListener('click', () => {
  refreshEvent.sort = 'atoz'
  dispatchEvent(refreshEvent)
})

sortAtoZ.addEventListener('dblclick', () => {
  refreshEvent.sort = 'rev-atoz'
  dispatchEvent(refreshEvent)
})

window.addEventListener('load', () => {
  dispatchEvent(refreshEvent)
})

window.addEventListener('refresh', (e) => {
  fetchDrafts(e.sort)
  deleteDocument()
})
