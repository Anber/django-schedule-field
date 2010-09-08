from django.conf.urls.defaults import *
from testapp.views import form

urlpatterns = patterns('',
   url(r'^(?P<id>\d+)', form, name="edit"),
    (r'^', form),
)
