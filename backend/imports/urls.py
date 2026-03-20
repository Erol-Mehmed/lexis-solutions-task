from django.urls import path

from .views import ImportJobUploadView

urlpatterns = [
    path('upload/', ImportJobUploadView.as_view()),
]
