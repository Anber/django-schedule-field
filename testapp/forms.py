from django import forms
from testapp.models import TestModel

class TestForm(forms.ModelForm):
    class Meta:
        model = TestModel
