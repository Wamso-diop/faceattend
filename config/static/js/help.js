// help.js - Gestion de la page d'aide

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les écouteurs d'événements
    initHelpEventListeners();
    
    // Initialiser la recherche
    initSearch();
});

// Initialiser les écouteurs d'événements
function initHelpEventListeners() {
    // Gestion du formulaire de support
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitSupportRequest();
        });
    }
    
    // Navigation vers les sections
    const helpLinks = document.querySelectorAll('.help-card a[href^="#"]');
    helpLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });
    
    // FAQ interactif
    initFAQ();
}

// Initialiser la recherche
function initSearch() {
    const searchInput = document.querySelector('.input-group-lg input');
    const searchBtn = document.querySelector('.input-group-lg .btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Effectuer une recherche
function performSearch() {
    const searchInput = document.querySelector('.input-group-lg input');
    const query = searchInput.value.trim();
    
    if (!query) {
        showNotification('Veuillez entrer un terme de recherche', 'warning');
        return;
    }
    
    // Simuler une recherche
    showNotification(`Recherche de "${query}" en cours...`, 'info');
    
    // Dans une application réelle, vous feriez une recherche dans la base de données
    setTimeout(() => {
        // Filtrer les FAQ basés sur la recherche
        const faqItems = document.querySelectorAll('.faq-item');
        let foundResults = false;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(query.toLowerCase()) || answer.includes(query.toLowerCase())) {
                item.style.display = 'block';
                foundResults = true;
                
                // Ouvrir la réponse
                const collapse = item.querySelector('.collapse');
                if (collapse) {
                    new bootstrap.Collapse(collapse, { toggle: true });
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        if (foundResults) {
            showNotification(`Résultats trouvés pour "${query}"`, 'success');
        } else {
            showNotification(`Aucun résultat pour "${query}"`, 'warning');
        }
    }, 1000);
}

// Initialiser la FAQ
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Animer l'icône
            if (isExpanded) {
                icon.className = 'fas fa-chevron-down';
            } else {
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
}

// Soumettre une demande de support
function submitSupportRequest() {
    const subject = document.getElementById('supportSubject').value;
    const description = document.getElementById('supportDescription').value;
    const priority = document.getElementById('supportPriority').value;
    const attachment = document.getElementById('supportAttachment').files[0];
    
    if (!subject || !description) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Préparer les données
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('priority', priority);
    
    if (attachment) {
        // Valider la taille du fichier
        if (attachment.size > 10 * 1024 * 1024) {
            showNotification('Le fichier est trop volumineux (max 10MB)', 'error');
            return;
        }
        formData.append('attachment', attachment);
    }
    
    // Simuler l'envoi
    showNotification('Envoi de votre demande en cours...', 'info');
    
    setTimeout(() => {
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactSupportModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        document.getElementById('supportForm').reset();
        
        // Afficher confirmation
        showNotification('Votre demande a été envoyée au support. Nous vous répondrons sous 24h.', 'success');
        
        // Log pour le développement
        console.log('Demande de support:', {
            subject,
            description,
            priority,
            attachment: attachment ? attachment.name : 'Aucun'
        });
    }, 1500);
}

// Faire défiler vers une section
function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Ajouter un effet visuel
        element.classList.add('highlight');
        setTimeout(() => {
            element.classList.remove('highlight');
        }, 2000);
    }
}

// Style pour le highlight
const style = document.createElement('style');
style.textContent = `
    .highlight {
        animation: highlight 2s ease;
    }
    
    @keyframes highlight {
        0% { background-color: rgba(10, 61, 98, 0.1); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(style);