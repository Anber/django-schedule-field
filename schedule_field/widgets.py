from django.forms.widgets import Textarea
from django.utils.safestring import mark_safe
from django.utils.html import conditional_escape
from django.utils.encoding import force_unicode
from django.forms.util import flatatt
from schedule_field.models import Hour

class ScheduleWidget(Textarea):
    class Media:
        css = {
            'all': ('widgets/schedule/schedule.css',)
        }
        js = ('widgets/schedule/schedule.js',)

    def render(self, name, value, attrs=None):
        if value is None: value = ''
        if isinstance(value, (list, tuple)):
            value = ','.join(list(Hour.objects.values_list('id', flat=True).filter(pk__in=value)))
        final_attrs = self.build_attrs(attrs, name=name)
        return mark_safe(u'<textarea data-widget="schedule"%s>%s</textarea>' % (
                flatatt(final_attrs),
                conditional_escape(force_unicode(value)),
        ))
