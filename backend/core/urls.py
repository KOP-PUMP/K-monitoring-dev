from django.contrib import admin
from django.urls import path
from .api import api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]


admin.site.site_title = "K-Monitoring site admin"
admin.site.site_header = "K-Monitoring administration"
admin.site.index_title = "Site administration"