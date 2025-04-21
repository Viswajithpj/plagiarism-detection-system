from django.apps import AppConfig


class DetectorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'detector'
    
    def ready(self):
        # Import signal handlers
        import detector.signals
