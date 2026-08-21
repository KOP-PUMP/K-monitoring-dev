from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from .api import api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]

if settings.DEBUG:
    # In production, nginx serves MEDIA_ROOT directly at MEDIA_URL — this is
    # only for local dev, where nothing else serves uploaded pump images.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


admin.site.site_title = "K-Monitoring site admin"
admin.site.site_header = "K-Monitoring administration"
admin.site.index_title = "Site administration"