// auth.js - Gestion de l'authentification

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('faceattend_token');
    if (token && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // Initialiser le formulaire de connexion
    initLoginForm();
    
    // Initialiser le toggle du mot de passe
    initPasswordToggle();
});

// Initialiser le formulaire de connexion
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Valider les champs
            if (!email || !password) {
                showLoginError('Veuillez remplir tous les champs');
                return;
            }
            
            // Simuler une requête d'authentification
            simulateLogin(email, password, rememberMe);
        });
    }
}

// Initialiser le toggle du mot de passe
function initPasswordToggle() {
    const togglePasswordBtn = document.getElementById('togglePassword');
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
}

// Simuler la connexion (dans une application réelle, cela ferait une requête API)
function simulateLogin(email, password, rememberMe) {
    // Afficher l'indicateur de chargement
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Connexion...';
    submitBtn.disabled = true;
    
    // Simuler un délai de requête
    setTimeout(() => {
        // Données de test
        const testUsers = [
            {
                email: 'admin@faceattend.com',
                password: 'admin123',
                user: {
                    id: 1,
                    email: 'admin@faceattend.com',
                    fullName: 'Jean Dupont',
                    role: 'admin',
                    avatar: 'JD'
                }
            },
            {
                email: 'prof@faceattend.com',
                password: 'prof123',
                user: {
                    id: 2,
                    email: 'prof@faceattend.com',
                    fullName: 'Marie Martin',
                    role: 'teacher',
                    avatar: 'MM'
                }
            }
        ];
        
        // Vérifier les identifiants
        const user = testUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Simuler un token JWT
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZmFjZWF0dGVuZC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTY5NzA0MDAsImV4cCI6MTYxNjk3MjIwMH0.4R_MFkGm0RjFQ6Q7Qw8XvJ8Qw8XvJ8Qw8XvJ8Qw8XvJ8';
            
            // Stocker le token et les informations utilisateur
            localStorage.setItem('faceattend_token', token);
            localStorage.setItem('faceattend_user', JSON.stringify(user.user));
            
            // Rediriger vers le tableau de bord
            window.location.href = 'dashboard.html';
        } else {
            // Afficher une erreur
            showLoginError('Email ou mot de passe incorrect');
            
            // Réactiver le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// Afficher une erreur de connexion
function showLoginError(message) {
    const errorAlert = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
        
        // Masquer l'erreur après 5 secondes
        setTimeout(() => {
            errorAlert.classList.add('d-none');
        }, 5000);
    }
}

// Simuler la vérification du token (pour les pages protégées)
function verifyToken() {
    const token = localStorage.getItem('faceattend_token');
    
    if (!token) {
        return false;
    }
    
    // Dans une application réelle, vous vérifieriez le token avec le serveur
    // Pour cette simulation, nous vérifions simplement s'il existe
    return true;
}

// Récupérer les informations de l'utilisateur connecté
function getCurrentUser() {
    const userStr = localStorage.getItem('faceattend_user');
    
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Erreur de parsing des données utilisateur:', e);
            return null;
        }
    }
    
    return null;
}