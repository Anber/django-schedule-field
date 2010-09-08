# -*- coding: utf-8 -*-
from django.db import models
from schedule_field.models import Hour
from schedule_field.db_fields import ScheduleDBField

class TestModel(models.Model):
    name = models.CharField(u"Название объекта", max_length=100)
    schedule = ScheduleDBField(u"Режим работы")
