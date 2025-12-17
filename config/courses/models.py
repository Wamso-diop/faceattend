"""
Modèles pour la gestion des cours
"""
from django.db import models
from django.conf import settings

class Course(models.Model):
    """
    Modèle Cours
    """
    DAYS_OF_WEEK = [
        ('monday', 'Lundi'),
        ('tuesday', 'Mardi'),
        ('wednesday', 'Mercredi'),
        ('thursday', 'Jeudi'),
        ('friday', 'Vendredi'),
        ('saturday', 'Samedi'),
    ]
    
    course_code = models.CharField(max_length=50, unique=True, verbose_name='Code du cours')
    course_name = models.CharField(max_length=255, verbose_name='Nom du cours')
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='courses',
        verbose_name='Enseignant'
    )
    room = models.CharField(max_length=50, blank=True, null=True, verbose_name='Salle')
    schedule_day = models.CharField(
        max_length=20,
        choices=DAYS_OF_WEEK,
        blank=True,
        null=True,
        verbose_name='Jour'
    )
    schedule_time = models.TimeField(blank=True, null=True, verbose_name='Heure')
    duration = models.IntegerField(
        blank=True,
        null=True,
        verbose_name='Durée (minutes)',
        help_text='Durée du cours en minutes'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    
    class Meta:
        verbose_name = 'Cours'
        verbose_name_plural = 'Cours'
        ordering = ['course_code']
    
    def __str__(self):
        return f"{self.course_code} - {self.course_name}"