# -*- coding: utf-8 -*-
from django.db import models


class Hour(models.Model):
    class Meta:
        verbose_name = u"час"
        verbose_name_plural = u"часы"

    day_choices = (
        (0, u'пн'),
        (1, u'вт'),
        (2, u'ср'),
        (3, u'чт'),
        (4, u'пт'),
        (5, u'сб'),
        (6, u'вс'),
    )
    id = models.CharField(u"ключ", max_length=4, primary_key=True)
    day = models.IntegerField(u"день недели", choices=day_choices, db_index=True)
    hour = models.IntegerField(u"час", db_index=True)

    def save(self, *args, **kwargs):
        self.id = '%d_%d' % (self.day, self.hour)
        super(Hour, self).save(*args, **kwargs)
