from django.urls import path

from .views import RegisterView, LoginView, LogoutView, MeView, ImportJobUploadView, ImportJobStatusView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MeView.as_view()),
    path('upload/', ImportJobUploadView.as_view(), name='import-upload'),
    path('<int:job_id>/', ImportJobStatusView.as_view()),
]
