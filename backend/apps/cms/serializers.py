from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.blog.models import Post, Category, Tag, Author
from apps.newsletter.models import Subscriber
from .models import MediaAsset
from django.contrib.auth import get_user_model
import re

def validate_strict_text(value):
    if not isinstance(value, str):
        return value
    if re.search(r'<[^>]+>', value):
        raise ValidationError("HTML elements are not allowed in this field.")
    if 'wikipedia' in value.lower():
        raise ValidationError("Links to Wikipedia or mentions are not permitted.")
    return value

User = get_user_model()

class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = '__all__'

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'role']

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        if hasattr(obj, 'author'):
            return obj.author.role
        return 'viewer'

class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[validate_strict_text])
    description = serializers.CharField(validators=[validate_strict_text], required=False, allow_blank=True)
    
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[validate_strict_text])

    class Meta:
        model = Tag
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Author
        fields = '__all__'

class PostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.user.get_full_name', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'status', 'published_at', 'category_name', 'author_name', 'is_featured', 'created_at']

class PostDetailSerializer(serializers.ModelSerializer):
    title = serializers.CharField(validators=[validate_strict_text])
    excerpt = serializers.CharField(validators=[validate_strict_text], required=False, allow_blank=True)
    
    def validate(self, data):
        request = self.context.get('request')
        if not request:
            return data

        status = data.get('status')
        user = request.user

        # If user is an Author (not editor/manager/admin/superuser), 
        # they cannot set status to 'published' or 'scheduled' directly.
        is_author_only = not user.is_superuser and hasattr(user, 'author') and user.author.role == 'author'
        
        if is_author_only and status in ['published', 'scheduled']:
            raise ValidationError({
                "status": "As autores não podem publicar diretamente. Por favor, envie para 'Em Revisão'."
            })

        return data

    def validate_content(self, value):
        import bleach
        # We allow markdown but strictly block wikipedia links in content too
        if 'wikipedia.org' in value.lower() or 'wikipedia.com' in value.lower():
            raise ValidationError("References to Wikipedia are strictly forbidden.")
        
        # Bleach sanitization to prevent XSS in markdown/HTML content
        allowed_tags = bleach.ALLOWED_TAGS + [
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr',
            'pre', 'code', 'blockquote', 'img', 'span', 'div',
            'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ]
        allowed_attributes = {
            **bleach.ALLOWED_ATTRIBUTES,
            'img': ['src', 'alt', 'title'],
            'a': ['href', 'title', 'target', 'rel']
        }
        
        sanitized_value = bleach.clean(
            value,
            tags=allowed_tags,
            attributes=allowed_attributes,
            strip=True
        )
        return sanitized_value

    class Meta:
        model = Post
        fields = '__all__'
