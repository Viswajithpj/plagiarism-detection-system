from django.contrib import admin
from .models import Course, Assignment, PlagiarismResult, PlagiarismMatch


class PlagiarismMatchInline(admin.TabularInline):
    model = PlagiarismMatch
    extra = 0


class PlagiarismResultAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'overall_score', 'processed_at')
    inlines = [PlagiarismMatchInline]


class PlagiarismResultInline(admin.TabularInline):
    model = PlagiarismResult
    extra = 0


class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'student_name', 'student_id', 'uploaded_by', 'created_at')
    list_filter = ('course', 'uploaded_by', 'created_at')
    search_fields = ('title', 'student_name', 'student_id')
    inlines = [PlagiarismResultInline]


class AssignmentInline(admin.TabularInline):
    model = Assignment
    extra = 0


class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'teacher', 'created_at')
    list_filter = ('teacher', 'created_at')
    search_fields = ('name', 'code')
    inlines = [AssignmentInline]


admin.site.register(Course, CourseAdmin)
admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(PlagiarismResult, PlagiarismResultAdmin)
admin.site.register(PlagiarismMatch)
