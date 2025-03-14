// Funktion för att visa/dölja sidopanelen
function toggleSidebar() {
  try {
    const sidebar = document.querySelector('.sidebar'); // Ändra här till .sidebar
    if (sidebar) {
      sidebar.classList.toggle('open'); // Toggle på sidopanelen istället
      console.log('Sidopanelen har ändrats:', sidebar.classList.contains('open') ? 'öppnad' : 'stängd');
    } else {
      console.error('Sidopanelen hittades inte.');
    }
  } catch (error) {
    console.error('Fel vid toggling av sidopanel:', error);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  // Hämta hamburger-menyn och sidopanelen
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const sidebar = document.querySelector('.sidebar');

  if (hamburgerMenu && sidebar) {
    // Lägg till klicklyssnare på hamburger-menyn
    hamburgerMenu.addEventListener('click', function () {
      console.log('Hamburger-menyn klickades.');
      sidebar.classList.toggle('open'); // Toggla klass för att visa/dölja sidopanelen
      console.log('Sidopanelens status:', sidebar.classList.contains('open') ? 'Öppen' : 'Stängd');
    });
  } else {
    console.error('Hamburger-menyn eller sidopanelen hittades inte i DOM.');
  }
});

// Exempel på att öppna sidopanelen när en knapp klickas
document.querySelector('.hamburger-menu').addEventListener('click', function() {
  document.body.classList.toggle('sidebar-open');
  document.querySelector('.sidebar').classList.toggle('open');
});

// Kontrollera om sidopanelens innehåll finns
window.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebar) {
    console.log('Sidopanelen finns:', sidebar);
    const sidebarContent = sidebar.querySelector('ul'); // Kollar om sidopanelens lista finns
    if (sidebarContent) {
      console.log('Sidopanelens innehåll finns:', sidebarContent);
    } else {
      console.log('Sidopanelens innehåll saknas.');
    }
  } else {
    console.log('Sidopanelen saknas.');
  }
});