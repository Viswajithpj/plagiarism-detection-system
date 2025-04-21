from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Assignment
from .utils.text_extractor import extract_text_from_file


@receiver(post_save, sender=Assignment)
def extract_text_on_save(sender, instance, created, **kwargs):
    """Extract text from uploaded files when a new assignment is created"""
    if created and not instance.content_text:
        try:
            text = extract_text_from_file(instance.file.path, instance.file_type)
            instance.content_text = text
            # Use update to avoid triggering the signal again
            Assignment.objects.filter(id=instance.id).update(content_text=text)
        except Exception as e:
            print(f"Error extracting text: {e}")
