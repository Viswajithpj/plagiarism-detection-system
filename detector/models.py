from django.db import models
from django.conf import settings
import uuid
import os


def assignment_file_path(instance, filename):
    """Generate file path for assignment uploads"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('assignments', filename)


class Course(models.Model):
    """Course model for organizing assignments"""
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Assignment(models.Model):
    """Assignment model for storing uploaded documents"""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    file = models.FileField(upload_to=assignment_file_path)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField()  # Size in bytes
    content_text = models.TextField(blank=True)  # Extracted text content
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assignments')
    student_name = models.CharField(max_length=255, blank=True)
    student_id = models.CharField(max_length=50, blank=True)
    submission_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.student_name or 'Unknown'}"


class PlagiarismResult(models.Model):
    """Model to store plagiarism detection results"""
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='plagiarism_results')
    overall_score = models.FloatField()  # Overall plagiarism percentage
    processed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Result for {self.assignment} - {self.overall_score}%"


class PlagiarismMatch(models.Model):
    """Model to store individual plagiarism matches"""
    SOURCE_TYPES = (
        ('assignment', 'Assignment'),
        ('internet', 'Internet Source'),
        ('database', 'Database'),
    )
    
    result = models.ForeignKey(PlagiarismResult, on_delete=models.CASCADE, related_name='matches')
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    source_name = models.CharField(max_length=255)
    source_url = models.URLField(blank=True, null=True)
    source_assignment = models.ForeignKey(Assignment, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_source')
    similarity_score = models.FloatField()  # Match percentage
    matched_text = models.TextField(blank=True)  # The text that matched
    
    def __str__(self):
        return f"Match: {self.source_name} ({self.similarity_score}%)"
