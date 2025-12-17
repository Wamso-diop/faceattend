"""
Modèles pour la gestion des étudiants
"""
from django.db import models
from django.core.validators import RegexValidator

class Student(models.Model):
    """
    Modèle Étudiant
    """
    student_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Matricule',
        validators=[
            RegexValidator(
                regex=r'^[A-Z0-9]+$',
                message='Le matricule doit contenir uniquement des lettres majuscules et des chiffres'
            )
        ]
    )
    first_name = models.CharField(max_length=100, verbose_name='Prénom')
    last_name = models.CharField(max_length=100, verbose_name='Nom')
    email = models.EmailField(unique=True, blank=True, null=True, verbose_name='Email')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Téléphone')
    program = models.CharField(max_length=100, blank=True, null=True, verbose_name='Programme')
    year_level = models.IntegerField(
        blank=True,
        null=True,
        verbose_name='Niveau',
        choices=[(i, f'Niveau {i}') for i in range(1, 6)]
    )
    photo = models.ImageField(
        upload_to='photos/students/',
        blank=True,
        null=True,
        verbose_name='Photo'
    )
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Modifié le')
    
    class Meta:
        verbose_name = 'Étudiant'
        verbose_name_plural = 'Étudiants'
        ordering = ['last_name', 'first_name']
        indexes = [
            models.Index(fields=['student_number']),
            models.Index(fields=['last_name', 'first_name']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_number})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def has_face_encoding(self):
        return hasattr(self, 'face_encoding') and self.face_encoding is not None


class FaceEncoding(models.Model):
    """
    Modèle pour stocker les encodages faciaux
    """
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name='face_encoding',
        verbose_name='Étudiant'
    )
    encoding = models.BinaryField(verbose_name='Encodage')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    
    class Meta:
        verbose_name = 'Encodage Facial'
        verbose_name_plural = 'Encodages Faciaux'
    
    def __str__(self):
        return f"Encodage de {self.student.get_full_name()}"