import csv
from celery import shared_task
from .models import ImportJob, ImportJobStatus


@shared_task
def process_import_job(job_id):
    job = ImportJob.objects.get(id=job_id)

    try:
        job.status = ImportJobStatus.PROCESSING
        job.save()

        file_path = job.file.path

        success = 0
        failed = 0
        processed = 0

        with open(file_path, newline='') as csvfile:
            reader = list(csv.DictReader(csvfile))

            if not reader:
                raise ValueError("CSV is empty")

            required_columns = {'name', 'email'}
            if not required_columns.issubset(reader[0].keys()):
                raise ValueError("CSV must contain 'name' and 'email' columns")

            total = len(reader)

            job.total_rows = total
            job.save()

            for row in reader:
                processed += 1

                name = row.get('name')
                email = row.get('email')

                if name and email and '@' in email:
                    success += 1
                else:
                    failed += 1

                job.processed_rows = processed
                job.success_rows = success
                job.failed_rows = failed

                # save less frequently
                if processed % 5 == 0 or processed == total:
                    job.save()

        job.status = ImportJobStatus.COMPLETED
        job.save()

    except Exception as e:
        job.status = ImportJobStatus.FAILED
        job.error_message = str(e)
        job.save()
        raise e
