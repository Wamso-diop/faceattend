// dashboard.js - Fonctions spécifiques au tableau de bord

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le graphique de présence
    initAttendanceChart();
    
    // Charger les données du dashboard
    loadDashboardData();
    
    // Mettre à jour l'heure en temps réel
    updateRealTime();
});

// Initialiser le graphique de présence
function initAttendanceChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Données d'exemple pour la semaine
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const presentData = [185, 190, 188, 192, 189, 95, 42];
    const absentData = [12, 8, 10, 6, 9, 5, 3];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Présents',
                    data: presentData,
                    backgroundColor: '#2ECC71',
                    borderRadius: 5,
                    borderSkipped: false,
                },
                {
                    label: 'Absents',
                    data: absentData,
                    backgroundColor: '#E74C3C',
                    borderRadius: 5,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 2]
                    },
                    ticks: {
                        stepSize: 50
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Charger les données du dashboard
function loadDashboardData() {
    // Simuler un chargement depuis l'API
    setTimeout(() => {
        // Mettre à jour les statistiques
        updateStats({
            totalStudents: 245,
            presentToday: 189,
            attendanceRate: 94.2,
            repeatedAbsences: 12
        });
        
        // Mettre à jour la liste des cours
        updateTodayCourses([
            {
                name: 'Intelligence Artificielle',
                time: '10:30 - 12:30',
                room: 'Salle A12',
                status: 'active'
            },
            {
                name: 'Base de données',
                time: '14:00 - 16:00',
                room: 'Salle B07',
                status: 'upcoming'
            },
            {
                name: 'Réseaux informatiques',
                time: '16:30 - 18:30',
                room: 'Salle C03',
                status: 'upcoming'
            }
        ]);
        
        // Mettre à jour les dernières présences
        updateRecentAttendances([
            {
                studentName: 'Marie Dubois',
                course: 'IA',
                time: '10:32 AM',
                status: 'present'
            },
            {
                studentName: 'Paul Leroy',
                course: 'IA',
                time: '10:35 AM',
                status: 'late'
            }
        ]);
    }, 1000);
}

// Mettre à jour les statistiques
function updateStats(data) {
    // Cette fonction serait utilisée pour mettre à jour dynamiquement les statistiques
    console.log('Statistiques mises à jour:', data);
}

// Mettre à jour la liste des cours
function updateTodayCourses(courses) {
    // Cette fonction serait utilisée pour mettre à jour dynamiquement les cours
    console.log('Cours mis à jour:', courses);
}

// Mettre à jour les dernières présences
function updateRecentAttendances(attendances) {
    // Cette fonction serait utilisée pour mettre à jour dynamiquement les présences
    console.log('Présences mises à jour:', attendances);
}

// Mettre à jour l'heure en temps réel
function updateRealTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Vous pouvez afficher ces informations quelque part dans votre interface
        // Par exemple:
        // document.getElementById('current-time').textContent = timeString;
        // document.getElementById('current-date').textContent = dateString;
    }
    
    // Mettre à jour immédiatement
    updateTime();
    
    // Mettre à jour toutes les secondes
    setInterval(updateTime, 1000);
}

// Rafraîchir les données du dashboard
function refreshDashboard() {
    // Afficher un indicateur de chargement
    showNotification('Rafraîchissement des données...', 'info');
    
    // Recharger les données
    loadDashboardData();
    
    // Rafraîchir le graphique
    // Note: Dans une application réelle, vous devriez détruire et recréer le graphique
}