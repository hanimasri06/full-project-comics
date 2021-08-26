const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    // Validate that variables exist
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav__menu')



const genrebtn = document.getElementById('comic');
const genreMenu = document.getElementById('drop__down');


genrebtn.addEventListener('mouseover', () => {
    genreMenu.classList.toggle('drop-down-show-menu')
})