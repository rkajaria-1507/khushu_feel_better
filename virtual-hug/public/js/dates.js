// dates.js - Interactive category switching for date ideas

function showCategory(categoryName) {
  // Hide all sections
  const sections = document.querySelectorAll('.date-ideas-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active class from all categories
  const categories = document.querySelectorAll('.category');
  categories.forEach(category => {
    category.classList.remove('active');
  });
  
  // Show selected section
  const selectedSection = document.getElementById(categoryName);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }
  
  // Add active class to selected category
  const selectedCategory = document.querySelector(`.category[onclick="showCategory('${categoryName}')"]`);
  if (selectedCategory) {
    selectedCategory.classList.add('active');
  }
  
  // Add a little animation effect
  const container = document.querySelector('.date-ideas-container');
  container.style.transform = 'scale(0.95)';
  container.style.opacity = '0.7';
  
  setTimeout(() => {
    container.style.transform = 'scale(1)';
    container.style.opacity = '1';
  }, 100);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to date ideas
  const dateIdeas = document.querySelectorAll('.date-idea');
  
  dateIdeas.forEach(idea => {
    idea.addEventListener('mouseenter', () => {
      // Add a subtle pulse effect to the icon
      const icon = idea.querySelector('.date-icon');
      icon.style.animation = 'pulse 0.6s ease-in-out';
      
      setTimeout(() => {
        icon.style.animation = '';
      }, 600);
    });
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4') {
      const categories = ['romantic', 'fun', 'creative', 'cozy'];
      const index = parseInt(e.key) - 1;
      if (categories[index]) {
        showCategory(categories[index]);
      }
    }
  });
});

// Add pulse animation for icons
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
