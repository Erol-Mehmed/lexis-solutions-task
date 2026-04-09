from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

from .models import ImportJob
from .serializers import ImportJobSerializer
from .tasks import process_import_job


class RegisterView(APIView):
    def post(self, request):
        print("test>>>  ", request.data)
        
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Missing fields"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)

        return Response({
            "id": user.id,
            "username": user.username
        }, status=201)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=400)

        login(request, user)

        return Response({"message": "Logged in"})


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
        })


class ImportJobUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        job = ImportJob.objects.create(file=file)

        process_import_job.delay(job.id)

        return Response(
            ImportJobSerializer(job).data,
            status=status.HTTP_201_CREATED
        )


class ImportJobStatusView(APIView):
    def get(self, request, job_id):
        try:
            job = ImportJob.objects.get(id=job_id)
        except ImportJob.DoesNotExist:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            ImportJobSerializer(job).data,
        )
