import './css/index.css'

/* VERSION TEMPORAIRE */
/*
  Le code que nous allons faire sera clairement différent, il s'agit juste d'un micro exemple pour vous permettre
  de tester les liens.
*/

const links = document.querySelectorAll('nav a')

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    document.querySelector('nav a.active').classList.remove('active')
    link.classList.add('active')

    document.querySelectorAll('section').forEach((section) => section.id == link.href.split('#')[1] ? section.classList.add('active') : section.classList.remove('active'))
  })
})
