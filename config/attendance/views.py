from django.shortcuts import render

# Create your views here.
def attendance_list(request):
    return render(request, 'attendance.html', {'title': 'Liste des présences'})
def attendance_histtory(request):
    return render(request, 'attendance-history.html', {'title': 'Historique des présences'})