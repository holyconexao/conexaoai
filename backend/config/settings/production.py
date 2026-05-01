import os

import dj_database_url

from .base import *  # noqa: F403

DEBUG = False
ALLOWED_HOSTS = [
    host.strip() for host in os.environ.get("ALLOWED_HOSTS", "*").split(",") if host.strip()
]
# Allow all Railway domains
ALLOWED_HOSTS.append(".railway.app")

# Trust Railway and custom domains for CSRF
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]
railway_domain = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "").strip()
if railway_domain:
    CSRF_TRUSTED_ORIGINS.append(f"https://{railway_domain}")

DATABASES = {
    "default": dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )
}

cloudinary_cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
cloudinary_api_key = os.environ.get("CLOUDINARY_API_KEY")
cloudinary_api_secret = os.environ.get("CLOUDINARY_API_SECRET")

if cloudinary_cloud_name and cloudinary_api_key and cloudinary_api_secret:
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": cloudinary_cloud_name,
        "API_KEY": cloudinary_api_key,
        "API_SECRET": cloudinary_api_secret,
    }

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SECURE_HSTS_SECONDS = 31536000
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# Sentry was removed as per user request (custom monitoring used instead).
import posthog

POSTHOG_API_KEY = os.environ.get("POSTHOG_API_KEY")
POSTHOG_HOST = os.environ.get("POSTHOG_HOST", "https://app.posthog.com")

if POSTHOG_API_KEY:
    posthog.project_api_key = POSTHOG_API_KEY
    posthog.host = POSTHOG_HOST
