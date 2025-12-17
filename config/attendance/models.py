"""
Modèles pour la gestion des présences
"""
from django.db import models
from django.conf import settings
from students.models import Student
from courses.models import Course

class Attendance(models.Model):
    """
    Modèle Présence
    """
    STATUS_CHOICES = [
        ('present', 'Présent'),
        ('late', 'Retard'),
        ('absent', 'Absent'),
    ]
    
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='attendances',
        verbose_name='Étudiant'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='attendances',
        verbose_name='Cours'
    )
    attendance_date = models.DateField(verbose_name='Date')
    check_in_time = models.DateTimeField(verbose_name='Heure d\'arrivée')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='present',
        verbose_name='Statut'
    )
    confidence_score = models.FloatField(
        blank=True,
        null=True,
        verbose_name='Score de confiance',
        help_text='Score de reconnaissance faciale (0-1)'
    )
    capture_image = models.ImageField(
        upload_to='photos/captures/',
        blank=True,
        null=True,
        verbose_name='Image capturée'
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_attendances',
        verbose_name='Vérifié par'
    )
    notes = models.TextField(blank=True, null=True, verbose_name='Notes')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    
    class Meta:
        verbose_name = 'Présence'
        verbose_name_plural = 'Présences'
        ordering = ['-attendance_date', '-check_in_time']
        unique_together = ['student', 'course', 'attendance_date']
        indexes = [
            models.Index(fields=['student', 'attendance_date']),
            models.Index(fields=['course', 'attendance_date']),
        ]
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.course_code} - {self.attendance_date}"