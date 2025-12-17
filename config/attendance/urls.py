from django.urls import path
from . import views

app_name = 'attendance'

urlpatterns = [
    path('', views.attendance_list, name='attendance_list'),
    path('history/', views.attendance_histtory, name='attendance_history'),
#    path('add/', views.attendance_create, name='create'),
]