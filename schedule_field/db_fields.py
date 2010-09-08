from django.db import models
from schedule_field.form_fields import ScheduleFormField
from schedule_field.models import Hour

try:
    from south.modelsinspector import add_introspection_rules
    has_south = True
except:
    has_south = False

class ScheduleDBField(models.ManyToManyField):
    def __init__(self, verbose_name=None, **kwargs):
        help_text = kwargs.pop('help_text', None)
        to = kwargs.pop('to', Hour)
        default = {}
        default.update(kwargs)
        super(ScheduleDBField, self).__init__(to, verbose_name=verbose_name, **default)
        self.help_text = help_text

    def formfield(self, **kwargs):
        db = kwargs.pop('using', None)
        defaults = {
            'form_class': ScheduleFormField,
            'queryset': self.rel.to._default_manager.using(db).complex_filter(self.rel.limit_choices_to)
        }
        defaults.update(kwargs)
        # If initial is passed in, it's a list of related objects, but the
        # MultipleChoiceField takes a list of IDs.
        if defaults.get('initial') is not None:
            initial = defaults['initial']
            if callable(initial):
                initial = initial()
            defaults['initial'] = [i._get_pk_val() for i in initial]
        return super(ScheduleDBField, self).formfield(**defaults)

if has_south:
    add_introspection_rules([], ["^schedule_field\.db_fields\.ScheduleDBField"])
