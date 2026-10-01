from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ObligationViewSet
router = DefaultRouter()
router.register(r'obligations', ObligationViewSet, basename='obligation')
urlpatterns = [path('', include(router.urls))]