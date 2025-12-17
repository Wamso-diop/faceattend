from django.urls import path
from . import views

app_name = 'students'
urlpatterns = [
path('', views.students_list, name='list-students'),
path('add/', views.add_student, name='add-student'),
path('<int:student_id>/edit/', views.edit_student, name='edit-student'),

#path('add/', views.student_create, name='create'),
#path('int:pk/', views.student_detail, name='detail'),
#path('int:pk/edit/', views.student_update, name='update'),
#path('int:pk/delete/', views.student_delete, name='delete'),
#path('int:pk/enroll/', views.student_enroll_face, name='enroll_face'),
]