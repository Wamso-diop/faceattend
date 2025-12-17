from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def dashboard_home(request):
    user = request.user
    
    context = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        # Ajoute d'autres infos si besoin
    }
    return render(request, 'dashboard.html', context)   

