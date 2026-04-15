import csv
from celery import shared_task
from django.db import transaction
from .models import ImportJob, ImportJobStatus


@shared_task
def process_import_job(job_id):
    try:
        ImportJob.objects.filter(id=job_id).update(
            status=ImportJobStatus.PROCESSING,
            error_message=None,
        )
        job = ImportJob.objects.get(id=job_id)

        success = 0
        failed = 0
        processed = 0

        with open(job.file.path, newline="") as csvfile:
            reader = list(csv.DictReader(csvfile))

            if not reader:
                raise ValueError("CSV is empty")

            required_columns = {"name", "email"}
            if not required_columns.issubset(reader[0].keys()):
                raise ValueError("CSV must contain 'name' and 'email' columns")

            total = len(reader)
            ImportJob.objects.filter(id=job_id).update(total_rows=total)

            for row in reader:
                processed += 1
                name = row.get("name")
                email = row.get("email")

                if name and email and "@" in email:
                    success += 1
                else:
                    failed += 1

                if processed % 5 == 0 or processed == total:
                    ImportJob.objects.filter(id=job_id).update(
                        processed_rows=processed,
                        success_rows=success,
                        failed_rows=failed,
                    )

        with transaction.atomic():
            ImportJob.objects.filter(id=job_id).update(
                status=ImportJobStatus.COMPLETED,
                processed_rows=processed,
                success_rows=success,
                failed_rows=failed,
            )

    except Exception as e:
        with transaction.atomic():
            ImportJob.objects.filter(id=job_id).update(
                status=ImportJobStatus.FAILED,
                error_message=str(e),
            )
        raise
