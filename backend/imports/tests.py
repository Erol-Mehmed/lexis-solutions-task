import csv
import io
import shutil
import tempfile

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ImportJob, ImportJobStatus
from .tasks import process_import_job

TEST_MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(
    MEDIA_ROOT=TEST_MEDIA_ROOT,
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class ImportJobTest(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
        )

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    @staticmethod
    def create_csv(rows):
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["name", "email", "age"])

        for row in rows:
            writer.writerow(row)

        return SimpleUploadedFile(
            "test.csv",
            output.getvalue().encode("utf-8"),
            content_type="text/csv",
        )

    def test_upload_requires_authentication(self):
        csv_file = self.create_csv([
            ["John", "john@example.com", 30]
        ])

        response = self.client.post(
            reverse("import-upload"),
            {"file": csv_file},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_upload_endpoint_creates_job_when_authenticated(self):
        self.authenticate()

        csv_file = self.create_csv([
            ["John", "john@example.com", 30]
        ])

        response = self.client.post(
            reverse("import-upload"),
            {"file": csv_file},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.json())

        job = ImportJob.objects.get(id=response.json()["id"])
        self.assertEqual(job.status, ImportJobStatus.COMPLETED)
        self.assertEqual(job.total_rows, 1)
        self.assertEqual(job.processed_rows, 1)
        self.assertEqual(job.success_rows, 1)
        self.assertEqual(job.failed_rows, 0)

    def test_upload_without_file_returns_400_when_authenticated(self):
        self.authenticate()

        response = self.client.post(
            reverse("import-upload"),
            {},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["error"], "No file provided")

    def test_status_endpoint_requires_authentication(self):
        job = ImportJob.objects.create(
            file=self.create_csv([["John", "john@example.com", 30]])
        )

        response = self.client.get(f"/api/imports/{job.id}/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_status_endpoint_returns_job_data_when_authenticated(self):
        self.authenticate()

        job = ImportJob.objects.create(
            file=self.create_csv([["John", "john@example.com", 30]])
        )

        response = self.client.get(f"/api/imports/{job.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["id"], job.id)
        self.assertEqual(response.json()["status"], ImportJobStatus.PENDING)

    def test_import_job_created_defaults_to_pending(self):
        csv_file = self.create_csv([
            ["John", "john@example.com", 30]
        ])

        job = ImportJob.objects.create(file=csv_file)

        self.assertIsNotNone(job.id)
        self.assertEqual(job.status, ImportJobStatus.PENDING)

    def test_valid_csv_processing_marks_job_completed(self):
        csv_file = self.create_csv([
            ["John", "john@example.com", 30],
            ["Jane", "jane@example.com", 25]
        ])

        job = ImportJob.objects.create(file=csv_file)

        process_import_job(job.id)
        job.refresh_from_db()

        self.assertEqual(job.status, ImportJobStatus.COMPLETED)
        self.assertEqual(job.total_rows, 2)
        self.assertEqual(job.processed_rows, 2)
        self.assertEqual(job.success_rows, 2)
        self.assertEqual(job.failed_rows, 0)

    def test_invalid_csv_processing_counts_failed_rows(self):
        csv_file = self.create_csv([
            ["John", "invalid-email", 30]
        ])

        job = ImportJob.objects.create(file=csv_file)

        process_import_job(job.id)
        job.refresh_from_db()

        self.assertEqual(job.status, ImportJobStatus.COMPLETED)
        self.assertEqual(job.total_rows, 1)
        self.assertEqual(job.processed_rows, 1)
        self.assertEqual(job.success_rows, 0)
        self.assertEqual(job.failed_rows, 1)
