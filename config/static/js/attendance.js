// attendance.js - Fonctions pour la prise de présence

let cameraStream = null;
let autoCaptureInterval = null;
let isAutoCaptureEnabled = false;
let detectedStudents = [];
let recognizedStudents = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les écouteurs d'événements
    initAttendanceEventListeners();
    
    // Initialiser la sélection du cours
    initCourseSelection();
});

// Initialiser les écouteurs d'événements
function initAttendanceEventListeners() {
    // Sélection du cours
    const selectCourse = document.getElementById('selectCourse');
    const startAttendanceBtn = document.getElementById('startAttendance');
    
    if (selectCourse && startAttendanceBtn) {
        selectCourse.addEventListener('change', function() {
            startAttendanceBtn.disabled = !this.value;
            
            if (this.value) {
                loadEnrolledStudents(this.value);
            }
        });
    }
    
    // Démarrer la reconnaissance
    if (startAttendanceBtn) {
        startAttendanceBtn.addEventListener('click', startRecognition);
    }
    
    // Toggle de la caméra
    const toggleCameraBtn = document.getElementById('toggleCamera');
    if (toggleCameraBtn) {
        toggleCameraBtn.addEventListener('click', toggleCamera);
    }
    
    // Toggle de la capture automatique
    const toggleAutoCaptureBtn = document.getElementById('toggleAutoCapture');
    if (toggleAutoCaptureBtn) {
        toggleAutoCaptureBtn.addEventListener('click', toggleAutoCapture);
    }
    
    // Sauvegarder la présence
    const saveAttendanceBtn = document.getElementById('saveAttendance');
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', saveAttendance);
    }
}

// Initialiser la sélection du cours
function initCourseSelection() {
    // Remplir la liste des cours
    // Dans une application réelle, cela viendrait de l'API
    const courses = [
        { id: 1, code: 'IA101', name: 'Intelligence Artificielle' },
        { id: 2, code: 'BDD202', name: 'Base de données' },
        { id: 3, code: 'RES303', name: 'Réseaux informatiques' }
    ];
    
    const selectCourse = document.getElementById('selectCourse');
    if (selectCourse) {
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.name} (${course.code})`;
            selectCourse.appendChild(option);
        });
    }
}

// Charger les étudiants inscrits au cours
function loadEnrolledStudents(courseId) {
    // Simuler un chargement depuis l'API
    setTimeout(() => {
        const students = [
            {
                id: 1,
                firstName: 'Marie',
                lastName: 'Dubois',
                studentNumber: 'ETU00123',
                status: 'pending',
                checkInTime: null,
                confidenceScore: null
            },
            {
                id: 2,
                firstName: 'Paul',
                lastName: 'Leroy',
                studentNumber: 'ETU00124',
                status: 'pending',
                checkInTime: null,
                confidenceScore: null
            },
            {
                id: 3,
                firstName: 'Anne',
                lastName: 'Dupuis',
                studentNumber: 'ETU00125',
                status: 'pending',
                checkInTime: null,
                confidenceScore: null
            }
        ];
        
        renderEnrolledStudents(students);
    }, 500);
}

// Rendre la liste des étudiants inscrits
function renderEnrolledStudents(students) {
    const tbody = document.querySelector('#enrolledStudents tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const avatar = generateAvatar(`${student.firstName} ${student.lastName}`);
        
        const row = document.createElement('tr');
        row.dataset.studentId = student.id;
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="student-avatar me-2" style="background-color: ${avatar.color}">
                        ${avatar.initials}
                    </div>
                    <div>
                        <div class="fw-bold">${student.firstName} ${student.lastName}</div>
                    </div>
                </div>
            </td>
            <td>${student.studentNumber}</td>
            <td>
                <span class="status-badge status-${student.status}">
                    ${getStatusText(student.status)}
                </span>
            </td>
            <td>${student.checkInTime ? formatTime(student.checkInTime) : '--:--'}</td>
            <td>
                ${student.confidenceScore ? 
                    `<span class="confidence-badge">${(student.confidenceScore * 100).toFixed(1)}%</span>` : 
                    '--'}
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-success"
                            onclick="markAsPresent(${student.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button type="button" class="btn btn-outline-warning"
                            onclick="markAsLate(${student.id})">
                        <i class="fas fa-clock"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger"
                            onclick="markAsAbsent(${student.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Obtenir le texte du statut
function getStatusText(status) {
    const statusMap = {
        'pending': 'En attente',
        'present': 'Présent',
        'late': 'En retard',
        'absent': 'Absent'
    };
    
    return statusMap[status] || status;
}

// Démarrer la reconnaissance
async function startRecognition() {
    try {
        // Démarrer la caméra
        await startCamera();
        
        // Activer les boutons
        document.getElementById('toggleCamera').disabled = false;
        document.getElementById('toggleAutoCapture').disabled = false;
        
        // Mettre à jour le statut
        updateCameraStatus('active', 'Caméra active - Prêt pour la reconnaissance');
        
        // Démarrer la capture automatique
        toggleAutoCapture();
        
        showNotification('Reconnaissance faciale démarrée', 'success');
    } catch (error) {
        console.error('Erreur de démarrage:', error);
        showNotification('Impossible de démarrer la reconnaissance', 'error');
    }
}

// Démarrer la caméra
async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });
        
        const cameraElement = document.getElementById('attendanceCamera');
        if (cameraElement) {
            cameraElement.srcObject = cameraStream;
        }
        
        return cameraStream;
    } catch (error) {
        throw new Error('Erreur d\'accès à la caméra: ' + error.message);
    }
}

// Arrêter la caméra
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    const cameraElement = document.getElementById('attendanceCamera');
    if (cameraElement) {
        cameraElement.srcObject = null;
    }
    
    updateCameraStatus('inactive', 'Caméra arrêtée');
}

// Toggle de la caméra
function toggleCamera() {
    const toggleBtn = document.getElementById('toggleCamera');
    
    if (cameraStream) {
        stopCamera();
        toggleBtn.innerHTML = '<i class="fas fa-video"></i>';
        toggleBtn.classList.remove('btn-danger');
        toggleBtn.classList.add('btn-outline-primary');
    } else {
        startCamera();
        toggleBtn.innerHTML = '<i class="fas fa-video-slash"></i>';
        toggleBtn.classList.remove('btn-outline-primary');
        toggleBtn.classList.add('btn-danger');
    }
}

// Toggle de la capture automatique
function toggleAutoCapture() {
    const toggleBtn = document.getElementById('toggleAutoCapture');
    
    if (isAutoCaptureEnabled) {
        // Arrêter la capture automatique
        clearInterval(autoCaptureInterval);
        autoCaptureInterval = null;
        isAutoCaptureEnabled = false;
        
        toggleBtn.classList.remove('btn-success');
        toggleBtn.classList.add('btn-outline-success');
        
        showNotification('Capture automatique désactivée', 'info');
    } else {
        // Démarrer la capture automatique
        isAutoCaptureEnabled = true;
        autoCaptureInterval = setInterval(captureAndProcessFrame, 3000); // Toutes les 3 secondes
        
        toggleBtn.classList.remove('btn-outline-success');
        toggleBtn.classList.add('btn-success');
        
        showNotification('Capture automatique activée', 'success');
    }
}

// Capturer et traiter une frame
function captureAndProcessFrame() {
    const cameraElement = document.getElementById('attendanceCamera');
    const canvasElement = document.getElementById('attendanceCanvas');
    const overlayElement = document.getElementById('cameraOverlay');
    
    if (!cameraElement || !canvasElement || cameraElement.videoWidth === 0) {
        return;
    }
    
    // Capturer la frame
    const context = canvasElement.getContext('2d');
    canvasElement.width = cameraElement.videoWidth;
    canvasElement.height = cameraElement.videoHeight;
    context.drawImage(cameraElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Simuler la détection de visages (dans une application réelle, cela utiliserait une API)
    simulateFaceDetection(canvasElement, overlayElement);
}

// Simuler la détection de visages
function simulateFaceDetection(canvas, overlay) {
    // Effacer l'overlay précédent
    if (overlay) {
        overlay.innerHTML = '';
    }
    
    // Simuler la détection de 1-3 visages aléatoires
    const numFaces = Math.floor(Math.random() * 3) + 1;
    const detected = [];
    
    for (let i = 0; i < numFaces; i++) {
        // Position aléatoire
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        const width = 80 + Math.random() * 40;
        const height = width * 1.2;
        
        // Dessiner le cadre du visage
        if (overlay) {
            const faceBox = document.createElement('div');
            faceBox.className = 'face-box';
            faceBox.style.left = `${(x / canvas.width) * 100}%`;
            faceBox.style.top = `${(y / canvas.height) * 100}%`;
            faceBox.style.width = `${(width / canvas.width) * 100}%`;
            faceBox.style.height = `${(height / canvas.height) * 100}%`;
            
            // Ajouter un label aléatoire
            const students = ['Marie Dubois', 'Paul Leroy', 'Anne Dupuis', 'Thomas Martin'];
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const confidence = (0.85 + Math.random() * 0.15).toFixed(2);
            
            const faceLabel = document.createElement('div');
            faceLabel.className = 'face-label';
            faceLabel.textContent = `${randomStudent} (${(confidence * 100).toFixed(0)}%)`;
            faceBox.appendChild(faceLabel);
            
            overlay.appendChild(faceBox);
        }
        
        // Ajouter à la liste des détections
        detected.push({
            x, y, width, height,
            studentName: 'Étudiant ' + (i + 1),
            confidence: 0.85 + Math.random() * 0.15
        });
    }
    
    // Mettre à jour le compteur
    updateDetectedCount(detected.length);
    
    // Simuler la reconnaissance (dans une application réelle, cela enverrait l'image à une API)
    simulateRecognition(detected);
}

// Simuler la reconnaissance
function simulateRecognition(detections) {
    // Simuler un délai de traitement
    setTimeout(() => {
        detections.forEach(detection => {
            // Simuler l'identification d'un étudiant aléatoire
            const students = [
                { id: 1, name: 'Marie Dubois', studentNumber: 'ETU00123' },
                { id: 2, name: 'Paul Leroy', studentNumber: 'ETU00124' },
                { id: 3, name: 'Anne Dupuis', studentNumber: 'ETU00125' }
            ];
            
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const isNew = !recognizedStudents.some(s => s.id === randomStudent.id);
            
            if (isNew) {
                // Ajouter à la liste des reconnus
                const recognizedStudent = {
                    ...randomStudent,
                    confidence: detection.confidence,
                    timestamp: new Date().toISOString(),
                    status: 'present'
                };
                
                recognizedStudents.push(recognizedStudent);
                
                // Mettre à jour l'affichage
                addDetectedStudent(recognizedStudent);
                
                // Mettre à jour la table des étudiants inscrits
                updateStudentStatus(randomStudent.id, 'present', detection.confidence);
                
                // Activer le bouton de sauvegarde
                document.getElementById('saveAttendance').disabled = false;
            }
        });
        
        // Mettre à jour le compteur
        updateRecognizedCount(recognizedStudents.length);
    }, 500);
}

// Ajouter un étudiant détecté à la liste
function addDetectedStudent(student) {
    const detectedList = document.getElementById('detectedList');
    const emptyDetections = document.getElementById('emptyDetections');
    
    if (emptyDetections) {
        emptyDetections.style.display = 'none';
    }
    
    const avatar = generateAvatar(student.name);
    
    const detectedItem = document.createElement('div');
    detectedItem.className = 'detected-item';
    detectedItem.dataset.studentId = student.id;
    detectedItem.innerHTML = `
        <div class="student-avatar" style="background-color: ${avatar.color}">
            ${avatar.initials}
        </div>
        <div class="student-info">
            <div class="student-name">${student.name}</div>
            <div class="student-id">${student.studentNumber}</div>
        </div>
        <div class="confidence-badge">
            ${(student.confidence * 100).toFixed(1)}%
        </div>
    `;
    
    if (detectedList) {
        // Ajouter au début de la liste
        detectedList.insertBefore(detectedItem, detectedList.firstChild);
        
        // Limiter à 10 éléments affichés
        if (detectedList.children.length > 10) {
            detectedList.removeChild(detectedList.lastChild);
        }
    }
}

// Mettre à jour le statut d'un étudiant
function updateStudentStatus(studentId, status, confidence = null) {
    const rows = document.querySelectorAll(`#enrolledStudents tbody tr[data-student-id="${studentId}"]`);
    
    rows.forEach(row => {
        // Mettre à jour le statut
        const statusCell = row.querySelector('.status-badge');
        if (statusCell) {
            statusCell.className = `status-badge status-${status}`;
            statusCell.textContent = getStatusText(status);
        }
        
        // Mettre à jour l'heure
        const timeCell = row.cells[3];
        if (timeCell && status !== 'pending') {
            timeCell.textContent = formatTime(new Date());
        }
        
        // Mettre à jour le score
        const scoreCell = row.cells[4];
        if (scoreCell && confidence !== null) {
            scoreCell.innerHTML = `<span class="confidence-badge">${(confidence * 100).toFixed(1)}%</span>`;
        }
    });
}

// Mettre à jour le compteur des détections
function updateDetectedCount(count) {
    const countElement = document.getElementById('detectedCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Mettre à jour le compteur des reconnus
function updateRecognizedCount(count) {
    const countElement = document.getElementById('recognizedCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Mettre à jour le statut de la caméra
function updateCameraStatus(status, text) {
    const statusElement = document.getElementById('cameraStatus');
    const statusText = document.getElementById('cameraStatusText');
    
    if (statusElement && statusText) {
        if (status === 'active') {
            statusElement.className = 'spinner-border spinner-border-sm text-success';
        } else if (status === 'inactive') {
            statusElement.className = 'spinner-border spinner-border-sm text-danger';
        } else {
            statusElement.className = 'spinner-border spinner-border-sm text-primary';
        }
        
        statusText.textContent = text;
    }
}

// Marquer comme présent manuellement
function markAsPresent(studentId) {
    updateStudentStatus(studentId, 'present', 1.0);
    showNotification('Étudiant marqué comme présent', 'success');
}

// Marquer comme en retard manuellement
function markAsLate(studentId) {
    updateStudentStatus(studentId, 'late', 1.0);
    showNotification('Étudiant marqué comme en retard', 'warning');
}

// Marquer comme absent manuellement
function markAsAbsent(studentId) {
    updateStudentStatus(studentId, 'absent');
    showNotification('Étudiant marqué comme absent', 'error');
}

// Sauvegarder la présence
function saveAttendance() {
    // Récupérer les données du cours
    const courseId = document.getElementById('selectCourse').value;
    const sessionDate = document.getElementById('sessionDate').value;
    
    // Récupérer les statuts des étudiants
    const attendanceData = [];
    const rows = document.querySelectorAll('#enrolledStudents tbody tr');
    
    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const statusCell = row.querySelector('.status-badge');
        const status = statusCell ? 
            statusCell.className.includes('present') ? 'present' :
            statusCell.className.includes('late') ? 'late' :
            statusCell.className.includes('absent') ? 'absent' : 'pending' : 'pending';
        
        const timeCell = row.cells[3];
        const checkInTime = timeCell.textContent !== '--:--' ? 
            new Date().toDateString() + ' ' + timeCell.textContent : null;
        
        const scoreCell = row.cells[4];
        const confidenceScore = scoreCell.textContent !== '--' ? 
            parseFloat(scoreCell.textContent) / 100 : null;
        
        attendanceData.push({
            studentId,
            status,
            checkInTime,
            confidenceScore
        });
    });
    
    // Ici, vous enverriez les données à l'API
    console.log('Données de présence à sauvegarder:', {
        courseId,
        sessionDate,
        attendanceData
    });
    
    showNotification('Présence enregistrée avec succès', 'success');
    
    // Réinitialiser l'interface
    resetAttendanceInterface();
}

// Réinitialiser l'interface de présence
function resetAttendanceInterface() {
    // Arrêter la caméra et la capture automatique
    if (isAutoCaptureEnabled) {
        toggleAutoCapture();
    }
    
    stopCamera();
    
    // Réinitialiser les listes
    recognizedStudents = [];
    detectedStudents = [];
    
    // Réinitialiser les compteurs
    updateDetectedCount(0);
    updateRecognizedCount(0);
    
    // Réinitialiser la liste des détections
    const detectedList = document.getElementById('detectedList');
    const emptyDetections = document.getElementById('emptyDetections');
    
    if (detectedList) {
        detectedList.innerHTML = '';
    }
    
    if (emptyDetections) {
        emptyDetections.style.display = 'block';
    }
    
    // Désactiver les boutons
    document.getElementById('toggleCamera').disabled = true;
    document.getElementById('toggleAutoCapture').disabled = true;
    document.getElementById('saveAttendance').disabled = true;
    
    // Mettre à jour le statut
    updateCameraStatus('inactive', 'Prêt pour une nouvelle session');
}

// Nettoyer à la fermeture de la page
window.addEventListener('beforeunload', function() {
    if (cameraStream) {
        stopCamera();
    }
    
    if (autoCaptureInterval) {
        clearInterval(autoCaptureInterval);
    }
});