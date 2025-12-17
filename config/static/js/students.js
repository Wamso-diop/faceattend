// students.js - Fonctions pour la gestion des étudiants

document.addEventListener('DOMContentLoaded', function() {
    // Charger les étudiants
    loadStudents();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Initialiser la recherche
    initSearch();
});



// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Gestion de la caméra pour l'ajout d'étudiant
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const studentCamera = document.getElementById('studentCamera');
    const studentCanvas = document.getElementById('studentCanvas');
    
    if (startCameraBtn && studentCamera) {
        startCameraBtn.addEventListener('click', async function() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        facingMode: 'user',
                        width: { ideal: 640 },
                        height: { ideal: 480 }
                    },
                    audio: false
                });
                
                studentCamera.srcObject = stream;
                capturePhotoBtn.disabled = false;
                startCameraBtn.disabled = true;
                
                showNotification('Caméra démarrée avec succès', 'success');
            } catch (error) {
                console.error('Erreur de la caméra:', error);
                showNotification('Impossible d\'accéder à la caméra', 'error');
            }
        });
    }
    
    if (capturePhotoBtn && studentCamera && studentCanvas) {
        capturePhotoBtn.addEventListener('click', function() {
            const context = studentCanvas.getContext('2d');
            studentCanvas.width = studentCamera.videoWidth;
            studentCanvas.height = studentCamera.videoHeight;
            context.drawImage(studentCamera, 0, 0, studentCanvas.width, studentCanvas.height);
            
            // Afficher la prévisualisation
            const photoData = studentCanvas.toDataURL('image/png');
            const photoPreview = document.getElementById('photoPreview');
            
            if (photoPreview) {
                photoPreview.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        Photo capturée avec succès
                        <div class="mt-2">
                            <img src="${photoData}" class="img-thumbnail" style="max-width: 200px;">
                        </div>
                    </div>
                `;
            }
            
            showNotification('Photo capturée avec succès', 'success');
        });
    }
    
    // Gestion du formulaire d'ajout d'étudiant
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                studentNumber: document.getElementById('studentNumber').value,
                email: document.getElementById('email').value,
                program: document.getElementById('program').value,
                yearLevel: document.getElementById('yearLevel').value
            };
            
            // Ici, vous enverriez les données à l'API
            console.log('Données de l\'étudiant:', formData);
            
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
            modal.hide();
            
            // Réinitialiser le formulaire
            studentForm.reset();
            
            // Recharger la liste des étudiants
            loadStudents();
            
            showNotification('Étudiant ajouté avec succès', 'success');
        });
    }
    
    // Réinitialiser les filtres
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('searchStudents').value = '';
            document.getElementById('filterProgram').value = '';
            document.getElementById('filterYear').value = '';
            
            // Recharger tous les étudiants
            loadStudents();
        });
    }
}

// Initialiser la recherche
function initSearch() {
    const searchInput = document.getElementById('searchStudents');
    const filterProgram = document.getElementById('filterProgram');
    const filterYear = document.getElementById('filterYear');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterStudents();
        }, 300));
    }
    
    if (filterProgram) {
        filterProgram.addEventListener('change', filterStudents);
    }
    
    if (filterYear) {
        filterYear.addEventListener('change', filterStudents);
    }
}

// Filtrer les étudiants
function filterStudents() {
    // Cette fonction filtrerait les étudiants en fonction des critères
    // Dans une application réelle, cela ferait une requête API
    console.log('Filtrage des étudiants');
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

// Voir les détails d'un étudiant
function viewStudent(studentId) {
    // Rediriger vers la page de profil de l'étudiant
    window.location.href = `student-profile.html?id=${studentId}`;
}

// Modifier un étudiant
function editStudent(studentId) {
    // Ouvrir le modal de modification
    console.log('Modification de l\'étudiant:', studentId);
    
    // Dans une application réelle, vous chargeriez les données de l'étudiant
    // et les afficheriez dans un formulaire de modification
}

// Supprimer un étudiant
function deleteStudent(studentId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        // Ici, vous feriez une requête DELETE à l'API
        console.log('Suppression de l\'étudiant:', studentId);
        
        showNotification('Étudiant supprimé avec succès', 'success');
        
        // Recharger la liste
        loadStudents();
    }
}