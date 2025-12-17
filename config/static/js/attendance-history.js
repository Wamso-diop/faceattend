// attendance-history.js - Gestion de l'historique des présences

document.addEventListener('DOMContentLoaded', function() {
    // Charger l'historique
    loadAttendanceHistory();
    
    // Initialiser les écouteurs d'événements
    initHistoryEventListeners();
});

// Charger l'historique des présences
function loadAttendanceHistory() {
    // Simuler un chargement depuis l'API
    setTimeout(() => {
        const history = [
            {
                id: 1,
                date: '2023-10-15',
                course: 'Intelligence Artificielle',
                courseCode: 'IA101',
                student: 'Marie Dubois',
                studentNumber: 'ETU00123',
                checkInTime: '10:32',
                status: 'present',
                confidence: 0.95,
                method: 'Reconnaissance',
                corrected: false
            },
            {
                id: 2,
                date: '2023-10-15',
                course: 'Intelligence Artificielle',
                courseCode: 'IA101',
                student: 'Paul Leroy',
                studentNumber: 'ETU00124',
                checkInTime: '10:35',
                status: 'late',
                confidence: 0.87,
                method: 'Reconnaissance',
                corrected: false
            },
            {
                id: 3,
                date: '2023-10-15',
                course: 'Base de données',
                courseCode: 'BDD202',
                student: 'Anne Dupuis',
                studentNumber: 'ETU00125',
                checkInTime: '14:02',
                status: 'present',
                confidence: 0.92,
                method: 'Reconnaissance',
                corrected: false
            },
            {
                id: 4,
                date: '2023-10-14',
                course: 'Réseaux',
                courseCode: 'RES303',
                student: 'Thomas Martin',
                studentNumber: 'ETU00126',
                checkInTime: '16:45',
                status: 'absent',
                confidence: null,
                method: 'Manuel',
                corrected: true,
                correctionNotes: 'Présence corrigée après justificatif'
            }
        ];
        
        renderAttendanceHistory(history);
    }, 1000);
}

// Rendre l'historique des présences
function renderAttendanceHistory(history) {
    const tbody = document.querySelector('#attendanceHistoryTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    history.forEach((record, index) => {
        const row = document.createElement('tr');
        if (record.corrected) {
            row.classList.add('table-warning');
        }
        
        const statusClass = {
            'present': 'status-present',
            'late': 'status-late',
            'absent': 'status-absent'
        }[record.status] || '';
        
        row.innerHTML = `
            <td>
                <div class="fw-bold">${formatDate(record.date)}</div>
                <small class="text-muted">${record.date}</small>
            </td>
            <td>
                <div class="fw-bold">${record.course}</div>
                <small class="text-muted">${record.courseCode}</small>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="student-avatar me-2">${record.student.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <div class="fw-bold">${record.student}</div>
                        <small class="text-muted">${record.studentNumber}</small>
                    </div>
                </div>
            </td>
            <td>
                <div class="fw-bold">${record.checkInTime}</div>
            </td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${getStatusText(record.status)}
                    ${record.corrected ? ' <i class="fas fa-pen ml-1"></i>' : ''}
                </span>
            </td>
            <td>
                ${record.confidence ? 
                    `<span class="confidence-badge">${(record.confidence * 100).toFixed(1)}%</span>` : 
                    '<span class="text-muted">--</span>'}
            </td>
            <td>
                <span class="badge bg-light text-dark">
                    ${record.method === 'Reconnaissance' ? 
                        '<i class="fas fa-robot me-1"></i>' : 
                        '<i class="fas fa-user-edit me-1"></i>'}
                    ${record.method}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary"
                            onclick="viewAttendanceDetails(${record.id})"
                            data-bs-toggle="tooltip" title="Détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-outline-warning"
                            onclick="correctAttendance(${record.id})"
                            data-bs-toggle="tooltip" title="Corriger">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${record.method === 'Reconnaissance' ? `
                        <button type="button" class="btn btn-outline-info"
                                onclick="viewCapture(${record.id})"
                                data-bs-toggle="tooltip" title="Voir capture">
                            <i class="fas fa-image"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Réinitialiser les tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Initialiser les écouteurs d'événements
function initHistoryEventListeners() {
    // Appliquer les filtres
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Réinitialiser les filtres
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Gestion de la correction
    const correctionForm = document.getElementById('correctionForm');
    if (correctionForm) {
        correctionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCorrection();
        });
    }
}

// Appliquer les filtres
function applyFilters() {
    const course = document.getElementById('filterCourse').value;
    const date = document.getElementById('filterDate').value;
    const student = document.getElementById('filterStudent').value;
    const status = document.getElementById('filterStatus').value;
    const showCorrections = document.getElementById('showCorrections').checked;
    
    // Ici, vous feriez une requête API avec les filtres
    console.log('Filtres appliqués:', { course, date, student, status, showCorrections });
    
    // Simuler un rechargement
    loadAttendanceHistory();
    
    showNotification('Filtres appliqués', 'success');
}

// Réinitialiser les filtres
function resetFilters() {
    document.getElementById('filterCourse').value = '';
    document.getElementById('filterDate').value = '';
    document.getElementById('filterStudent').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('showCorrections').checked = false;
    
    // Recharger sans filtres
    loadAttendanceHistory();
    
    showNotification('Filtres réinitialisés', 'info');
}

// Voir les détails d'une présence
function viewAttendanceDetails(attendanceId) {
    // Ici, vous ouvririez un modal avec les détails complets
    console.log('Voir détails:', attendanceId);
    
    showNotification('Ouverture des détails...', 'info');
}

// Corriger une présence
function correctAttendance(attendanceId) {
    // Récupérer les données de la présence
    const modal = new bootstrap.Modal(document.getElementById('correctionModal'));
    
    // Simuler le chargement des données
    setTimeout(() => {
        document.getElementById('attendanceId').value = attendanceId;
        document.getElementById('studentName').value = 'Marie Dubois (ETU00123)';
        document.getElementById('courseName').value = 'Intelligence Artificielle (IA101)';
        document.getElementById('attendanceDate').value = '15 Oct 2023 - 10:32';
        
        modal.show();
    }, 500);
}

// Sauvegarder une correction
function saveCorrection() {
    const attendanceId = document.getElementById('attendanceId').value;
    const correctedStatus = document.getElementById('correctedStatus').value;
    const correctionNotes = document.getElementById('correctionNotes').value;
    
    // Ici, vous enverriez les données à l'API
    console.log('Sauvegarde correction:', { attendanceId, correctedStatus, correctionNotes });
    
    // Fermer le modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('correctionModal'));
    modal.hide();
    
    // Réinitialiser le formulaire
    document.getElementById('correctionForm').reset();
    
    // Recharger l'historique
    loadAttendanceHistory();
    
    showNotification('Correction enregistrée avec succès', 'success');
}

// Voir la capture de reconnaissance
function viewCapture(attendanceId) {
    // Ici, vous afficheriez l'image de capture
    console.log('Voir capture:', attendanceId);
    
    // Simuler l'affichage d'une image
    showNotification('Ouverture de la capture...', 'info');
}

// Obtenir le texte du statut
function getStatusText(status) {
    const statusMap = {
        'present': 'Présent',
        'late': 'En retard',
        'absent': 'Absent'
    };
    
    return statusMap[status] || status;
}