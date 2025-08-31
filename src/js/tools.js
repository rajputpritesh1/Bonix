// Tools Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Load tools from JSON
    loadTools();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filter functionality
    setupFilters();
    
    // Setup newsletter form
    setupNewsletter();
});

// Load tools from JSON file
async function loadTools() {
    try {
        const response = await fetch('../data/tools.json');
        const toolsData = await response.json();
        displayTools(toolsData.tools);
    } catch (error) {
        console.error('Error loading tools:', error);
        document.getElementById('loading-indicator').innerHTML = 
            '<p>Error loading tools. Please try again later.</p>';
    }
}

// Display tools in the grid
function displayTools(tools) {
    const toolsContainer = document.getElementById('tools-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
    
    if (tools.length === 0) {
        document.getElementById('no-results').style.display = 'block';
        return;
    }
    
    // Clear previous results
    toolsContainer.innerHTML = '';
    
    // Create tool cards
    tools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolsContainer.appendChild(toolCard);
    });
}

// Create a tool card element
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.category = tool.category;
    card.dataset.status = tool.status;
    
    // Status badge
    const statusClass = tool.status === 'active' ? 'status-active' : 'status-coming-soon';
    const statusText = tool.status === 'active' ? 'Active' : 'Coming Soon';
    
    // Button based on status
    let buttonHtml = '';
    if (tool.status === 'active') {
        buttonHtml = `<a href="${tool.link}" class="btn btn-primary">Use Tool</a>`;
    } else {
        buttonHtml = `<button class="btn btn-outline btn-disabled" disabled>Coming Soon</button>`;
    }
    
    card.innerHTML = `
        <div class="tool-status ${statusClass}">${statusText}</div>
        <div class="tool-image">
            <img src="${tool.image}" alt="${tool.name}">
        </div>
        <div class="tool-content">
            <h3 class="tool-title">${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-meta">
                <span class="tool-category">${tool.category}</span>
                <div class="tool-actions">
                    ${buttonHtml}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('tool-search');
    
    searchInput.addEventListener('input', function() {
        filterTools();
    });
}

// Setup filter functionality
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tools
            filterTools();
        });
    });
}

// Filter tools based on search and active filter
function filterTools() {
    const searchTerm = document.getElementById('tool-search').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const toolCards = document.querySelectorAll('.tool-card');
    
    let visibleCount = 0;
    
    toolCards.forEach(card => {
        const toolName = card.querySelector('.tool-title').textContent.toLowerCase();
        const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
        const toolCategory = card.dataset.category;
        const toolStatus = card.dataset.status;
        
        const matchesSearch = toolName.includes(searchTerm) || toolDescription.includes(searchTerm);
        let matchesFilter = true;
        
        if (activeFilter === 'active') {
            matchesFilter = toolStatus === 'active';
        } else if (activeFilter === 'coming-soon') {
            matchesFilter = toolStatus === 'coming-soon';
        } else if (activeFilter !== 'all') {
            matchesFilter = toolCategory === activeFilter;
        }
        
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    const noResults = document.getElementById('no-results');
    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// Setup newsletter form
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, you would send this to a server
            alert('Thank you for subscribing! You will be notified about new tools.');
            this.reset();
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[09]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}