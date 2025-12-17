from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.views.generic import CreateView, UpdateView, DeleteView, ListView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from .models import Course
from .forms import CourseForm

# Vue basée sur les fonctions (simple)
#@login_required
#@permission_required('app_name.add_course', raise_exception=True)
def create_course(request):
    """
    Vue pour créer un nouveau cours avec validation
    """
    if request.method == 'POST':
        form = CourseForm(request.POST)
        if form.is_valid():
            course = form.save()
            messages.success(request, f'Le cours "{course.course_name}" a été créé avec succès!')
            return redirect('/courses/')  # Rediriger vers la page du cours
        else:
            messages.error(request, 'Veuillez corriger les erreurs ci-dessous.')
    else:
        form = CourseForm()
    
    return render(request, 'partials/add_course.html', {
        'form': form,
        'title': 'Créer un nouveau cours',
        'submit_text': 'Créer le cours'
    })

# Vue basée sur les classes (plus complète)
class CourseCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    """
    Vue basée sur les classes pour créer un cours
    """
    model = Course
    form_class = CourseForm
    template_name = 'partials/add_course.html'
    permission_required = 'app_name.add_course'
    success_url = reverse_lazy('course_list')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Créer un nouveau cours'
        context['submit_text'] = 'Créer le cours'
        return context
    
    def form_valid(self, form):
        messages.success(self.request, f'Le cours "{form.instance.course_name}" a été créé avec succès!')
        return super().form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request, 'Veuillez corriger les erreurs ci-dessous.')
        return super().form_invalid(form)

# Vue pour lister les cours (optionnel)
class CourseListView(LoginRequiredMixin, ListView):
    model = Course
    template_name = 'courses/course_list.html'
    context_object_name = 'courses'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtrage par recherche
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(
                models.Q(course_code__icontains=search_query) |
                models.Q(course_name__icontains=search_query) |
                models.Q(teacher__username__icontains=search_query)
            )
        return queryset

# Vue pour mettre à jour un cours (optionnel)
class CourseUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Course
    form_class = CourseForm
    template_name = 'partials/add_course.html'
    permission_required = 'app_name.change_course'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Modifier le cours: {self.object.course_code}'
        context['submit_text'] = 'Mettre à jour'
        return context
    
    def form_valid(self, form):
        messages.success(self.request, f'Le cours "{form.instance.course_name}" a été mis à jour avec succès!')
        return super().form_valid(form)




def course_list(request):
    return render(request, 'courses.html', {'title': 'Liste des cours'}) 
