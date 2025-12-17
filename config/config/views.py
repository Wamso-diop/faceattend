from django.shortcuts import render

# Create your views here.
def settings(request):
    return render(request, 'settings.html', {'title': 'Liste des étudiants'})
def help(request):
    return render(request, 'help.html', {'title': 'aide'})