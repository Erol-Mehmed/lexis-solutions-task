from django.urls import path

from .views import RegisterView, LogoutView, MeView, ImportJobUploadView, ImportJobStatusView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MeView.as_view()),
    path("upload/", ImportJobUploadView.as_view(), name="import-upload"),
    path("<int:job_id>/", ImportJobStatusView.as_view()),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]
