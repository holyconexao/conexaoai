from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from apps.blog.models import Post, Category, Tag, Author
from apps.newsletter.models import Subscriber
from .models import MediaAsset
from .serializers import (
    PostListSerializer, PostDetailSerializer, 
    CategorySerializer, TagSerializer, 
    AuthorSerializer, UserSerializer,
    MediaAssetSerializer, SubscriberSerializer
)
from .permissions import IsAdminUser, IsManagerUser, IsEditorUser

class IsCmsUser(permissions.BasePermission):
    """
    Allows access only to authenticated users with a valid CMS role.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return hasattr(request.user, 'author_profile') and request.user.author_profile.role in ['admin', 'manager', 'editor']

@api_view(['GET'])
@permission_classes([IsCmsUser])
def current_cms_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().select_related('category', 'author__user')
    permission_classes = [IsEditorUser]
    filterset_fields = ['status', 'category', 'author', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostDetailSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        post = self.get_object()
        history_data = post.history.all()
        data = []
        for h in history_data:
            data.append({
                'history_id': h.history_id,
                'history_date': h.history_date,
                'history_change_reason': h.history_change_reason,
                'history_type': h.history_type,
                'history_user': h.history_user.username if h.history_user else None,
                'status': h.status,
                'title': h.title,
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def activity(self, request):
        from django.db.models.functions import TruncDate
        from django.db.models import Count
        import datetime

        one_year_ago = datetime.date.today() - datetime.timedelta(days=365)
        
        activity = Post.objects.filter(created_at__date__gte=one_year_ago) \
            .annotate(date=TruncDate('created_at')) \
            .values('date') \
            .annotate(count=Count('id')) \
            .order_by('date')
            
        return Response(list(activity))

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsManagerUser]
    search_fields = ['name']

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsManagerUser]
    search_fields = ['name']

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().select_related('user')
    serializer_class = AuthorSerializer
    permission_classes = [IsManagerUser]
    search_fields = ['user__first_name', 'user__last_name', 'user__username']

class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all().order_by('-created_at')
    serializer_class = MediaAssetSerializer
    permission_classes = [IsEditorUser]

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all().order_by('-subscribed_at')
    serializer_class = SubscriberSerializer
    permission_classes = [IsAdminUser]
    search_fields = ['email', 'name']
    filterset_fields = ['is_active', 'confirmed']
