// users.js - CRUD complet pour la gestion des utilisateurs

let currentUsers = [];
let currentUserId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Charger les utilisateurs
    loadUsers();
    
    // Initialiser les écouteurs d'événements
    initUsersEventListeners();
    
    // Initialiser la recherche
    initSearch();
});

// Charger la liste des utilisateurs
function loadUsers() {
    // Simuler un chargement depuis l'API
    setTimeout(() => {
        currentUsers = [
            {
                id: 1,
                firstName: 'Jean',
                lastName: 'Dupont',
                fullName: 'Jean Dupont',
                email: 'jean.dupont@universite.fr',
                phone: '+33 6 12 34 56 78',
                role: 'admin',
                department: 'informatique',
                lastLogin: '2023-10-15T10:30:00',
                isActive: true,
                createdAt: '2023-09-01',
                avatar: 'JD'
            },
            {
                id: 2,
                firstName: 'Marie',
                lastName: 'Martin',
                fullName: 'Marie Martin',
                email: 'marie.martin@universite.fr',
                phone: '+33 6 23 45 67 89',
                role: 'teacher',
                department: 'informatique',
                lastLogin: '2023-10-15T09:15:00',
                isActive: true,
                createdAt: '2023-09-01',
                avatar: 'MM'
            },
            {
                id: 3,
                firstName: 'Pierre',
                lastName: 'Durand',
                fullName: 'Pierre Durand',
                email: 'pierre.durand@universite.fr',
                phone: '+33 6 34 56 78 90',
                role: 'teacher',
                department: 'mathematiques',
                lastLogin: '2023-10-14T14:20:00',
                isActive: true,
                createdAt: '2023-09-05',
                avatar: 'PD'
            },
            {
                id: 4,
                firstName: 'Sophie',
                lastName: 'Leroy',
                fullName: 'Sophie Leroy',
                email: 'sophie.leroy@universite.fr',
                phone: '+33 6 45 67 89 01',
                role: 'teacher',
                department: 'physique',
                lastLogin: '2023-10-10T11:45:00',
                isActive: false,
                createdAt: '2023-09-10',
                avatar: 'SL'
            }
        ];
        
        renderUsersTable(currentUsers);
        updateUserStatistics(currentUsers);
    }, 1000);
}

// Rendre le tableau des utilisateurs
function renderUsersTable(users) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        const avatar = generateAvatar(user.fullName);
        const lastLogin = user.lastLogin ? formatDate(user.lastLogin, true) : 'Jamais';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar me-2" style="background-color: ${avatar.color}">
                        ${avatar.initials}
                    </div>
                    <div>
                        <div class="fw-bold">${user.fullName}</div>
                        <div class="text-muted small">Créé le: ${formatDate(user.createdAt)}</div>
                    </div>
                </div>
            </td>
            <td>
                <a href="mailto:${user.email}" class="text-decoration-none">${user.email}</a>
            </td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'bg-warning' : 'bg-info'}">
                    ${user.role === 'admin' ? 'Administrateur' : 'Enseignant'}
                </span>
                ${user.department ? `<br><small class="text-muted">${user.department}</small>` : ''}
            </td>
            <td>${user.phone || '--'}</td>
            <td>${lastLogin}</td>
            <td>
                <span class="status-badge ${user.isActive ? 'status-present' : 'status-absent'}">
                    ${user.isActive ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary"
                            data-bs-toggle="tooltip" title="Voir le profil"
                            onclick="viewUserProfile(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary"
                            data-bs-toggle="tooltip" title="Modifier"
                            onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-warning"
                            data-bs-toggle="tooltip" title="Réinitialiser mot de passe"
                            onclick="resetUserPassword(${user.id})">
                        <i class="fas fa-key"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger"
                            data-bs-toggle="tooltip" title="Supprimer"
                            onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Réinitialiser les tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Mettre à jour les statistiques des utilisateurs
function updateUserStatistics(users) {
    const totalUsers = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const inactiveUsers = users.filter(u => !u.isActive).length;
    
    // Mettre à jour l'affichage
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalUsers;
        statNumbers[1].textContent = admins;
        statNumbers[2].textContent = teachers;
        statNumbers[3].textContent = inactiveUsers;
    }
}

// Initialiser les écouteurs d'événements
function initUsersEventListeners() {
    // Gestion du formulaire d'ajout d'utilisateur
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createUser();
        });
    }
    
    // Gestion du formulaire de modification
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateUser();
        });
    }
    
    // Gestion du formulaire de réinitialisation de mot de passe
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmResetPassword();
        });
    }
    
    // Toggle des mots de passe
    const toggleUserPassword = document.getElementById('toggleUserPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    if (toggleUserPassword) {
        toggleUserPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('userPassword');
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('userConfirmPassword');
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    // Confirmation de suppression
    const confirmDeleteText = document.getElementById('confirmDeleteText');
    const confirmDeleteUserBtn = document.getElementById('confirmDeleteUserBtn');
    
    if (confirmDeleteText && confirmDeleteUserBtn) {
        confirmDeleteText.addEventListener('input', function() {
            confirmDeleteUserBtn.disabled = this.value !== 'SUPPRIMER';
        });
        
        confirmDeleteUserBtn.addEventListener('click', confirmDeleteUser);
    }
    
    // Réinitialiser les filtres
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('searchUsers').value = '';
            document.getElementById('filterRole').value = '';
            document.getElementById('filterStatus').value = '';
            applyFilters();
        });
    }
}

// Initialiser la recherche
function initSearch() {
    const searchInput = document.getElementById('searchUsers');
    const filterRole = document.getElementById('filterRole');
    const filterStatus = document.getElementById('filterStatus');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            applyFilters();
        }, 300));
    }
    
    if (filterRole) {
        filterRole.addEventListener('change', applyFilters);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', applyFilters);
    }
}

// Appliquer les filtres
function applyFilters() {
    const search = document.getElementById('searchUsers').value.toLowerCase();
    const role = document.getElementById('filterRole').value;
    const status = document.getElementById('filterStatus').value;
    
    let filteredUsers = [...currentUsers];
    
    // Filtre par recherche
    if (search) {
        filteredUsers = filteredUsers.filter(user => 
            user.fullName.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.phone?.toLowerCase().includes(search)
        );
    }
    
    // Filtre par rôle
    if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    // Filtre par statut
    if (status) {
        const isActive = status === 'active';
        filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
    }
    
    renderUsersTable(filteredUsers);
}

// Toggle de la visibilité du mot de passe
function togglePasswordVisibility(passwordInput, toggleButton) {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Créer un nouvel utilisateur
function createUser() {
    const userData = {
        firstName: document.getElementById('userFirstName').value,
        lastName: document.getElementById('userLastName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        role: document.getElementById('userRole').value,
        department: document.getElementById('userDepartment').value,
        password: document.getElementById('userPassword').value,
        confirmPassword: document.getElementById('userConfirmPassword').value,
        sendWelcomeEmail: document.getElementById('sendWelcomeEmail').checked
    };
    
    // Validation
    if (!userData.firstName || !userData.lastName || !userData.email || 
        !userData.role || !userData.password || !userData.confirmPassword) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    if (userData.password !== userData.confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (userData.password.length < 8) {
        showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return;
    }
    
    // Vérifier si l'email existe déjà
    const emailExists = currentUsers.some(user => user.email === userData.email);
    if (emailExists) {
        showNotification('Cet email est déjà utilisé par un autre utilisateur', 'error');
        return;
    }
    
    // Simuler la création
    showNotification('Création de l\'utilisateur en cours...', 'info');
    
    setTimeout(() => {
        // Créer l'ID
        const newId = Math.max(...currentUsers.map(u => u.id)) + 1;
        
        // Créer l'objet utilisateur
        const newUser = {
            id: newId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            fullName: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            department: userData.department,
            lastLogin: null,
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            avatar: userData.firstName[0] + userData.lastName[0]
        };
        
        // Ajouter à la liste
        currentUsers.push(newUser);
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        document.getElementById('userForm').reset();
        
        // Recharger la liste
        renderUsersTable(currentUsers);
        updateUserStatistics(currentUsers);
        
        // Simuler l'envoi d'email si demandé
        if (userData.sendWelcomeEmail) {
            console.log('Email de bienvenue envoyé à:', userData.email);
        }
        
        showNotification(`Utilisateur ${newUser.fullName} créé avec succès`, 'success');
    }, 1500);
}

// Voir le profil d'un utilisateur
function viewUserProfile(userId) {
    const user = currentUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Ouvrir une nouvelle page ou un modal détaillé
    // Pour l'exemple, on affiche une alerte
    const userDetails = `
        Nom: ${user.fullName}
        Email: ${user.email}
        Rôle: ${user.role === 'admin' ? 'Administrateur' : 'Enseignant'}
        Département: ${user.department || 'Non spécifié'}
        Téléphone: ${user.phone || 'Non spécifié'}
        Statut: ${user.isActive ? 'Actif' : 'Inactif'}
        Dernière connexion: ${user.lastLogin ? formatDate(user.lastLogin, true) : 'Jamais'}
        Date de création: ${formatDate(user.createdAt)}
    `;
    
    showNotification(`Profil de ${user.fullName}`, 'info');
    console.log('Détails utilisateur:', userDetails);
    
    // Dans une application réelle, vous ouvririez une page de profil détaillée
}

// Modifier un utilisateur
function editUser(userId) {
    currentUserId = userId;
    const user = currentUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Remplir le formulaire de modification
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editRole').value = user.role;
    document.getElementById('editDepartment').value = user.department || '';
    document.getElementById('editIsActive').checked = user.isActive;
    
    // Ouvrir le modal
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

// Mettre à jour un utilisateur
function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const userIndex = currentUsers.findIndex(u => u.id == userId);
    
    if (userIndex === -1) return;
    
    const updatedData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        role: document.getElementById('editRole').value,
        department: document.getElementById('editDepartment').value,
        isActive: document.getElementById('editIsActive').checked
    };
    
    // Validation
    if (!updatedData.firstName || !updatedData.lastName || !updatedData.email || !updatedData.role) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Vérifier si l'email existe déjà (pour un autre utilisateur)
    const emailExists = currentUsers.some((user, index) => 
        index !== userIndex && user.email === updatedData.email
    );
    
    if (emailExists) {
        showNotification('Cet email est déjà utilisé par un autre utilisateur', 'error');
        return;
    }
    
    // Mettre à jour l'utilisateur
    currentUsers[userIndex] = {
        ...currentUsers[userIndex],
        ...updatedData,
        fullName: `${updatedData.firstName} ${updatedData.lastName}`,
        avatar: updatedData.firstName[0] + updatedData.lastName[0]
    };
    
    // Fermer le modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    modal.hide();
    
    // Recharger la liste
    renderUsersTable(currentUsers);
    updateUserStatistics(currentUsers);
    
    showNotification('Utilisateur mis à jour avec succès', 'success');
}

// Réinitialiser le mot de passe d'un utilisateur
function resetUserPassword(userId) {
    currentUserId = userId;
    const user = currentUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Remplir les informations
    document.getElementById('resetUserId').value = user.id;
    document.getElementById('resetUserName').textContent = user.fullName;
    
    // Ouvrir le modal
    const modal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
    modal.show();
}

// Confirmer la réinitialisation du mot de passe
function confirmResetPassword() {
    const userId = document.getElementById('resetUserId').value;
    const user = currentUsers.find(u => u.id == userId);
    const forcePasswordChange = document.getElementById('forcePasswordChange').checked;
    
    if (!user) return;
    
    // Simuler la réinitialisation
    showNotification(`Réinitialisation du mot de passe pour ${user.fullName}...`, 'info');
    
    setTimeout(() => {
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        document.getElementById('resetPasswordForm').reset();
        
        // Simuler l'envoi d'email
        console.log(`Email de réinitialisation envoyé à: ${user.email}`);
        if (forcePasswordChange) {
            console.log('Changement de mot de passe forcé à la prochaine connexion');
        }
        
        showNotification(`Un email de réinitialisation a été envoyé à ${user.email}`, 'success');
    }, 1500);
}

// Supprimer un utilisateur
function deleteUser(userId) {
    currentUserId = userId;
    const user = currentUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Remplir les informations
    document.getElementById('deleteUserName').textContent = user.fullName;
    
    // Charger la liste des enseignants pour la réassignation
    loadTeachersForReassignment(userId);
    
    // Réinitialiser la confirmation
    document.getElementById('confirmDeleteText').value = '';
    document.getElementById('confirmDeleteUserBtn').disabled = true;
    
    // Ouvrir le modal
    const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    modal.show();
}

// Charger les enseignants pour la réassignation
function loadTeachersForReassignment(excludeUserId) {
    const selectElement = document.getElementById('reassignTo');
    if (!selectElement) return;
    
    // Filtrer les enseignants actifs (exclure l'utilisateur à supprimer)
    const teachers = currentUsers.filter(user => 
        user.role === 'teacher' && 
        user.isActive && 
        user.id !== excludeUserId
    );
    
    // Remplir les options
    selectElement.innerHTML = '<option value="">-- Sélectionner un enseignant --</option>';
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = `${teacher.fullName} (${teacher.email})`;
        selectElement.appendChild(option);
    });
}

// Confirmer la suppression d'un utilisateur
function confirmDeleteUser() {
    const userId = currentUserId;
    const reassignTo = document.getElementById('reassignTo').value;
    
    // Validation
    if (!reassignTo) {
        showNotification('Veuillez sélectionner un enseignant pour la réassignation', 'error');
        return;
    }
    
    const user = currentUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Simuler la suppression
    showNotification(`Suppression de ${user.fullName}...`, 'warning');
    
    setTimeout(() => {
        // Simuler la réassignation des cours
        if (user.role === 'teacher') {
            console.log(`Cours réassignés à l'enseignant ID: ${reassignTo}`);
        }
        
        // Supprimer l'utilisateur
        currentUsers = currentUsers.filter(u => u.id !== userId);
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        document.getElementById('reassignTo').innerHTML = '<option value="">-- Sélectionner un enseignant --</option>';
        
        // Recharger la liste
        renderUsersTable(currentUsers);
        updateUserStatistics(currentUsers);
        
        showNotification('Utilisateur supprimé avec succès', 'success');
    }, 2000);
}

// Fonction debounce pour la recherche
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}