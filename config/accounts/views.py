from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("dashboard:dashboard")  # à créer
        else:
            messages.error(request, "Identifiants incorrects")

    return render(request, "accounts\login.html")
def profile_view(request):
    pass
def user_list(request):
    return render(request, "students.html")
