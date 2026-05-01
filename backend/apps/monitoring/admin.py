from django.contrib import admin
from .models import ErrorLog

@admin.register(ErrorLog)
class ErrorLogAdmin(admin.ModelAdmin):
    list_display = ("exception_type", "path", "method", "user", "created_at")
    list_filter = ("exception_type", "method", "created_at")
    search_fields = ("path", "exception_type", "exception_message", "user")
    readonly_fields = ("path", "method", "user", "exception_type", "exception_message", "traceback", "created_at")

    def has_add_permission(self, request):
        return False
        
    def has_change_permission(self, request, obj=None):
        return False
