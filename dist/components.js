function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  const navbarPath = document.currentScript.src.includes('dist') 
    ? 'navbar.html' 
    : 'dist/navbar.html';
  
  fetch(navbarPath)
    .then(response => response.text())
    .then(data => {
      navbarContainer.innerHTML = data;
      // Réinitialiser Alpine.js après l'insertion du DOM
      if (window.Alpine) {
        Alpine.destroyTree(navbarContainer);
        Alpine.initTree(navbarContainer);
      }
    })
    .catch(error => console.error('Erreur chargement navbar:', error));
}

function loadFooter() {
  const footerContainer = document.getElementById('footer-container');
  const footerPath = document.currentScript.src.includes('dist') 
    ? 'footer.html' 
    : 'dist/footer.html';
  
  fetch(footerPath)
    .then(response => response.text())
    .then(data => {
      footerContainer.innerHTML = data;
    })
    .catch(error => console.error('Erreur chargement footer:', error));
}
