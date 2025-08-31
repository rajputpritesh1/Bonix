// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Load blog posts from JSON
    loadBlogPosts();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filter functionality
    setupFilters();
    
    // Setup pagination
    setupPagination();
    
    // Setup newsletter form
    setupNewsletter();
});

// Configuration
const POSTS_PER_PAGE = 6;
let currentPage = 1;
let allPosts = [];
let filteredPosts = [];

// Load blog posts from JSON file
async function loadBlogPosts() {
    try {
        const response = await fetch('./../data/blog.json');
        const blogData = await response.json();
        allPosts = blogData.posts;
        filteredPosts = [...allPosts];
        displayBlogPosts();
        updatePagination();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('loading-indicator').innerHTML = 
            '<p>Error loading blog posts. Please try again later.</p>';
    }
}

// Display blog posts
function displayBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    const loadingIndicator = document.getElementById('loading-indicator');
    const noResults = document.getElementById('no-results');
    
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
    
    if (filteredPosts.length === 0) {
        noResults.style.display = 'block';
        blogContainer.innerHTML = '';
        return;
    }
    
    // Hide no results message
    noResults.style.display = 'none';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    // Clear previous results
    blogContainer.innerHTML = '';
    
    // Create blog posts
    postsToShow.forEach(post => {
        const postElement = createBlogPost(post);
        blogContainer.appendChild(postElement);
    });
}

// Create a blog post element
function createBlogPost(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    article.dataset.category = post.category;
    
    // Format date
    const postDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    article.innerHTML = `
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span><i class="far fa-user"></i> ${post.author}</span>
                <span><i class="far fa-clock"></i> ${postDate}</span>
                <span><i class="far fa-comment"></i> ${post.comments} Comments</span>
            </div>
            <span class="post-category">${post.category}</span>
            <h2 class="post-title">${post.title}</h2>
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="${post.link}" class="post-read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
    `;
    
    return article;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('blog-search');
    
    searchInput.addEventListener('input', function() {
        filterPosts();
    });
}

// Setup filter functionality
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryLinks = document.querySelectorAll('.categories-list a');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            filterPosts();
        });
    });
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Update active state on filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');
            
            // Filter posts
            filterPosts();
        });
    });
}

// Filter posts based on search and active filter
function filterPosts() {
    const searchTerm = document.getElementById('blog-search').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                             post.excerpt.toLowerCase().includes(searchTerm) ||
                             post.content.toLowerCase().includes(searchTerm);
        
        const matchesFilter = activeFilter === 'all' || post.category === activeFilter;
        
        return matchesSearch && matchesFilter;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Update display
    displayBlogPosts();
    updatePagination();
}

// Setup pagination
function setupPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayBlogPosts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            displayBlogPosts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    // Update button states
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    
    // Generate page numbers
    paginationNumbers.innerHTML = '';
    
    // Show limited page numbers for mobile friendliness
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageNumber = document.createElement('button');
        pageNumber.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            displayBlogPosts();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        paginationNumbers.appendChild(pageNumber);
    }
}

// Setup newsletter form
function setupNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, you would send this to a server
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    });
}

// Email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}