from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Student
import json
from django.contrib import messages
from .models import Student
from django.core.files.storage import FileSystemStorage


def edit_student(request, student_id):
    student = get_object_or_404(Student, id=student_id)

    total_students_count = Student.objects.count()
    active_students_count = Student.objects.filter(is_active=True).count()
    inactive_students_count = Student.objects.filter(is_active=False).count()

    if request.method == 'POST':
        student.first_name = request.POST.get('first_name', '').strip()
        student.last_name = request.POST.get('last_name', '').strip()
        student.student_number = request.POST.get('student_number', '').strip()
        student.email = request.POST.get('email', '').strip()
        student.phone = request.POST.get('phone', '').strip()
        student.program = request.POST.get('program')
        student.year_level = request.POST.get('year_level')
        student.is_active = request.POST.get('is_active') == 'true'
        student.created_at = request.POST.get('create_at')

        # Validation minimale
        if not all([
            student.first_name,
            student.last_name,
            student.student_number,
            student.email,
            student.program,
            student.year_level
        ]):
            messages.error(request, "Veuillez remplir tous les champs obligatoires.")
            return redirect(request.path)

        # Vérifier unicité matricule (sauf lui-même)
        if Student.objects.exclude(id=student.id).filter(student_number=student.student_number).exists():
            messages.error(request, "Ce numéro d'étudiant est déjà utilisé.")
            return redirect(request.path)

        # Nouvelle photo (optionnelle)
        if request.FILES.get('photo'):
            student.photo = request.FILES.get('photo')

        student.save()
        messages.success(request, "Étudiant modifié avec succès.")
        return redirect('students:list-students')

    return render(request, 'partials/edit_student.html', {
        'student': student,
        'total_students_count': total_students_count,
        'active_students_count': active_students_count,
        'inactive_students_count': inactive_students_count,
    })


def add_student(request):
    total_students_count = Student.objects.count()
    active_students_count = Student.objects.filter(is_active=True).count()
    inactive_students_count = Student.objects.filter(is_active=False).count()
    
    if request.method == 'POST':
        # Récupération des données du formulaire
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        student_number = request.POST.get('student_number')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        program = request.POST.get('program')
        year_level = request.POST.get('year_level')
        created_at = request.POST.get('create_at')
        is_active = request.POST.get('is_active') == 'true'

        print( first_name, last_name, student_number, email, phone, address, program, year_level, created_at, is_active)
        # Vérification des champs obligatoires
        if not all([first_name, last_name, student_number, email, program, year_level, created_at]):
            messages.error(request, 'Veuillez remplir tous les champs obligatoires.')
            print("\n\n\nMissing fields")
            return render(request, 'partials/add_students.html', {
                'total_students_count': total_students_count,
                'active_students_count': active_students_count,
                'inactive_students_count': inactive_students_count,
            })
        
        # Vérification de l'unicité du numéro étudiant
        if Student.objects.filter(student_number=student_number).exists():
            messages.error(request, 'Ce numéro d\'étudiant existe déjà.')
            print("\n\n\nDuplicate student number")
            return render(request, 'partials/add_students.html', {
                'total_students_count': total_students_count,
                'active_students_count': active_students_count,
                'inactive_students_count': inactive_students_count,
            })
        
        # Traitement de la photo
        photo = None
        if 'photo' in request.FILES:
            uploaded_photo = request.FILES['photo']
            fs = FileSystemStorage(location='media/students/photos/')
            filename = fs.save(f"{student_number}_{uploaded_photo.name}", uploaded_photo)
            photo = f"students/photos/{filename}"
        
        # Création de l'étudiant
        student = Student.objects.create(
            first_name=first_name,
            last_name=last_name,
            student_number=student_number,
            email=email,
            phone=phone or '',
            program=program,
            year_level=int(year_level),
            created_at=created_at,
            is_active=is_active,
            photo=photo
        )
        
        messages.success(request, f'Étudiant {first_name} {last_name} ajouté avec succès!')
        return redirect('/students/')
    
    return render(request, 'partials/add_students.html', {
        'total_students_count': total_students_count,
        'active_students_count': active_students_count,
        'inactive_students_count': inactive_students_count,
    })
# Create your views here.
def students_list(request):

    students = Student.objects.all()
    
    return render(request, 'students.html', {
        'students': students
    })
