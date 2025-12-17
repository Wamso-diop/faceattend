from django import forms
from django.core.exceptions import ValidationError
from .models import Course
from django.utils import timezone

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = [
            'course_code',
            'course_name', 
            'teacher',
            'room',
            'schedule_day',
            'schedule_time',
            'duration'
        ]
        widgets = {
            'course_code': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ex: MATH101'
            }),
            'course_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ex: Mathématiques Avancées'
            }),
            'teacher': forms.Select(attrs={'class': 'form-control'}),
            'room': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ex: Bâtiment A, Salle 203'
            }),
            'schedule_day': forms.Select(attrs={'class': 'form-control'}),
            'schedule_time': forms.TimeInput(attrs={
                'class': 'form-control',
                'type': 'time'
            }),
            'duration': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Durée en minutes',
                'min': '15',
                'step': '15'
            }),
        }
    
    def clean_course_code(self):
        course_code = self.cleaned_data.get('course_code')
        # Vérifier si le code existe déjà (pour la mise à jour, exclure l'instance actuelle)
        if self.instance.pk:
            if Course.objects.filter(course_code=course_code).exclude(pk=self.instance.pk).exists():
                raise ValidationError("Ce code de cours existe déjà.")
        else:
            if Course.objects.filter(course_code=course_code).exists():
                raise ValidationError("Ce code de cours existe déjà.")
        return course_code
    
    def clean_duration(self):
        duration = self.cleaned_data.get('duration')
        if duration and duration < 15:
            raise ValidationError("La durée minimale est de 15 minutes.")
        if duration and duration > 480:  # 8 heures
            raise ValidationError("La durée ne peut pas dépasser 8 heures.")
        return duration
    
    def clean(self):
        cleaned_data = super().clean()
        schedule_day = cleaned_data.get('schedule_day')
        schedule_time = cleaned_data.get('schedule_time')
        
        # Si un jour est spécifié, une heure doit l'être aussi
        if schedule_day and not schedule_time:
            self.add_error('schedule_time', "Veuillez spécifier une heure si vous choisissez un jour.")
        
        # Si une heure est spécifiée, un jour doit l'être aussi
        if schedule_time and not schedule_day:
            self.add_error('schedule_day', "Veuillez spécifier un jour si vous choisissez une heure.")
        
        return cleaned_data