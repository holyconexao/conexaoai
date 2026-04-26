from django.db import models

class MediaAsset(models.Model):
    file = models.ImageField(upload_to="library/")
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name

class ClickEvent(models.Model):
    path = models.CharField(max_length=255)
    x_percent = models.FloatField()
    y_percent = models.FloatField()
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
