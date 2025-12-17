// courses.js - Gestion des cours

document.addEventListener('DOMContentLoaded', function() {
    // Charger les cours
    loadCourses();
    
    // Initialiser les écouteurs d'événements
    initCoursesEventListeners();
    
    // Initialiser le toggle de vue
    initViewToggle();
});

// Charger la liste des cours
function loadCourses() {
    // Simuler un chargement depuis l'API
    setTimeout(() => {
        const courses = [
            {
                id: 1,
                code: 'IA101',
                name: 'Intelligence Artificielle',
                teacher: 'Jean Dupont',
                teacherId: 1,
                schedule: {
                    day: 'Lundi, Mercredi',
                    time: '10:30-12:30'
                },
                room: 'Salle A12',
                students: 35,
                attendanceRate: 94,
                status: 'active',
                description: 'Cours avancé d\'IA et machine learning'
            },
            {
                id: 2,
                code: 'BDD202',
                name: 'Base de données',
                teacher: 'Marie Martin',
                teacherId: 2,
                schedule: {
                    day: 'Mardi, Jeudi',
                    time: '14:00-16:00'
                },
                room: 'Salle B07',
                students: 28,
                attendanceRate: 92,
                status: 'active',
                description: 'Conception et gestion de bases de données'
            },
            {
                id: 3,
                code: 'RES303',
                name: 'Réseaux informatiques',
                teacher: 'Pierre Durand',
                teacherId: 3,
                schedule: {
                    day: 'Vendredi',
                    time: '09:00-12:00'
                },
                room: 'Salle C03',
                students: 42,
                attendanceRate: 96,
                status: 'active',
                description: 'Principes des réseaux et protocoles de communication'
            }
        ];
        
        renderCoursesTable(courses);
        updateStatistics(courses);
    }, 1000);
}

// Rendre le tableau des cours
function renderCoursesTable(courses) {
    const tbody = document.querySelector('#coursesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const statusClass = course.status === 'active' ? 'status-present' : 
                           course.status === 'completed' ? 'status-absent' : 'status-late';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div>
                    <div class="fw-bold">${course.code} - ${course.name}</div>
                    <small class="text-muted">${course.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>${course.teacher}</td>
            <td>
                <div class="fw-bold">${course.schedule.day}</div>
                <small class="text-muted">${course.schedule.time}</small>
            </td>
            <td>${course.room}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1 me-2" style="height: 6px;">
                        <div class="progress-bar bg-success" style="width: ${course.attendanceRate}%"></div>
                    </div>
                    <span>${course.students}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${course.status === 'active' ? 'Actif' : 
                      course.status === 'completed' ? 'Terminé' : 'Inactif'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary"
                            onclick="viewCourseDetails(${course.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary"
                            onclick="editCourse(${course.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger"
                            onclick="deleteCourse(${course.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Mettre à jour les statistiques
function updateStatistics(courses) {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === 'active').length;
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    
    // Mettre à jour l'affichage des statistiques
    document.querySelectorAll('.stat-number')[0].textContent = activeCourses;
    document.querySelectorAll('.stat-number')[3].textContent = 
        new Set(courses.map(c => c.room)).size;
    
    // Calculer les cours d'aujourd'hui
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayCourses = courses.filter(c => 
        c.schedule.day.toLowerCase().includes(today.toLowerCase())
    ).length;
    
    document.querySelectorAll('.stat-number')[2].textContent = todayCourses;
}

// Initialiser les écouteurs d'événements
function initCoursesEventListeners() {
    // Gestion du formulaire de création de cours
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createCourse();
        });
    }
    
    // Filtres
    const searchInput = document.getElementById('searchCourses');
    const filterTeacher = document.getElementById('filterTeacher');
    const filterDay = document.getElementById('filterDay');
    const filterStatus = document.getElementById('filterStatus');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyCourseFilters, 300));
    }
    
    if (filterTeacher) {
        filterTeacher.addEventListener('change', applyCourseFilters);
    }
    
    if (filterDay) {
        filterDay.addEventListener('change', applyCourseFilters);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', applyCourseFilters);
    }
    
    // Toggle calendrier
    const toggleCalendarBtn = document.getElementById('toggleCalendar');
    if (toggleCalendarBtn) {
        toggleCalendarBtn.addEventListener('click', function() {
            // Ici, vous initialiseriez un calendrier interactif
            showNotification('Fonctionnalité calendrier en développement', 'info');
        });
    }
}

// Initialiser le toggle de vue
function initViewToggle() {
    const viewButtons = document.querySelectorAll('[data-view]');
    const calendarView = document.getElementById('calendarView');
    const listView = document.getElementById('listView');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Mettre à jour les boutons actifs
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            
            if (view === 'calendar') {
                calendarView.classList.remove('d-none');
                listView.classList.add('d-none');
            } else {
                calendarView.classList.add('d-none');
                listView.classList.remove('d-none');
            }
        });
    });
}

// Créer un nouveau cours
function createCourse() {
    const courseData = {
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseName').value,
        teacher: document.getElementById('courseTeacher').value,
        room: document.getElementById('courseRoom').value,
        day: document.getElementById('courseDay').value,
        time: document.getElementById('courseTime').value,
        duration: document.getElementById('courseDuration').value,
        maxStudents: document.getElementById('courseMaxStudents').value,
        description: document.getElementById('courseDescription').value
    };
    
    // Validation
    if (!courseData.code || !courseData.name || !courseData.teacher || 
        !courseData.day || !courseData.time) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Simuler la création
    showNotification('Création du cours en cours...', 'info');
    
    setTimeout(() => {
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        document.getElementById('courseForm').reset();
        
        // Recharger la liste
        loadCourses();
        
        showNotification(`Cours "${courseData.code}" créé avec succès`, 'success');
    }, 1500);
}

// Appliquer les filtres de cours
function applyCourseFilters() {
    const search = document.getElementById('searchCourses').value.toLowerCase();
    const teacher = document.getElementById('filterTeacher').value;
    const day = document.getElementById('filterDay').value;
    const status = document.getElementById('filterStatus').value;
    
    // Ici, vous feriez une requête API filtrée
    console.log('Filtres appliqués:', { search, teacher, day, status });
    
    // Pour l'exemple, on simule juste
    loadCourses();
}

// Voir les détails d'un cours
function viewCourseDetails(courseId) {
    const modal = new bootstrap.Modal(document.getElementById('courseDetailsModal'));
    
    // Simuler le chargement des détails
    setTimeout(() => {
        const course = {
            id: courseId,
            code: 'IA101',
            name: 'Intelligence Artificielle',
            teacher: 'Jean Dupont',
            room: 'Salle A12',
            schedule: 'Lundi, Mercredi 10:30-12:30',
            duration: '2 heures',
            maxStudents: 40,
            currentStudents: 35,
            attendanceRate: 94,
            description: 'Cours avancé d\'IA et machine learning couvrant les algorithmes de classification, réseaux de neurones, et applications pratiques.',
            createdAt: '2023-09-15',
            status: 'active'
        };
        
        const content = document.getElementById('courseDetailsContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <h4>${course.code} - ${course.name}</h4>
                    <p class="text-muted">${course.description}</p>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h6>Informations</h6>
                            <dl class="row">
                                <dt class="col-sm-4">Enseignant</dt>
                                <dd class="col-sm-8">${course.teacher}</dd>
                                
                                <dt class="col-sm-4">Salle</dt>
                                <dd class="col-sm-8">${course.room}</dd>
                                
                                <dt class="col-sm-4">Horaire</dt>
                                <dd class="col-sm-8">${course.schedule}</dd>
                                
                                <dt class="col-sm-4">Durée</dt>
                                <dd class="col-sm-8">${course.duration}</dd>
                            </dl>
                        </div>
                        <div class="col-md-6">
                            <h6>Statistiques</h6>
                            <dl class="row">
                                <dt class="col-sm-6">Étudiants inscrits</dt>
                                <dd class="col-sm-6">${course.currentStudents}/${course.maxStudents}</dd>
                                
                                <dt class="col-sm-6">Taux de présence</dt>
                                <dd class="col-sm-6">
                                    <div class="d-flex align-items-center">
                                        <div class="progress flex-grow-1 me-2" style="height: 6px;">
                                            <div class="progress-bar bg-success" style="width: ${course.attendanceRate}%"></div>
                                        </div>
                                        <span>${course.attendanceRate}%</span>
                                    </div>
                                </dd>
                                
                                <dt class="col-sm-6">Date de création</dt>
                                <dd class="col-sm-6">${formatDate(course.createdAt)}</dd>
                                
                                <dt class="col-sm-6">Statut</dt>
                                <dd class="col-sm-6">
                                    <span class="badge bg-success">${course.status === 'active' ? 'Actif' : 'Inactif'}</span>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">Actions rapides</h6>
                        </div>
                        <div class="card-body">
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" onclick="startAttendanceForCourse(${courseId})">
                                    <i class="fas fa-camera me-2"></i>Prendre la présence
                                </button>
                                <button class="btn btn-outline-primary" onclick="viewCourseStudents(${courseId})">
                                    <i class="fas fa-users me-2"></i>Voir les étudiants
                                </button>
                                <button class="btn btn-outline-secondary" onclick="viewCourseAttendance(${courseId})">
                                    <i class="fas fa-history me-2"></i>Historique des présences
                                </button>
                                <button class="btn btn-outline-warning" onclick="editCourse(${courseId})">
                                    <i class="fas fa-edit me-2"></i>Modifier le cours
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mt-3">
                        <div class="card-header">
                            <h6 class="card-title mb-0">Prochaine session</h6>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-calendar-day me-2"></i>
                                <strong>Lundi prochain</strong><br>
                                10:30 - 12:30<br>
                                Salle A12
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <h6>Étudiants récemment présents</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Étudiant</th>
                                    <th>Présences</th>
                                    <th>Absences</th>
                                    <th>Taux</th>
                                    <th>Dernière présence</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Marie Dubois</td>
                                    <td>12</td>
                                    <td>0</td>
                                    <td>100%</td>
                                    <td>15 Oct 2023</td>
                                </tr>
                                <tr>
                                    <td>Paul Leroy</td>
                                    <td>11</td>
                                    <td>1</td>
                                    <td>92%</td>
                                    <td>15 Oct 2023</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        modal.show();
    }, 500);
}

// Modifier un cours
function editCourse(courseId) {
    // Ici, vous ouvririez un modal de modification avec les données pré-remplies
    console.log('Modification du cours:', courseId);
    
    // Pour l'exemple, on réutilise le modal d'ajout
    const addModal = new bootstrap.Modal(document.getElementById('addCourseModal'));
    
    // Changer le titre
    document.getElementById('addCourseModalLabel').textContent = 'Modifier le cours';
    
    // Remplir les champs avec les données existantes
    setTimeout(() => {
        document.getElementById('courseCode').value = 'IA101';
        document.getElementById('courseName').value = 'Intelligence Artificielle';
        document.getElementById('courseTeacher').value = '1';
        document.getElementById('courseRoom').value = 'Salle A12';
        document.getElementById('courseDay').value = 'monday';
        document.getElementById('courseTime').value = '10:30';
        document.getElementById('courseDuration').value = '120';
        document.getElementById('courseMaxStudents').value = '40';
        document.getElementById('courseDescription').value = 'Cours avancé d\'IA et machine learning';
        
        // Changer le bouton de soumission
        const submitBtn = document.querySelector('#addCourseModal .btn-primary');
        submitBtn.textContent = 'Mettre à jour le cours';
        submitBtn.onclick = function() {
            updateCourse(courseId);
        };
        
        addModal.show();
    }, 500);
}

// Mettre à jour un cours
function updateCourse(courseId) {
    // Logique similaire à createCourse mais pour la mise à jour
    showNotification('Mise à jour du cours...', 'info');
    
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
        modal.hide();
        
        // Réinitialiser le modal pour les futures utilisations
        document.getElementById('addCourseModalLabel').textContent = 'Créer un nouveau cours';
        const submitBtn = document.querySelector('#addCourseModal .btn-primary');
        submitBtn.textContent = 'Créer le cours';
        submitBtn.onclick = null;
        
        // Recharger la liste
        loadCourses();
        
        showNotification('Cours mis à jour avec succès', 'success');
    }, 1500);
}

// Supprimer un cours
function deleteCourse(courseId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
        // Ici, vous feriez une requête DELETE à l'API
        showNotification('Suppression du cours...', 'warning');
        
        setTimeout(() => {
            loadCourses();
            showNotification('Cours supprimé avec succès', 'success');
        }, 1000);
    }
}

// Démarrer la prise de présence pour un cours
function startAttendanceForCourse(courseId) {
    // Rediriger vers la page de prise de présence avec le cours présélectionné
    localStorage.setItem('selectedCourse', courseId);
    window.location.href = 'attendance.html';
}

// Voir les étudiants d'un cours
function viewCourseStudents(courseId) {
    // Rediriger vers une page spécifique ou ouvrir un modal
    console.log('Voir étudiants du cours:', courseId);
    showNotification('Ouverture de la liste des étudiants...', 'info');
}

// Voir l'historique des présences d'un cours
function viewCourseAttendance(courseId) {
    // Rediriger vers l'historique avec filtre
    localStorage.setItem('filterCourse', courseId);
    window.location.href = 'attendance-history.html';
}

// Fonction debounce pour les filtres
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