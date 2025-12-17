// profile.js - Gestion du profil utilisateur

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les écouteurs d'événements
    initProfileEventListeners();
    
    // Charger les données du profil
    loadProfileData();
});

// Initialiser les écouteurs d'événements
function initProfileEventListeners() {
    // Gestion des formulaires
    const profileInfoForm = document.getElementById('profileInfoForm');
    if (profileInfoForm) {
        profileInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileInfo();
        });
    }
    
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
    
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePreferences();
        });
    }
    
    // Toggle 2FA
    const enable2FA = document.getElementById('enable2FA');
    if (enable2FA) {
        enable2FA.addEventListener('change', function() {
            const setup2FA = document.getElementById('2faSetup');
            if (this.checked) {
                setup2FA.classList.remove('d-none');
            } else {
                setup2FA.classList.add('d-none');
            }
        });
    }
    
    // Upload d'avatar
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            uploadAvatar(e.target.files[0]);
        });
    }
    
    // Suppression de compte
    const confirmDelete = document.getElementById('confirmDelete');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    if (confirmDelete && confirmDeleteBtn) {
        confirmDelete.addEventListener('input', function() {
            confirmDeleteBtn.disabled = this.value !== 'SUPPRIMER';
        });
        
        confirmDeleteBtn.addEventListener('click', deleteAccount);
    }
    
    // Déconnexion des sessions
    const logoutButtons = document.querySelectorAll('.list-group-item .btn-outline-danger');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionDevice = this.closest('.list-group-item').querySelector('strong').textContent;
            logoutSession(sessionDevice);
        });
    });
}

// Charger les données du profil
function loadProfileData() {
    // Simuler le chargement depuis l'API
    setTimeout(() => {
        // Informations de base
        const userData = {
            firstName: localStorage.getItem('userFirstName') || 'Jean',
            lastName: localStorage.getItem('userLastName') || 'Dupont',
            email: localStorage.getItem('userEmail') || 'jean.dupont@universite.fr',
            phone: localStorage.getItem('userPhone') || '+33 6 12 34 56 78',
            department: localStorage.getItem('userDepartment') || 'info',
            bio: localStorage.getItem('userBio') || 'Administrateur du système FACEATTEND...'
        };
        
        // Mettre à jour les champs du formulaire
        Object.keys(userData).forEach(key => {
            const element = document.getElementById(`profile${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (element) {
                element.value = userData[key];
            }
        });
        
        // Préférences
        document.getElementById('uiTheme').value = localStorage.getItem('uiTheme') || 'light';
        document.getElementById('uiDensity').value = localStorage.getItem('uiDensity') || 'compact';
        document.getElementById('notifyEmailUpdates').checked = localStorage.getItem('notifyEmailUpdates') !== 'false';
        document.getElementById('notifyWeeklyReports').checked = localStorage.getItem('notifyWeeklyReports') !== 'false';
        document.getElementById('notifySystemAlerts').checked = localStorage.getItem('notifySystemAlerts') === 'true';
        document.getElementById('userLanguage').value = localStorage.getItem('userLanguage') || 'fr';
        document.getElementById('userTimeZone').value = localStorage.getItem('userTimeZone') || 'Europe/Paris';
        
        showNotification('Profil chargé avec succès', 'success');
    }, 500);
}

// Sauvegarder les informations du profil
function saveProfileInfo() {
    const profileData = {
        firstName: document.getElementById('profileFirstName').value,
        lastName: document.getElementById('profileLastName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        department: document.getElementById('profileDepartment').value,
        bio: document.getElementById('profileBio').value
    };
    
    // Valider les données
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Sauvegarder dans le localStorage
    Object.keys(profileData).forEach(key => {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, profileData[key]);
    });
    
    // Mettre à jour l'affichage
    document.querySelector('.user-avatar-lg').textContent = 
        profileData.firstName[0] + profileData.lastName[0];
    document.querySelector('h4.mb-1').textContent = 
        `${profileData.firstName} ${profileData.lastName}`;
    
    showNotification('Profil mis à jour avec succès', 'success');
}

// Changer le mot de passe
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    // Valider la complexité du mot de passe
    if (newPassword.length < 8) {
        showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return;
    }
    
    // Simuler la mise à jour
    setTimeout(() => {
        document.getElementById('passwordChangeForm').reset();
        showNotification('Mot de passe changé avec succès', 'success');
    }, 1500);
}

// Sauvegarder les préférences
function savePreferences() {
    const preferences = {
        uiTheme: document.getElementById('uiTheme').value,
        uiDensity: document.getElementById('uiDensity').value,
        notifyEmailUpdates: document.getElementById('notifyEmailUpdates').checked,
        notifyWeeklyReports: document.getElementById('notifyWeeklyReports').checked,
        notifySystemAlerts: document.getElementById('notifySystemAlerts').checked,
        userLanguage: document.getElementById('userLanguage').value,
        userTimeZone: document.getElementById('userTimeZone').value
    };
    
    // Sauvegarder dans le localStorage
    Object.keys(preferences).forEach(key => {
        localStorage.setItem(key, preferences[key]);
    });
    
    showNotification('Préférences sauvegardées avec succès', 'success');
}

// Uploader un avatar
function uploadAvatar(file) {
    if (!file) return;
    
    // Valider le type de fichier
    if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image', 'error');
        return;
    }
    
    // Valider la taille
    if (file.size > 5 * 1024 * 1024) { // 5MB
        showNotification('L\'image est trop volumineuse (max 5MB)', 'error');
        return;
    }
    
    // Simuler l'upload
    showNotification('Téléchargement de l\'avatar...', 'info');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Créer une version miniature
        const img = new Image();
        img.onload = function() {
            // Créer un canvas pour redimensionner
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 150;
            canvas.height = 150;
            
            // Dessiner l'image redimensionnée
            ctx.drawImage(img, 0, 0, 150, 150);
            
            // Mettre à jour l'avatar
            const avatarUrl = canvas.toDataURL('image/jpeg');
            const avatarElement = document.querySelector('.user-avatar-lg');
            
            // Changer le texte par une image
            avatarElement.innerHTML = `<img src="${avatarUrl}" class="rounded-circle" 
                                         style="width: 100%; height: 100%; object-fit: cover;">`;
            
            // Sauvegarder dans le localStorage
            localStorage.setItem('userAvatar', avatarUrl);
            
            showNotification('Avatar mis à jour avec succès', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Déconnecter une session
function logoutSession(deviceName) {
    if (confirm(`Déconnecter "${deviceName}" ?`)) {
        // Ici, vous feriez une requête API
        showNotification(`Session "${deviceName}" déconnectée`, 'success');
        
        // Retirer l'élément de la liste
        const listItem = document.querySelector(`.list-group-item:contains("${deviceName}")`);
        if (listItem) {
            listItem.remove();
        }
    }
}

// Supprimer le compte
function deleteAccount() {
    // Ici, vous feriez une requête API pour supprimer le compte
    showNotification('Compte en cours de suppression...', 'warning');
    
    setTimeout(() => {
        // Déconnexion et redirection
        logout();
        showNotification('Compte supprimé avec succès', 'success');
    }, 2000);
}