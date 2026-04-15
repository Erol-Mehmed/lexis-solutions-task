from django.db import models


class ImportJobStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PROCESSING = "processing", "Processing"
    COMPLETED = "completed", "Completed"
    FAILED = "failed", "Failed"


class ImportJob(models.Model):
    file = models.FileField(upload_to="uploads/")
    status = models.CharField(
        max_length=20,
        choices=ImportJobStatus,
        default=ImportJobStatus.PENDING,
    )

    total_rows = models.IntegerField(default=0)
    processed_rows = models.IntegerField(default=0)
    success_rows = models.IntegerField(default=0)
    failed_rows = models.IntegerField(default=0)
    error_message = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ImportJob {self.pk} - {self.status}"
