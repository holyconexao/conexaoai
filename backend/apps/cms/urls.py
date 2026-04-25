from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    PostViewSet, CategoryViewSet, TagViewSet, 
    AuthorViewSet, current_cms_user
)

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='cms-posts')
router.register(r'categories', CategoryViewSet, basename='cms-categories')
router.register(r'tags', TagViewSet, basename='cms-tags')
router.register(r'authors', AuthorViewSet, basename='cms-authors')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='cms-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='cms-refresh'),
    path('me/', current_cms_user, name='cms-me'),
    path('', include(router.urls)),
]
