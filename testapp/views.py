from testapp.forms import TestForm
from django.shortcuts import render_to_response
from testapp.models import TestModel
from django.template.context import RequestContext
from django.http import HttpResponseRedirect

def form(request, id=None):
    kwargs = {}
    if id:
        kwargs.update({
            'instance': TestModel.objects.get(pk=id)
        })
    obj_list = TestModel.objects.all()
    if request.method == 'POST':
        form = TestForm(request.POST, **kwargs)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/')
    else:
        form = TestForm(**kwargs)
    return render_to_response('testapp/form.html', dict(form=form, obj_list=obj_list), context_instance=RequestContext(request))