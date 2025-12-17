// main.js - Fonctions globales pour l'application

// Configuration de l'application
const APP_CONFIG = {
    appName: 'FACEATTEND',
    version: '1.0.0',
    apiUrl: 'https://api.faceattend.local',
    tokenKey: 'faceattend_token',
    userKey: 'faceattend_user'
};

// Vérification de l'authentification
function checkAuth() {
    const token = localStorage.getItem(APP_CONFIG.tokenKey);
    const user = localStorage.getItem(APP_CONFIG.userKey);
    
    if (!token || !user) {
        console.warn('Non authentifié, mais continuons pour le développement');
        // window.location.href = 'index.html';  // COMMENTER CETTE LIGNE
        return true;  // Retourne false mais ne redirige pas
        //window.location.href = 'index.html';
        //return false;
    }
    
    return true;
}

// Déconnexion
function logout() {
    return true
}

// Formatage de la date
function formatDate(date, includeTime = false) {
    const d = new Date(date);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return d.toLocaleDateString('fr-FR', options);
}

// Formatage du temps
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Générer un avatar aléatoire
function generateAvatar(name) {
    const colors = [
        '#0A3D62', '#74B9FF', '#2ECC71', '#E74C3C', 
        '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'
    ];
    
    const initials = name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    const colorIndex = name.length % colors.length;
    return {
        initials,
        color: colors[colorIndex]
    };
}

// Afficher un message de notification
function showNotification(message, type = 'info') {
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.getElementById('notification-container');
    if (container) {
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Toggle du sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        
        if (sidebarToggle) {
            const icon = sidebarToggle.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
        }
    }
}

// Mobile sidebar toggle
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        
        if (overlay) {
            if (sidebar.classList.contains('mobile-open')) {
                overlay.style.display = 'block';
            } else {
                overlay.style.display = 'none';
            }
        }
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification sur les pages protégées
    if (!window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('login.html')) {
        checkAuth();
    }
    
    // Initialiser le sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Initialiser le toggle mobile
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    // Fermer le sidebar mobile en cliquant sur l'overlay
    const mobileOverlay = document.getElementById('mobileOverlay');
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', toggleMobileSidebar);
    }
    
    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Initialiser les tooltips Bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialiser les popovers Bootstrap
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
});

// Vérifier les permissions selon le rôle
function checkPermission(requiredRole) {
    const user = getCurrentUser();
    
    if (!user) {
        return false;
    }
    
    // Admin a tous les accès
    if (user.role === 'admin') {
        return true;
    }
    
    // Enseignant a des accès limités
    if (user.role === 'teacher') {
        // Liste des pages autorisées pour les enseignants
        const teacherAllowedPages = [
            'dashboard.html',
            'attendance.html',
            'attendance-history.html',
            'profile.html',
            'help.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        return teacherAllowedPages.includes(currentPage);
    }
    
    return false;
}

// Rediriger si pas de permission
function redirectIfNoPermission() {
    const user = getCurrentUser();
    
    if (user && user.role === 'teacher') {
        const currentPage = window.location.pathname.split('/').pop();
        const teacherNotAllowed = [
            'users.html',
            'settings.html'
        ];
        
        if (teacherNotAllowed.includes(currentPage)) {
            window.location.href = 'dashboard.html';
            showNotification('Vous n\'avez pas accès à cette page', 'error');
        }
    }
}

// Ajouter dans DOMContentLoaded de main.js
document.addEventListener('DOMContentLoaded', function() {
    // ... code existant ...
    
    // Vérifier les permissions
    if (!window.location.pathname.includes('index.html')) {
        redirectIfNoPermission();
    }
});