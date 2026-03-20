from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import ImportJob
from .serializers import ImportJobSerializer


class ImportJobUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        job = ImportJob.objects.create(file=file)

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
