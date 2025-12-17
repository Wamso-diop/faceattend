"""
URLs principales du projet FaceAttend
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from . import views
from accounts import views as accounts_views

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Page d'accueil
    path('', accounts_views.login_view, name='login'),
    path('settings/', views.settings, name='settings'),
    path('help/', views.help, name='help'),
    # Applications
    path('users/', include('accounts.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('students/', include('students.urls')),
    path('courses/', include('courses.urls')),
    path('attendance/', include('attendance.urls')),
    path('facial_recognition/', include('face_recognition.urls')),
]

# Servir les fichiers média en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Personnalisation admin
admin.site.site_header = "FaceAttend Administration"
admin.site.site_title = "FaceAttend Admin"
admin.site.index_title = "Bienvenue sur FaceAttend"