from django.urls import path

from .views import ImportJobUploadView, ImportJobStatusView

urlpatterns = [
    path('upload/', ImportJobUploadView.as_view(), name='import-upload'),
    path('<int:job_id>/', ImportJobStatusView.as_view()),
]
