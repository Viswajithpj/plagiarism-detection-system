from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, 
    AssignmentViewSet, 
    PlagiarismResultViewSet,
    CheckPlagiarismView,
    UserProfileView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'results', PlagiarismResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('check-plagiarism/', CheckPlagiarismView.as_view(), name='check-plagiarism'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
