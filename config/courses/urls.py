from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('', views.course_list, name='list-courses'),
    path('add/', views.create_course, name='create_course'),
#    path('<int:pk>/', views.course_detail, name='detail'),
#    path('<int:pk>/edit/', views.course_update, name='update'),
#    path('<int:pk>/delete/', views.course_delete, name='delete'),

    # OU vue basée sur les classes
    path('create/', views.CourseCreateView.as_view(), name='course_create'),
    path('list/', views.CourseListView.as_view(), name='course_list'),
    path('update/<int:pk>/', views.CourseUpdateView.as_view(), name='course_update'),
    
    # Vous pouvez aussi ajouter
    #path('detail/<int:pk>/', views.CourseDetailView.as_view(), name='course_detail'),
    #path('delete/<int:pk>/', views.CourseDeleteView.as_view(), name='course_delete'), 
    
]