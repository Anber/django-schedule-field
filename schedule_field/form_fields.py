from django.forms.models import ModelMultipleChoiceField
from schedule_field.widgets import ScheduleWidget
from schedule_field.models import Hour

class ScheduleFormField(ModelMultipleChoiceField):
    widget = ScheduleWidget

    def clean(self, value):
        value = value.split(',')
        return super(ScheduleFormField, self).clean(value)

