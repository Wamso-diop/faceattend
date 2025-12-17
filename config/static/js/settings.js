// settings.js - Gestion des paramètres

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les écouteurs d'événements
    initSettingsEventListeners();
    
    // Charger les paramètres actuels
    loadCurrentSettings();
});

// Initialiser les écouteurs d'événements
function initSettingsEventListeners() {
    // Mise à jour en temps réel du seuil de confiance
    const confidenceSlider = document.getElementById('confidenceThreshold');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (confidenceSlider && confidenceValue) {
        confidenceSlider.addEventListener('input', function() {
            confidenceValue.textContent = this.value;
        });
    }
    
    // Gestion des formulaires
    const forms = [
        'generalSettingsForm',
        'recognitionSettingsForm',
        'notificationsSettingsForm',
        'securitySettingsForm',
        'integrationsSettingsForm'
    ];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                saveSettings(formId);
            });
        }
    });
    
    // Boutons de maintenance
    const clearCacheBtn = document.getElementById('clearCache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', clearCache);
    }
    
    const testSystemBtn = document.getElementById('testSystem');
    if (testSystemBtn) {
        testSystemBtn.addEventListener('click', testSystem);
    }
    
    const resetSettingsBtn = document.getElementById('resetSettings');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', resetSettings);
    }
}

// Charger les paramètres actuels
function loadCurrentSettings() {
    // Simuler le chargement depuis le stockage local ou l'API
    setTimeout(() => {
        // Général
        document.getElementById('institutionName').value = localStorage.getItem('institutionName') || 'Université Tech Paris';
        document.getElementById('timezone').value = localStorage.getItem('timezone') || 'Europe/Paris';
        document.getElementById('dateFormat').value = localStorage.getItem('dateFormat') || 'fr-FR';
        document.getElementById('language').value = localStorage.getItem('language') || 'fr';
        document.getElementById('sessionTimeout').value = localStorage.getItem('sessionTimeout') || '30';
        document.getElementById('autoLogout').value = localStorage.getItem('autoLogout') || 'yes';
        
        // Reconnaissance
        const confidence = localStorage.getItem('confidenceThreshold') || '75';
        document.getElementById('confidenceThreshold').value = confidence;
        document.getElementById('confidenceValue').textContent = confidence;
        document.getElementById('captureInterval').value = localStorage.getItem('captureInterval') || '3';
        document.getElementById('maxFaces').value = localStorage.getItem('maxFaces') || '5';
        document.getElementById('faceModel').value = localStorage.getItem('faceModel') || 'hog';
        document.getElementById('enableLiveDetection').checked = localStorage.getItem('enableLiveDetection') !== 'false';
        document.getElementById('enableSoundAlert').checked = localStorage.getItem('enableSoundAlert') !== 'false';
        document.getElementById('saveCaptures').checked = localStorage.getItem('saveCaptures') === 'true';
        
        showNotification('Paramètres chargés', 'success');
    }, 500);
}

// Sauvegarder les paramètres
function saveSettings(formId) {
    let settings = {};
    let formName = '';
    
    switch(formId) {
        case 'generalSettingsForm':
            settings = {
                institutionName: document.getElementById('institutionName').value,
                timezone: document.getElementById('timezone').value,
                dateFormat: document.getElementById('dateFormat').value,
                language: document.getElementById('language').value,
                sessionTimeout: document.getElementById('sessionTimeout').value,
                autoLogout: document.getElementById('autoLogout').value
            };
            formName = 'Général';
            break;
            
        case 'recognitionSettingsForm':
            settings = {
                confidenceThreshold: document.getElementById('confidenceThreshold').value,
                captureInterval: document.getElementById('captureInterval').value,
                maxFaces: document.getElementById('maxFaces').value,
                faceModel: document.getElementById('faceModel').value,
                enableLiveDetection: document.getElementById('enableLiveDetection').checked,
                enableSoundAlert: document.getElementById('enableSoundAlert').checked,
                saveCaptures: document.getElementById('saveCaptures').checked
            };
            formName = 'Reconnaissance';
            break;
            
        case 'notificationsSettingsForm':
            settings = {
                notifyNewStudents: document.getElementById('notifyNewStudents').checked,
                notifyLowConfidence: document.getElementById('notifyLowConfidence').checked,
                notifyAbsences: document.getElementById('notifyAbsences').checked,
                notifySystemUpdates: document.getElementById('notifySystemUpdates').checked,
                notifyInApp: document.getElementById('notifyInApp').checked,
                notifyEmail: document.getElementById('notifyEmail').checked,
                notifySMS: document.getElementById('notifySMS').checked,
                dailyReport: document.getElementById('dailyReport').value,
                weeklyReport: document.getElementById('weeklyReport').value
            };
            formName = 'Notifications';
            break;
            
        case 'securitySettingsForm':
            settings = {
                passwordPolicy: document.getElementById('passwordPolicy').value,
                enable2FA: document.getElementById('enable2FA').checked,
                failedAttempts: document.getElementById('failedAttempts').value,
                lockoutDuration: document.getElementById('lockoutDuration').value,
                ipWhitelist: document.getElementById('ipWhitelist').checked,
                sessionLogging: document.getElementById('sessionLogging').checked,
                backupFrequency: document.getElementById('backupFrequency').value,
                retentionPeriod: document.getElementById('retentionPeriod').value
            };
            formName = 'Sécurité';
            break;
            
        case 'integrationsSettingsForm':
            settings = {
                sisIntegration: document.getElementById('sisIntegration').checked,
                sisUrl: document.getElementById('sisUrl').value,
                sisKey: document.getElementById('sisKey').value,
                syncFrequency: document.getElementById('syncFrequency').value,
                calendarIntegration: document.getElementById('calendarIntegration').checked,
                autoExport: document.getElementById('autoExport').checked,
                exportExcel: document.getElementById('exportExcel').checked,
                exportCSV: document.getElementById('exportCSV').checked,
                exportPDF: document.getElementById('exportPDF').checked
            };
            formName = 'Intégrations';
            break;
    }
    
    // Sauvegarder dans le localStorage (dans une app réelle, ce serait une API)
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });
    
    showNotification(`Paramètres ${formName} sauvegardés avec succès`, 'success');
    
    // Simuler un délai d'enregistrement
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Paramètres sauvegardés:', settings);
            resolve(true);
        }, 1000);
    });
}

// Vider le cache
function clearCache() {
    if (confirm('Voulez-vous vraiment vider le cache ? Cela peut améliorer les performances.')) {
        // Simuler le vidage du cache
        setTimeout(() => {
            showNotification('Cache vidé avec succès', 'success');
        }, 1000);
    }
}

// Tester le système
function testSystem() {
    showNotification('Démarrage des tests système...', 'info');
    
    // Simuler des tests
    const tests = [
        'Test de connexion à la base de données...',
        'Test du service de reconnaissance...',
        'Test des notifications...',
        'Test des exports...'
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
        if (progress < tests.length) {
            console.log(tests[progress]);
            progress++;
        } else {
            clearInterval(interval);
            showNotification('Tous les tests ont réussi ✅', 'success');
        }
    }, 800);
}

// Réinitialiser les paramètres
function resetSettings() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?')) {
        // Supprimer tous les paramètres du localStorage
        const keysToRemove = [
            'institutionName', 'timezone', 'dateFormat', 'language',
            'sessionTimeout', 'autoLogout', 'confidenceThreshold',
            'captureInterval', 'maxFaces', 'faceModel'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Recharger la page pour appliquer les changements
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
        showNotification('Paramètres réinitialisés', 'info');
    }
}