from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.test import override_settings
from .models import ImportJob
import csv
import io


@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class ImportJobTest(TestCase):
    def test_upload_endpoint(self):
        csv_file = self.create_csv([
            ["John", "john@example.com", 30]
        ])

        response = self.client.post(
            reverse("import-upload"),
            {"file": csv_file},
            format="multipart"
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.json())

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
            content_type="text/csv"
        )

    def test_import_job_created(self):
        csv_file = self.create_csv([
            ["John", "john@example.com", 30]
        ])

        job = ImportJob.objects.create(file=csv_file)

        self.assertIsNotNone(job.id)
        self.assertEqual(job.status, "pending")

    def test_valid_csv_processing(self):
        csv_file = self.create_csv([
            ["John", "john@example.com", 30],
            ["Jane", "jane@example.com", 25]
        ])

        job = ImportJob.objects.create(file=csv_file)

        from .tasks import process_import_job
        process_import_job(job.id)

        job.refresh_from_db()

        self.assertEqual(job.status, "completed")
        self.assertEqual(job.success_rows, 2)

    def test_invalid_csv_processing(self):
        csv_file = self.create_csv([
            ["John", "invalid-email", 30]
        ])

        job = ImportJob.objects.create(file=csv_file)

        from .tasks import process_import_job
        process_import_job(job.id)

        job.refresh_from_db()

        self.assertEqual(job.failed_rows, 1)
