function onEnabled({env, icon, name}, sendResponse) {
  if (chrome.runtime.lastError) {
    console.log('onEnabled', chrome.runtime.lastError.message)
  }
  const links = Array.from(document.querySelectorAll('link[rel*=icon]')).map(item => item.outerHTML)

  document.querySelectorAll('link[rel*=icon]').forEach(item => item.remove())

  const head = document.querySelector('head')
  const link = document.createElement('link');
  document.title = `${env} - ${name}`.toUpperCase()
  link.rel = 'icon';
  link.href = svgToDataUri({env, icon});
  link.className = 'icon-rel'
  head.appendChild(link)

  sendResponse(links)

  return true
}

function onDisabled(links) {
  if (chrome.runtime.lastError) {
    console.log('onDisabled', chrome.runtime.lastError.message)
  }
  document.querySelector('.icon-rel').remove()
  const head = document.querySelector('head')

  links.forEach(item => {
    head.insertAdjacentHTML('beforeend', item)
  })

  return true
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (chrome.runtime.lastError) {
    console.log('onMessage', chrome.runtime.lastError.message)
  }
  if (msg && msg.action && msg.action === EXTENSION_ENABLED) onEnabled(msg, sendResponse)
  if (msg && msg.action && msg.action === EXTENSION_DISABLED) onDisabled(msg.links)
})