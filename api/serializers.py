from rest_framework import serializers
from detector.models import Course, Assignment, PlagiarismResult, PlagiarismMatch
from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'institution', 'department', 'is_teacher']
        read_only_fields = ['id', 'email']


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'description', 'teacher', 'teacher_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}".strip() or obj.teacher.username


class PlagiarismMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlagiarismMatch
        fields = ['id', 'source_type', 'source_name', 'source_url', 'source_assignment', 'similarity_score', 'matched_text']
        read_only_fields = ['id']


class PlagiarismResultSerializer(serializers.ModelSerializer):
    matches = PlagiarismMatchSerializer(many=True, read_only=True)
    
    class Meta:
        model = PlagiarismResult
        fields = ['id', 'assignment', 'overall_score', 'processed_at', 'matches']
        read_only_fields = ['id', 'processed_at']


class AssignmentSerializer(serializers.ModelSerializer):
    plagiarism_results = PlagiarismResultSerializer(many=True, read_only=True)
    course_name = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 'course', 'course_name', 'file', 'file_name', 
            'file_type', 'file_size', 'uploaded_by', 'uploaded_by_name', 'student_name', 
            'student_id', 'submission_date', 'created_at', 'updated_at', 'plagiarism_results'
        ]
        read_only_fields = ['id', 'file_name', 'file_type', 'file_size', 'created_at', 'updated_at']
    
    def get_course_name(self, obj):
        return obj.course.name
    
    def get_uploaded_by_name(self, obj):
        return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}".strip() or obj.uploaded_by.username


class AssignmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 'course', 'file', 
            'student_name', 'student_id', 'submission_date'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        # Get the file from the request
        file = validated_data.get('file')
        
        # Set file metadata
        validated_data['file_name'] = file.name
        validated_data['file_type'] = file.content_type
        validated_data['file_size'] = file.size
        
        # Set the uploader
        validated_data['uploaded_by'] = self.context['request'].user
        
        return super().create(validated_data)


class CheckPlagiarismSerializer(serializers.Serializer):
    assignment_id = serializers.IntegerField()
    compare_with_course = serializers.BooleanField(default=True)
    compare_with_all = serializers.BooleanField(default=False)
